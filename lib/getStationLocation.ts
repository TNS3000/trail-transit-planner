import { stationLocations } from "@/data/stations";

export function getStationLocation(input: string) {
  const normalizedInput = input.replace(/\s+/g, "").toLowerCase();

  return stationLocations.find((station) =>
    station.keywords.some((keyword) => {
      const normalizedKeyword = keyword.replace(/\s+/g, "").toLowerCase();
      return normalizedInput.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedInput);
    }),
  );
}
