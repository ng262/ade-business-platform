import { useState } from "react";
import Panel from "@/components/Panel";
import { Table } from "lucide-react";
import SelectionSection from "./SelectionSection";
import DataSection from "./DataSection";
import type { Client, Goal } from "@/types";

export default function DataSheet() {
  const [client, setClient] = useState<Client | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Panel title="Data Sheet" icon={Table} className="space-y-6">
      <SelectionSection
        date={date}
        setDate={setDate}
        client={client}
        setClient={setClient}
        setGoal={setGoal}
      />

      {client && goal && date ? (
        <DataSection client={client} goal={goal} date={date} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose a date, client, and goal to begin.
        </p>
      )}
    </Panel>
  );
}
