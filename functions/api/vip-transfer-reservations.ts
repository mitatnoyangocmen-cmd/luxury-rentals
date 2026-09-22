import { calculateTransfer, isValidRoute, JourneyType, TransferLocation } from "../../src/lib/transfer";

type Env = {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

type Reservation = {
  name: string;
  email: string;
  phone: string;
  pickup: TransferLocation;
  dropoff: TransferLocation;
  journeyType: JourneyType;
  returnPickup?: TransferLocation;
  returnDropoff?: TransferLocation;
  flightNumber?: string;
  passengers: number;
  largeLuggage: number;
  cabinLuggage: number;
  notes?: string;
  turnstileToken?: string;
};

const locationName: Record<TransferLocation, string> = {
  ist: "Istanbul Airport (IST)",
  saw: "Sabiha Gökçen Airport (SAW)",
  home: "FMG Homes",
};

const json = (body: Record<string, string>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

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

async function verifyTurnstile(token: string | undefined, secret: string, remoteIp: string | null) {
  if (!token || !secret) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, ...(remoteIp ? { remoteip: remoteIp } : {}) }),
  });
  if (!response.ok) return false;
  return (await response.json() as { success?: boolean }).success === true;
}

function hasValidQuantities(item: Reservation) {
  return Number.isInteger(item.passengers) && item.passengers >= 1 && item.passengers <= 10
    && Number.isInteger(item.largeLuggage) && item.largeLuggage >= 0 && item.largeLuggage <= 10
    && Number.isInteger(item.cabinLuggage) && item.cabinLuggage >= 0 && item.cabinLuggage <= 10;
}

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  try {
    const item = await request.json() as Reservation;
    if (!item.name || !/^\S+@\S+\.\S+$/.test(item.email) || !item.phone || !item.flightNumber || !hasValidQuantities(item)) {
      return json({ message: "Please complete the required contact and flight details." }, 400);
    }
    if (!await verifyTurnstile(item.turnstileToken, env.TURNSTILE_SECRET_KEY, request.headers.get("CF-Connecting-IP"))) {
      return json({ message: "Verification couldn't be completed. Please try again.", code: "turnstile_failed" }, 400);
    }
    if (item.journeyType !== "one-way" && item.journeyType !== "round-trip") {
      return json({ message: "Please select a valid airport and FMG Homes route." }, 400);
    }
    if (!isValidRoute(item.pickup, item.dropoff)) {
      return json({ message: "Please select a valid airport and FMG Homes route." }, 400);
    }
    if (item.journeyType === "round-trip" && !isValidRoute(item.returnPickup ?? "", item.returnDropoff ?? "")) {
      return json({ message: "Please complete a valid return transfer route." }, 400);
    }

    const pricing = calculateTransfer(item);
    const vehicle = pricing.vehicle === "vito" ? "Mercedes Vito" : "Mercedes Sprinter";
    const email = reservationEmail(item, pricing.totalPrice, vehicle);
    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: ["mitatnoyangocmen@gmail.com"],
        subject: `New VIP Transfer Request – ${item.name}`,
        text: email.text,
        html: email.html,
      }),
    });
    if (!resend.ok) throw new Error("Reservation email could not be sent.");

    return json({
      message: "Your VIP transfer request has been submitted.",
      whatsappUrl: `https://wa.me/905312980035?text=${encodeURIComponent(email.text)}`,
    }, 201);
  } catch (error) {
    console.error("VIP transfer reservation failed:", error instanceof Error ? error.message : "Unknown error");
    return json({ message: "We couldn't submit your transfer request. Please try again or contact us." }, 503);
  }
};
