"use client";

import { Card, Button, ListGroup } from "react-bootstrap";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
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
      <Card.Header className="text-center py-3">
        {dayPlan.day}
      </Card.Header>
      <Card.Body ref={setNodeRef} className="d-flex flex-column" style={{ minHeight: "150px" }}> 
        
        {dayPlan.recipes.length === 0 ? (
           <div className="text-secondary text-center my-auto py-4 fst-italic opacity-75">
             <i className="bi bi-journal-plus fs-2 mb-2 d-block"></i>
             No recipes planned
           </div>
        ) : (
          <SortableContext 
            items={dayPlan.recipes.map(r => r.id)} 
            strategy={verticalListSortingStrategy}
          >
            <ListGroup variant="flush" className="flex-grow-1">
              <AnimatePresence mode="popLayout">
                {dayPlan.recipes.map((recipe) => (
                  <SortableRecipe
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={onEditRecipe}
                    onDelete={onDeleteRecipe}
                  />
                ))}
              </AnimatePresence>
            </ListGroup>
          </SortableContext>
        )}
      </Card.Body>
      <Card.Footer className="border-0">
        <Button variant="outline-primary" size="sm" className="w-100 border-dashed opacity-75 hover-opacity-100" onClick={onAddRecipe}>
          <i className="bi bi-plus-lg me-1"></i> Add Recipe
        </Button>
      </Card.Footer>
    </Card>
  );
}
