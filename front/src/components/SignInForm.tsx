"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 6 characters.",
  }),
});

export const SignInForm = () => {
  const [requestError, setRequestError] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const signInFetch = async () => {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.status >= 400) {
        setRequestError((await response.json()).error);
        return false;
      }
      return true;
    };

    const refreshTokenFetch = async () => {
      const response = await fetch("/api/refresh-token", {
        method: "GET",
      });

      if (response.status >= 400) {
        setRequestError((await response.json()).error);
      }

      if (response.status >= 200 && response.status <= 300) {
        router.push("/");
        return;
      }
    };

    const isValidAccount = await signInFetch();
    if (!isValidAccount) return;

    await refreshTokenFetch();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  return (
    <div className="w-[500px] rounded-lg bg-slate-900 p-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <h1 className="font-bold text-2xl">Sign In</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Type your email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Type your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
          {requestError && (
            <p className="text-center text-[#FF80AB]">{requestError}</p>
          )}
          <p className="w-full flex items-center justify-center gap-1">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-slate-400 hover:text-slate-700"
              onClick={() => router.push("/auth/sign-up")}
            >
              Create Now
            </button>
          </p>
        </form>
      </Form>
    </div>
  );
};
