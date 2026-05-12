export type Mountain = {
  id: string;
  name: string;
  area: string;
  elevation: number;
  description: string;
  difficulty: "初級" | "中級" | "上級";
  estimatedTime: string;
};

export type Trailhead = {
  id: string;
  name: string;
  accessPoint: string;
  nearestStop: string;
};

export type MountainTrailheads = {
  mountainId: string;
  entryTrailheadIds: string[];
  exitTrailheadIds: string[];
};

export type BusSchedule = {
  trailheadId: string;
  stopName: string;
  lastBusTime: string;
  notes: string;
};

export type RouteStep = {
  mode: "train" | "bus" | "walk";
  from: string;
  to: string;
  durationMinutes: number;
  departureTime?: string;
  arrivalTime?: string;
  note?: string;
};

export type SampleRoute = {
  routeKey: string;
  outbound: RouteStep[];
  inbound: RouteStep[];
};

export type LastBusRiskLevel = "low" | "medium" | "high" | "impossible";

export type LastBusRisk = {
  level: LastBusRiskLevel;
  label: "低" | "中" | "高" | "帰宅困難リスクあり";
  minutesUntilLastBus: number;
  checkedTime: string;
  message: string;
};
