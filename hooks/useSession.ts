"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  username: string;
  adminPanelAccess: boolean;
  active: boolean;
  author: boolean;
  featured: boolean;
  subjectCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SessionData {
  user?: UserData;
  token?: string;
  isLoggedIn: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return { session, loading, logout };
}
