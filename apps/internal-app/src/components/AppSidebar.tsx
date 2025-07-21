import { useState, useContext } from "react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import {
  Calendar,
  Home,
  Table,
  Search,
  Settings as SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useUser } from "@/context/UserContext";
import { Side } from "@shared/types/domain.types";
import NavUser from "@/components/NavUser";
import SideSwitcher from "@/components/SideSwitcher";
import SettingsDialog from "@/features/settings/SettingsDialog";
import Logo from "@/assets/logo.svg?react";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Data Sheet", url: "/data", icon: Table },
  { title: "Attendance", url: "/attendance", icon: Calendar },
];

export function AppSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();

  const sides = [
    {
      name: "ADE",
      logo: Logo,
      role: user.role,
      value: Side.One,
      disabled: user.side !== Side.Both && user.side !== Side.One,
    },
    {
      name: "ADE Too!",
      logo: Logo,
      role: user.role,
      value: Side.Two,
      disabled: user.side !== Side.Both && user.side !== Side.Two,
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SideSwitcher sides={sides} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <SettingsIcon className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                      <DialogTitle className="sr-only">Settings</DialogTitle>
                      <DialogDescription className="sr-only">
                        Settings menu
                      </DialogDescription>
                      <SettingsDialog />
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
