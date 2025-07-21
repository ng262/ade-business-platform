import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useSide } from "@/context/SideContext";
import { Side as SideEnum } from "@shared/types/domain.types";

type SideInfo = {
  name: string;
  logo: React.ElementType;
  role: string;
  value: Side;
  disabled?: boolean;
};

export default function SideSwitcher({ sides }: { sides: SideInfo[] }) {
  const { isMobile } = useSidebar();
  const { side, setSide } = useSide();

  const activeSide = sides.find((s) => s.value === side);

  if (!activeSide) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeSide.logo />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeSide.name}</span>
                <span className="truncate text-xs">{activeSide.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Sides
            </DropdownMenuLabel>
            {sides.map((sideOption, index) => (
              <DropdownMenuItem
                key={sideOption.name}
                onClick={() => setSide(sideOption.value)}
                disabled={sideOption.disabled}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <sideOption.logo className="shrink-0" />
                </div>
                {sideOption.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
