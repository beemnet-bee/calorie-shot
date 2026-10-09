import Dexie, { type Table } from "dexie";

// A detected/edited food item inside a meal
export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  servingGrams: number;
  calories: number;        // kcal for this serving
  protein: number;         // g
  carbs: number;            // g
  fat: number;              // g
  fiber: number;            // g
  sugar: number;            // g
  sodium: number;           // mg
  saturatedFat: number;    // g
  cholesterol: number;     // mg
  confidence: number;       // 0..1 AI confidence
  source: "ai" | "user";    // AI Estimated vs User Confirmed/added
  foodDatabaseId?: string;  // link to seed DB if matched
}

export interface Meal {
  id: string;
  name: string;
  emoji: string;
  imageDataUrl?: string;     // compressed base64 (max ~200KB)
  imageThumb?: string;       // small thumb for lists
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  totalSaturatedFat: number;
  totalCholesterol: number;
  loggedAt: number;          // epoch ms
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "unknown";
  notes?: string;
  userConfirmed: boolean;    // false = AI Estimated, true = User Confirmed
}

export interface Goals {
  id: string; // always "default"
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  weightGoalKg?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  dietaryPreference?: "none" | "vegetarian" | "vegan" | "halal" | "keto" | "pescatarian";
  onboardedAt: number;
  updatedAt: number;
}

export interface FoodDatabaseEntry {
  id: string;
  name: string;
  emoji: string;
  category: string;
  region: "international" | "ethiopian";
  // Per 100g values
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    saturatedFat: number;
    cholesterol: number;
  };
  defaultServingGrams: number;
  aliases?: string[];
}

class CalorieShotDB extends Dexie {
  meals!: Table<Meal, string>;
  goals!: Table<Goals, string>;
  foodDatabase!: Table<FoodDatabaseEntry, string>;

  constructor() {
    super("calorieshot");
    this.version(1).stores({
      meals: "id, loggedAt, mealType",
      goals: "id",
      foodDatabase: "id, name, category, region, *aliases",
    });
  }
}

export const db = new CalorieShotDB();
