"use client";

import { useSession } from "@/hooks/useSession";

export default function AdminPage() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-4 ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {session?.user?.name || session?.user?.username}
                </span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.[0] || session?.user?.username?.[0] || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          <div className="grid gap-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Welcome back, {session?.user?.name}!
              </h2>
              <p className="text-muted-foreground mb-4">
              { `Here's what's happening with your admin panel today.` }
              </p>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">User Information</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-gray-900">{session?.user?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium text-gray-900">{session?.user?.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs text-gray-900">{session?.user?._id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Admin Access:</span>
                  <span className={session?.user?.adminPanelAccess ? "text-success font-medium" : "text-muted-foreground"}>
                    {session?.user?.adminPanelAccess ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={session?.user?.active ? "text-success font-medium" : "text-destructive font-medium"}>
                    {session?.user?.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
