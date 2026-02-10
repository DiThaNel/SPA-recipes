"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { DayPlan, DayName, Recipe } from "@/types";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

interface RecipeContextType {
  weekPlan: DayPlan[];
  recipeBank: Recipe[];
  selectedDay: DayName | null;
  editingRecipe: Recipe | null;
  showModal: boolean;
  activeId: string | null;
  activeRecipe: Recipe | null;
  handleAddClick: (day: DayName) => void;
  handleCloseModal: () => void;
  handleEditClick: (day: DayName | null, recipe: Recipe) => void;
  handleDeleteRecipe: (day: DayName, recipeId: string) => void;
  handleSaveRecipe: (recipeData: Omit<Recipe, "id">) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const weekPlanState = useWeekPlan();

  return (
    <RecipeContext.Provider value={weekPlanState}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return context;
}
