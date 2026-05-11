export function generateGoogleMapsUrl(origin: string, destination: string) {
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "transit",
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
