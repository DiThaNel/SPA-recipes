import { recipeBankSlice, addRecipeToBank, removeRecipeFromBank, updateRecipeInBank, setRecipeBank } from "../recipeBankSlice";
import { Recipe } from "@/types";

const { reducer } = recipeBankSlice;

describe("recipeBankSlice", () => {
  const initialState = {
    savedRecipes: [],
  };

  const sampleRecipe: Recipe = {
    id: "b1",
    name: "Bank Recipe",
    description: "Desc",
    ingredients: "Ing",
  };

  it("should add recipe to bank", () => {
    const actual = reducer(initialState, addRecipeToBank(sampleRecipe));
    expect(actual.savedRecipes).toHaveLength(1);
    expect(actual.savedRecipes[0]).toEqual(sampleRecipe);
  });

  it("should not add duplicate recipe ID", () => {
    const state = reducer(initialState, addRecipeToBank(sampleRecipe));
    const actual = reducer(state, addRecipeToBank(sampleRecipe));
    expect(actual.savedRecipes).toHaveLength(1);
  });

  it("should remove recipe from bank", () => {
    const state = reducer(initialState, addRecipeToBank(sampleRecipe));
    const actual = reducer(state, removeRecipeFromBank("b1"));
    expect(actual.savedRecipes).toHaveLength(0);
  });

  it("should update recipe in bank", () => {
    const state = reducer(initialState, addRecipeToBank(sampleRecipe));
    const updatedRecipe = { ...sampleRecipe, name: "Updated Name" };
    const actual = reducer(state, updateRecipeInBank(updatedRecipe));
    expect(actual.savedRecipes[0].name).toBe("Updated Name");
  });

  it("should set whole bank (hydration)", () => {
    const newBank = [sampleRecipe, { ...sampleRecipe, id: "b2" }];
    const actual = reducer(initialState, setRecipeBank(newBank));
    expect(actual.savedRecipes).toHaveLength(2);
  });
});
