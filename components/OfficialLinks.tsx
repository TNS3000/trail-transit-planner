import type { OfficialLink } from "@/types";

type OfficialLinksProps = {
  links: OfficialLink[];
  notes?: string[];
};

export function OfficialLinks({ links, notes = [] }: OfficialLinksProps) {
  if (links.length === 0 && notes.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-stone-950">公式確認リンク</h2>
      {links.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-950 transition hover:bg-stone-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
      {notes.length > 0 ? (
        <ul className="mt-4 space-y-2 text-xs leading-5 text-stone-600">
          {notes.map((note) => (
            <li key={note}>・{note}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
