import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
import type { Credentials, LoginResult } from "@shared/validation";
import { credentialsSchema } from "@shared/validation";
import { isChallenge } from "@shared/utils/auth.util";
import type { ClientResult } from "@shared/types/apiResult.types";
import { login } from "@/api/auth";
import { useUser } from "@/context/UserContext";
import Logo from "@/assets/logo.svg?react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { username: "", password: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, error]);

  async function onSubmit(creds: Credentials) {
    setLoading(true);
    const result: ApiResponse<User> = await login(creds);
    setLoading(false);
    if (!result.success) {
      setError(result.message ?? "Login failed.");
      return;
    }
    if (isChallenge(result.data)) {
      navigate("/challenge", { state: result.data });
      return;
    }
    setUser(result.data);
    navigate("/");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-12 items-center justify-center rounded-md">
                  <Logo />
                </div>
                <span className="sr-only">ADE Inc.</span>
              </a>
              <h1 className="text-xl font-bold">Adult Day Experiences</h1>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Contact admin
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        type="text"
                        placeholder="e.g. johndoe"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
