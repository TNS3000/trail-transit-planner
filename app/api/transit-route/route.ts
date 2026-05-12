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
  return new Date(`${date}T${time}:00+09:00`).toISOString();
}

function toUnixSeconds(date: string, time: string) {
  return Math.floor(new Date(`${date}T${time}:00+09:00`).getTime() / 1000);
}

function normalizeAddress(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.includes("日本") || trimmed.toLowerCase().includes("japan")) {
    return trimmed;
  }

  return `${trimmed}, 日本`;
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

function formatEpochSeconds(value: unknown) {
  if (typeof value !== "number") {
    return undefined;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(new Date(value * 1000));
}

function createQuery(body: TransitRouteRequest) {
  return {
    origin: body.origin,
    destination: body.destination,
    timingMode: body.timingMode,
    requestedTime: toRfc3339(body.date, body.time),
    requestedLocalTime: `${body.date} ${body.time}`,
  };
}

function normalizeGoogleRoutesResponse(data: unknown, body: TransitRouteRequest): TransitRouteResult {
  const route = (data as { routes?: Array<Record<string, unknown>> }).routes?.[0];

  if (!route) {
    return {
      configured: true,
      source: "google-routes-api",
      steps: [],
      error: "公共交通ルートが見つかりませんでした。入力地点が曖昧、指定時刻に公共交通がない、またはGoogle側で公共交通ルートを返せない可能性があります。",
      query: createQuery(body),
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
    query: createQuery(body),
  };
}

function normalizeGoogleDirectionsResponse(data: unknown, body: TransitRouteRequest): TransitRouteResult {
  const response = data as {
    status?: string;
    error_message?: string;
    routes?: Array<{
      legs?: Array<{
        duration?: { text?: string };
        steps?: Array<{
          travel_mode?: string;
          html_instructions?: string;
          duration?: { text?: string };
          transit_details?: {
            departure_stop?: { name?: string };
            arrival_stop?: { name?: string };
            departure_time?: { value?: number; text?: string };
            arrival_time?: { value?: number; text?: string };
            line?: {
              short_name?: string;
              name?: string;
              agencies?: Array<{ name?: string }>;
            };
          };
        }>;
      }>;
    }>;
  };
  const route = response.routes?.[0];

  if (!route) {
    return {
      configured: true,
      source: "google-directions-api",
      steps: [],
      error: response.error_message
        ? `公共交通ルートが見つかりませんでした。詳細: ${response.error_message}`
        : `公共交通ルートが見つかりませんでした。Google Directions API status: ${response.status ?? "UNKNOWN"}`,
      query: createQuery(body),
    };
  }

  const legs = route.legs ?? [];
  const steps = legs.flatMap((leg) => leg.steps ?? []);
  const normalizedSteps: TransitRouteLegStep[] = steps.map((step) => {
    const transitDetails = step.transit_details;

    return {
      mode: step.travel_mode ?? "TRANSIT",
      instruction: step.html_instructions?.replace(/<[^>]+>/g, ""),
      from: transitDetails?.departure_stop?.name,
      to: transitDetails?.arrival_stop?.name,
      lineName: transitDetails?.line?.short_name ?? transitDetails?.line?.name,
      operator: transitDetails?.line?.agencies?.[0]?.name,
      departureTime: transitDetails?.departure_time?.text ?? formatEpochSeconds(transitDetails?.departure_time?.value),
      arrivalTime: transitDetails?.arrival_time?.text ?? formatEpochSeconds(transitDetails?.arrival_time?.value),
      durationText: step.duration?.text,
    };
  });

  return {
    configured: true,
    source: "google-directions-api",
    durationText: legs[0]?.duration?.text,
    steps: normalizedSteps,
    query: createQuery(body),
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
    origin: { address: normalizeAddress(body.origin) },
    destination: { address: normalizeAddress(body.destination) },
    travelMode: "TRANSIT",
    computeAlternativeRoutes: true,
    languageCode: "ja-JP",
    regionCode: "JP",
    transitPreferences: {
      routingPreference: "FEWER_TRANSFERS",
    },
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
    const errorText = await response.text();

    return NextResponse.json(
      {
        configured: true,
        source: "google-routes-api",
        steps: [],
        error: `Google Routes APIからルートを取得できませんでした。${errorText ? `詳細: ${errorText.slice(0, 240)}` : ""}`,
        query: createQuery(body),
      } satisfies TransitRouteResult,
      { status: response.status },
    );
  }

  const data = await response.json();
  const routesResult = normalizeGoogleRoutesResponse(data, body);

  if (routesResult.steps.length > 0) {
    return NextResponse.json(routesResult);
  }

  const directionsParams = new URLSearchParams({
    origin: normalizeAddress(body.origin),
    destination: normalizeAddress(body.destination),
    mode: "transit",
    language: "ja",
    region: "jp",
    key: apiKey,
    [body.timingMode === "arrival" ? "arrival_time" : "departure_time"]: String(toUnixSeconds(body.date, body.time)),
  });
  const directionsResponse = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${directionsParams.toString()}`, {
    cache: "no-store",
  });

  if (!directionsResponse.ok) {
    return NextResponse.json(
      {
        ...routesResult,
        error: `${routesResult.error} Directions APIのフォールバックにも失敗しました。`,
      } satisfies TransitRouteResult,
      { status: directionsResponse.status },
    );
  }

  const directionsData = await directionsResponse.json();
  return NextResponse.json(normalizeGoogleDirectionsResponse(directionsData, body));
}
