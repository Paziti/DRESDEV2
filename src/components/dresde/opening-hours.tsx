"use client";

import type { Location } from "@/lib/types";
import { groupHours, openStatus, useArgentinaClock } from "@/lib/hours";
import { cn } from "@/lib/utils";

export function OpeningHours({ location }: { location: Location }) {
  const clock = useArgentinaClock();
  const groups = groupHours(location.hours);

  return (
    <ul className="flex flex-col divide-y divide-dresde-line border-y border-dresde-line">
      {groups.map((group) => {
        const isToday = clock !== null && group.days.includes(clock.day);
        return (
          <li
            key={group.label}
            className={cn(
              "flex items-baseline justify-between gap-4 py-3 text-small",
              isToday ? "text-dresde-paper" : "text-dresde-paper-dim"
            )}
          >
            <span>
              {group.label}
              {isToday && <span className="ml-2 text-dresde-brass">hoy</span>}
            </span>
            <span className="tabular-nums">
              {group.open && group.close ? `${group.open} a ${group.close}` : "Cerrado"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "Abierto ahora, cierra a las 20:00". Computed in Argentina's time zone,
 * so it is right for a visitor browsing from anywhere. Renders nothing on
 * the server, where the time isn't known.
 */
export function OpenNow({ location }: { location: Location }) {
  const clock = useArgentinaClock();
  if (!clock) return <p className="h-5" aria-hidden="true" />;

  const status = openStatus(location.hours, clock.day, clock.minutes);
  return (
    <p className="flex items-center gap-2 text-small text-dresde-paper-dim">
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          status.open ? "bg-dresde-brass" : "border border-dresde-mute"
        )}
      />
      <span>
        <span className="text-dresde-paper">{status.open ? "Abierto ahora" : "Cerrado ahora"}</span>
        {status.detail && `, ${status.detail}`}
      </span>
    </p>
  );
}
