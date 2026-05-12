import type { SampleRoute } from "@/types";

export const sampleRoutes: SampleRoute[] = [
  {
    routeKey: "default",
    outbound: [
      { mode: "train", from: "{homeStation}", to: "{entryHub}", durationMinutes: 58, note: "固定サンプル。実際の乗換案内で最新時刻を確認" },
      { mode: "bus", from: "{entryHub}", to: "{entryStop}", durationMinutes: 24, waitBeforeMinutes: 12, note: "電車到着後、乗換余裕12分を仮設定" },
      { mode: "walk", from: "{entryStop}", to: "{entryTrailhead}", durationMinutes: 8, note: "登山開始希望時刻に着くよう逆算" },
    ],
    inbound: [
      { mode: "walk", from: "{exitTrailhead}", to: "{exitStop}", durationMinutes: 8, note: "下山予定時刻から徒歩移動を仮設定" },
      { mode: "bus", from: "{exitStop}", to: "{exitHub}", durationMinutes: 24, waitBeforeMinutes: 10, note: "下山後、バス停到着までの余裕10分を仮設定" },
      { mode: "train", from: "{exitHub}", to: "{homeStation}", durationMinutes: 58, waitBeforeMinutes: 12, note: "バス到着後、鉄道乗換余裕12分を仮設定" },
    ],
  },
];
