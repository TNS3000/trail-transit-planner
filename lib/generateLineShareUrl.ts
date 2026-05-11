export function generateLineShareUrl(text: string) {
  const params = new URLSearchParams({ text });
  return `https://social-plugins.line.me/lineit/share?${params.toString()}`;
}
