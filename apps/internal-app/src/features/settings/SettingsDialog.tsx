import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Badge, UserPlus, LogOut } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import type { User, Client } from "@shared/validation";
import { logout } from "@/api/auth";
import ManageUsers from "./ManageUsers";
import ManageUser from "./ManageUser";
import ManageClients from "./ManageClients";
import ManageClient from "./ManageClient";

const data = {
  nav: [
    { name: "Manage Users", icon: Users },
    { name: "Manage Clients", icon: Badge },
    { name: "My Account", icon: UserPlus },
  ],
};

export default function SettingsDialog() {
  const navigate = useNavigate();
  const defaultStack = [data.nav[0].name];
  const [activeStack, setActiveStack] = useState<string[]>(defaultStack);
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  function onBreadcrumbClick(selected: string) {
    const index = activeStack.lastIndexOf(selected);
    if (index !== -1) {
      setActiveStack(activeStack.slice(0, index + 1));
    }
  }

  return (
    <SidebarProvider className="items-start">
      <Sidebar collapsible="none" className="hidden md:flex">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.nav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.name === activeStack[0]}
                      onClick={() => setActiveStack([item.name])}
                    >
                      <button
                        type="button"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <div className="border-t my-2" />
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                        navigate("/login");
                      }}
                      className="flex items-center gap-2 text-red-500 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    onClick={() => setActiveStack(defaultStack)}
                    className="cursor-pointer"
                  >
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {activeStack.slice(0, -1).map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => onBreadcrumbClick(item)}
                        className="cursor-pointer"
                      >
                        {item}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeStack.at(-1)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          {activeStack.at(-1) === "Manage Users" && (
            <ManageUsers
              activeStack={activeStack}
              setActiveStack={setActiveStack}
              setUser={setUser}
            />
          )}
          {activeStack.at(-1) === "Create User" && (
            <ManageUser type="create" setActiveStack={setActiveStack} />
          )}
          {activeStack.at(-1) === "Update User" && user && (
            <ManageUser
              type="update"
              user={user}
              setActiveStack={setActiveStack}
            />
          )}

          {activeStack.at(-1) === "Manage Clients" && (
            <ManageClients
              activeStack={activeStack}
              setActiveStack={setActiveStack}
              setClient={setClient}
            />
          )}
          {activeStack.at(-1) === "Create Client" && (
            <ManageClient mode="create" setActiveStack={setActiveStack} />
          )}
          {activeStack.at(-1) === "Update Client" && client && (
            <ManageClient
              mode="update"
              client={client}
              setActiveStack={setActiveStack}
            />
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}
