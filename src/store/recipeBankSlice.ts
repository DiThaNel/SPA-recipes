import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "@/types";

interface RecipeBankState {
  savedRecipes: Recipe[];
}

const INITIAL_RECIPES: Recipe[] = [
  { id: "bank-1", name: "Spaghetti Carbonara", description: "Classic Italian pasta dish with eggs, cheese, and bacon.", ingredients: "Spaghetti, Eggs, Pecorino Romano, Guanciale, Black Pepper" },
  { id: "bank-2", name: "Chicken Stir-Fry", description: "Quick and healthy chicken with mixed vegetables.", ingredients: "Chicken Breast, Broccoli, Bell Peppers, Soy Sauce, Ginger, Garlic" },
  { id: "bank-3", name: "Vegetable Curry", description: "Rich and spicy vegetable curry with coconut milk.", ingredients: "Potatoes, Cauliflower, Peas, Coconut Milk, Curry Paste" },
];

const initialState: RecipeBankState = {
  savedRecipes: INITIAL_RECIPES,
};

export const recipeBankSlice = createSlice({
  name: "recipeBank",
  initialState,
  reducers: {
    addRecipeToBank: (state, action: PayloadAction<Recipe>) => {
      if (!state.savedRecipes.find(r => r.id === action.payload.id)) {
          state.savedRecipes.push(action.payload);
      }
    },
    setRecipeBank: (state, action: PayloadAction<Recipe[]>) => {
      state.savedRecipes = action.payload;
    },
    removeRecipeFromBank: (state, action: PayloadAction<string>) => {
      state.savedRecipes = state.savedRecipes.filter(r => r.id !== action.payload);
    },
    updateRecipeInBank: (state, action: PayloadAction<Recipe>) => {
      const index = state.savedRecipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
          state.savedRecipes[index] = action.payload;
      }
    }
  },
});

export const { addRecipeToBank, removeRecipeFromBank, updateRecipeInBank, setRecipeBank } = recipeBankSlice.actions;
export default recipeBankSlice.reducer;
