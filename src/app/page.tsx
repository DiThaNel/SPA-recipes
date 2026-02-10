"use client";

import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import DayCard from "@/components/DayCard";
import RecipeModal from "@/components/RecipeModal";
import RecipeItem from "@/components/RecipeItem";
import ShoppingListModal from "@/components/ShoppingListModal";
import RecipeSidebar from "@/components/RecipeSidebar";
import { useRecipeContext } from "@/context/RecipeContext";

export default function Home() {
  const {
    weekPlan,
    recipeBank,
    selectedDay,
    editingRecipe,
    showModal,
    activeRecipe,
    handleAddClick,
    handleCloseModal,
    handleEditClick,
    handleDeleteRecipe,
    handleSaveRecipe,
    handleDragStart,
    handleDragEnd,
  } = useRecipeContext();

  const [showShoppingList, setShowShoppingList] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Container className="py-5">
        <header className="mb-5 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="display-4 fw-bold text-primary">Weekly Recipe Scheduler</h1>
                <p className="lead text-secondary mb-4">Plan your meals for the week efficiently.</p>
                
                <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => setShowShoppingList(true)}
                    className="btn-save shadow-sm rounded-pill px-4"
                >
                    <i className="bi bi-cart4 me-2"></i>
                    Generate Shopping List
                </Button>
            </motion.div>
        </header>

        <Row className="g-4 px-2">
          {/* Sidebar */}
          <Col xs={12} md={4} lg={3} xl={3} className="mb-4 mb-md-0">
             <div className="sticky-top" style={{ top: "20px", zIndex: 100 }}>
                 <RecipeSidebar recipes={recipeBank} />
             </div>
          </Col>

          {/* Week Grid */}
          <Col xs={12} md={8} lg={9} xl={9}>
            <Row className="g-4">
              {weekPlan.map((plan, index) => (
                <Col key={plan.day} xs={12} lg={6} xl={4}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="h-100"
                    >
                      <DayCard
                        dayPlan={plan}
                        onAddRecipe={() => handleAddClick(plan.day)}
                        onEditRecipe={(recipe) => handleEditClick(plan.day, recipe)}
                        onDeleteRecipe={(recipeId) => handleDeleteRecipe(plan.day, recipeId)}
                      />
                    </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <RecipeModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleSaveRecipe}
          initialData={editingRecipe}
        />

        <ShoppingListModal
            show={showShoppingList}
            onHide={() => setShowShoppingList(false)}
            weekPlan={weekPlan}
        />
        
        <DragOverlay>
            {activeRecipe ? (
                <RecipeItem recipe={activeRecipe} isOverlay />
            ) : null}
        </DragOverlay>
      </Container>
    </DndContext>
  );
}
