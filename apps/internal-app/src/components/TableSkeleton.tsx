import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({
  rows = 5,
  columns,
}: {
  rows?: number;
  columns: string[];
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell
              key={colIndex}
              className={colIndex === columns.length - 1 ? "text-right" : ""}
            >
              <Skeleton className="h-4 w-full rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
