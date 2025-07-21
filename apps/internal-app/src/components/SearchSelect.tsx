// components/ui/SearchSelect.tsx
"use client";
import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SearchSelectProps<T> = {
  /** Called on every keystroke to fetch results */
  onSearch: (q: string) => Promise<T[]>;
  /** Fired when the user picks an item */
  onSelect: (item: T) => void;
  /** How to uniquely key a result */
  getKey: (item: T) => string | number;
  /** How to render a result’s label */
  getLabel: (item: T) => string;
  /** Button placeholder before a choice is made */
  placeholder?: string;
  className?: string;
};

export function SearchSelect<T>({
  onSearch,
  onSelect,
  getKey,
  getLabel,
  placeholder = "Search…",
  className,
}: SearchSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<T | null>(null);

  /* remote search */
  useEffect(() => {
    if (!query) return setItems([]);
    onSearch(query).then(setItems).catch(console.error);
  }, [query, onSearch]);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-full cursor-pointer"
          >
            {chosen ? getLabel(chosen) : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-48 overflow-y-auto">
              {items.map((item) => (
                <CommandItem
                  key={getKey(item)}
                  value={getLabel(item)}
                  onSelect={() => {
                    setChosen(item);
                    setOpen(false);
                    setQuery("");
                    setItems([]);
                    onSelect(item);
                  }}
                >
                  {getLabel(item)}
                </CommandItem>
              ))}

              {query && items.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">No results</p>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
