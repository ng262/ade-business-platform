import * as React from "react";
import { addMonths, format, parseISO, startOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceStatus } from "@shared/types/domain.types";

export type BillingMap = Record<string, AttendanceStatus>;

export function BillingCalendar({
  month,
  onMonthChange,
  map,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  map: BillingMap;
}) {
  const hereDays = React.useMemo(
    () =>
      Object.entries(map)
        .filter(([, s]) => s === AttendanceStatus.Here)
        .map(([k]) => parseISO(k)),
    [map]
  );
  const absentDays = React.useMemo(
    () =>
      Object.entries(map)
        .filter(([, s]) => s === AttendanceStatus.Absent)
        .map(([k]) => parseISO(k)),
    [map]
  );
  const nsDays = React.useMemo(
    () =>
      Object.entries(map)
        .filter(([, s]) => s === AttendanceStatus.NotScheduled)
        .map(([k]) => parseISO(k)),
    [map]
  );

  const Caption = React.useCallback(
    () => (
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(addMonths(month, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">{format(month, "MMMM yyyy")}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(addMonths(month, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    ),
    [month, onMonthChange]
  );

  return (
    <div className="rounded-xl border p-4">
      <Calendar
        mode="multiple"
        selected={[]}
        onSelect={() => {}}
        onDayClick={(e) => e.preventDefault()}
        month={month}
        onMonthChange={(d) => onMonthChange(startOfMonth(d))}
        showOutsideDays
        modifiers={{ here: hereDays, absent: absentDays, notScheduled: nsDays }}
        modifiersClassNames={{
          here: "after:content-[''] after:absolute after:inset-0 after:m-[2px] after:rounded-md after:bg-[var(--attendance-present-bg)] after:-z-10 after:pointer-events-none",
          absent:
            "after:content-[''] after:absolute after:inset-0 after:m-[2px] after:rounded-md after:bg-[var(--attendance-absent-bg)] after:-z-10 after:pointer-events-none",
          notScheduled:
            "after:content-[''] after:absolute after:inset-0 after:m-[2px] after:rounded-md after:bg-[var(--attendance-not-scheduled-bg)] after:-z-10 after:pointer-events-none",
          today:
            "before:content-[''] before:absolute before:inset-0 before:m-[2px] before:rounded-md before:ring before:ring-foreground/25 before:pointer-events-none",
        }}
        classNames={{
          day: "relative z-0 h-9 w-9 p-0 font-normal rounded-md hover:bg-muted",
          day_today:
            "relative z-0 h-9 w-9 p-0 font-normal rounded-md hover:bg-muted",
        }}
        components={{ Caption }}
      />
    </div>
  );
}
