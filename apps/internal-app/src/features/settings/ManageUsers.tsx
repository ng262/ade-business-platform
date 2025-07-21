import { useEffect, useMemo, useState } from "react";
import { ManageTable } from "@/components/ManageTable";
import { getUsers, deactivateUsers, deleteUsers } from "@/api/user";
import { resetPassword } from "@/api/auth";
import type { User, UserList, DeleteUsers } from "@shared/validation";
import type { ApiResponse } from "@shared/types/apiResult.types";
import { withToast } from "@/lib/utils";

const columns = [
  { label: "First Name", key: "fname" },
  { label: "Last Name", key: "lname" },
  { label: "Username", key: "username" },
  { label: "Side", key: "side" },
  { label: "Role", key: "role" },
];

type Props = {
  activeStack: string[];
  setActiveStack: React.Dispatch<React.SetStateAction<string[]>>;
  setUser: (user: User) => void;
};

export default function ManageUsers({
  activeStack,
  setActiveStack,
  setUser,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set());
  const [loading, setLoading] = useState(true);

  const selectedArray = [...selectedUsers];
  const selectedCount = selectedArray.length;

  const fetchUsers = async () => {
    setLoading(true);
    const result: ApiResponse<UserList> = await getUsers();
    setUsers(result.success ? result.data : []);
    setSelectedUsers(new Set());
    setLoading(false);
  };

  const toggle = (row: User) =>
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.has(row) ? next.delete(row) : next.add(row);
      return next;
    });

  useEffect(() => {
    void fetchUsers();
  }, []);

  const actions = useMemo(
    () => [
      {
        label: "Update User",
        disabled: selectedCount !== 1,
        onClick: () => {
          setUser(selectedArray[0]);
          setActiveStack((stk) => [...stk, "Update User"]);
        },
      },
      {
        label: "Reset Password",
        disabled: selectedCount !== 1,
        onClick: async () => {
          await withToast(
            () => resetPassword(selectedArray[0].username),
            "Password reset",
            "Failed to reset password"
          );
        },
        alert: {
          title: "Reset Password",
          description: `This will reset the password for "${selectedArray[0]?.username}" to a temporary password. They will need to change it on their next login.`,
          confirm: "Reset Password",
          cancel: "Cancel",
        },
      },
      {
        label: selectedCount === 1 ? "Delete User" : "Delete Users",
        disabled: selectedCount === 0,
        onClick: async () => {
          const payload: DeleteUsers = selectedArray.map((u) => ({
            id: u.id,
            username: u.username,
          }));
          const single = selectedCount === 1;
          const ok = await withToast(
            () => deleteUsers(payload),
            single ? "User deleted" : "Users deleted",
            single ? "Failed to delete user" : "Failed to delete users"
          );
          if (ok) await fetchUsers();
        },
        alert: (() => {
          const single = selectedCount === 1;
          const username = single ? selectedArray[0].username : null;
          return {
            title: single ? "Delete User" : "Delete Users",
            description: single
              ? `This will permanently delete the user "${username}".`
              : `This will permanently delete ${selectedCount} users.`,
            confirm: single ? "Delete User" : "Delete Users",
            cancel: "Cancel",
          };
        })(),
      },
    ],
    [selectedArray, selectedCount, setUser, setActiveStack]
  );

  return (
    <ManageTable<User>
      columns={columns}
      data={users}
      selected={selectedUsers}
      onToggle={toggle}
      actions={actions}
      createButton={{
        label: "Create User",
        onClick: () => setActiveStack((stk) => [...stk, "Create User"]),
      }}
      loading={loading}
    />
  );
}
