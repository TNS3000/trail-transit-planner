import { mountainTrailheads } from "@/data/mountainTrailheads";
import { trailheads } from "@/data/trailheads";

export function getTrailheadsForMountain(mountainId: string) {
  const relation = mountainTrailheads.find((item) => item.mountainId === mountainId);

  if (!relation) {
    return { entryTrailheads: [], exitTrailheads: [] };
  }

  return {
    entryTrailheads: relation.entryTrailheadIds
      .map((id) => trailheads.find((trailhead) => trailhead.id === id))
      .filter((trailhead) => trailhead !== undefined),
    exitTrailheads: relation.exitTrailheadIds
      .map((id) => trailheads.find((trailhead) => trailhead.id === id))
      .filter((trailhead) => trailhead !== undefined),
  };
}
