import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { calculateTransfer, isValidRoute, JourneyType, TransferLocation } from "./src/lib/transfer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  type Reservation = {
    name: string; email: string; phone: string; pickup: TransferLocation; dropoff: TransferLocation;
    journeyType: JourneyType;
    returnPickup?: TransferLocation; returnDropoff?: TransferLocation;
    flightNumber?: string; passengers: number; largeLuggage: number; cabinLuggage: number;
    notes?: string; turnstileToken?: string;
  };
  const locationName: Record<TransferLocation, string> = {
    ist: "Istanbul Airport (IST)",
    saw: "Sabiha Gökçen Airport (SAW)",
    home: "FMG Homes",
  };
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  const emailValue = (value: string) => `<span style="color:#1a1a1a;font-weight:600">${escapeHtml(value)}</span>`;
  function formatIstanbulTime(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
    const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? "";
    return `${value("day")} ${value("month")} ${value("year")}, ${value("hour")}:${value("minute")} (Istanbul Time)`;
  }
  function reservationEmail(item: Reservation, total: number, vehicle: string) {
    const inquiryTime = formatIstanbulTime(new Date());
    const journeyType = item.journeyType === "round-trip" ? "ROUND TRIP" : "ONE WAY";
    const outboundRoute = `${locationName[item.pickup]} → ${locationName[item.dropoff]}`;
    const returnRoute = item.journeyType === "round-trip" && item.returnPickup && item.returnDropoff
      ? `${locationName[item.returnPickup]} → ${locationName[item.returnDropoff]}`
      : undefined;
    const flightNumber = item.flightNumber?.trim();
    const notes = item.notes?.trim();
    const text = [
      "VIP TRANSFER INQUIRY",
      "",
      `Inquiry Date/Time: ${inquiryTime}`,
      "",
      "GUEST DETAILS",
      `Guest Name: ${item.name}`,
      `Email: ${item.email}`,
      `WhatsApp / Phone: ${item.phone}`,
      "",
      "JOURNEY",
      `Journey Type: ${journeyType}`,
      `Route: ${outboundRoute}`,
      ...(returnRoute ? [`Return Route: ${returnRoute}`] : []),
      "",
      "TRANSFER DETAILS",
      `Vehicle: ${vehicle}`,
      `Price: €${total}`,
      `Passengers: ${item.passengers}`,
      `Large Luggage: ${item.largeLuggage}`,
      `Cabin Luggage: ${item.cabinLuggage}`,
      "",
      "ADDITIONAL INFORMATION",
      ...(flightNumber ? [`Flight Number: ${flightNumber}`] : []),
      ...(notes ? ["", "Additional Notes:", notes] : []),
    ].join("\n");
    const row = (label: string, value: string) => `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top">${emailValue(value)}</td></tr>`;
    const section = (title: string, rows: string) => `<h2 style="margin:28px 0 8px;padding-top:20px;border-top:1px solid #e5e7eb;color:#c5a059;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.6px;text-transform:uppercase">${title}</h2><table role="presentation" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;width:100%">${rows}</table>`;
    const html = `<div style="margin:0 auto;max-width:640px;background:#ffffff;color:#1a1a1a;font-family:Arial,sans-serif;padding:32px 24px"><h1 style="margin:0;color:#1a1a1a;font-family:Georgia,serif;font-size:28px;font-weight:normal">VIP Transfer Inquiry</h1><p style="margin:8px 0 0;color:#6b7280;font-size:14px">${escapeHtml(inquiryTime)}</p>${section("Guest Details", row("Guest Name", item.name) + row("Email", item.email) + row("WhatsApp / Phone", item.phone))}${section("Journey", row("Journey Type", journeyType) + row("Route", outboundRoute) + (returnRoute ? row("Return Route", returnRoute) : ""))}${section("Transfer Details", row("Vehicle", vehicle) + row("Price", `€${total}`) + row("Passengers", String(item.passengers)) + row("Large Luggage", String(item.largeLuggage)) + row("Cabin Luggage", String(item.cabinLuggage)))}${section("Additional Information", flightNumber ? row("Flight Number", flightNumber) : "")}${notes ? `<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb"><p style="margin:0 0 8px;color:#c5a059;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase">Additional Notes</p><div style="color:#1a1a1a;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;overflow-wrap:anywhere;white-space:pre-wrap">${escapeHtml(notes)}</div></div>` : ""}</div>`;
    return { text, html };
  }
  async function verifyTurnstile(token: string | undefined, remoteIp: string | undefined) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) throw new Error("Turnstile is not configured.");
    if (!token) return false;
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(remoteIp ? { remoteip: remoteIp } : {}) }),
    });
    if (!response.ok) return false;
    return (await response.json() as { success?: boolean }).success === true;
  }
  async function sendEmail(subject: string, text: string, html: string) {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) throw new Error("Email delivery is not configured on the server.");
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: ["mitatnoyangocmen@gmail.com"], subject, text, html }) });
    if (!response.ok) throw new Error("Reservation email could not be sent.");
  }
  app.post("/api/vip-transfer-reservations", async (req, res) => {
    try {
      const item = req.body as Reservation;
      if (!item.name || !/^\S+@\S+\.\S+$/.test(item.email) || !item.phone || !item.flightNumber) return res.status(400).json({ message: "Please complete the required contact and flight details." });
      if (!await verifyTurnstile(item.turnstileToken, req.ip)) return res.status(400).json({ message: "Verification couldn't be completed. Please try again.", code: "turnstile_failed" });
      if (!isValidRoute(item.pickup, item.dropoff)) return res.status(400).json({ message: "Please select a valid airport and FMG Homes route." });
      if (item.journeyType === "round-trip" && !isValidRoute(item.returnPickup ?? "", item.returnDropoff ?? "")) return res.status(400).json({ message: "Please complete a valid return transfer route." });
      const pricing = calculateTransfer(item); const vehicle = pricing.vehicle === "vito" ? "Mercedes Vito" : "Mercedes Sprinter";
      const email = reservationEmail(item, pricing.totalPrice, vehicle);
      await sendEmail(`New VIP Transfer Request – ${item.name}`, email.text, email.html);
      const text = email.text;
      const whatsappUrl = `https://wa.me/905312980035?text=${encodeURIComponent(text)}`;
      res.status(201).json({ message: "Your VIP transfer request has been submitted.", whatsappUrl });
    } catch (error) { console.error("VIP transfer reservation failed:", error); res.status(503).json({ message: "We couldn't submit your transfer request. Please try again or contact us." }); }
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
