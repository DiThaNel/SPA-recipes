export interface Recipe {
  id: string;
  name: string;
  description: string;
  preparation?: string;
  ingredients: string;
}

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface DayPlan {
  day: DayName;
  recipes: Recipe[];
}
