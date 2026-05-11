"use client";

import { useMemo, useState } from "react";
import type { Mountain } from "@/types";
import { MountainCard } from "@/components/MountainCard";
import { trackEvent } from "@/lib/trackEvent";

type MountainSearchProps = {
  mountains: Mountain[];
};

export function MountainSearch({ mountains }: MountainSearchProps) {
  const [query, setQuery] = useState("");

  const filteredMountains = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return mountains;
    }

    return mountains.filter((mountain) => mountain.name.toLowerCase().includes(normalizedQuery));
  }, [mountains, query]);

  return (
    <section className="mt-8">
      <label htmlFor="mountain-search" className="text-sm font-semibold text-stone-700">
        山名検索
      </label>
      <input
        id="mountain-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          trackEvent("mountain_search", { query: event.target.value });
        }}
        placeholder="例：高尾山、塔ノ岳、雲取山"
        className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {filteredMountains.map((mountain) => (
          <MountainCard key={mountain.id} mountain={mountain} />
        ))}
      </div>
      {filteredMountains.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-stone-300 p-4 text-sm text-stone-600">
          対象山が見つかりません。MVPでは10山のみ対応しています。
        </p>
      ) : null}
    </section>
  );
}
