import { NextResponse } from "next/server";
import type { TransitRouteLegStep, TransitRouteRequest, TransitRouteResult } from "@/types";

const fieldMask = [
  "routes.duration",
  "routes.localizedValues",
  "routes.legs.steps.travelMode",
  "routes.legs.steps.localizedValues",
  "routes.legs.steps.navigationInstruction",
  "routes.legs.steps.transitDetails",
].join(",");

function toRfc3339(date: string, time: string) {
  return `${date}T${time}:00+09:00`;
}

function isValidRequest(body: Partial<TransitRouteRequest>): body is TransitRouteRequest {
  return Boolean(body.origin && body.destination && body.date && body.time && body.timingMode);
}

function getTransitStopName(stop: unknown) {
  if (!stop || typeof stop !== "object") {
    return undefined;
  }

  const stopObject = stop as { name?: { text?: string } | string };
  if (typeof stopObject.name === "string") {
    return stopObject.name;
  }

  return stopObject.name?.text;
}

function formatIsoTime(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

function normalizeGoogleRoutesResponse(data: unknown): TransitRouteResult {
  const route = (data as { routes?: Array<Record<string, unknown>> }).routes?.[0];

  if (!route) {
    return {
      configured: true,
      source: "google-routes-api",
      steps: [],
      error: "公共交通ルートが見つかりませんでした。",
    };
  }

  const legs = route.legs as Array<{ steps?: Array<Record<string, unknown>> }> | undefined;
  const steps = legs?.flatMap((leg) => leg.steps ?? []) ?? [];
  const normalizedSteps: TransitRouteLegStep[] = steps.map((step) => {
    const transitDetails = step.transitDetails as
      | {
          stopDetails?: {
            arrivalStop?: unknown;
            arrivalTime?: string;
            departureStop?: unknown;
            departureTime?: string;
          };
          transitLine?: {
            name?: string;
            nameShort?: string;
            agencies?: Array<{ name?: string }>;
          };
        }
      | undefined;
    const localizedValues = step.localizedValues as { staticDuration?: { text?: string } } | undefined;
    const navigationInstruction = step.navigationInstruction as { instructions?: string } | undefined;

    return {
      mode: String(step.travelMode ?? "TRANSIT"),
      instruction: navigationInstruction?.instructions,
      from: getTransitStopName(transitDetails?.stopDetails?.departureStop),
      to: getTransitStopName(transitDetails?.stopDetails?.arrivalStop),
      lineName: transitDetails?.transitLine?.nameShort ?? transitDetails?.transitLine?.name,
      operator: transitDetails?.transitLine?.agencies?.[0]?.name,
      departureTime: formatIsoTime(transitDetails?.stopDetails?.departureTime),
      arrivalTime: formatIsoTime(transitDetails?.stopDetails?.arrivalTime),
      durationText: localizedValues?.staticDuration?.text,
    };
  });

  const localizedValues = route.localizedValues as { duration?: { text?: string } } | undefined;

  return {
    configured: true,
    source: "google-routes-api",
    durationText: localizedValues?.duration?.text,
    steps: normalizedSteps,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const body = (await request.json()) as Partial<TransitRouteRequest>;

  if (!isValidRequest(body)) {
    return NextResponse.json(
      {
        configured: Boolean(apiKey),
        source: "google-routes-api",
        steps: [],
        error: "ルート取得に必要な入力が不足しています。",
      } satisfies TransitRouteResult,
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      source: "google-routes-api",
      steps: [],
      error: "Google Maps APIキーが未設定です。",
    } satisfies TransitRouteResult);
  }

  const requestBody = {
    origin: { address: body.origin },
    destination: { address: body.destination },
    travelMode: "TRANSIT",
    languageCode: "ja-JP",
    regionCode: "JP",
    ...(body.timingMode === "arrival"
      ? { arrivalTime: toRfc3339(body.date, body.time) }
      : { departureTime: toRfc3339(body.date, body.time) }),
  };

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        configured: true,
        source: "google-routes-api",
        steps: [],
        error: "Google Routes APIからルートを取得できませんでした。",
      } satisfies TransitRouteResult,
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(normalizeGoogleRoutesResponse(data));
}
