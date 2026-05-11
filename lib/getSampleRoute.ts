import { sampleRoutes } from "@/data/sampleRoutes";
import type { RouteStep, Trailhead } from "@/types";

const hubByTrailhead: Record<string, string> = {
  takaosanguchi: "高尾山口駅",
  kobotoke: "高尾駅",
  "jinba-kogen-shita": "高尾駅",
  yabitsu: "秦野駅",
  okura: "渋沢駅",
  "oyama-cable": "伊勢原駅",
  "hinata-yakushi": "伊勢原駅",
  "mitake-station": "御嶽駅",
  takimoto: "御嶽駅",
  "kawanori-bashi": "奥多摩駅",
  hatonosu: "鳩ノ巣駅",
  okutama: "奥多摩駅",
  sawai: "沢井駅",
  kamozawa: "奥多摩駅",
  mitsuya: "西武秩父駅",
};

function fillStep(step: RouteStep, values: Record<string, string>): RouteStep {
  return {
    ...step,
    from: replaceTokens(step.from, values),
    to: replaceTokens(step.to, values),
  };
}

function replaceTokens(text: string, values: Record<string, string>) {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, value), text);
}

export function getSampleRoute(homeStation: string, entryTrailhead: Trailhead, exitTrailhead: Trailhead) {
  const template = sampleRoutes[0];
  const values = {
    homeStation,
    entryHub: hubByTrailhead[entryTrailhead.id] ?? entryTrailhead.accessPoint,
    exitHub: hubByTrailhead[exitTrailhead.id] ?? exitTrailhead.accessPoint,
    entryStop: entryTrailhead.nearestStop,
    exitStop: exitTrailhead.nearestStop,
    entryTrailhead: entryTrailhead.name,
    exitTrailhead: exitTrailhead.name,
  };

  return {
    outbound: template.outbound.map((step) => fillStep(step, values)),
    inbound: template.inbound.map((step) => fillStep(step, values)),
  };
}
