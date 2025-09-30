import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Status } from "@shared/types/domain.types";

export type ClientRow = {
  fname: string;
  lname: string;
  side: string;
  status: Status;
};

function StatusBadge({ status }: { status: Status }) {
  const tone =
    status === Status.Active
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : "bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={`px-1.5 ${tone}`}>
      {status}
    </Badge>
  );
}

const columnsBuilder = (
  onSingleSelect: (id: string, value: boolean) => void
): ColumnDef<ClientRow>[] => [
  {
    id: "select",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2">
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => onSingleSelect(row.id, !!v)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 36,
  },
  {
    accessorKey: "fname",
    header: () => <div className="px-3 py-2">First Name</div>,
    cell: ({ row }) => (
      <div className="px-3 py-2 font-medium">{row.original.fname}</div>
    ),
  },
  {
    accessorKey: "lname",
    header: () => <div className="px-3 py-2">Last Name</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.original.lname}</div>,
  },
  {
    accessorKey: "side",
    header: () => <div className="px-3 py-2">Side</div>,
    cell: ({ row }) => (
      <div className="px-3 py-2 text-muted-foreground">{row.original.side}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="px-3 py-2">Status</div>,
    cell: ({ row }) => (
      <div className="px-3 py-2">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
];

export function ClientsTable({
  data,
  rowSelection,
  onRowSelectionChange,
}: {
  data: ClientRow[];
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (s: Record<string, boolean>) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [query, setQuery] = React.useState("");

  const onSingleSelect = React.useCallback(
    (id: string, value: boolean) => {
      onRowSelectionChange(value ? { [id]: true } : {});
    },
    [onRowSelectionChange]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((c) =>
      `${c.fname} ${c.lname} ${c.side} ${c.status}`.toLowerCase().includes(q)
    );
  }, [data, query]);

  const columns = React.useMemo(
    () => columnsBuilder(onSingleSelect),
    [onSingleSelect]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getRowId: (_row, idx) => String(idx),
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      const first = Object.keys(next).find((k) => next[k]);
      onRowSelectionChange(first ? { [first]: true } : {});
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-xs"
      />

      <div className="rounded-lg border overflow-hidden">
        <div className="max-h-[50vh] overflow-y-auto">
          <Table className="text-sm">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="[&_td]:py-2 [&_td]:px-3">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<ClientRow>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSingleSelect(row.id, true)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllLeafColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
