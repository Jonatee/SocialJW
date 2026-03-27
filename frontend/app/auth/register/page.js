"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import GuestOnly from "@/components/auth/guest-only";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { APP_NAME } from "@/lib/community";

export default function RegisterPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      displayName: "",
      congregationDisplay: "",
      gender: "male",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values) {
    setSubmitError("");

    try {
      await api.post("/auth/register", {
        username: values.username,
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        congregationDisplay: values.congregationDisplay,
        gender: values.gender
      });
      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      const details = error.response?.data?.error || null;

      setSubmitError(message);

      if (details?.code === "email_not_verified" && details?.email) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(details.email)}`);
      }
    }
  }

  return (
    <GuestOnly>
      <main className="subtle-grid mx-auto flex min-h-screen items-center justify-center px-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="panel w-full max-w-md p-8">
          <div className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">Join a calm spiritual community</div>
          <div className="editorial-title text-3xl font-black text-ink">Create your {APP_NAME} account</div>
          {submitError ? <p className="mt-3 text-sm text-accent">{submitError}</p> : null}
          <div className="mt-6 grid gap-4">
            <Input placeholder="Display name (optional)" {...form.register("displayName")} />
            <Input placeholder="Username" {...form.register("username", { required: true })} />
            <Input type="email" placeholder="Email" {...form.register("email", { required: true })} />
            <Input placeholder="Congregation display (optional)" {...form.register("congregationDisplay")} />
            <select
              {...form.register("gender", { required: true })}
              className="flex h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
            >
              <option value="male">Brother</option>
              <option value="female">Sister</option>
            </select>
            <PasswordInput placeholder="Password" {...form.register("password", { required: true })} />
            <PasswordInput
              placeholder="Confirm password"
              {...form.register("confirmPassword", {
                required: true,
                validate: (value) => value === form.getValues("password") || "Passwords do not match"
              })}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-xs text-accent">{form.formState.errors.confirmPassword.message}</p>
            ) : null}
            <Button type="submit" loading={form.formState.isSubmitting}>
              Join Community
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Already have an account? <Link href="/auth/login" className="text-accent">Log in</Link>
          </p>
        </form>
      </main>
    </GuestOnly>
  );
}
