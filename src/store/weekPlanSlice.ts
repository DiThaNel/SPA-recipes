import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayPlan, DayName, Recipe } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";

interface WeekPlanState {
  weekPlan: DayPlan[];
}

const INITIAL_WEEK: DayPlan[] = [
  { day: "Monday", recipes: [] },
  { day: "Tuesday", recipes: [] },
  { day: "Wednesday", recipes: [] },
  { day: "Thursday", recipes: [] },
  { day: "Friday", recipes: [] },
  { day: "Saturday", recipes: [] },
  { day: "Sunday", recipes: [] },
];

const initialState: WeekPlanState = {
  weekPlan: INITIAL_WEEK,
};

export const weekPlanSlice = createSlice({
  name: "weekPlan",
  initialState,
  reducers: {
    setWeekPlan: (state, action: PayloadAction<DayPlan[]>) => {
      state.weekPlan = action.payload;
    },
    addRecipe: (state, action: PayloadAction<{ day: DayName; recipe: Recipe }>) => {
      const { day, recipe } = action.payload;
      const dayPlan = state.weekPlan.find((p) => p.day === day);
      if (dayPlan) {
        dayPlan.recipes.push(recipe);
      }
    },
    updateRecipe: (state, action: PayloadAction<{ day: DayName; recipe: Recipe }>) => {
      const { day, recipe } = action.payload;
      const dayPlan = state.weekPlan.find((p) => p.day === day);
      if (dayPlan) {
        const index = dayPlan.recipes.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          dayPlan.recipes[index] = recipe;
        }
      }
    },
    deleteRecipe: (state, action: PayloadAction<{ day: DayName; recipeId: string }>) => {
      const { day, recipeId } = action.payload;
      const dayPlan = state.weekPlan.find((p) => p.day === day);
      if (dayPlan) {
        dayPlan.recipes = dayPlan.recipes.filter((r) => r.id !== recipeId);
      }
    },
    moveRecipeWithinDay: (state, action: PayloadAction<{ day: DayName; oldIndex: number; newIndex: number }>) => {
      const { day, oldIndex, newIndex } = action.payload;
      const dayPlan = state.weekPlan.find((p) => p.day === day);
      if (dayPlan) {
        dayPlan.recipes = arrayMove(dayPlan.recipes, oldIndex, newIndex);
      }
    },
    moveRecipeToDifferentDay: (state, action: PayloadAction<{
        sourceDayName: DayName;
        targetDayName: DayName;
        recipeId: string;
    }>) => {
        const { sourceDayName, targetDayName, recipeId } = action.payload;
        const sourceDay = state.weekPlan.find(p => p.day === sourceDayName);
        const targetDay = state.weekPlan.find(p => p.day === targetDayName);
        
        if (sourceDay && targetDay) {
            const recipe = sourceDay.recipes.find(r => r.id === recipeId);
            if (recipe) {
                sourceDay.recipes = sourceDay.recipes.filter(r => r.id !== recipeId);
                targetDay.recipes.push(recipe);
            }
        }
    }
  },
});

export const { 
    setWeekPlan, 
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    moveRecipeWithinDay,
    moveRecipeToDifferentDay
} = weekPlanSlice.actions;

export default weekPlanSlice.reducer;
