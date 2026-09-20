import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createSign } from "crypto";
import { calculateTransfer, HandLuggagePreference, JourneyType, TransferLocation } from "./src/lib/transfer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  type Reservation = {
    name: string; email: string; phone: string; pickup: TransferLocation; dropoff: TransferLocation;
    journeyType: JourneyType; date: string; time: string; returnDate?: string; returnTime?: string;
    flightNumber?: string; passengers: number; largeLuggage: number; cabinLuggage: number;
    handLuggagePreference: HandLuggagePreference; notes?: string;
  };
  const b64 = (value: string | Buffer) => Buffer.from(value).toString("base64url");
  async function googleToken() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!email || !privateKey) throw new Error("Google Drive is not configured on the server.");
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(JSON.stringify({ iss: email, scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }))}`;
    const signature = createSign("RSA-SHA256").update(unsigned).sign(privateKey, "base64url");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }) });
    if (!tokenResponse.ok) throw new Error("Google authentication failed.");
    return (await tokenResponse.json() as { access_token: string }).access_token;
  }
  function reservationText(item: Reservation, total: number, vehicle: string, route: string) {
    return `VIP TRANSFER RESERVATION\n\nBooking Date/Time: ${new Date().toISOString()}\nGuest Name: ${item.name}\nEmail: ${item.email}\nWhatsApp / Phone: ${item.phone}\n\nJourney Type: ${item.journeyType === "round-trip" ? "Round Trip" : "One Way"}\nPickup: ${item.pickup}\nDrop-off: ${item.dropoff}\nReturn Pickup: ${item.journeyType === "round-trip" ? item.dropoff : "—"}\nReturn Drop-off: ${item.journeyType === "round-trip" ? item.pickup : "—"}\nRoute: ${route}\n\nTransfer Date: ${item.date}\nTransfer Time: ${item.time}\nReturn Date: ${item.returnDate || "—"}\nReturn Time: ${item.returnTime || "—"}\n\nPassengers: ${item.passengers}\nLarge Luggage: ${item.largeLuggage}\nCabin Luggage: ${item.cabinLuggage}\nHand Luggage Preference: ${item.handLuggagePreference}\n\nVehicle: ${vehicle}\nPrice: €${total}\n\nFlight Number: ${item.flightNumber || "—"}\nAdditional Notes: ${item.notes || "—"}`;
  }
  async function createGoogleDocument(title: string, content: string) {
    const token = await googleToken(); const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const documentResponse = await fetch("https://docs.googleapis.com/v1/documents", { method: "POST", headers, body: JSON.stringify({ title }) });
    if (!documentResponse.ok) throw new Error("Google Doc could not be created.");
    const document = await documentResponse.json() as { documentId: string };
    const insertResponse = await fetch(`https://docs.googleapis.com/v1/documents/${document.documentId}:batchUpdate`, { method: "POST", headers, body: JSON.stringify({ requests: [{ insertText: { location: { index: 1 }, text: content } }] }) });
    const folder = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const moveResponse = folder && await fetch(`https://www.googleapis.com/drive/v3/files/${document.documentId}?addParents=${encodeURIComponent(folder)}&removeParents=root`, { method: "PATCH", headers });
    if (!insertResponse.ok || (moveResponse && !moveResponse.ok)) throw new Error("Google Doc could not be saved to Drive.");
  }
  async function sendEmail(subject: string, text: string) {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) throw new Error("Email delivery is not configured on the server.");
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: ["mitatnoyangocmen@gmail.com"], subject, text, html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${text.replace(/[&<>]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]!))}</pre>` }) });
    if (!response.ok) throw new Error("Reservation email could not be sent.");
  }
  app.post("/api/vip-transfer-reservations", async (req, res) => {
    try {
      const item = req.body as Reservation;
      if (!item.name || !/^\S+@\S+\.\S+$/.test(item.email) || !item.phone || !item.date || !item.time) return res.status(400).json({ message: "Please complete the required contact and transfer details." });
      if (item.pickup === item.dropoff) return res.status(400).json({ message: "Pick up and drop off must be different." });
      if (item.journeyType === "round-trip" && (!item.returnDate || !item.returnTime)) return res.status(400).json({ message: "Return date and time are required." });
      if ((item.pickup !== "fatih" || item.dropoff !== "fatih") && !item.flightNumber) return res.status(400).json({ message: "Flight number is required for airport transfers." });
      const pricing = calculateTransfer(item); const vehicle = pricing.vehicle === "vito" ? "Mercedes Vito" : "Mercedes Sprinter";
      const route = `${item.pickup} → ${pricing.isViaFatih ? "fatih → " : ""}${item.dropoff}`;
      const text = reservationText(item, pricing.totalPrice, vehicle, route);
      await Promise.all([createGoogleDocument(`VIP Transfer Reservation - ${item.name} - ${item.date}`, text), sendEmail(`New VIP Transfer Reservation - ${item.name} - ${item.date}`, text)]);
      const whatsappUrl = `https://wa.me/905312980035?text=${encodeURIComponent(text)}`;
      res.status(201).json({ message: "Your VIP transfer request has been submitted.", whatsappUrl });
    } catch (error) { console.error("VIP transfer reservation failed:", error); res.status(503).json({ message: error instanceof Error ? error.message : "Reservation delivery failed. Please try again." }); }
  });

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
