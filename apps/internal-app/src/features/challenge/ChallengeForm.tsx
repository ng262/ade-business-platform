import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { completeChallengeSchema } from "@shared/validation";
import { completeChallenge } from "@/api/auth";
import { useUser } from "@/context/UserContext";
import * as z from "zod";

const formSchema = completeChallengeSchema
  .extend({
    confirmPassword: completeChallengeSchema.shape.newPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChallengeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const state = location.state as { username: string; session: string };
  if (!state?.username || !state?.session) {
    useEffect(() => {
      navigate("/login", { replace: true });
    }, []);
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: state.username,
      session: state.session,
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormValues) {
    const result = await completeChallenge(data);
    if (!result.success) return;
    navigate("/login");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 max-w-sm mx-auto">
            <h1 className="text-xl font-bold text-center">
              Set a New Password
            </h1>

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-4 cursor-pointer">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
