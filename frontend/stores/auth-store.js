"use client";

import { create } from "zustand";
import { SESSION_CHECK_KEY, SESSION_STORAGE_KEY } from "@/lib/community";

const useAuthStore = create((set) => ({
  accessToken: null,
  currentUser: null,
  setSession: ({ accessToken, user }) => {
    if (typeof window !== "undefined" && accessToken) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, accessToken);
    }

    set({
      accessToken: accessToken || null,
      currentUser: user || null
    });
  },
  clearSession: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_CHECK_KEY);
    }

    set({
      accessToken: null,
      currentUser: null
    });
  }
}));

export default useAuthStore;
