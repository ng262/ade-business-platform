import { useState, useEffect } from "react";
import type { Client, Goal } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Props = {
  client: Client | null;
  setGoal: (g: Goal) => void;
};

export default function GoalSelector({ client, setGoal }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [titleFilter, setTitleFilter] = useState("");

  useEffect(() => {
    if (!client) {
      setGoals([]);
      return;
    }

    const fetchGoals = async () => {
      let url = `/api/goals?cid=${client.id}`;
      if (titleFilter) {
        url += `&title=${encodeURIComponent(titleFilter)}`;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        setGoals(json.data);
      } catch (err) {
        console.error((err as Error).message);
      }
    };

    fetchGoals();
  }, [titleFilter, client]);

  return (
    <Command>
      <CommandInput
        placeholder="Filter goals..."
        value={titleFilter}
        onValueChange={setTitleFilter}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {goals.length > 0 && (
          <CommandGroup heading="Goals">
            {goals.map((goal) => (
              <CommandItem
                key={goal.id}
                value={goal.title}
                onSelect={() => {
                  setGoal(goal);
                  setTitleFilter(goal.title);
                }}
                className="cursor-pointer"
              >
                {goal.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
