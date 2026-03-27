"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useAuthStore from "@/stores/auth-store";
import GuestOnly from "@/components/auth/guest-only";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { resetSessionCheckAttempts } from "@/lib/session-check";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";
import { APP_NAME } from "@/lib/community";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    defaultValues: {
      identity: "",
      password: ""
    }
  });

  async function onSubmit(values) {
    setSubmitError("");

    try {
      const response = await api.post("/auth/login", values);
      resetSessionCheckAttempts();
      const accessToken = response.data.data.accessToken;
      const nextPath =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
      setSession({
        accessToken,
        user: response.data.data.user
      });

      const meResponse = await api.get("/auth/me");
      const user = {
        ...meResponse.data.data.user,
        profile: meResponse.data.data.profile || null
      };

      setSession({
        accessToken,
        user
      });
      router.push(nextPath || getPostAuthRedirectPath(user));
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
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
          <div className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">Faith-centered community access</div>
          <div className="editorial-title text-3xl font-black text-ink">Log in to {APP_NAME}</div>
          {submitError ? <p className="mt-3 text-sm text-accent">{submitError}</p> : null}
          <div className="mt-6 grid gap-4">
            <Input placeholder="Email or username" {...form.register("identity", { required: true })} />
            <PasswordInput placeholder="Password" {...form.register("password", { required: true })} />
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center rounded-md border border-border bg-[#f7fbff] px-3 py-2 text-sm font-medium text-accent transition hover:border-accent/30 hover:text-ink"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" loading={form.formState.isSubmitting}>
              Log in
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Need an account? <Link href="/auth/register" className="text-accent">Join now</Link>
          </p>
        </form>
      </main>
    </GuestOnly>
  );
}
