import React from "react";
import { startOfMonth, format } from "date-fns";
import { ClientsTable, type ClientRow } from "./ClientsTable";
import { BillingCalendar, type BillingMap } from "./BillingCalendar";
import BillingSummary from "./BillingSummary";
import {
  Status as ClientStatus,
  AttendanceStatus,
} from "@shared/types/domain.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { getClients } from "@/api/client";
import type {
  ClientsQuery,
  ClientList,
  ClientAttendanceMap,
} from "@shared/validation";
import type { ClientResult } from "@shared/types/apiResult.types";
import { useSide } from "@/context/SideContext";

import { getClientAttendance } from "@/api/attendance";

type ClientWithId = ClientRow & { id: number };

export default function Billing() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [month, setMonth] = React.useState(startOfMonth(new Date()));

  const [clients, setClients] = React.useState<ClientWithId[]>([]);
  const { side } = useSide();

  const [map, setMap] = React.useState<ClientAttendanceMap>({});

  const fetchClients = React.useCallback(async () => {
    const query: ClientsQuery = { side };
    const result: ClientResult<ClientList> = await getClients(query);

    if (!result.success) {
      setClients([]);
      setRowSelection({});
      return;
    }

    const rows = (result.data ?? []).map((c: any) => ({
      id: c.id as number,
      fname: c.fname,
      lname: c.lname,
      side: c.side,
      status: c.status as ClientStatus,
    })) as ClientWithId[];

    rows.sort((a, b) => {
      const last = a.lname.localeCompare(b.lname);
      if (last !== 0) return last;
      return a.fname.localeCompare(b.fname);
    });

    setClients(rows);

    setRowSelection((prev) => {
      const selectedId = Object.keys(prev).find((k) => prev[k]);
      const stillExists =
        selectedId != null && rows.some((r) => String(r.id) === selectedId);
      if (stillExists) return prev;
      return rows.length ? { [String(rows[0].id)]: true } : {};
    });
  }, [side]);

  React.useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const selectedId = React.useMemo(() => {
    return Object.keys(rowSelection).find((k) => rowSelection[k]) ?? null;
  }, [rowSelection]);

  const selectedClient = React.useMemo(() => {
    return selectedId
      ? (clients.find((c) => String(c.id) === selectedId) ?? null)
      : null;
  }, [clients, selectedId]);

  const handleNextClient = React.useCallback(() => {
    if (!clients.length) return;
    if (!selectedId) {
      setRowSelection({ [String(clients[0].id)]: true });
      return;
    }
    const idx = clients.findIndex((c) => String(c.id) === selectedId);
    const nextIdx = (idx + 1) % clients.length;
    setRowSelection({ [String(clients[nextIdx].id)]: true });
  }, [clients, selectedId]);

  const handlePrevClient = React.useCallback(() => {
    if (!clients.length) return;
    if (!selectedId) {
      setRowSelection({ [String(clients[0].id)]: true });
      return;
    }
    const idx = clients.findIndex((c) => String(c.id) === selectedId);
    const prevIdx = (idx - 1 + clients.length) % clients.length;
    setRowSelection({ [String(clients[prevIdx].id)]: true });
  }, [clients, selectedId]);

  const fetchClientAttendance = React.useCallback(async () => {
    if (selectedClient == null) {
      setMap({});
      return;
    }

    const monthParam = format(month, "yyyy-MM");

    const result = (await getClientAttendance({
      month: monthParam,
      cid: selectedClient.id,
    })) as ClientResult<ClientAttendanceMap>;

    if (!result.success) {
      setMap({});
      return;
    }

    setMap(result.data ?? {});
  }, [month, selectedClient]);

  React.useEffect(() => {
    void fetchClientAttendance();
  }, [fetchClientAttendance]);

  const { absentCount, hereCount, nsCount } = React.useMemo(() => {
    let absent = 0,
      here = 0,
      ns = 0;
    for (const s of Object.values(map)) {
      if (s === AttendanceStatus.Absent) absent++;
      else if (s === AttendanceStatus.Here) here++;
      else if (s === AttendanceStatus.NotScheduled) ns++;
    }
    return { absentCount: absent, hereCount: here, nsCount: ns };
  }, [map]);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 items-stretch">
            <div>
              <BillingCalendar
                month={month}
                onMonthChange={setMonth}
                map={map as BillingMap}
              />
            </div>
            <div className="flex-1">
              <BillingSummary
                clientLabel={
                  selectedClient
                    ? `${selectedClient.fname} ${selectedClient.lname}`
                    : "No client selected"
                }
                monthLabel={format(month, "MMMM yyyy")}
                absentCount={absentCount}
                hereCount={hereCount}
                nsCount={nsCount}
                onNextClient={clients.length > 1 ? handleNextClient : undefined}
                onPrevClient={clients.length > 1 ? handlePrevClient : undefined}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle>Client Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsTable
            data={clients}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        </CardContent>
      </Card>
    </div>
  );
}
