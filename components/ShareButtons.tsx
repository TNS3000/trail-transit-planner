type ShareButtonsProps = {
  outboundUrl: string;
  inboundUrl: string;
  lineShareUrl: string;
};

export function ShareButtons({ outboundUrl, inboundUrl, lineShareUrl }: ShareButtonsProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-stone-950">確認・共有</h2>
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
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center justify-center rounded-lg bg-[#06c755] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#05b34d]"
        >
          LINEで共有
        </a>
      </div>
    </section>
  );
}
