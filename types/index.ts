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
  operator?: string;
  direction?: string;
  officialUrl?: string;
  verifiedOn?: string;
  notes: string;
};

export type RouteStep = {
  mode: "train" | "bus" | "walk" | "cablecar";
  from: string;
  to: string;
  durationMinutes: number;
  waitBeforeMinutes?: number;
  departureTime?: string;
  arrivalTime?: string;
  lineName?: string;
  operator?: string;
  timetableUrl?: string;
  note?: string;
};

export type SampleRoute = {
  routeKey: string;
  outbound: RouteStep[];
  inbound: RouteStep[];
};

export type OfficialLink = {
  label: string;
  url: string;
};

export type AccessPlan = {
  id: string;
  mountainId: string;
  entryTrailheadId: string;
  exitTrailheadId: string;
  title: string;
  dataStatus: "verified-reference" | "sample";
  outbound: RouteStep[];
  inbound: RouteStep[];
  officialLinks: OfficialLink[];
  notes: string[];
};

export type LastBusRiskLevel = "low" | "medium" | "high" | "impossible";

export type LastBusRisk = {
  level: LastBusRiskLevel;
  label: "低" | "中" | "高" | "帰宅困難リスクあり";
  minutesUntilLastBus: number;
  checkedTime: string;
  message: string;
};

export type TransitRouteTimingMode = "arrival" | "departure";

export type TransitRouteRequest = {
  origin: string;
  destination: string;
  date: string;
  time: string;
  timingMode: TransitRouteTimingMode;
};

export type TransitRouteLegStep = {
  mode: string;
  instruction?: string;
  from?: string;
  to?: string;
  lineName?: string;
  operator?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationText?: string;
};

export type TransitRouteResult = {
  configured: boolean;
  source: "google-routes-api" | "google-directions-api";
  summary?: string;
  durationText?: string;
  steps: TransitRouteLegStep[];
  error?: string;
  query?: {
    origin: string;
    destination: string;
    timingMode: TransitRouteTimingMode;
    requestedTime: string;
    requestedLocalTime: string;
  };
};
