import { useState, useEffect } from "react";
import { 
  DragEndEvent, 
  DragStartEvent,
} from "@dnd-kit/core";
import { DayName, Recipe } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
    setWeekPlan, 
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    moveRecipeWithinDay, 
    moveRecipeToDifferentDay 
} from "@/store/weekPlanSlice";
import { updateRecipeInBank, setRecipeBank } from "@/store/recipeBankSlice";

export function useWeekPlan() {
  const dispatch = useAppDispatch();
  const weekPlan = useAppSelector((state) => state.weekPlan.weekPlan);
  const recipeBank = useAppSelector((state) => state.recipeBank.savedRecipes);

  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem("weekPlan");
      const savedBank = localStorage.getItem("recipeBank");

      if (savedPlan) {
        dispatch(setWeekPlan(JSON.parse(savedPlan)));
      }
      if (savedBank) {
        dispatch(setRecipeBank(JSON.parse(savedBank)));
      }
      setIsLoaded(true);
    }
  }, [dispatch]);

  // Save to localStorage whenever weekPlan changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem("weekPlan", JSON.stringify(weekPlan));
    }
  }, [weekPlan, isLoaded]);

  // Save recipeBank to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem("recipeBank", JSON.stringify(recipeBank));
    }
  }, [recipeBank, isLoaded]);

  const handleAddClick = (day: DayName) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDay(null);
    setEditingRecipe(null);
  };

  const handleEditClick = (day: DayName | null, recipe: Recipe) => {
    setSelectedDay(day);
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleDeleteRecipe = (day: DayName, recipeId: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      dispatch(deleteRecipe({ day, recipeId }));
    }
  };

  const handleSaveRecipe = (recipeData: Omit<Recipe, "id">) => {
    if (selectedDay) {
        // Week Plan Logic
        if (editingRecipe) {
            dispatch(updateRecipe({ 
                day: selectedDay, 
                recipe: { ...editingRecipe, ...recipeData } 
            }));
        } else {
            const newRecipe: Recipe = {
                id: crypto.randomUUID(),
                ...recipeData,
            };
            dispatch(addRecipe({ day: selectedDay, recipe: newRecipe }));
        }
    } else {
        if (editingRecipe) {
             dispatch(updateRecipeInBank({ ...editingRecipe, ...recipeData }));
        }
    }
  };

  const findRecipeById = (id: string): Recipe | undefined => {
    for (const day of weekPlan) {
      const recipe = day.recipes.find(r => r.id === id);
      if (recipe) return recipe;
    }
    const bankRecipe = recipeBank.find(r => r.id === id);
    if (bankRecipe) return bankRecipe;

    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const isFromBank = recipeBank.some(r => r.id === activeId);

    if (isFromBank) {
        let targetDayName: DayName | undefined;
        
        const isDayName = weekPlan.some(d => d.day === overId);
        if (isDayName) {
            targetDayName = overId as DayName;
        } else {
            const day = weekPlan.find(d => d.recipes.some(r => r.id === overId));
            if (day) targetDayName = day.day;
        }

        if (targetDayName) {
            const recipe = recipeBank.find(r => r.id === activeId);
            if (recipe) {
                dispatch(addRecipe({
                    day: targetDayName,
                    recipe: { ...recipe, id: crypto.randomUUID() }
                }));
            }
        }
        return;
    }

    // logic for Week Plan sort/move
    const findDayOfRecipe = (recipeId: string) => 
      weekPlan.find(day => day.recipes.some(r => r.id === recipeId));

    const sourceDay = findDayOfRecipe(activeId);
    
    let targetDay = weekPlan.find(day => day.day === overId);
    if (!targetDay) {
       targetDay = findDayOfRecipe(overId);
    }

    if (!sourceDay || !targetDay) return;

    if (sourceDay.day === targetDay.day) {
      const oldIndex = sourceDay.recipes.findIndex(r => r.id === activeId);
      const newIndex = targetDay.recipes.findIndex(r => r.id === overId);

      if (oldIndex !== newIndex) {
         dispatch(moveRecipeWithinDay({
             day: sourceDay.day,
             oldIndex,
             newIndex
         }));
      }
    } else {
      dispatch(moveRecipeToDifferentDay({
          sourceDayName: sourceDay.day,
          targetDayName: targetDay.day,
          recipeId: activeId
      }));
    }
  };
  
  const activeRecipe = activeId ? (findRecipeById(activeId) || null) : null;

  return {
    weekPlan,
    recipeBank,
    selectedDay,
    editingRecipe,
    showModal,
    activeId,
    activeRecipe,
    handleAddClick,
    handleCloseModal,
    handleEditClick,
    handleDeleteRecipe,
    handleSaveRecipe,
    handleDragStart,
    handleDragEnd,
  };
}
