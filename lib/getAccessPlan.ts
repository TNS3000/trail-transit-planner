import { accessPlans } from "@/data/accessPlans";
import type { AccessPlan, RouteStep } from "@/types";

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

function fillStep(step: RouteStep, values: Record<string, string>): RouteStep {
  return {
    ...step,
    from: replaceTokens(step.from, values),
    to: replaceTokens(step.to, values),
  };
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

  return [...steps]
    .reverse()
    .map((step) => {
      const arrivalTime = toTime(cursor);
      cursor -= step.durationMinutes;
      const departureTime = toTime(cursor);
      cursor -= step.waitBeforeMinutes ?? 0;

      return {
        ...step,
        departureTime,
        arrivalTime,
      };
    })
    .reverse();
}

export function getAccessPlan(
  mountainId: string,
  entryTrailheadId: string,
  exitTrailheadId: string,
  homeStation: string,
  startTime: string,
  finishTime: string,
): AccessPlan | undefined {
  const plan = accessPlans.find(
    (item) =>
      item.mountainId === mountainId &&
      item.entryTrailheadId === entryTrailheadId &&
      item.exitTrailheadId === exitTrailheadId,
  );

  if (!plan) {
    return undefined;
  }

  const values = { homeStation };

  return {
    ...plan,
    outbound: addTimesBackward(plan.outbound.map((step) => fillStep(step, values)), startTime),
    inbound: addTimesForward(plan.inbound.map((step) => fillStep(step, values)), finishTime),
  };
}
