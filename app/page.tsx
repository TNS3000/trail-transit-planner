import { MountainSearch } from "@/components/MountainSearch";
import { mountains } from "@/data/mountains";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="py-6">
          <p className="text-sm font-semibold text-emerald-700">Trail Transit Planner MVP</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            公共交通機関で行く
            <br />
            登山アクセス計画
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            登山の行き帰りの交通アクセス情報を計画して簡単にシェアできます。山の種類は随時追加予定。
          </p>
        </section>

        <MountainSearch mountains={mountains} />
      </div>
    </main>
  );
}
