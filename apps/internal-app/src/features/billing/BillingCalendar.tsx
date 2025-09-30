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
        modifiersStyles={{
          here: {
            backgroundColor: "var(--attendance-present-bg)",
            borderRadius: "0.375rem",
            margin: "2px",
          },
          absent: {
            backgroundColor: "var(--attendance-absent-bg)",
            borderRadius: "0.375rem",
            margin: "2px",
          },
          notScheduled: {
            backgroundColor: "var(--attendance-not-scheduled-bg)",
            borderRadius: "0.375rem",
            margin: "2px",
          },
        }}
        classNames={{
          day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-muted",
        }}
        components={{ Caption }}
      />
    </div>
  );
}
