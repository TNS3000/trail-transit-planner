type YamapSummaryProps = {
  summary: string;
};

export function YamapSummary({ summary }: YamapSummaryProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-stone-950">YAMAP転記用サマリー</h2>
      <textarea
        readOnly
        value={summary}
        className="mt-3 min-h-56 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 font-mono text-sm leading-6 text-stone-800"
      />
    </section>
  );
}
