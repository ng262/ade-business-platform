import { z } from "zod";
import { useState } from "react";
import GenericForm, { type Field } from "@/components/GenericForm";
import { updateUser } from "@/api/user";
import { register } from "@/api/auth";
import { Role, Status, Side } from "@shared/types/domain.types";
import type { ApiResponse } from "@shared/types/apiResult.types";
import { userDataSchema } from "@shared/validation";
import type { User } from "@/types";
import { toast } from "sonner";
import { emptyDefaults } from "@/lib/utils";

const userFields: Field[] = [
  {
    label: "First Name",
    name: "fname",
    type: "input",
    placeholder: "Enter first name",
  },
  {
    label: "Last Name",
    name: "lname",
    type: "input",
    placeholder: "Enter last name",
  },
  {
    label: "Username",
    name: "username",
    type: "input",
    placeholder: "Choose a username",
  },
  {
    label: "Side",
    name: "side",
    type: "select",
    placeholder: "Select a side",
    options: Object.values(Side).map((side) => ({
      label: side,
      value: side,
    })),
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    placeholder: "Select a role",
    options: Object.values(Role).map((role) => ({
      label: role,
      value: role,
    })),
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    placeholder: "Select a status",
    options: Object.values(Status).map((status) => ({
      label: status,
      value: status,
    })),
  },
];

type BaseProps = {
  setActiveStack: (prev: string[]) => string[];
};

type CreateProps = BaseProps & {
  type: "create";
};

type UpdateProps = BaseProps & {
  type: "update";
  user: User;
};

type Props = CreateProps | UpdateProps;

export default function ManageUser(props: Props) {
  const { setActiveStack, type } = props;
  const fields: Field[] = userFields.map((f) =>
    f.name === "username" ? { ...f, disabled: type === "update" } : f
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    setLoading(true);
    const result =
      type === "update"
        ? await updateUser(props.user.id, values)
        : await register(values);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Submission failed");
      return;
    }

    toast.success(type === "update" ? "User updated" : "User created");
    setActiveStack((prev) => prev.slice(0, -1));
  };

  return (
    <GenericForm
      formSchema={userDataSchema}
      fields={fields}
      submitButton={{
        label: type === "update" ? "Update User" : "Create User",
        onSubmit: onSubmit,
      }}
      defaultValues={props.user ?? emptyDefaults(userDataSchema)}
      loading={loading}
    />
  );
}
