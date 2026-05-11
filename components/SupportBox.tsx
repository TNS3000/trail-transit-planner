export function SupportBox() {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <h2 className="text-lg font-bold text-emerald-950">サポート導線</h2>
      <p className="mt-2 text-sm leading-6 text-emerald-900">
        ルート確認、終バスリスク、代替下山案の整理が必要な場合は、山行前の計画レビューとして相談できます。
      </p>
      <a
        href="mailto:support@example.com?subject=登山アクセス計画レビュー相談"
        className="mt-4 flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
      >
        計画レビューを相談する
      </a>
    </section>
  );
}
