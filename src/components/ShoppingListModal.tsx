"use client";

import { Modal, Button, ListGroup } from "react-bootstrap";
import { DayPlan } from "@/types";
import { useState, useMemo } from "react";

interface ShoppingListModalProps {
  show: boolean;
  onHide: () => void;
  weekPlan: DayPlan[];
}

export default function ShoppingListModal({ show, onHide, weekPlan }: ShoppingListModalProps) {
  const [copied, setCopied] = useState(false);

  const ingredientsList = useMemo(() => {
    const allIngredients: string[] = [];
    
    weekPlan.forEach(day => {
      day.recipes.forEach(recipe => {
        if (recipe.ingredients) {
            const items = recipe.ingredients.split(/[\n,]+/).map(i => i.trim()).filter(i => i.length > 0);
            allIngredients.push(...items);
        }
      });
    });

    return Array.from(new Set(allIngredients)).sort();
  }, [weekPlan]);

  const handleCopy = () => {
    const text = "Shopping List:\n\n" + ingredientsList.map(i => `- [ ] ${i}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
            Shopping List
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ingredientsList.length === 0 ? (
            <div className="text-center py-4 text-muted">
                <p className="mb-0">No ingredients found in your weekly plan.</p>
                <small>Add recipes with ingredients to see them here.</small>
            </div>
        ) : (
            <ListGroup variant="flush">
            {ingredientsList.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex align-items-center gap-2">
                    <input type="checkbox" className="form-check-input mt-0" />
                    <span>{item}</span>
                </ListGroup.Item>
            ))}
            </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="link" onClick={onHide} className="btn-cancel text-decoration-none">
          Close
        </Button>
        <Button 
            variant="primary" 
            onClick={handleCopy}
            disabled={ingredientsList.length === 0}
            className="btn-save px-4 d-flex align-items-center gap-2"
        >
          {copied ? <i className="bi bi-check-lg"></i> : <i className="bi bi-clipboard"></i>}
          {copied ? "Copied!" : "Copy List"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
