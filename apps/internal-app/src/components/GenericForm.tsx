import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodSchema } from "zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type BaseField = {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
};

export type InputField = BaseField & {
  type: "input";
};

export type SelectField = BaseField & {
  type: "select";
  options: { label: string; value: string }[];
};

export type Field = InputField | SelectField;

type Props<T extends ZodSchema> = {
  formSchema: T;
  fields: Field[];
  submitButton: {
    label: string;
    onSubmit: (values: z.infer<T>) => void;
  };
  loading: boolean;
  defaultValues?: z.infer<T>;
};

export default function GenericForm<T extends ZodSchema>({
  formSchema,
  fields,
  submitButton,
  loading,
  defaultValues,
}: Props<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? ({} as z.infer<T>),
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitButton.onSubmit)}
        className="space-y-4"
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === "input" ? (
                    <Input
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      {...formField}
                    />
                  ) : (
                    <Select
                      value={formField.value}
                      onValueChange={formField.onChange}
                      disabled={field.disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className="cursor-pointer" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButton.label}
        </Button>
      </form>
    </Form>
  );
}
