// Geohash decode + shared constants used to place on-chain robots on the globe.

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

/** Center lat/lon of a geohash cell (used to position a robot's site on the globe). */
export function geohashCenter(geohash: string): { lat: number; lon: number } {
  let evenBit = true;
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;
  for (const ch of geohash) {
    const cd = BASE32.indexOf(ch);
    if (cd < 0) continue;
    for (let n = 4; n >= 0; n--) {
      const bit = (cd >> n) & 1;
      if (evenBit) {
        const mid = (lonMin + lonMax) / 2;
        if (bit === 1) lonMin = mid;
        else lonMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (bit === 1) latMin = mid;
        else latMax = mid;
      }
      evenBit = !evenBit;
    }
  }
  return { lat: (latMin + latMax) / 2, lon: (lonMin + lonMax) / 2 };
}

/** Site geohash prefixes — must match the on-chain sites seeded by contracts/script/Deploy.s.sol. */
export const SITE_GEOHASH: Record<number, string> = {
  1: "u4pru",
  2: "u09tv",
};

/** EventType enum (mirror of the on-chain / shared EventType). */
export const EVENT_NAMES = [
  "PATROL_START",
  "WAYPOINT_REACHED",
  "INCIDENT_DETECTED",
  "ALERT_ESCALATED",
  "SIREN_TRIGGERED",
  "DOCK_CHARGE",
  "PATROL_END",
  "HEARTBEAT",
] as const;

export const CRITICAL_TYPES = new Set([2, 3, 4]);
