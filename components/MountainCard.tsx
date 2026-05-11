import Link from "next/link";
import type { Mountain } from "@/types";

type MountainCardProps = {
  mountain: Mountain;
};

export function MountainCard({ mountain }: MountainCardProps) {
  return (
    <Link
      href={`/plan?mountainId=${mountain.id}`}
      className="block rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{mountain.name}</h3>
          <p className="mt-1 text-sm text-stone-500">{mountain.area}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {mountain.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-700">{mountain.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-stone-500">標高</p>
          <p className="font-semibold text-stone-900">{mountain.elevation}m</p>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-stone-500">目安</p>
          <p className="font-semibold text-stone-900">{mountain.estimatedTime}</p>
        </div>
      </div>
    </Link>
  );
}
