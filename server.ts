import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Analyze Celestial Compatibility
app.post("/api/compatibility", async (req, res) => {
  try {
    const ai = getGeminiClient();
    
    const prompt = `
    Analyze the romantic relationship compatibility between Ice (female, age 18) and Kao (male, age 17).
    Here are their detailed profiles:
    
    [ICE PROFILE]
    Nickname: Ice (ไอซ์ 🧊)
    Full Name: Arita Rachnavi (อาริตา ราชนาวี)
    Age: 18
    Birthday: Saturday, 6 October 2007 (2007)
    Province: Ubon Ratchathani (Isan)
    Likes:
    - Games: Roblox, RoV, Stardew Valley
    - Foods: Kaprao, Noodles, Japanese Curry, Moo Krata, Gyoza, Crispy Fried Chicken (KFC), Hainanese Chicken Rice (meat only, delicious dipping sauce), Spaghetti Carbonara (no mushrooms), Tom Yum Kung (thick soup), Mala (dry fried, medium spicy, yellow noodles, cheese tofu, fish tofu, meats)
    - Drinks: Crystal water (dislikes Singha), Oishi Orange, Yen Yen Red, Puriku (pink/green), Betagen, Oreo Frappe
    - Snacks: KitKat (regular), Pringles Sour Cream & Onion, Loacker Quadratini Red, Tivoli Jumbo (red/blue), Dozo Sweet Chili, Nelly (blue/green)
    - Pets: Dogs, Cats (Wichien Maat / Siamese)
    - Travel: Anywhere is fine
    - Countries: Thailand, China, Japan, Italy
    - Personality: Kind, speaks politely, good thinker/doer, generous, playful, high leadership, reasonable
    Dislikes:
    - Foods: Onion, long beans, durian
    - Drinks: Bubble tea, Thai tea, green tea, boba pearls
    - Snacks: Raisins
    - Pets/Animals: Snakes, centipedes, millipedes, worms, geckos
    - Personality: Lying, hypocrisy, flirting/unfaithful
    - Fears: Lightning/thunder, darkness, ghosts, loud noises
    
    [KAO PROFILE]
    Nickname: Kao (ก้าว 🔭)
    Full Name: Chitsanupong Renuhorm (ชิษณุพงศ์ เรณูหอม)
    Age: 17
    MBTI: INTJ
    Birthday: Friday, 3 April 2009 (2009)
    Province: Pathum Thani (Central)
    Likes:
    - Games: Roblox, RoV, NTE (Neverness to Everness)
    - Foods: Kaprao, Pork/Beef Steak, Ramen, Sushi (sweet egg), Egg Fried Rice (just egg, no vegetables), Fried Chicken (KFC), Hawaiian Pizza, Spaghetti (Carbonara/Tomato), Grilled Pork, Noodles (yellow noodles), Japanese Curry, Omelet Rice, Steamed egg, Pork stew (Phalo), Hainanese Chicken Rice (with chicken blood), Korean Mama (cheese/carbonara), Chicken breast (CP)
    - Drinks: Crystal water (dislikes Singha), Green Tea (0%-25% sweet), Oolong tea, Black tea, Matcha Latte (0%-25% sweet), Black Coffee, Coke Zero, Pepsi No Sugar, Honey Lemon tea, Grape juice, Betagen, Calpis Lacto, Cabernet Sauvignon, Red Bull Grape
    - Snacks: KitKat Matcha, Oreo Matcha, Pocky Matcha, Pringles Sour Cream & Onion, Nama Chocolate Au Lait, Croissant
    - Pets: Cats, Dogs, Rabbits
    - Travel: Nature, stargazing spots, mountains, sea, cozy cafes, museums, planetarium
    - Countries: China, Japan, Russia, Thailand
    - Personality: Kind, warm, sincere, honest, keeps promises, reasonable, likes planning, caring, active learner, faithful/single-minded, polite, gentle, empathetic, responsible
    Dislikes:
    - Foods: Durian, smelly foods, bitter vegetables, raw/gamey foods
    - Drinks: Super sweet drinks
    - Snacks: Excessively sweet snacks
    - Pets/Animals: Snakes, cockroaches, centipedes
    - Personality: Lying, selfish, unfaithful, taking advantage, impolite, jealous, dramatic, heavy smoker, gambler, violent, childish
    - Fears: Lightning/thunder, darkness, rain
    
    Write a beautiful, sweet, supportive, and emotionally touching compatibilty report in THAI.
    Highlight:
    1. Their amazing overlapping likes (Both love Roblox, RoV, Crystal water and strictly hate Singha water, Betagen, Pringles Sour Cream & Onion, KitKat, and both love cats & dogs!).
    2. Their matching traits (Both are extremely kind, polite, reasonable, sincere, and hate lying or flirting with others).
    3. How Kao's planning nature (INTJ) and love for stargazing can create wonderful romantic moments for Ice (e.g. taking her stargazing, being a warm protector when she's scared of thunder or darkness).
    4. Provide a "Love Harmony Percentage" (e.g., 99.99%) and a sweet, poetic summary of their orbit.
    
    Format the response in JSON with these keys:
    {
      "harmonyPercentage": 99.99,
      "compatibilityTitle": "string (romantic title in Thai)",
      "commonGrounds": ["array of sweet matches"],
      "traitSymmetry": "string (description of how their hearts match)",
      "stargazingStory": "string (how Kao's stargazing and Ice's brightness align)",
      "futureForecast": "string (sweet prediction/advice for them)",
      "poeticSummary": "string (a beautiful 4-line Thai poem about Ice & Kao)"
    }
    
    Ensure the JSON is completely valid, clean, and has no markdown formatting around it.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    res.setHeader("Content-Type", "application/json");
    res.send(resultText);
  } catch (error: any) {
    console.error("Error generating compatibility:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. API: Generate Custom Love Story or Poem
app.post("/api/generate-story", async (req, res) => {
  try {
    const { genre, mood } = req.body;
    const ai = getGeminiClient();

    const prompt = `
    Write a highly personalized, gorgeous, and emotionally touching cosmic romantic fairy tale in THAI featuring:
    - Main Characters: 
      * Ice (พี่ไอซ์ 🧊, Arita Rachnavi, age 18): polite, playful, kind leader, good thinker/doer, generous. Loves Roblox, RoV, Stardew Valley, dry-fried Mala (medium spicy, yellow noodles, cheese tofu, fish tofu, meats), Spaghetti Carbonara (no mushrooms). Drinks Crystal water (and strictly hates Singha water!), Betagen. Likes Wichien Maat (Siamese) cats and dogs. Fears lightning/thunder, darkness, and ghosts.
      * Kao (ก้าว 🔭, Chitsanupong Renuhorm, age 17): warm, polite, gentle, stargazing INTJ planner, active learner, faithful/single-minded, responsible. Loves Roblox, RoV, NTE, Pork/Beef Steak, yellow noodles, Japanese Curry. Drinks Crystal water (dislikes Singha), Betagen, Green Tea. Likes cats, dogs, rabbits. Fears lightning/thunder, darkness, and rain.

    - Genre requested: ${genre || "Cozy Planetarium Stargazing Romance"}
    - Mood requested: ${mood || "Comforting & Soft"}

    Create a story of exactly 4 sequential cards (scenes/chapters) representing their eternal cosmic voyage.
    The narrative should beautifully weave in these elements:
    1. Their shared love for playing Roblox & RoV together in the cosmic arcade.
    2. Sharing a celestial meal of dry-fried Mala (with yellow noodles and cheese tofu) and drinking Crystal water (while playfully teasing each other about how they both refuse to drink the bitter Singha water nebula!).
    3. A moment where a cosmic storm (lightning/thunder, darkness) occurs, and Kao (the INTJ planner/protector) wraps his arms around Ice, holding her hand tightly, planning their safe course and making her feel completely safe and warm.
    4. Kao's love for stargazing and planning a dream trip to Japan/Italy, and how Ice's bright warmth lights up his quiet INTJ universe.

    Format the output as a clean, valid JSON matching the following schema:
    {
      "title": "string (a beautiful, highly romantic title in Thai, e.g., 'วงโคจรแห่งหัวใจพราว: การเดินทางของดวงดาวไอซ์และก้าว')",
      "cards": [
        {
          "id": 1,
          "title": "string (elegant chapter/card title in Thai, e.g., 'บทนำ: จุดเริ่มต้นของวงโคจรคู่')",
          "content": "string (the heartwarming story section in Thai, around 2-3 sentences. Use beautiful, poetic, yet simple and modern Thai words)",
          "emoji": "string (a single highly relevant emoji for this card, e.g., '🌌', '🍜', '⚡', '✨', '🐱')",
          "bgGradient": "string (a dark, cozy Tailwind gradient class suited for this scene, e.g., 'from-indigo-950/50 via-purple-950/40 to-slate-900/50' or 'from-rose-950/50 via-purple-950/45 to-black/50')"
        }
      ],
      "quote": "string (a deeply touching, sweet, and memorable romantic quote in Thai, spoken between them or summarizing their love)"
    }

    Ensure you generate exactly 4 cards in the "cards" array. Each card must have a unique ID (1, 2, 3, 4).
    Ensure the JSON is completely valid, clean, and has no markdown codeblocks or wrapper around it.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    res.setHeader("Content-Type", "application/json");
    res.send(resultText);
  } catch (error: any) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. API: Generate Romantic Recipe or Fortune
app.post("/api/generate-fortune", async (req, res) => {
  try {
    const { category } = req.body; // e.g. "recipe" (Mala bowl) or "fortune"
    const ai = getGeminiClient();

    let prompt = "";
    if (category === "recipe") {
      prompt = `
      Create a cute, highly personalized romantic recipe in THAI called "สูตรลับหม่าล่าแห่งความรักของ ไอซ์ 💗 ก้าว" (Ice & Kao's Secret Mala Love Recipe).
      
      Ice loves: Mala (dry-fried, medium spicy, yellow noodles, cheese tofu, fish tofu, meats)
      Kao loves: Yellow noodles, ramen, pork/beef.
      
      Make it a funny, sweet, step-by-step recipe that combines their tastes into one ultimate dish.
      Each step of the recipe should have a cute romantic analogy. E.g., "Step 1: Boil yellow noodles till soft, just like how Kao's heart melts when seeing Ice's smile," or "Step 2: Dry-fry with medium spicy Mala, adding cheese tofu that overflows with warmth."
      
      Format the response in JSON with:
      {
        "recipeName": "string",
        "ingredients": ["array of playful, romantic ingredients"],
        "steps": ["array of sweet cooking steps with love analogies"],
        "chefNote": "string (a sweet message from the Chef/Gemini wishing them an eternity of happy cooking and dining together)"
      }
      `;
    } else {
      prompt = `
      Write a beautiful "Daily Cosmic Love Fortune & Blessing" in THAI for a couple: Ice (ไอซ์ 🧊, age 18) and Kao (ก้าว 🔭, age 17).
      Base the fortune on stars, cosmic alignment, and their matching personalities (empathetic, polite, honest, reasonable).
      
      Format the response in JSON with:
      {
        "luckyTheme": "string (e.g. กลุ่มดาวคนคู่, คริสตัลวิบวับ, ทางช้างเผือกสีชมพู)",
        "compatibilityTip": "string (cute daily advice for them, e.g. วันนี้ชวนกันเล่น Roblox หรือกินสปาเก็ตตี้คาโบนาร่าด้วยกันนะ)",
        "prediction": "string (beautiful cosmic love prediction)",
        "starRating": 5
      }
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    res.setHeader("Content-Type", "application/json");
    res.send(resultText);
  } catch (error: any) {
    console.error("Error generating fortune/recipe:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend assets in production / hook Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
