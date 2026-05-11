export function trackEvent(eventName: string, params?: Record<string, string | number | boolean | undefined>) {
  console.log("[trackEvent]", eventName, params ?? {});
}
