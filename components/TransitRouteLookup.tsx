"use client";

import { useEffect, useState } from "react";
import type { TransitRouteRequest, TransitRouteResult } from "@/types";

type TransitRouteLookupProps = {
  outboundRequest: TransitRouteRequest;
  inboundRequest: TransitRouteRequest;
};

type LookupState = {
  outbound?: TransitRouteResult;
  inbound?: TransitRouteResult;
  loading: boolean;
};

async function fetchTransitRoute(body: TransitRouteRequest) {
  const response = await fetch("/api/transit-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return (await response.json()) as TransitRouteResult;
}

function RouteResultList({ title, result }: { title: string; result?: TransitRouteResult }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3">
      <h3 className="font-semibold text-stone-950">{title}</h3>
      {!result ? <p className="mt-2 text-sm text-stone-600">取得待ちです。</p> : null}
      {result?.error ? <p className="mt-2 text-sm leading-6 text-stone-600">{result.error}</p> : null}
      {result?.query ? (
        <dl className="mt-3 grid gap-2 rounded-md bg-white p-3 text-xs text-stone-600">
          <div>
            <dt className="font-semibold text-stone-800">検索条件</dt>
            <dd>
              {result.query.origin} → {result.query.destination}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-stone-800">指定時刻</dt>
            <dd>
              {result.query.timingMode === "arrival" ? "到着" : "出発"} / {result.query.requestedLocalTime}
            </dd>
          </div>
        </dl>
      ) : null}
      {result?.durationText ? <p className="mt-2 text-sm font-semibold text-emerald-700">所要時間: {result.durationText}</p> : null}
      {result?.steps.length ? <p className="mt-2 text-xs text-stone-500">取得元: {result.source}</p> : null}
      {result?.steps.length ? (
        <ol className="mt-3 space-y-2">
          {result.steps.map((step, index) => (
            <li key={`${title}-${index}`} className="rounded-md bg-white p-3 text-sm">
              <p className="font-semibold text-stone-900">
                {step.departureTime ? `${step.departureTime}発 ` : ""}
                {step.from ?? step.instruction ?? step.mode}
                {step.to ? ` → ${step.to}` : ""}
                {step.arrivalTime ? ` ${step.arrivalTime}着` : ""}
              </p>
              {[step.lineName, step.operator, step.durationText].filter(Boolean).length ? (
                <p className="mt-1 text-stone-600">{[step.lineName, step.operator, step.durationText].filter(Boolean).join(" / ")}</p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function TransitRouteLookup({ outboundRequest, inboundRequest }: TransitRouteLookupProps) {
  const [state, setState] = useState<LookupState>({ loading: true });

  useEffect(() => {
    let cancelled = false;

    async function loadRoutes() {
      setState({ loading: true });
      const [outbound, inbound] = await Promise.all([fetchTransitRoute(outboundRequest), fetchTransitRoute(inboundRequest)]);

      if (!cancelled) {
        setState({ outbound, inbound, loading: false });
      }
    }

    loadRoutes().catch(() => {
      if (!cancelled) {
        setState({
          loading: false,
          outbound: { configured: true, source: "google-routes-api", steps: [], error: "往路の取得に失敗しました。" },
          inbound: { configured: true, source: "google-routes-api", steps: [], error: "復路の取得に失敗しました。" },
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [inboundRequest, outboundRequest]);

  const apiConfigured = state.outbound?.configured ?? state.inbound?.configured;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-stone-950">Google APIルート取得</h2>
        <p className="mt-2 text-xs leading-5 text-stone-500">
          Google Routes APIを設定すると、ここに正確な公共交通の時刻・乗換が表示されます。未設定時はGoogle Mapsリンクで確認してください。
        </p>
      </div>
      {state.loading ? <p className="mt-4 text-sm text-stone-600">ルート取得を確認中です。</p> : null}
      {apiConfigured === false ? (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          Google Maps APIキーが未設定です。Vercelに `GOOGLE_MAPS_API_KEY` を設定すると取得できます。
        </p>
      ) : null}
      {apiConfigured ? (
        <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs leading-5 text-emerald-950">
          Routes APIのみを使用しています。旧Directions APIは使いません。
        </p>
      ) : null}
      <div className="mt-4 grid gap-3">
        <RouteResultList title="往路" result={state.outbound} />
        <RouteResultList title="復路" result={state.inbound} />
      </div>
    </section>
  );
}
