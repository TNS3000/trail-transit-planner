import Link from "next/link";
import { LastBusRisk } from "@/components/LastBusRisk";
import { NoticeBox } from "@/components/NoticeBox";
import { OfficialLinks } from "@/components/OfficialLinks";
import { RouteSummary } from "@/components/RouteSummary";
import { ShareButtons } from "@/components/ShareButtons";
import { SupportBox } from "@/components/SupportBox";
import { YamapSummary } from "@/components/YamapSummary";
import { busSchedules } from "@/data/busSchedules";
import { mountains } from "@/data/mountains";
import { trailheads } from "@/data/trailheads";
import { calculateLastBusRisk } from "@/lib/calculateLastBusRisk";
import { generateGoogleMapsUrl } from "@/lib/generateGoogleMapsUrl";
import { getAccessPlan } from "@/lib/getAccessPlan";
import { getSampleRoute } from "@/lib/getSampleRoute";
import type { OfficialLink } from "@/types";

type ResultPageProps = {
  searchParams: Promise<{
    mountainId?: string;
    entryTrailheadId?: string;
    exitTrailheadId?: string;
    hikeDate?: string;
    startTime?: string;
    finishTime?: string;
    homeStation?: string;
  }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const mountain = mountains.find((item) => item.id === params.mountainId);
  const entryTrailhead = trailheads.find((item) => item.id === params.entryTrailheadId);
  const exitTrailhead = trailheads.find((item) => item.id === params.exitTrailheadId);
  const hikeDate = params.hikeDate ?? "";
  const startTime = params.startTime ?? "";
  const finishTime = params.finishTime ?? "";
  const homeStation = params.homeStation ?? "";

  if (!mountain || !entryTrailhead || !exitTrailhead || !hikeDate || !startTime || !finishTime || !homeStation) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-bold text-stone-950">計画情報が不足しています</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">山、登山口、予定時刻、自宅最寄り駅を入力してから結果を表示してください。</p>
            <Link
              href="/"
              className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white"
            >
              ホームへ戻る
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const busSchedule = busSchedules.find((schedule) => schedule.trailheadId === exitTrailhead.id) ?? busSchedules[0];
  const accessPlan = getAccessPlan(mountain.id, entryTrailhead.id, exitTrailhead.id, homeStation, startTime, finishTime);
  const route = accessPlan ?? {
    ...getSampleRoute(homeStation, entryTrailhead, exitTrailhead, startTime, finishTime),
    title: "固定サンプルルート",
    dataStatus: "sample" as const,
    officialLinks: [] as OfficialLink[],
    notes: ["この山の実用アクセスデータは未整備です。"],
  };
  const checkedTime = finishTime;
  const risk = calculateLastBusRisk(checkedTime, busSchedule.lastBusTime);
  const outboundUrl = generateGoogleMapsUrl(homeStation, entryTrailhead.accessPoint);
  const inboundUrl = generateGoogleMapsUrl(exitTrailhead.accessPoint, homeStation);
  const copySummary = [
    `山名：${mountain.name}`,
    `山行日：${hikeDate}`,
    `入山口：${entryTrailhead.name}（${entryTrailhead.accessPoint}）`,
    `下山口：${exitTrailhead.name}（${exitTrailhead.accessPoint}）`,
    `登山開始希望時刻：${startTime}`,
    `下山予定時刻：${finishTime}`,
    `自宅最寄り駅：${homeStation}`,
    `アクセスルート：${route.title}`,
    `終バス：${busSchedule.stopName} ${busSchedule.lastBusTime}（下山予定時刻：${checkedTime}で判定）`,
    `終バスリスク：${risk.label}`,
    "",
    "往路Google Maps確認：",
    `${homeStation} → ${entryTrailhead.accessPoint}`,
    `登山開始希望時刻 ${startTime} までに到着できる経路をGoogle Mapsで確認してください。`,
    outboundUrl,
    "",
    "復路Google Maps確認：",
    `${exitTrailhead.accessPoint} → ${homeStation}`,
    `下山予定時刻 ${finishTime} 以降に出発できる経路をGoogle Mapsで確認してください。`,
    inboundUrl,
    "",
    "公式確認：",
    ...(busSchedule.officialUrl ? [`${busSchedule.stopName}：${busSchedule.officialUrl}`] : []),
    ...route.officialLinks.map((link) => `${link.label}：${link.url}`),
    "",
    "注意：このサマリー内のGoogle Mapsリンクは時刻を固定しません。電車・バスの時刻、乗換、運休、季節運行は出発前に必ず公式情報で確認してください。",
  ].join("\n");

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/plan?mountainId=${mountain.id}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          ← 計画入力へ戻る
        </Link>

        <header className="mt-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">計画結果</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">{mountain.name} アクセス計画</h1>
          <p className="mt-2 text-sm font-semibold text-stone-700">{route.title}</p>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-4">
            <div className="rounded-md bg-stone-50 p-3">
              <dt className="text-stone-500">山行日</dt>
              <dd className="font-semibold text-stone-950">{hikeDate}</dd>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <dt className="text-stone-500">開始</dt>
              <dd className="font-semibold text-stone-950">{startTime}</dd>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <dt className="text-stone-500">下山予定</dt>
              <dd className="font-semibold text-stone-950">{finishTime}</dd>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <dt className="text-stone-500">最寄り駅</dt>
              <dd className="font-semibold text-stone-950">{homeStation}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <ShareButtons outboundUrl={outboundUrl} inboundUrl={inboundUrl} startTime={startTime} finishTime={finishTime} />
            <RouteSummary title="往路の公共交通" steps={route.outbound} />
            <RouteSummary title="復路の公共交通" steps={route.inbound} />
            <YamapSummary summary={copySummary} />
          </div>
          <aside className="space-y-5">
            <LastBusRisk busSchedule={busSchedule} risk={risk} />
            <OfficialLinks links={route.officialLinks} notes={route.notes} />
            <NoticeBox />
            <SupportBox />
          </aside>
        </div>
      </div>
    </main>
  );
}
