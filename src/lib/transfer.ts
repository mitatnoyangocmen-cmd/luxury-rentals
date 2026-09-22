export type TransferLocation = "home" | "ist" | "saw";
export type RouteLocation = TransferLocation | "";
export type JourneyType = "one-way" | "round-trip";

export const LOCATIONS: Record<TransferLocation, string> = {
  home: "FMG Homes",
  ist: "Istanbul Airport (IST)",
  saw: "Sabiha Gökçen Airport (SAW)",
};

const AIRPORTS: TransferLocation[] = ["ist", "saw"];
const LEG_PRICES = { vito: { ist: 80, saw: 100 }, sprinter: { ist: 110, saw: 130 } } as const;

export interface TransferPricingInput {
  pickup: TransferLocation;
  dropoff: TransferLocation;
  returnPickup?: TransferLocation;
  returnDropoff?: TransferLocation;
  journeyType: JourneyType;
  passengers: number;
  largeLuggage: number;
  cabinLuggage: number;
}

export function validDestinations(from: RouteLocation): TransferLocation[] {
  if (!from) return ["ist", "saw", "home"];
  return from === "home" ? AIRPORTS : ["home"];
}

export function validOrigins(to: RouteLocation): TransferLocation[] {
  return validDestinations(to);
}

export function isValidRoute(from: RouteLocation, to: RouteLocation): from is TransferLocation {
  return Boolean(from && to && validDestinations(from).includes(to as TransferLocation));
}

export function recommendedVehicle(input: Pick<TransferPricingInput, "passengers" | "largeLuggage" | "cabinLuggage">) {
  const maxCabinLuggage = input.largeLuggage === 3 ? 3 : 6;
  return input.passengers <= 6 && input.largeLuggage <= 3 && input.cabinLuggage <= maxCabinLuggage ? "vito" as const : "sprinter" as const;
}

export function calculateLeg(from: TransferLocation, to: TransferLocation, vehicle: "vito" | "sprinter") {
  if (!isValidRoute(from, to)) throw new Error("Only airport-to-FMG Homes transfers are available.");
  const airport = from === "home" ? to : from;
  return LEG_PRICES[vehicle][airport as "ist" | "saw"];
}

export function calculateTransfer(input: TransferPricingInput) {
  const vehicle = recommendedVehicle(input);
  const outboundPrice = calculateLeg(input.pickup, input.dropoff, vehicle);
  const returnPrice = input.journeyType === "round-trip"
    ? calculateLeg(input.returnPickup!, input.returnDropoff!, vehicle)
    : 0;
  return { vehicle, outboundPrice, returnPrice, totalPrice: outboundPrice + returnPrice };
}
