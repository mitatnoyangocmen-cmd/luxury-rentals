import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for our AI Concierge
  app.post("/api/concierge", async (req, res) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY environment variable is not configured.");
        return res.json({ 
          text: "Host team assistant here! I would love to answer your custom question, but my AI engine is currently in offline mode because the Gemini API secret is not configured in the Secrets panel yet. Please check out the pre-compiled 'Instant FAQs' tab, or contact our host Mitat directly via WhatsApp!" 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the premium local digital concierge for 'Istanbul Luxe Residence'—a beautiful 150m² luxury family apartment in Fatih, historic center of Istanbul.
Here are the official specifications and rules of the apartment:
- Accommodations: 150m² private floor, 4 private bedrooms, sleeps up to 10 guests. No shared areas. Highly secure.
  - Bedroom 1: King Bed, private in-suite glass hot tub.
  - Bedroom 2: Queen Bed.
  - Bedroom 3: 2 Twin Beds.
  - Bedroom 4: Twin bunk bed + high-end sofa bed in lounge.
- Luxury Amenities: Rooftop panoramic terrace with Bosphorus/Sultanahmet view, private master hot tub, 120-inch dropdown home cinema projector (with surround audio), 3 powerful modern AC units, electric fireplace, laundry closet (washer + steam iron), barista coffee maker, double kitchens.
- VIP Services: Chauffeured Mercedes-Benz Vito airport transfer (IST is €60, SAW is €70). Custom starry-sky ceiling, tv, sound system.
- Proximity & Transit: Located in Fatih.
  - 2 minutes walk to Yusufpaşa Tram Station (T1 Tram goes to Grand Bazaar in 8 mins/3 stops, Sultanahmet/Hagia Sophia in 12 mins/4 stops, Karaköy/Galata in 18 mins/6 stops).
  - 5 minutes walk to Yenikapı Metro Hub (Marmaray connects Asian Side; Metro M2 goes to Taksim in 15 mins).
- House Rules: No indoor smoking (permitted on open rooftop terrace), no massive loud parties, no pets. Standard check-in is 4:00 PM, checkout is 11:00 AM. Contactless check-in via smart digital door lock code (provided 24 hours prior to arrival).
- Local Supermarkets: Şok (1 min walk left), CarrefourSA (3 mins walk).
- Best local Baklava: Karaköy Güllüoğlu (take Tram T1 to Karaköy).
- Language: You can reply in English, Turkish, Arabic, Italian, German, or Spanish, matching the guest's language! Always maintain an incredibly polite, helpful, high-end hospitality host tone. Keep answers under 120 words for rapid readability, and use elegant formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({ 
        text: "My apologies! I encountered a temporary signal loss. Please feel free to ask again or review our Instant FAQs!" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
