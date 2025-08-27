import { useEffect, useState, useMemo } from "react";
import { ManageTable } from "@/components/ManageTable";
import { getClients } from "@/api/client";
import type { Client } from "@shared/validation";
import type { ApiResponse } from "@shared/types/apiResult.types";
import { deactivateClients, deleteClients } from "@/api/client";
import type { SerialId } from "@shared/validation";
import { withToast } from "@/lib/utils";

const columns = [
  { label: "First Name", key: "fname" },
  { label: "Last Name", key: "lname" },
  { label: "Side", key: "side" },
];

type Props = {
  activeStack: string[];
  setActiveStack: React.Dispatch<React.SetStateAction<string[]>>;
  setClient: (client: Client) => void;
};

export default function ManageClients({
  activeStack,
  setActiveStack,
  setClient,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Set<Client>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  const selectedArray = [...selectedClients];
  const selectedCount = selectedArray.length;

  const fetchClients = async () => {
    setLoading(true);
    const result: ApiResponse<Client[]> = await getClients();
    setClients(result.success ? result.data : []);
    setSelectedClients(new Set());
    setLoading(false);
  };

  const actions = useMemo(
    () => [
      {
        label: "Update Client",
        disabled: selectedCount !== 1,
        onClick: () => {
          setClient(selectedArray[0]);
          setActiveStack((stk) => [...stk, "Update Client"]);
        },
      },
      {
        label: selectedCount === 1 ? "Delete Client" : "Delete Clients",
        disabled: selectedCount === 0,
        onClick: async () => {
          const ids: SerialId[] = selectedArray.map((c) => c.id);
          const single = selectedCount === 1;
          const ok = await withToast(
            () => deleteClients({ ids }),
            single ? "Client deleted" : "Clients deleted",
            single ? "Failed to delete client" : "Failed to delete clients"
          );
          if (ok) await fetchClients();
        },
        alert: {
          title: selectedCount === 1 ? "Delete Client" : "Delete Clients",
          description:
            selectedCount === 1
              ? `This will permanently delete "${selectedArray[0]?.fname} ${selectedArray[0]?.lname}".`
              : `This will permanently delete ${selectedCount} clients.`,
          confirm: selectedCount === 1 ? "Delete Client" : "Delete Clients",
          cancel: "Cancel",
        },
      },
    ],
    [selectedArray, selectedCount, setClient, setActiveStack]
  );

  const toggle = (client: Client) =>
    setSelectedClients((prev) => {
      const next = new Set(prev);
      next.has(client) ? next.delete(client) : next.add(client);
      return next;
    });

  useEffect(() => {
    void fetchClients();
  }, []);

  return (
    <ManageTable<Client>
      title="Clients"
      columns={columns}
      data={clients}
      selected={selectedClients}
      onToggle={toggle}
      actions={actions}
      createButton={{
        label: "Create Client",
        onClick: () => setActiveStack((stk) => [...stk, "Create Client"]),
      }}
      loading={loading}
      sort={{ by: ["side", "lname"], direction: "asc" }}
    />
  );
}
