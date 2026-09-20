export type TransferLocation = "fatih" | "ist" | "saw";
export type JourneyType = "one-way" | "round-trip";
export type HandLuggagePreference = "carry" | "store";

export const LOCATIONS: Record<TransferLocation, string> = {
  fatih: "Fatih",
  ist: "Istanbul Airport (IST)",
  saw: "Sabiha Gökçen Airport (SAW)",
};

const LEG_PRICES = {
  vito: { ist: 80, saw: 100 },
  sprinter: { ist: 110, saw: 130 },
} as const;

export interface TransferPricingInput {
  pickup: TransferLocation;
  dropoff: TransferLocation;
  journeyType: JourneyType;
  passengers: number;
  largeLuggage: number;
  handLuggagePreference: HandLuggagePreference;
}

export function recommendedVehicle(input: Pick<TransferPricingInput, "passengers" | "largeLuggage" | "handLuggagePreference">) {
  return input.passengers <= 6 && input.largeLuggage <= 3 && input.handLuggagePreference === "carry"
    ? "vito" as const
    : "sprinter" as const;
}

export function routeLegs(pickup: TransferLocation, dropoff: TransferLocation): Array<"ist" | "saw"> {
  if (pickup === dropoff) throw new Error("Pick up and drop off must be different.");
  if (pickup === "fatih") return [dropoff as "ist" | "saw"];
  if (dropoff === "fatih") return [pickup];
  return [pickup, dropoff]; // Airport-to-airport journeys are always via Fatih.
}

export function calculateTransfer(input: TransferPricingInput) {
  const vehicle = recommendedVehicle(input);
  const legs = routeLegs(input.pickup, input.dropoff);
  const oneWayPrice = legs.reduce((total, airport) => total + LEG_PRICES[vehicle][airport], 0);
  const totalPrice = input.journeyType === "round-trip" ? oneWayPrice * 2 : oneWayPrice;
  return { vehicle, legs, oneWayPrice, totalPrice, isViaFatih: legs.length === 2 };
}
