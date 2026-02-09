"use client";

import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { DayPlan, DayName, Recipe } from "@/types";
import DayCard from "@/components/DayCard";
import RecipeModal from "@/components/RecipeModal";
import RecipeItem from "@/components/RecipeItem";
import ShoppingListModal from "@/components/ShoppingListModal";

const INITIAL_WEEK: DayPlan[] = [
  { day: "Monday", recipes: [] },
  { day: "Tuesday", recipes: [] },
  { day: "Wednesday", recipes: [] },
  { day: "Thursday", recipes: [] },
  { day: "Friday", recipes: [] },
  { day: "Saturday", recipes: [] },
  { day: "Sunday", recipes: [] },
];

export default function Home() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(INITIAL_WEEK);
  const [showModal, setShowModal] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  
  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("weekPlan");
      if (saved) {
        setWeekPlan(JSON.parse(saved));
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever weekPlan changes, but only after initial load
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem("weekPlan", JSON.stringify(weekPlan));
    }
  }, [weekPlan, isLoaded]);

  const handleAddClick = (day: DayName) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDay(null);
    setEditingRecipe(null);
  };

  const handleEditClick = (day: DayName, recipe: Recipe) => {
    setSelectedDay(day);
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleDeleteRecipe = (day: DayName, recipeId: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      setWeekPlan((prev) =>
        prev.map((plan) => {
          if (plan.day === day) {
            return {
              ...plan,
              recipes: plan.recipes.filter((r) => r.id !== recipeId),
            };
          }
          return plan;
        })
      );
    }
  };

  const handleSaveRecipe = (recipeData: Omit<Recipe, "id">) => {
    if (!selectedDay) return;

    setWeekPlan((prev) =>
      prev.map((plan) => {
        if (plan.day === selectedDay) {
          if (editingRecipe) {
            // Update existing recipe
            return {
              ...plan,
              recipes: plan.recipes.map((r) =>
                r.id === editingRecipe.id ? { ...r, ...recipeData } : r
              ),
            };
          } else {
            // Add new recipe
            const newRecipe: Recipe = {
              id: crypto.randomUUID(),
              ...recipeData,
            };
            return {
              ...plan,
              recipes: [...plan.recipes, newRecipe],
            };
          }
        }
        return plan;
      })
    );
  };

  const findRecipeById = (id: string): Recipe | undefined => {
    for (const day of weekPlan) {
      const recipe = day.recipes.find(r => r.id === id);
      if (recipe) return recipe;
    }
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
    
    const findDayOfRecipe = (recipeId: string): DayPlan | undefined => 
      weekPlan.find(day => day.recipes.some(r => r.id === recipeId));

    const sourceDay = findDayOfRecipe(activeId);
    
    let targetDay = weekPlan.find(day => day.day === overId);
    if (!targetDay) {
       targetDay = findDayOfRecipe(overId);
    }

    if (!sourceDay || !targetDay) return;

    if (sourceDay.day === targetDay.day) {
      // Reordering within the same day
      const oldIndex = sourceDay.recipes.findIndex(r => r.id === activeId);
      const newIndex = targetDay.recipes.findIndex(r => r.id === overId);

      if (oldIndex !== newIndex) {
         setWeekPlan(prev => prev.map(day => {
            if (day.day === sourceDay.day) {
              return {
                 ...day,
                 recipes: arrayMove(day.recipes, oldIndex, newIndex)
              };
            }
            return day;
         }));
      }
    } else {
      // Moving to a different day
      const recipeToMove = sourceDay.recipes.find(r => r.id === activeId);
      if (!recipeToMove) return;

      setWeekPlan(prev => prev.map(day => {
         if (day.day === sourceDay.day) {
            // Remove from source
            return {
               ...day,
               recipes: day.recipes.filter(r => r.id !== activeId)
            };
         }
         if (day.day === targetDay?.day) {
            return {
               ...day,
               recipes: [...day.recipes, recipeToMove]
            };
         }
         return day;
      }));
    }
  };
  
  const activeRecipe = activeId ? findRecipeById(activeId) : null;

  if (!mounted) {
    return null;
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Container className="py-5">
        <header className="mb-5 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-4 fw-bold text-primary">Weekly Recipe Scheduler</h1>
                <p className="lead text-secondary mb-4">Plan your meals for the week efficiently.</p>
                
                <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => setShowShoppingList(true)}
                    className="btn-save shadow-sm rounded-pill px-4"
                >
                    <i className="bi bi-cart4 me-2"></i>
                    Generate Shopping List
                </Button>
            </motion.div>
        </header>

        <Row className="g-4 px-2">
          {weekPlan.map((plan, index) => (
            <Col key={plan.day} xs={12} md={6} lg={4} xl={4}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="h-100"
                >
                  <DayCard
                    dayPlan={plan}
                    onAddRecipe={() => handleAddClick(plan.day)}
                    onEditRecipe={(recipe) => handleEditClick(plan.day, recipe)}
                    onDeleteRecipe={(recipeId) => handleDeleteRecipe(plan.day, recipeId)}
                  />
                </motion.div>
            </Col>
          ))}
        </Row>

        <RecipeModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleSaveRecipe}
          initialData={editingRecipe}
        />

        <ShoppingListModal
            show={showShoppingList}
            onHide={() => setShowShoppingList(false)}
            weekPlan={weekPlan}
        />
        
        <DragOverlay>
            {activeRecipe ? (
                <RecipeItem recipe={activeRecipe} isOverlay />
            ) : null}
        </DragOverlay>
      </Container>
    </DndContext>
  );
}
