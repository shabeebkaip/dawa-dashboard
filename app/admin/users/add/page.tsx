"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import { UserForm } from "@/components/forms/user-form";
import type { UserFormValues } from "@/lib/validations/user";

export default function AddUserPage() {
  const router = useRouter();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: UserFormValues) => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Failed to create user");
      }
    } catch {
      setError("An error occurred while creating the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-4 ml-12 lg:ml-0">
              <Link href="/admin/users">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <UserForm onSubmit={handleSubmit} isLoading={loading} />

            <div className="flex gap-4 justify-end mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
