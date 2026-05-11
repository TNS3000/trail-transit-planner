import type { BusSchedule, LastBusRisk as LastBusRiskType } from "@/types";

type LastBusRiskProps = {
  busSchedule: BusSchedule;
  risk: LastBusRiskType;
};

const riskClassName: Record<LastBusRiskType["level"], string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-900",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  high: "border-orange-200 bg-orange-50 text-orange-950",
  impossible: "border-red-200 bg-red-50 text-red-950",
};

export function LastBusRisk({ busSchedule, risk }: LastBusRiskProps) {
  return (
    <section className={`rounded-lg border p-4 shadow-sm ${riskClassName[risk.level]}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">終バスリスク</p>
          <h2 className="mt-1 text-2xl font-bold">{risk.label}</h2>
        </div>
        <div className="rounded-lg bg-white/70 px-4 py-3 text-right">
          <p className="text-sm">終バス</p>
          <p className="text-xl font-bold">{busSchedule.lastBusTime}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6">{risk.message}</p>
      <dl className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        <div className="rounded-md bg-white/70 p-3">
          <dt className="font-semibold">対象停留所</dt>
          <dd>{busSchedule.stopName}</dd>
        </div>
        <div className="rounded-md bg-white/70 p-3">
          <dt className="font-semibold">終バスまで</dt>
          <dd>{risk.minutesUntilLastBus > 0 ? `約${risk.minutesUntilLastBus}分` : "余裕なし"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5">{busSchedule.notes}</p>
    </section>
  );
}
