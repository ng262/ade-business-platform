import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/TableSkeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export type Props<Row extends { id: number }> = {
  columns: { label: string; key: keyof Row }[];
  data: Row[];
  selected: Set<Row>;
  onToggle: (row: Row) => void;
  actions: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    alert?: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
    };
  }[];
  createButton: {
    label: string;
    onClick: () => void;
  };
  loading: boolean;
  sort?: {
    by: keyof Row;
    direction?: "asc" | "desc";
  };
};

export function ManageTable<Row extends { id: number }>({
  columns,
  data,
  selected,
  onToggle,
  actions,
  createButton,
  loading,
  sort,
}: Props<Row>) {
  const [activeAction, setActiveAction] = useState<
    null | Props<Row>["actions"][number]
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sortedData = useMemo(() => {
    if (!sort?.by || !data?.length) return data;

    const { by, direction = "asc" } = sort;
    const arr = [...data];
    const collator = new Intl.Collator(undefined, { sensitivity: "base" });

    arr.sort((a, b) => {
      const av = (a as any)[by];
      const bv = (b as any)[by];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      const res = collator.compare(String(av), String(bv));
      return direction === "asc" ? res : -res;
    });

    return arr;
  }, [data, sort?.by, sort?.direction]);

  const triggerAction = (action: Props<Row>["actions"][number]) => {
    setMenuOpen(false);
    setTimeout(() => setActiveAction(action), 0);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Button className="cursor-pointer" onClick={createButton.onClick}>
            {createButton.label}
          </Button>
          {actions.length > 0 && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  disabled={selected.size === 0}
                >
                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions.map((a) =>
                  a.alert ? (
                    <DropdownMenuItem
                      key={a.label}
                      disabled={a.disabled}
                      onSelect={(e) => {
                        e.preventDefault();
                        triggerAction(a);
                      }}
                      className="cursor-pointer"
                    >
                      {a.label}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={a.label}
                      onClick={a.onClick}
                      disabled={a.disabled}
                      className="cursor-pointer"
                    >
                      {a.label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              {columns.map((c, i) => (
                <TableHead
                  key={String(c.key)}
                  className={i === columns.length - 1 ? "text-right" : ""}
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton
                rows={5}
                columns={["", ...columns.map((c) => c.label)]}
              />
            ) : sortedData.length ? (
              sortedData.map((r) => (
                <TableRow
                  className="cursor-pointer"
                  key={r.id}
                  onClick={() => onToggle(r)}
                >
                  <TableCell>
                    <Checkbox
                      className="cursor-pointer"
                      checked={[...selected].some((s) => s.id === r.id)}
                    />
                  </TableCell>
                  {columns.map((c, i) => (
                    <TableCell
                      key={String(c.key)}
                      className={i === columns.length - 1 ? "text-right" : ""}
                    >
                      {String(r[c.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {activeAction?.alert && (
        <AlertDialog open={true} onOpenChange={() => setActiveAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{activeAction.alert.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {activeAction.alert.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={() => setActiveAction(null)}
              >
                {activeAction.alert.cancel}
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => {
                  activeAction.onClick();
                  setActiveAction(null);
                }}
              >
                {activeAction.alert.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
