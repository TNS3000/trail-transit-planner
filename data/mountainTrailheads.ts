import type { MountainTrailheads } from "@/types";

export const mountainTrailheads: MountainTrailheads[] = [
  { mountainId: "takao", entryTrailheadIds: ["takaosanguchi", "kobotoke"], exitTrailheadIds: ["takaosanguchi", "kobotoke"] },
  { mountainId: "tonodake", entryTrailheadIds: ["okura", "yabitsu"], exitTrailheadIds: ["okura", "yabitsu"] },
  { mountainId: "oyama", entryTrailheadIds: ["oyama-cable", "yabitsu"], exitTrailheadIds: ["oyama-cable", "hinata-yakushi"] },
  { mountainId: "mitake", entryTrailheadIds: ["mitake-station", "takimoto"], exitTrailheadIds: ["mitake-station", "sawai"] },
  { mountainId: "jinba", entryTrailheadIds: ["jinba-kogen-shita", "kobotoke"], exitTrailheadIds: ["kobotoke", "takaosanguchi"] },
  { mountainId: "kagenobu", entryTrailheadIds: ["kobotoke", "jinba-kogen-shita"], exitTrailheadIds: ["kobotoke", "takaosanguchi"] },
  { mountainId: "kobotoke-shiroyama", entryTrailheadIds: ["takaosanguchi", "kobotoke"], exitTrailheadIds: ["takaosanguchi", "kobotoke"] },
  { mountainId: "kawanori", entryTrailheadIds: ["kawanori-bashi", "okutama"], exitTrailheadIds: ["hatonosu", "okutama"] },
  { mountainId: "otake", entryTrailheadIds: ["takimoto", "mitake-station"], exitTrailheadIds: ["okutama", "sawai"] },
  { mountainId: "kumotori", entryTrailheadIds: ["kamozawa", "mitsuya"], exitTrailheadIds: ["kamozawa", "mitsuya"] },
];
