import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import type { Client, Goal } from "@/types";
import ClientSelector from "./ClientSelector";
import GoalSelector from "./GoalSelector";

type Props = {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  client: Client | null;
  setClient: (c: Client) => void;
  setGoal: (g: Goal | null) => void;
};

export default function SelectionSection({
  date,
  setDate,
  client,
  setClient,
  setGoal,
}: Props) {
  const formatted = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <div className="grid w-full gap-4 md:grid-cols-[13rem_1fr_1fr]">
      <div className="space-y-1">
        <Input
          type="date"
          value={formatted}
          onChange={(e) =>
            setDate(e.target.value ? parseISO(e.target.value) : undefined)
          }
        />
      </div>
      <ClientSelector setClient={setClient} />
      <GoalSelector client={client} setGoal={setGoal} />
    </div>
  );
}
