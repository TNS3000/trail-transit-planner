"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Mountain, Trailhead } from "@/types";
import { trackEvent } from "@/lib/trackEvent";

type PlanFormProps = {
  mountain: Mountain;
  entryTrailhead: Trailhead;
  exitTrailhead: Trailhead;
};

function getToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function PlanForm({ mountain, entryTrailhead, exitTrailhead }: PlanFormProps) {
  const router = useRouter();
  const [hikeDate, setHikeDate] = useState(getToday());
  const [startTime, setStartTime] = useState("08:30");
  const [finishTime, setFinishTime] = useState("15:30");
  const [homeStation, setHomeStation] = useState("");

  useEffect(() => {
    const savedHomeStation = localStorage.getItem("trailTransitHomeStation");
    if (!savedHomeStation) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setHomeStation(savedHomeStation);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <form
      id="plan-input"
      className="mt-6 rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        localStorage.setItem("trailTransitHomeStation", homeStation);
        trackEvent("plan_submit", {
          mountainId: mountain.id,
          entryTrailheadId: entryTrailhead.id,
          exitTrailheadId: exitTrailhead.id,
        });

        const params = new URLSearchParams({
          mountainId: mountain.id,
          entryTrailheadId: entryTrailhead.id,
          exitTrailheadId: exitTrailhead.id,
          hikeDate,
          startTime,
          finishTime,
          homeStation,
        });
        router.push(`/result?${params.toString()}`);
      }}
    >
      <div>
        <p className="text-sm font-semibold text-emerald-700">計画入力</p>
        <h2 className="mt-1 text-xl font-bold text-stone-950">
          {entryTrailhead.name}から入り、{exitTrailhead.name}へ下山
        </h2>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">山行日</span>
          <input
            type="date"
            required
            min={getToday()}
            value={hikeDate}
            onChange={(event) => setHikeDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">自宅最寄り駅</span>
          <input
            type="text"
            required
            value={homeStation}
            onChange={(event) => setHomeStation(event.target.value)}
            placeholder="例：新宿駅"
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">登山開始希望時刻</span>
          <input
            type="time"
            required
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">下山予定時刻</span>
          <input
            type="time"
            required
            value={finishTime}
            onChange={(event) => setFinishTime(event.target.value)}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 min-h-12 w-full rounded-lg bg-stone-950 px-5 py-3 font-semibold text-white transition hover:bg-stone-800"
      >
        交通計画を作成
      </button>
    </form>
  );
}
