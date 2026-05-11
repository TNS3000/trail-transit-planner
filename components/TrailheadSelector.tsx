"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Mountain, Trailhead } from "@/types";
import { trackEvent } from "@/lib/trackEvent";

type TrailheadSelectorProps = {
  mountain: Mountain;
  entryTrailheads: Trailhead[];
  exitTrailheads: Trailhead[];
};

export function TrailheadSelector({ mountain, entryTrailheads, exitTrailheads }: TrailheadSelectorProps) {
  const [entryTrailheadId, setEntryTrailheadId] = useState(entryTrailheads[0]?.id ?? "");
  const [exitTrailheadId, setExitTrailheadId] = useState(exitTrailheads[0]?.id ?? "");

  const nextHref = useMemo(() => {
    const params = new URLSearchParams({
      mountainId: mountain.id,
      entryTrailheadId,
      exitTrailheadId,
    });
    return `/plan?${params.toString()}#plan-input`;
  }, [entryTrailheadId, exitTrailheadId, mountain.id]);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-emerald-700">選択中の山</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">{mountain.name}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">{mountain.description}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="entry-trailhead" className="text-sm font-semibold text-stone-700">
            入山口
          </label>
          <select
            id="entry-trailhead"
            value={entryTrailheadId}
            onChange={(event) => {
              setEntryTrailheadId(event.target.value);
              trackEvent("entry_trailhead_select", { mountainId: mountain.id, trailheadId: event.target.value });
            }}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {entryTrailheads.map((trailhead) => (
              <option key={trailhead.id} value={trailhead.id}>
                {trailhead.name}（{trailhead.accessPoint}）
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="exit-trailhead" className="text-sm font-semibold text-stone-700">
            下山口
          </label>
          <select
            id="exit-trailhead"
            value={exitTrailheadId}
            onChange={(event) => {
              setExitTrailheadId(event.target.value);
              trackEvent("exit_trailhead_select", { mountainId: mountain.id, trailheadId: event.target.value });
            }}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {exitTrailheads.map((trailhead) => (
              <option key={trailhead.id} value={trailhead.id}>
                {trailhead.name}（{trailhead.accessPoint}）
              </option>
            ))}
          </select>
        </div>
      </div>

      <Link
        href={nextHref}
        className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
        onClick={() =>
          trackEvent("trailhead_next_click", {
            mountainId: mountain.id,
            entryTrailheadId,
            exitTrailheadId,
          })
        }
      >
        この登山口で計画入力へ
      </Link>
    </section>
  );
}
