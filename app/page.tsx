import { MountainSearch } from "@/components/MountainSearch";
import { mountains } from "@/data/mountains";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="py-6">
          <p className="text-sm font-semibold text-emerald-700">Trail Transit Planner MVP</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            公共交通で行く登山アクセス計画
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            山名、入山口、下山口、予定時刻、自宅最寄り駅から、往復交通、終バスリスク、YAMAP転記用サマリーをまとめて確認できます。
          </p>
        </section>

        <MountainSearch mountains={mountains} />
      </div>
    </main>
  );
}
