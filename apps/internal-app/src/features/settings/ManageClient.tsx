import { z } from "zod";
import { useState } from "react";
import GenericForm, { type Field } from "@/components/GenericForm";
import { createClient, updateClient } from "@/api/client";
import { Status, Side } from "@shared/types/domain.types";
import { clientDataSchema } from "@shared/validation";
import type { Client } from "@/types";
import { toast } from "sonner";
import { emptyDefaults } from "@/lib/utils";

const clientFields: Field[] = [
  {
    name: "fname",
    label: "First Name",
    type: "input",
    placeholder: "Enter first name",
  },
  {
    name: "lname",
    label: "Last Name",
    type: "input",
    placeholder: "Enter last name",
  },
  {
    name: "side",
    label: "Side",
    type: "select",
    placeholder: "Select a side",
    options: Object.values(Side).map((side) => ({
      label: side,
      value: side,
    })),
  },
  {
    name: "status",
    label: "Status",
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
  client?: undefined;
};

type UpdateProps = BaseProps & {
  client: Client;
};

type Props = CreateProps | UpdateProps;

export default function ManageClient(props: Props) {
  const { setActiveStack, client } = props;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof clientDataSchema>) => {
    setLoading(true);
    const result = client
      ? await updateClient(client.id, values)
      : await createClient(values);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Submission failed");
      return;
    }

    toast.success(client ? "Client updated" : "Client created");
    setActiveStack((prev) => prev.slice(0, -1));
  };

  return (
    <GenericForm
      formSchema={clientDataSchema}
      fields={clientFields}
      defaultValues={props.client ?? emptyDefaults(clientDataSchema)}
      submitButton={{
        label: client ? "Update Client" : "Create Client",
        onSubmit,
      }}
      loading={loading}
    />
  );
}
