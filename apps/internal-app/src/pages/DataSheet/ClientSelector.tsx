import { useState, useEffect } from "react";
import type { Client } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Props = {
  setClient: (c: Client) => void;
};

export default function ClientSelector({ setClient }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    if (!nameFilter) {
      setClients([]);
      return;
    }

    const fetchClients = async () => {
      const url = `/api/clients?name=${encodeURIComponent(nameFilter)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        setClients(json.data);
      } catch (err) {
        console.error((err as Error).message);
      }
    };

    fetchClients();
  }, [nameFilter]);

  return (
    <Command>
      <CommandInput
        placeholder="Filter clients..."
        value={nameFilter}
        onValueChange={setNameFilter}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {clients.length > 0 && (
          <CommandGroup heading="Clients">
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={() => {
                  setClient(client);
                  setNameFilter(client.name);
                }}
                className="cursor-pointer"
              >
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
