"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/trackEvent";

type YamapSummaryProps = {
  summary: string;
};

export function YamapSummary({ summary }: YamapSummaryProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    trackEvent("copy_summary_click");
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-950">コピー用サマリー</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        readOnly
        value={summary}
        className="mt-3 min-h-56 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 font-mono text-sm leading-6 text-stone-800"
      />
    </section>
  );
}
