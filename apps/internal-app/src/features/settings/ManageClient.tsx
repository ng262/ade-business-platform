import { z } from "zod";
import { useState } from "react";
import GenericForm, { type Field } from "@/components/GenericForm";
import { createClient, updateClient } from "@/api/client";
import { Status, Side } from "@shared/types/domain.types";
import { clientDataSchema, dateSchema } from "@shared/validation";
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
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
  },
];

type BaseProps = {
  setActiveStack: (prev: string[]) => string[];
};

type CreateProps = BaseProps & {
  mode: "create";
};

type UpdateProps = BaseProps & {
  mode: "update";
  client: Client;
};

type Props = CreateProps | UpdateProps;

const createClientSchema = clientDataSchema.extend({
  startDate: dateSchema,
});
const updateClientSchema = clientDataSchema;

export default function ManageClient(props: Props) {
  const { setActiveStack, mode } = props;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setLoading(true);

    let result;
    if (mode === "update") {
      result = await updateClient(props.client.id, values);
    } else {
      const { startDate, ...clientData } = values as z.infer<
        typeof createClientSchema
      >;
      result = await createClient(clientData, startDate);
    }

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Submission failed");
      return;
    }

    toast.success(mode === "update" ? "Client updated" : "Client created");
    setActiveStack((prev) => prev.slice(0, -1));
  };

  return (
    <GenericForm
      formSchema={mode === "create" ? createClientSchema : updateClientSchema}
      fields={
        mode === "create"
          ? clientFields
          : clientFields.filter((f) => f.name !== "startDate")
      }
      defaultValues={
        mode === "create" ? emptyDefaults(createClientSchema) : props.client
      }
      submitButton={{
        label: mode === "update" ? "Update Client" : "Create Client",
        onSubmit,
      }}
      loading={loading}
    />
  );
}
