import { CheckCircle, XCircle, PauseCircle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { AttendanceStatus } from "@shared/types/domain.types";
import type { Attendance } from "@shared/validation";
import type { AttendanceUi } from "./Attendance";

type Props = {
  data: AttendanceUi[];
  edit: boolean;
  onStatusChange: (cid: number, val: AttendanceStatus) => void;
};

export default function AttendanceTable({ data, edit, onStatusChange }: Props) {
  const bgColorMap: Record<AttendanceStatus, string> = {
    [AttendanceStatus.Here]: "bg-[var(--attendance-present-bg)]",
    [AttendanceStatus.Absent]: "bg-[var(--attendance-absent-bg)]",
    [AttendanceStatus.NotScheduled]: "bg-[var(--attendance-not-scheduled-bg)]",
  };

  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-auto border-r">Name</TableHead>
          <TableHead className="border-r">Present</TableHead>
          <TableHead className="border-r">Absent</TableHead>
          <TableHead>Not Scheduled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((row) => (
            <TableRow key={row.data.cid}>
              <TableCell className="w-auto border-r whitespace-normal">
                {row.data.lname}, {row.data.fname}
              </TableCell>

              {[
                AttendanceStatus.Here,
                AttendanceStatus.Absent,
                AttendanceStatus.NotScheduled,
              ].map((val) => (
                <TableCell
                  key={val}
                  className={cn(
                    "w-1/3 cursor-pointer py-10 border-r",
                    !edit && "pointer-events-none opacity-50",
                    row.data.attendance_status === val
                      ? bgColorMap[val]
                      : "bg-transparent"
                  )}
                  onClick={
                    edit ? () => onStatusChange(row.data.cid, val) : undefined
                  }
                >
                  {row.data.attendance_status === val && (
                    <div className="flex flex-col items-center justify-center gap-2">
                      {val === AttendanceStatus.Here && <CheckCircle />}
                      {val === AttendanceStatus.Absent && <XCircle />}
                      {val === AttendanceStatus.NotScheduled && <PauseCircle />}
                      <span className="text-[9px] sm:text-sm">{val}</span>
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No attendance data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
