import { render, screen, fireEvent } from "@testing-library/react";
import DayCard from "../DayCard";
import { DayPlan } from "@/types";

describe("DayCard", () => {
  const mockDayPlan: DayPlan = {
    day: "Monday",
    recipes: [
      {
        id: "1",
        name: "Pasta",
        description: "Tomato sauce",
        ingredients: "Pasta, Tomato",
      },
    ],
  };

  test("renders day name", () => {
    render(<DayCard dayPlan={mockDayPlan} onAddRecipe={() => {}} onEditRecipe={() => {}} onDeleteRecipe={() => {}} />);
    expect(screen.getByText("Monday")).toBeInTheDocument();
  });

  test("renders recipes", () => {
    render(<DayCard dayPlan={mockDayPlan} onAddRecipe={() => {}} onEditRecipe={() => {}} onDeleteRecipe={() => {}} />);
    expect(screen.getByText("Pasta")).toBeInTheDocument();
  });

  test("renders 'No recipes' when empty", () => {
    const emptyPlan: DayPlan = { day: "Tuesday", recipes: [] };
    render(<DayCard dayPlan={emptyPlan} onAddRecipe={() => {}} onEditRecipe={() => {}} onDeleteRecipe={() => {}} />);
    expect(screen.getByText("No recipes planned.")).toBeInTheDocument();
  });

  test("calls onAddRecipe when button clicked", () => {
    const mockOnAdd = jest.fn();
    render(<DayCard dayPlan={mockDayPlan} onAddRecipe={mockOnAdd} onEditRecipe={() => {}} onDeleteRecipe={() => {}} />);
    
    const button = screen.getByText("+ Add Recipe");
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });
  
  test("calls onEditRecipe when edit button clicked", () => {
    const mockOnEdit = jest.fn();
    render(<DayCard dayPlan={mockDayPlan} onAddRecipe={() => {}} onEditRecipe={mockOnEdit} onDeleteRecipe={() => {}} />);
    
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockDayPlan.recipes[0]);
  });
  
  test("calls onDeleteRecipe when delete button clicked", () => {
    const mockOnDelete = jest.fn();
    render(<DayCard dayPlan={mockDayPlan} onAddRecipe={() => {}} onEditRecipe={() => {}} onDeleteRecipe={mockOnDelete} />);
    
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockDayPlan.recipes[0].id);
  });
});
