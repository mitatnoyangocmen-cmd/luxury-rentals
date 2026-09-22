import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Car, Luggage, ShieldCheck, Users, X } from "lucide-react";
import {
  calculateTransfer,
  isValidRoute,
  JourneyType,
  LOCATIONS,
  recommendedVehicle,
  RouteLocation,
  TransferLocation,
  validDestinations,
  validOrigins,
} from "../lib/transfer";

type Inquiry = {
  name: string; email: string; phone: string; journeyType: JourneyType;
  pickup: RouteLocation; dropoff: RouteLocation; returnPickup: RouteLocation; returnDropoff: RouteLocation;
  flightNumber: string; passengers: number; largeLuggage: number; cabinLuggage: number; notes: string;
};

const initial: Inquiry = {
  name: "", email: "", phone: "", journeyType: "one-way",
  pickup: "", dropoff: "", returnPickup: "", returnDropoff: "",
  flightNumber: "", passengers: 2, largeLuggage: 1, cabinLuggage: 2, notes: "",
};
const vehicleImage = (vehicle: string) => vehicle === "vito" ? "/images/vip/vito.png" : "/images/vip/sprinter.png";
const field = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

function Turnstile({ onVerify, onExpire }: { onVerify: (token: string) => void; onExpire: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const siteKey = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !host.current) return;
    const render = () => {
      if (!host.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(host.current, {
        sitekey: siteKey,
        theme: "light",
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onExpire,
      });
    };
    if (window.turnstile) render();
    else {
      const script = document.getElementById("cloudflare-turnstile") as HTMLScriptElement | null;
      if (script) script.addEventListener("load", render, { once: true });
      else {
        const nextScript = document.createElement("script");
        nextScript.id = "cloudflare-turnstile";
        nextScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        nextScript.async = true;
        nextScript.defer = true;
        nextScript.addEventListener("load", render, { once: true });
        document.head.appendChild(nextScript);
      }
    }
    return () => { if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current); };
  }, [siteKey, onVerify, onExpire]);

  if (!siteKey) return <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">Verification is temporarily unavailable. Please try again later.</p>;
  return <div ref={host} className="min-h-[65px]" />;
}

