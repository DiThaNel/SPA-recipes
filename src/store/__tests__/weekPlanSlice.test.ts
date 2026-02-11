import { weekPlanSlice, addRecipe, deleteRecipe, moveRecipeWithinDay, moveRecipeToDifferentDay } from "../weekPlanSlice";
import { Recipe, DayPlan } from "@/types";

const { reducer } = weekPlanSlice;

describe("weekPlanSlice", () => {
  const initialState: { weekPlan: DayPlan[] } = {
    weekPlan: [
      { day: "Monday", recipes: [] },
      { day: "Tuesday", recipes: [] },
    ] as DayPlan[],
  };

  const sampleRecipe: Recipe = {
    id: "r1",
    name: "Test Recipe",
    description: "Test Desc",
    ingredients: "Test Ing",
  };

  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      weekPlan: expect.any(Array),
    });
  });

  it("should handle addRecipe", () => {
    const actual = reducer(initialState, addRecipe({ day: "Monday", recipe: sampleRecipe }));
    expect(actual.weekPlan[0].recipes).toHaveLength(1);
    expect(actual.weekPlan[0].recipes[0]).toEqual(sampleRecipe);
  });

  it("should handle deleteRecipe", () => {
    const stateWithRecipe = reducer(initialState, addRecipe({ day: "Monday", recipe: sampleRecipe }));
    const actual = reducer(stateWithRecipe, deleteRecipe({ day: "Monday", recipeId: "r1" }));
    expect(actual.weekPlan[0].recipes).toHaveLength(0);
  });

  it("should handle moveRecipeWithinDay", () => {
    const recipe1 = { ...sampleRecipe, id: "r1" };
    const recipe2 = { ...sampleRecipe, id: "r2" };
    
    let state = reducer(initialState, addRecipe({ day: "Monday", recipe: recipe1 }));
    state = reducer(state, addRecipe({ day: "Monday", recipe: recipe2 }));

    const actual = reducer(state, moveRecipeWithinDay({ day: "Monday", oldIndex: 0, newIndex: 1 }));
    
    expect(actual.weekPlan[0].recipes[0].id).toBe("r2");
    expect(actual.weekPlan[0].recipes[1].id).toBe("r1");
  });

  it("should handle moveRecipeToDifferentDay", () => {
    const state = reducer(initialState, addRecipe({ day: "Monday", recipe: sampleRecipe }));
    
    const actual = reducer(state, moveRecipeToDifferentDay({ 
        sourceDayName: "Monday", 
        targetDayName: "Tuesday", 
        recipeId: "r1" 
    }));

    expect(actual.weekPlan[0].recipes).toHaveLength(0);
    expect(actual.weekPlan[1].recipes).toHaveLength(1);
    expect(actual.weekPlan[1].recipes[0].id).toBe("r1");
  });
});
