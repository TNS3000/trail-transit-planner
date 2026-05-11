import type { SampleRoute } from "@/types";

export const sampleRoutes: SampleRoute[] = [
  {
    routeKey: "default",
    outbound: [
      { mode: "train", from: "{homeStation}", to: "{entryHub}", durationMinutes: 58, note: "乗換案内で最新時刻を確認" },
      { mode: "bus", from: "{entryHub}", to: "{entryStop}", durationMinutes: 24, note: "固定サンプルルート" },
      { mode: "walk", from: "{entryStop}", to: "{entryTrailhead}", durationMinutes: 8 },
    ],
    inbound: [
      { mode: "walk", from: "{exitTrailhead}", to: "{exitStop}", durationMinutes: 8 },
      { mode: "bus", from: "{exitStop}", to: "{exitHub}", durationMinutes: 24, note: "終バス時刻を優先確認" },
      { mode: "train", from: "{exitHub}", to: "{homeStation}", durationMinutes: 58, note: "乗換案内で最新時刻を確認" },
    ],
  },
];
