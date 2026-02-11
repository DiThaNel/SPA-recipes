import { Button } from "react-bootstrap";
import { Recipe } from "@/types";
import { forwardRef } from "react";
import { motion } from "framer-motion";

import { HTMLMotionProps } from "framer-motion";

interface RecipeItemProps extends HTMLMotionProps<"div"> {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
  isOverlay?: boolean;
}

const RecipeItem = forwardRef<HTMLDivElement, RecipeItemProps>(
  ({ recipe, onEdit, onDelete, isOverlay, style, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout={!isOverlay}
        initial={isOverlay ? { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" } : { opacity: 0, y: 10 }}
        animate={isOverlay ? { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}

        className={`list-group-item d-flex flex-column align-items-stretch gap-2 py-3 border-0 rounded-3 mb-2 ${className || ""}`}
        style={{
            ...style,
            backgroundColor: isOverlay ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.02)",
            cursor: isOverlay ? "grabbing" : "grab",
            zIndex: isOverlay ? 999 : "auto",
            position: "relative",
            backdropFilter: isOverlay ? "blur(8px)" : "none",
        }}
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
            className="bg-light p-2 rounded border-start border-2 border-warning mb-2"
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
            className="bg-light p-2 rounded border-start border-2 border-info"
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
      </motion.div>
    );
  }
);

RecipeItem.displayName = "RecipeItem";

export default RecipeItem;
