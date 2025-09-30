export default function BillingSummary({
  clientLabel,
  monthLabel,
  absentCount,
  hereCount,
  nsCount,
}: {
  clientLabel: string;
  monthLabel: string;
  absentCount: number;
  hereCount: number;
  nsCount: number;
}) {
  const scheduled = absentCount + hereCount;
  const percentAbsent =
    scheduled > 0 ? ((absentCount / scheduled) * 100).toFixed(1) : "0.0";

  return (
    <div className="@container/summary p-4 h-full flex flex-col">
      <div className="mb-3 min-w-0">
        <div className="text-sm text-muted-foreground">{monthLabel}</div>
        <div className="text-base font-semibold truncate">{clientLabel}</div>
      </div>
      <div className="flex-1 grid gap-3 grid-cols-1 @sm/summary:grid-cols-2 @md/summary:grid-cols-3">
        <StatTile label="Absent" value={absentCount} />
        <StatTile label="Scheduled" value={scheduled} />
        <StatTile label="Absent %" value={`${percentAbsent}%`} />
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
