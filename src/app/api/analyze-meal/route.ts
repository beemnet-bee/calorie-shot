import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DetectedFoodItem {
  name: string;
  emoji: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  saturatedFat: number;
  cholesterol: number;
  confidence: number;
}

interface AnalyzeResult {
  mealName: string;
  mealEmoji: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "unknown";
  foods: DetectedFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  totalSaturatedFat: number;
  totalCholesterol: number;
  overallConfidence: number;
}

const SYSTEM_PROMPT = `You are CalorieShot, an expert nutrition AI specializing in both international and Ethiopian cuisine. You analyze meal photos and identify individual food items, then estimate the nutritional content of each.

For every photo:
1. Identify the overall meal name (e.g. "Chicken Rice Bowl" or "Injera with Doro Wot").
2. Detect each individual food item on the plate or in the bowl.
3. Estimate the serving size in grams based on visual portion.
4. Estimate per-item nutrition: calories (kcal), protein (g), carbs (g), fat (g), fiber (g), sugar (g), sodium (mg), saturatedFat (g), cholesterol (mg).
5. Provide a confidence score 0..1 for each item, and an overallConfidence for the meal.
6. For each food's "emoji" field, return a SHORT ICON KEY (lowercase, hyphenated) instead of an emoji — these are the only valid keys:
   flatbread, stew, meat-pieces, minced-meat, shredded, lentils, greens, mixed-veg, platter, dough, grain, drink,
   rice, chicken, pasta, beef, salad, broccoli, sauce, avocado, banana, apple, egg, bread, fish, dairy, oatmeal,
   fries, cheese, oil, coffee, bowl

=== CRITICAL: ETHIOPIAN FOOD RECOGNITION ===
You MUST recognize and correctly identify these traditional Ethiopian dishes when they appear:
- Injera: large spongy, porous, gray-beige flatbread (pancake-like), often used as a base or rolled
- Doro Wot: dark red-brown spicy chicken stew, often with a boiled egg, served on injera
- Shiro: smooth, thick, yellow-brown chickpea flour stew
- Tibs: sautéed cubed beef or lamb with onions/peppers, often sizzling
- Kitfo: minced raw beef, often with cottage cheese (ayib) and greens
- Firfir: shredded injera mixed with berbere sauce, often with onion
- Misir Wot: red lentil stew, deep red-orange
- Gomen: cooked chopped collard greens
- Atakilt: mild cabbage, potato, and carrot stew
- Kik Wot: yellow split pea stew
- Beyainatu: combination platter with multiple wots on injera (no meat during fasting)
- Key Wot: red berbere beef stew
- Chechebsa: spiced shredded flatbread bits
- Tihlo: roasted barley dough balls
- Dabo: Ethiopian wheat bread loaf

=== HOW TO CALCULATE PORTIONS ===
- For injera: a typical large piece (rolled or spread) = 200-300g
- For wot/stew on top of injera: typically 150-250g per serving
- For tibs: typically 150-200g
- For kitfo: typically 100-150g
- For beyainatu platter: estimate the total weight including injera base (~350g+)
- Always split the meal into individual food components (e.g. injera + doro wot + boiled egg separately)

=== HOW TO NAME FOODS ===
- Use the canonical names listed above when the food is Ethiopian
- For international foods use clear English names (White Rice, Grilled Chicken, etc.)

Respond with ONLY a single JSON object — no markdown, no explanation, no code fence. Use this exact schema:

{
  "mealName": string,
  "mealEmoji": string,
  "mealType": "breakfast" | "lunch" | "dinner" | "snack" | "unknown",
  "foods": [
    {
      "name": string,
      "emoji": string,
      "servingGrams": number,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number,
      "sugar": number,
      "sodium": number,
      "saturatedFat": number,
      "cholesterol": number,
      "confidence": number
    }
  ],
  "overallConfidence": number
}

Important:
- Totals must equal the sum of per-item values.
- The "emoji" field MUST be one of the icon keys listed above (NOT a unicode emoji).
- If you cannot identify a food, label it as "Unknown food" with confidence 0.1 and emoji "bowl".
- Always estimate, do not refuse.
- All nutrition values are non-negative numbers.`;

interface RequestBody {
  image: string;
}

function sanitizeJson(text: string): string {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }
  return t;
}

function clampPositive(n: unknown, fallback = 0): number {
  const v = typeof n === "number" ? n : typeof n === "string" ? parseFloat(n) : NaN;
  if (!isFinite(v) || v < 0) return fallback;
  return Math.round(v * 100) / 100;
}

