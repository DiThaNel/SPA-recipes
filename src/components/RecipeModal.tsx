"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Recipe } from "@/types";

interface RecipeModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (recipe: Omit<Recipe, "id">) => void;
  initialData?: Recipe | null;
}

export default function RecipeModal({ show, onHide, onSave, initialData }: RecipeModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preparation, setPreparation] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Update effect to load initial data when modal opens
  useEffect(() => {
    if (show && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPreparation(initialData.preparation || "");
      setIngredients(initialData.ingredients);
    } else if (show && !initialData) {
      // Reset if adding new
      setName("");
      setDescription("");
      setPreparation("");
      setIngredients("");
    }
  }, [show, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, preparation, ingredients });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Recipe" : "Add Recipe"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Recipe Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Preparation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="link" onClick={onHide} className="btn-cancel text-decoration-none">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="btn-save px-4">
              Save Recipe
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
