export type StationLocation = {
  keywords: string[];
  name: string;
  latitude: number;
  longitude: number;
};

export const stationLocations: StationLocation[] = [
  { keywords: ["中野駅", "東京都中野駅", "JR中野駅"], name: "中野駅", latitude: 35.706, longitude: 139.6657 },
  { keywords: ["新宿駅", "東京都新宿駅", "JR新宿駅"], name: "新宿駅", latitude: 35.6896, longitude: 139.7006 },
  { keywords: ["東京駅", "東京都東京駅", "JR東京駅"], name: "東京駅", latitude: 35.6812, longitude: 139.7671 },
  { keywords: ["渋谷駅", "東京都渋谷駅", "JR渋谷駅"], name: "渋谷駅", latitude: 35.658, longitude: 139.7016 },
  { keywords: ["池袋駅", "東京都池袋駅", "JR池袋駅"], name: "池袋駅", latitude: 35.7289, longitude: 139.7104 },
  { keywords: ["立川駅", "東京都立川駅", "JR立川駅"], name: "立川駅", latitude: 35.6984, longitude: 139.4136 },
  { keywords: ["八王子駅", "東京都八王子駅", "JR八王子駅"], name: "八王子駅", latitude: 35.6556, longitude: 139.3389 },
  { keywords: ["高尾駅", "東京都高尾駅", "JR高尾駅", "京王高尾駅"], name: "高尾駅", latitude: 35.642, longitude: 139.2823 },
];
