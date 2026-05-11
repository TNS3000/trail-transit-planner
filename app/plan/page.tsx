import Link from "next/link";
import { PlanForm } from "@/components/PlanForm";
import { TrailheadSelector } from "@/components/TrailheadSelector";
import { mountains } from "@/data/mountains";
import { trailheads } from "@/data/trailheads";
import { getTrailheadsForMountain } from "@/lib/getTrailheadsForMountain";

type PlanPageProps = {
  searchParams: Promise<{
    mountainId?: string;
    entryTrailheadId?: string;
    exitTrailheadId?: string;
  }>;
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const mountain = mountains.find((item) => item.id === params.mountainId) ?? mountains[0];
  const { entryTrailheads, exitTrailheads } = getTrailheadsForMountain(mountain.id);
  const entryTrailhead = trailheads.find((item) => item.id === params.entryTrailheadId) ?? entryTrailheads[0];
  const exitTrailhead = trailheads.find((item) => item.id === params.exitTrailheadId) ?? exitTrailheads[0];
  const canShowForm = Boolean(params.entryTrailheadId && params.exitTrailheadId && entryTrailhead && exitTrailhead);

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          ← 山一覧へ戻る
        </Link>

        <div className="mt-5 space-y-6">
          <TrailheadSelector mountain={mountain} entryTrailheads={entryTrailheads} exitTrailheads={exitTrailheads} />

          {canShowForm ? (
            <PlanForm mountain={mountain} entryTrailhead={entryTrailhead} exitTrailhead={exitTrailhead} />
          ) : (
            <section className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm leading-6 text-stone-600">
              入山口と下山口を選び、「この登山口で計画入力へ」を押すと計画入力欄が表示されます。
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
