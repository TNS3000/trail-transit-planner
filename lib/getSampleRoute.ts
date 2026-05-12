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

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes: number) {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function addTimesForward(steps: RouteStep[], firstDepartureTime: string) {
  let cursor = toMinutes(firstDepartureTime);

  return steps.map((step) => {
    cursor += step.waitBeforeMinutes ?? 0;
    const departureTime = toTime(cursor);
    cursor += step.durationMinutes;

    return {
      ...step,
      departureTime,
      arrivalTime: toTime(cursor),
    };
  });
}

function addTimesBackward(steps: RouteStep[], finalArrivalTime: string) {
  let cursor = toMinutes(finalArrivalTime);

  return [...steps].reverse().map((step) => {
    const arrivalTime = toTime(cursor);
    cursor -= step.durationMinutes;
    const departureTime = toTime(cursor);
    cursor -= step.waitBeforeMinutes ?? 0;

    return {
      ...step,
      departureTime,
      arrivalTime,
    };
  }).reverse();
}

export function getSampleRoute(
  homeStation: string,
  entryTrailhead: Trailhead,
  exitTrailhead: Trailhead,
  startTime: string,
  finishTime: string,
) {
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
    outbound: addTimesBackward(template.outbound.map((step) => fillStep(step, values)), startTime),
    inbound: addTimesForward(template.inbound.map((step) => fillStep(step, values)), finishTime),
  };
}