export default function VIPTransferBooking() {
  const [form, setForm] = useState<Inquiry>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [success, setSuccess] = useState(false);
  const onTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const onTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  const outboundValid = isValidRoute(form.pickup, form.dropoff);
  const returnValid = form.journeyType === "one-way" || isValidRoute(form.returnPickup, form.returnDropoff);
  const vehicle = recommendedVehicle(form);
  const calculation = useMemo(
    () => outboundValid && returnValid
      ? calculateTransfer({
          ...form,
          pickup: form.pickup as TransferLocation,
          dropoff: form.dropoff as TransferLocation,
          returnPickup: form.returnPickup as TransferLocation,
          returnDropoff: form.returnDropoff as TransferLocation,
        })
      : null,
    [form, outboundValid, returnValid],
  );
  const activeVehicle = calculation?.vehicle ?? vehicle;
  const vehicleName = activeVehicle === "vito" ? "Mercedes Vito" : "Mercedes Sprinter";
  const locationLabel = (location: RouteLocation) => location ? LOCATIONS[location] : "—";
  const routeLabel = (from: RouteLocation, to: RouteLocation) => [locationLabel(from), locationLabel(to)].join(" → ");
  const clearReturn = (value: Inquiry) => ({ ...value, returnPickup: "" as RouteLocation, returnDropoff: "" as RouteLocation });

  function setOutboundFrom(pickup: RouteLocation) {
    setForm(current => {
      const dropoff: RouteLocation = isValidRoute(pickup, current.dropoff) ? current.dropoff : "";
      const next = { ...current, pickup, dropoff };
      if (next.journeyType === "one-way") return next;
      const returnDropoff: RouteLocation = isValidRoute(dropoff, current.returnDropoff) ? current.returnDropoff : "";
      return { ...next, returnPickup: dropoff, returnDropoff };
    });
  }

  function setOutboundTo(dropoff: RouteLocation) {
    setForm(current => {
      const pickup: RouteLocation = isValidRoute(current.pickup, dropoff) ? current.pickup : "";
      const next = { ...current, pickup, dropoff };
      if (next.journeyType === "one-way") return next;
      if (!isValidRoute(next.pickup, next.dropoff)) return { ...next, returnPickup: "", returnDropoff: "" };
      const returnDropoff: RouteLocation = isValidRoute(dropoff, current.returnDropoff) ? current.returnDropoff : "";
      return { ...next, returnPickup: dropoff, returnDropoff };
    });
  }

  function setJourneyType(journeyType: JourneyType) {
    setForm(current => {
      if (journeyType === "one-way") return clearReturn({ ...current, journeyType });
      return {
        ...current,
        journeyType,
        returnPickup: isValidRoute(current.pickup, current.dropoff) ? current.dropoff : "",
        returnDropoff: "",
      };
    });
  }

  function resetRoute() {
    setForm(current => clearReturn({ ...current, pickup: "", dropoff: "" }));
    setErrors({});
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!outboundValid) next.route = "Please select a valid airport and FMG Homes route.";
    if (form.journeyType === "round-trip" && !returnValid) next.returnRoute = "Please complete a valid return transfer route.";
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.phone.trim()) next.phone = "Please enter a WhatsApp or phone number.";
    if (!form.flightNumber.trim()) next.flightNumber = "Please enter your flight number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openReview(event: FormEvent) {
    event.preventDefault();
    if (validate()) {
      setErrors({});
      setTurnstileToken("");
      setTurnstileKey(current => current + 1);
      setReviewOpen(true);
    }
  }

  async function submit() {
    if (!turnstileToken) {
      setErrors({ submit: "Verification couldn't be completed. Please try again." });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/vip-transfer-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        setTurnstileToken("");
        setTurnstileKey(current => current + 1);
        setErrors({ submit: data.code === "turnstile_failed" ? "Verification couldn't be completed. Please try again." : "We couldn't submit your transfer request. Please try again or contact us." });
        return;
      }
      setReviewOpen(false);
      setSuccess(true);
    } catch {
      setErrors({ submit: "We couldn't submit your transfer request. Please try again or contact us." });
    } finally {
      setSubmitting(false);
    }
  }

  function RouteFields({ title, from, to, lockedFrom, onFrom, onTo }: {
    title?: string; from: RouteLocation; to: RouteLocation; lockedFrom?: boolean;
    onFrom?: (value: RouteLocation) => void; onTo: (value: RouteLocation) => void;
  }) {
    return <div className="space-y-3">
      {title && <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">{title}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-gray-600">From
          <select value={from} disabled={lockedFrom} onChange={event => onFrom?.(event.target.value as RouteLocation)} className={[field, lockedFrom ? "disabled:cursor-not-allowed disabled:bg-gray-100" : ""].join(" ")}>
            <option value="">{lockedFrom ? "Select outbound destination first" : "Select pickup"}</option>
            {validOrigins(to).map(key => <option key={key} value={key}>{LOCATIONS[key]}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-600">To
          <select value={to} onChange={event => onTo(event.target.value as RouteLocation)} className={field}>
            <option value="">Select destination</option>
            {validDestinations(from).map(key => <option key={key} value={key}>{LOCATIONS[key]}</option>)}
          </select>
        </label>
      </div>
    </div>;
  }

  const summary = <div className="space-y-3 text-sm text-gray-600">
    <p><b className="text-charcoal">Journey:</b> {form.journeyType === "round-trip" ? "Round Trip" : "One Way"}</p>
    <p><b className="text-charcoal">{form.journeyType === "round-trip" ? "Outbound:" : "Route:"}</b> {routeLabel(form.pickup, form.dropoff)}</p>
    {form.journeyType === "round-trip" && <p><b className="text-charcoal">Return:</b> {routeLabel(form.returnPickup, form.returnDropoff)}</p>}
    <p><b className="text-charcoal">Passengers:</b> {form.passengers} · <b className="text-charcoal">Large luggage:</b> {form.largeLuggage} · <b className="text-charcoal">Cabin luggage:</b> {form.cabinLuggage}</p>
    <p><b className="text-charcoal">Vehicle:</b> {vehicleName}</p>
  </div>;

  const quantity = (key: "passengers" | "largeLuggage" | "cabinLuggage", text: string, Icon: typeof Car) => <label key={key} className="text-xs font-semibold text-gray-600">
    <span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5" />{text}</span>
    <select value={form[key]} onChange={event => setForm(current => ({ ...current, [key]: Number(event.target.value) }))} className={field}>
      {Array.from({ length: key === "passengers" ? 10 : 11 }, (_, index) => <option key={index} value={key === "passengers" ? index + 1 : index}>{key === "passengers" ? index + 1 : index}</option>)}
    </select>
  </label>;

  return <><div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl">
    <div className="bg-charcoal px-7 py-6 text-white"><p className="font-serif text-2xl text-gold">Book Your VIP Transfer</p><p className="mt-1 text-xs text-white/65">Calculate your private airport transfer and send an inquiry to our team.</p></div>
    <form onSubmit={openReview} className="grid lg:grid-cols-[1.25fr_.75fr]">
      <div className="space-y-7 p-6 sm:p-8">
        <section>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-gold">1. Route & journey</p>
          <div className="mb-5 flex flex-wrap items-center gap-2">{(["one-way", "round-trip"] as JourneyType[]).map(type => <button type="button" key={type} onClick={() => setJourneyType(type)} className={["rounded-full px-4 py-2 text-xs font-bold", form.journeyType === type ? "bg-gold text-white" : "bg-cream text-gray-600"].join(" ")}>{type === "one-way" ? "One Way" : "Round Trip"}</button>)}<button type="button" onClick={resetRoute} className="ml-1 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gold hover:text-charcoal">Reset Route</button></div>

          <RouteFields title={form.journeyType === "round-trip" ? "Outbound transfer" : undefined} from={form.pickup} to={form.dropoff} onFrom={setOutboundFrom} onTo={setOutboundTo} />
          {form.journeyType === "round-trip" && <div className="mt-6 border-t border-gold/15 pt-6"><RouteFields title="Return transfer" from={form.returnPickup} to={form.returnDropoff} lockedFrom onTo={value => setForm(current => ({ ...current, returnDropoff: value }))} /></div>}
          {errors.route && <p className="mt-2 text-xs text-red-600">{errors.route}</p>}{errors.returnRoute && <p className="mt-2 text-xs text-red-600">{errors.returnRoute}</p>}
        
        </section>
        <section><p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-gold">2. Guests & luggage</p><div className="grid grid-cols-3 gap-3">{quantity("passengers", "Passengers", Users)}{quantity("largeLuggage", "Large cases", Luggage)}{quantity("cabinLuggage", "Cabin bags", Car)}</div></section>
        <section><p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-gold">3. Contact details</p><div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-gray-600">Guest / contact name<input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} className={field} /></label>
          <label className="text-xs font-semibold text-gray-600">Email<input type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className={field} /></label>
          <label className="text-xs font-semibold text-gray-600">WhatsApp / phone<input value={form.phone} onChange={event => setForm(current => ({ ...current, phone: event.target.value }))} className={field} /></label>
          <label className="text-xs font-semibold text-gray-600">Flight number<input value={form.flightNumber} onChange={event => setForm(current => ({ ...current, flightNumber: event.target.value }))} className={field} /></label>
        </div><label className="mt-3 block text-xs font-semibold text-gray-600">Additional notes<textarea value={form.notes} onChange={event => setForm(current => ({ ...current, notes: event.target.value }))} rows={2} placeholder="You can share each guest’s soft drink preferences or anything else you’d like us to know." className={`${field} placeholder:italic placeholder:text-gray-400`} /></label>
        {Object.entries(errors).filter(([key]) => !["route", "returnRoute", "submit"].includes(key)).map(([key, error]) => <p key={key} className="mt-1 text-xs text-red-600">{error}</p>)}</section>
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:brightness-110"><ShieldCheck className="h-4 w-4" /> Book VIP Transfer</button>
      </div>
      <aside className="bg-cream p-6 sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Your transfer</p><img src={vehicleImage(activeVehicle)} alt={vehicleName} className="mt-4 h-40 w-full rounded-2xl bg-white/50 object-contain object-center p-2" /><h3 className="mt-4 font-serif text-2xl text-charcoal">{vehicleName}</h3><p className="mt-1 text-xs leading-relaxed text-gray-600">{vehicle === "vito" ? "Recommended for up to 6 guests, up to 3 large suitcases, and luggage within Vito capacity." : "Recommended for larger groups or luggage beyond Mercedes Vito capacity."}</p><div className="my-6 border-y border-gold/20 py-5"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Transfer Price</p><p className="font-serif text-4xl text-gold">€{calculation?.totalPrice ?? 0}</p></div>{summary}</aside>
    </form>
  </div>
  {reviewOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><button type="button" onClick={() => setReviewOpen(false)} className="float-right rounded-full p-2 text-gray-500"><X /></button><h3 className="font-serif text-2xl text-charcoal">Review your VIP transfer</h3><p className="mt-2 text-sm text-gray-600">Please review your VIP transfer details before confirming.</p><img src={vehicleImage(activeVehicle)} alt={vehicleName} className="mt-5 h-32 w-full rounded-xl bg-cream object-contain object-center p-2" /><div className="mt-5">{summary}<p className="mt-3 text-sm text-gray-600"><b className="text-charcoal">Total:</b> €{calculation?.totalPrice ?? 0}</p><p className="mt-3 text-sm text-gray-600"><b className="text-charcoal">Contact:</b> {form.name}, {form.email}, {form.phone}</p></div><div className="mt-5 border-t border-gray-100 pt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-gold">Security verification</p><Turnstile key={turnstileKey} onVerify={onTurnstileVerify} onExpire={onTurnstileExpire} /></div>{errors.submit && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{errors.submit}</p>}<div className="mt-6 flex gap-3"><button type="button" onClick={() => setReviewOpen(false)} className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-wider">Edit Details</button><button type="button" disabled={submitting || !turnstileToken} onClick={submit} className="flex-1 rounded-full bg-gold px-4 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60">{submitting ? "Submitting…" : "Confirm VIP Reservation"}</button></div></div></div>}
  {success && <div role="dialog" aria-modal="true" aria-labelledby="vip-transfer-success-title" className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl"><ShieldCheck className="mx-auto mb-4 h-12 w-12 text-gold" /><h3 id="vip-transfer-success-title" className="font-serif text-3xl text-charcoal">Transfer Request Received</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">Thank you! We've received your VIP transfer request. We'll contact you shortly to confirm availability and finalize your transfer.</p><button type="button" onClick={() => setSuccess(false)} className="mt-7 rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110">Okay</button></div></div>}
  </>;
}
