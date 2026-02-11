import { Card, Button, ListGroup } from "react-bootstrap";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Recipe } from "@/types";
import SortableRecipe from "./SortableRecipe";
import { useAppDispatch } from "@/store/hooks";
import { addRecipeToBank, removeRecipeFromBank } from "@/store/recipeBankSlice";
import { useRecipeContext } from "@/context/RecipeContext";

interface RecipeSidebarProps {
  recipes: Recipe[];
}

export default function RecipeSidebar({ recipes }: RecipeSidebarProps) {
  const dispatch = useAppDispatch();
  const { setNodeRef } = useDroppable({
    id: "recipe-bank",
  });

  const handleAddRecipe = () => {
      const name = prompt("Enter recipe name:");
      if (name) {
          const newRecipe: Recipe = {
              id: `bank-${crypto.randomUUID()}`,
              name,
              description: "Custom recipe",
              ingredients: "",
          };
          dispatch(addRecipeToBank(newRecipe));
      }
  };

  const handleDelete = (id: string) => {
      if(confirm("Delete from bank?")) {
          dispatch(removeRecipeFromBank(id));
      }
  }

  const { handleEditClick, handleDeleteRecipe } = useRecipeContext();
  
  const handleEdit = (recipe: Recipe) => {
      handleEditClick(null, recipe);
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Header className="text-center fw-bold d-flex justify-content-between align-items-center py-3">
        <span><i className="bi bi-collection me-2"></i>Recipe Bank</span>
        <Button variant="outline-light" size="sm" onClick={handleAddRecipe} className="opacity-50 hover-opacity-100 border-0">
            <i className="bi bi-plus-lg"></i>
        </Button>
      </Card.Header>
      <Card.Body ref={setNodeRef} className="d-flex flex-column p-2" style={{ minHeight: "150px", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          <SortableContext 
            items={recipes.map(r => r.id)} 
            strategy={verticalListSortingStrategy}
          >
            <ListGroup variant="flush" className="flex-grow-1">
              <AnimatePresence mode="popLayout">
                {recipes.map((recipe) => (
                  <SortableRecipe
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </ListGroup>
          </SortableContext>
          {recipes.length === 0 && <div className="text-muted text-center mt-3">No saved recipes</div>}
      </Card.Body>
    </Card>
  );
}
