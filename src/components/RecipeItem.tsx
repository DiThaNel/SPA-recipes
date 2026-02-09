"use client";

import { Button, ListGroup } from "react-bootstrap";
import { Recipe } from "@/types";
import { forwardRef } from "react";

interface RecipeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
  isOverlay?: boolean;
}

const RecipeItem = forwardRef<HTMLElement, RecipeItemProps>(
  ({ recipe, onEdit, onDelete, isOverlay, style, className, ...props }, ref) => {
    return (
      <ListGroup.Item
        // @ts-ignore - ListGroup.Item ref type is complex/polymorphic
        ref={ref}
        style={{
            ...style,
            cursor: isOverlay ? "grabbing" : "grab",
            boxShadow: isOverlay ? "none" : "none",
            background: isOverlay ? "transparent" : undefined, 
            borderColor: isOverlay ? "transparent" : undefined,
        }}
        className={`d-flex flex-column align-items-stretch gap-2 py-3 ${className || ""}`}
        {...props}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fw-bold fs-5">{recipe.name}</div>
            {recipe.description && (
              <p className="small mb-0 text-muted">{recipe.description}</p>
            )}
          </div>
        </div>

        {recipe.preparation && (
          <div
            className="bg-light p-2 rounded border-start border-4 border-warning mb-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="small mb-0 text-dark">
              <span className="fw-bold text-uppercase" style={{ fontSize: "0.7rem" }}>
                Preparation:
              </span>
              <br />
              {recipe.preparation}
            </p>
          </div>
        )}

        {recipe.ingredients && (
          <div
            className="bg-light p-2 rounded border-start border-4 border-info"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="small mb-0 text-dark">
              <span className="fw-bold text-uppercase" style={{ fontSize: "0.7rem" }}>
                Ingredients:
              </span>
              <br />
              {recipe.ingredients}
            </p>
          </div>
        )}

        <div className="d-flex gap-2 mt-1">
          <Button
            variant="outline-secondary"
            size="sm"
            className="flex-grow-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit && onEdit(recipe)}
          >
            <i className="bi bi-pencil"></i> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="flex-grow-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete && onDelete(recipe.id)}
          >
            <i className="bi bi-trash"></i> Delete
          </Button>
        </div>
      </ListGroup.Item>
    );
  }
);

RecipeItem.displayName = "RecipeItem";

export default RecipeItem;
