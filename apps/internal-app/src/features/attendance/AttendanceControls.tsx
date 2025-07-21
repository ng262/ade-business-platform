import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";

type ButtonsProps = {
  edit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function AttendanceButtons({
  edit,
  onEdit,
  onCancel,
  onSubmit,
}: ButtonsProps) {
  return (
    <div className="flex gap-1 ml-auto">
      {!edit ? (
        <Button variant="default" onClick={onEdit} disabled={edit}>
          Edit
        </Button>
      ) : (
        <>
          <Button variant="secondary" onClick={onCancel} disabled={!edit}>
            Cancel
          </Button>
          <Button variant="default" onClick={onSubmit} disabled={!edit}>
            Submit
          </Button>
        </>
      )}
    </div>
  );
}

type FiltersProps = {
  date: Date;
  search: string;
  onDateChange: (date: Date) => void;
  onSearchChange: (value: string) => void;
};

export function AttendanceFilters({
  date,
  search,
  onDateChange,
  onSearchChange,
}: FiltersProps) {
  return (
    <div className="flex gap-1">
      <Input
        type="date"
        value={format(date, "yyyy-MM-dd")}
        onChange={(e) =>
          onDateChange(parse(e.target.value, "yyyy-MM-dd", new Date()))
        }
      />
      <Input
        placeholder="Search…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
