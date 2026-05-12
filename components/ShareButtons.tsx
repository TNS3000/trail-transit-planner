type ShareButtonsProps = {
  outboundUrl: string;
  inboundUrl: string;
  startTime: string;
  finishTime: string;
};

export function ShareButtons({ outboundUrl, inboundUrl, startTime, finishTime }: ShareButtonsProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-stone-950">地図で確認</h2>
      <p className="mt-2 text-xs leading-5 text-stone-500">
        Google Mapsリンクは時刻を固定しません。往路は{startTime}までの到着、復路は{finishTime}以降の出発としてMaps側で再確認してください。
      </p>
      <div className="mt-4 grid gap-3">
        <a
          href={outboundUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-center font-semibold text-stone-950 transition hover:bg-stone-50"
        >
          Google Mapsで往路を確認
        </a>
        <a
          href={inboundUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-center font-semibold text-stone-950 transition hover:bg-stone-50"
        >
          Google Mapsで復路を確認
        </a>
      </div>
    </section>
  );
}
