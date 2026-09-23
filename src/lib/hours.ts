import { useSyncExternalStore } from "react";
import type { DayHours } from "./types";

const TIME_ZONE = "America/Argentina/Buenos_Aires";
// Argentine weeks start on Monday.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export type HoursGroup = {
  label: string;
  days: number[];
  open: string | null;
  close: string | null;
};

/** Consecutive days with identical hours collapse into one row ("Lunes a sábado"). */
export function groupHours(hours: DayHours[]): HoursGroup[] {
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const groups: HoursGroup[] = [];
  const labels: string[][] = [];

  for (const day of WEEK_ORDER) {
    const entry = byDay.get(day);
    if (!entry) continue;
    const last = groups[groups.length - 1];
    if (last && last.open === entry.open && last.close === entry.close) {
      last.days.push(day);
      labels[labels.length - 1].push(entry.label);
    } else {
      groups.push({ label: "", days: [day], open: entry.open, close: entry.close });
      labels.push([entry.label]);
    }
  }

  groups.forEach((g, i) => {
    const names = labels[i];
    g.label =
      names.length === 1 ? names[0] : `${names[0]} a ${names[names.length - 1].toLowerCase()}`;
  });
  return groups;
}

export type OpenStatus = { open: true; detail: string } | { open: false; detail: string };

/** Open/closed right now in Argentina, and when that changes next. */
export function openStatus(hours: DayHours[], day: number, minutes: number): OpenStatus {
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const today = byDay.get(day as DayHours["day"]);

  if (today?.open && today.close) {
    const opens = toMinutes(today.open);
    const closes = toMinutes(today.close);
    if (minutes >= opens && minutes < closes) {
      return { open: true, detail: `cierra a las ${today.close}` };
    }
    if (minutes < opens) {
      return { open: false, detail: `abre hoy a las ${today.open}` };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = byDay.get(((day + offset) % 7) as DayHours["day"]);
    if (next?.open) {
      const when = offset === 1 ? "mañana" : `el ${next.label.toLowerCase()}`;
      return { open: false, detail: `abre ${when} a las ${next.open}` };
    }
  }
  return { open: false, detail: "" };
}

// The clock is external state the server can't know: read it through
// useSyncExternalStore so the server render and hydration agree (null),
// then tick every 30s. The snapshot is a primitive, so it only
// re-renders when the minute actually changes.
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}

function readArgentinaClock() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${WEEKDAY_INDEX[get("weekday")]}|${Number(get("hour")) * 60 + Number(get("minute"))}`;
}

export function useArgentinaClock(): { day: number; minutes: number } | null {
  const snapshot = useSyncExternalStore(subscribe, readArgentinaClock, () => null);
  if (!snapshot) return null;
  const [day, minutes] = snapshot.split("|").map(Number);
  return { day, minutes };
}
