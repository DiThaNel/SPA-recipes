import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Recipe } from "@/types";
import RecipeItem from "./RecipeItem";

interface SortableRecipeProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

export default function SortableRecipe({ recipe, onEdit, onDelete }: SortableRecipeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <RecipeItem
        ref={setNodeRef}
        style={style}
        recipe={recipe}
        onEdit={onEdit}
        onDelete={onDelete}
        {...attributes}
        {...listeners}
    />
  );
}
