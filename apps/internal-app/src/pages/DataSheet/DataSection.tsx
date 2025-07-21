import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Client, Goal } from "@/types";
import { GoalForm } from "./GoalForm";

type Props = { client: Client; goal: Goal; date: Date };

export default function DataSection({ client, goal, date }: Props) {
  return (
    <Tabs defaultValue="goal" className="space-y-4">
      <TabsList>
        <TabsTrigger value="goal">Goal Details</TabsTrigger>
        <TabsTrigger value="data">Data Entry</TabsTrigger>
      </TabsList>

      <TabsContent value="goal">
        <GoalForm client={client} goal={goal} />
      </TabsContent>

      <TabsContent value="data"></TabsContent>
    </Tabs>
  );
}
