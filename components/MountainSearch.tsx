"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Mountain } from "@/types";
import { trackEvent } from "@/lib/trackEvent";

type MountainSearchProps = {
  mountains: Mountain[];
};

export function MountainSearch({ mountains }: MountainSearchProps) {
  const router = useRouter();
  const [mountainId, setMountainId] = useState(mountains[0]?.id ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mountainId) {
      return;
    }

    trackEvent("mountain_select_submit", { mountainId });
    router.push(`/plan?mountainId=${mountainId}`);
  }

  return (
    <section className="mt-8 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <label htmlFor="mountain-select" className="text-sm font-semibold text-stone-700">
          山を選択
        </label>
        <select
          id="mountain-select"
          value={mountainId}
          onChange={(event) => {
            setMountainId(event.target.value);
            trackEvent("mountain_select", { mountainId: event.target.value });
          }}
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          {mountains.map((mountain) => (
            <option key={mountain.id} value={mountain.id}>
              {mountain.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="mt-4 min-h-12 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          この山で計画する
        </button>
      </form>

      {mountains.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-stone-300 p-4 text-sm text-stone-600">
          対象山が見つかりません。山の種類は随時追加予定となります。
        </p>
      ) : null}
    </section>
  );
}
