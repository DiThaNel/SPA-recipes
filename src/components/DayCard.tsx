"use client";

import { Card, Button, ListGroup } from "react-bootstrap";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DayPlan, Recipe } from "@/types";
import SortableRecipe from "./SortableRecipe";

interface DayCardProps {
  dayPlan: DayPlan;
  onAddRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export default function DayCard({ dayPlan, onAddRecipe, onEditRecipe, onDeleteRecipe }: DayCardProps) {
  const { setNodeRef } = useDroppable({
    id: dayPlan.day,
  });

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white text-center fw-bold">
        {dayPlan.day}
      </Card.Header>
      <Card.Body ref={setNodeRef} className="d-flex flex-column" style={{ minHeight: "150px" }}> 
        
        {dayPlan.recipes.length === 0 ? (
           <div className="text-muted text-center my-auto py-3">No recipes planned.</div>
        ) : (
          <SortableContext 
            items={dayPlan.recipes.map(r => r.id)} 
            strategy={verticalListSortingStrategy}
          >
            <ListGroup variant="flush" className="flex-grow-1">
              {dayPlan.recipes.map((recipe) => (
                <SortableRecipe
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={onEditRecipe}
                  onDelete={onDeleteRecipe}
                />
              ))}
            </ListGroup>
          </SortableContext>
        )}
      </Card.Body>
      <Card.Footer className="border-0">
        <Button variant="outline-primary" size="sm" className="w-100" onClick={onAddRecipe}>
          + Add Recipe
        </Button>
      </Card.Footer>
    </Card>
  );
}
