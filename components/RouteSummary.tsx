import type { RouteStep } from "@/types";

const modeLabel: Record<RouteStep["mode"], string> = {
  train: "電車",
  bus: "バス",
  walk: "徒歩",
  cablecar: "ケーブルカー",
};

type RouteSummaryProps = {
  title: string;
  steps: RouteStep[];
};

export function RouteSummary({ title, steps }: RouteSummaryProps) {
  const totalMinutes = steps.reduce((sum, step) => sum + step.durationMinutes + (step.waitBeforeMinutes ?? 0), 0);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-950">{title}</h2>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">約{totalMinutes}分</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-500">
        現在の公共交通時刻は固定サンプルです。実際の出発前にGoogle Maps、乗換案内、交通事業者の公式時刻表で確認してください。
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={`${step.from}-${step.to}-${index}`} className="rounded-lg bg-stone-50 p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-700">
                  {modeLabel[step.mode]} / {step.departureTime}発 → {step.arrivalTime}着 / 約{step.durationMinutes}分
                </p>
                <p className="mt-1 text-base font-semibold text-stone-950">
                  {step.from} → {step.to}
                </p>
                {step.lineName || step.operator ? (
                  <p className="mt-1 text-sm text-stone-700">
                    {[step.lineName, step.operator].filter(Boolean).join(" / ")}
                  </p>
                ) : null}
                {index > 0 && step.waitBeforeMinutes ? (
                  <p className="mt-1 text-sm font-medium text-stone-700">接続余裕：約{step.waitBeforeMinutes}分</p>
                ) : null}
                {step.timetableUrl ? (
                  <a
                    href={step.timetableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    公式時刻表を確認
                  </a>
                ) : null}
                {step.note ? <p className="mt-1 text-sm text-stone-600">{step.note}</p> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