function normalizeFood(raw: any): DetectedFoodItem {
  // "emoji" field is now an icon key (e.g. "rice", "stew") — validate against allowed list
  const VALID_KEYS = new Set([
    "flatbread", "stew", "meat-pieces", "minced-meat", "shredded", "lentils", "greens",
    "mixed-veg", "platter", "dough", "grain", "drink", "rice", "chicken", "pasta", "beef",
    "salad", "broccoli", "sauce", "avocado", "banana", "apple", "egg", "bread", "fish",
    "dairy", "oatmeal", "fries", "cheese", "oil", "coffee", "bowl",
  ]);
  const emojiRaw = typeof raw?.emoji === "string" ? raw.emoji.trim().toLowerCase() : "";
  // If the AI returned an actual emoji char instead of a key, fall back to "bowl"
  const emoji = VALID_KEYS.has(emojiRaw) ? emojiRaw : "bowl";
  return {
    name: typeof raw?.name === "string" && raw.name.trim() ? raw.name.trim() : "Unknown food",
    emoji,
    servingGrams: clampPositive(raw?.servingGrams ?? raw?.grams ?? 100),
    calories: clampPositive(raw?.calories ?? raw?.kcal),
    protein: clampPositive(raw?.protein),
    carbs: clampPositive(raw?.carbs ?? raw?.carbohydrates),
    fat: clampPositive(raw?.fat),
    fiber: clampPositive(raw?.fiber),
    sugar: clampPositive(raw?.sugar),
    sodium: clampPositive(raw?.sodium),
    saturatedFat: clampPositive(raw?.saturatedFat ?? raw?.saturated),
    cholesterol: clampPositive(raw?.cholesterol),
    confidence: Math.min(1, Math.max(0, clampPositive(raw?.confidence, 0.5))),
  };
}

function computeTotals(foods: DetectedFoodItem[]) {
  const sum = (k: keyof DetectedFoodItem) =>
    foods.reduce((acc, f) => acc + (f[k] as number), 0);
  return {
    totalCalories: Math.round(sum("calories")),
    totalProtein: Math.round(sum("protein") * 10) / 10,
    totalCarbs: Math.round(sum("carbs") * 10) / 10,
    totalFat: Math.round(sum("fat") * 10) / 10,
    totalFiber: Math.round(sum("fiber") * 10) / 10,
    totalSugar: Math.round(sum("sugar") * 10) / 10,
    totalSodium: Math.round(sum("sodium")),
    totalSaturatedFat: Math.round(sum("saturatedFat") * 10) / 10,
    totalCholesterol: Math.round(sum("cholesterol")),
  };
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.image || !body.image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Missing or invalid image data URL" }, { status: 400 });
  }

  if (body.image.length > 14_000_000) {
    return NextResponse.json({ error: "Image too large. Please compress and retry." }, { status: 413 });
  }

  try {
    const zai = await ZAI.create();
    const response = await zai.chat.completions.createVision({
      messages: [
        { role: "system", content: [{ type: "text", text: SYSTEM_PROMPT }] },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this meal photo and return the JSON described." },
            { type: "image_url", image_url: { url: body.image } },
          ],
        },
      ],
      thinking: { type: "disabled" },
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(sanitizeJson(raw));
    } catch {
      return NextResponse.json(
        { error: "Could not parse AI response. Please retake the photo.", raw: raw.slice(0, 500) },
        { status: 502 }
      );
    }

    const foodsRaw: any[] = Array.isArray(parsed?.foods) ? parsed.foods : [];
    const foods = foodsRaw.map(normalizeFood).filter((f) => f.calories >= 0);

    const totals = computeTotals(foods);
    const VALID_KEYS = new Set([
      "flatbread", "stew", "meat-pieces", "minced-meat", "shredded", "lentils", "greens",
      "mixed-veg", "platter", "dough", "grain", "drink", "rice", "chicken", "pasta", "beef",
      "salad", "broccoli", "sauce", "avocado", "banana", "apple", "egg", "bread", "fish",
      "dairy", "oatmeal", "fries", "cheese", "oil", "coffee", "bowl",
    ]);
    const mealEmojiRaw = typeof parsed?.mealEmoji === "string" ? parsed.mealEmoji.trim().toLowerCase() : "";
    const mealEmoji = VALID_KEYS.has(mealEmojiRaw) ? mealEmojiRaw : "bowl";

    const result: AnalyzeResult = {
      mealName: typeof parsed?.mealName === "string" && parsed.mealName ? parsed.mealName : "Untitled meal",
      mealEmoji,
      mealType: ["breakfast", "lunch", "dinner", "snack", "unknown"].includes(parsed?.mealType) ? parsed.mealType : "unknown",
      foods,
      overallConfidence: Math.min(1, Math.max(0, clampPositive(parsed?.overallConfidence, 0.5))),
      ...totals,
    };

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("[/api/analyze-meal] error:", err?.message ?? err);
    return NextResponse.json(
      { error: "AI analysis failed. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
