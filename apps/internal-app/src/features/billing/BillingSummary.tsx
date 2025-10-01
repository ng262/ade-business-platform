import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export type BillingSummaryProps = {
  clientLabel: string;
  monthLabel: string;
  absentCount: number;
  hereCount: number;
  nsCount: number;
  onNextClient?: () => void;
  onPrevClient?: () => void;
};

export default function BillingSummary({
  clientLabel,
  monthLabel,
  absentCount,
  hereCount,
  nsCount,
  onNextClient,
  onPrevClient,
}: BillingSummaryProps) {
  const scheduled = absentCount + hereCount;
  const percentPresent =
    scheduled > 0 ? ((hereCount / scheduled) * 100).toFixed(1) : "0.0";

  return (
    <div className="@container/summary p-4 h-full flex flex-col">
      <div className="mb-3 flex flex-col items-center min-w-0">
        <div className="text-sm text-muted-foreground text-center">
          {monthLabel}
        </div>

        <div className="relative mt-0.5 w-full">
          {onPrevClient && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer"
              onClick={onPrevClient}
              aria-label="Previous client"
              title="Previous client"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="text-base font-semibold truncate text-center px-8">
            {clientLabel}
          </div>

          {onNextClient && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer"
              onClick={onNextClient}
              aria-label="Next client"
              title="Next client"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 grid gap-3 grid-cols-1 @sm/summary:grid-cols-2 @md/summary:grid-cols-3">
        <StatTile label="Absent" value={absentCount} />
        <StatTile label="Scheduled" value={scheduled} />
        <StatTile label="Attendance %" value={`${percentPresent}%`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <LegendSwatch varName="--attendance-present-bg" label="Present" />
        <LegendSwatch varName="--attendance-absent-bg" label="Absent" />
        <LegendSwatch
          varName="--attendance-not-scheduled-bg"
          label="Not Scheduled"
        />
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border h-full w-full p-3 flex flex-col items-center justify-center min-w-0">
      <div
        className="font-bold tabular-nums leading-none"
        style={{ fontSize: "clamp(1.25rem, 4.5cqw, 2.75rem)" }}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function LegendSwatch({ varName, label }: { varName: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block size-3 rounded-sm"
        style={{ backgroundColor: `var(${varName})` }}
      />
      {label}
    </span>
  );
}
