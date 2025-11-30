"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import { EventForm } from "@/components/forms/event-form";
import type { EventFormValues } from "@/lib/validations/event";

interface Speaker {
  _id: string;
  name: string;
}

export default function AddEventPage() {
  const router = useRouter();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loadingSpeakers, setLoadingSpeakers] = useState(true);

  useEffect(() => {
    if (session?.token) {
      fetchSpeakers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  const fetchSpeakers = async () => {
    try {
      setLoadingSpeakers(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/users/get_orators_general`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          limit: 100,
          page: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSpeakers(Array.isArray(data.users) ? data.users : []);
      } else {
        setSpeakers([]);
      }
    } catch (error) {
      console.error("Failed to fetch speakers:", error);
      setSpeakers([]);
    } finally {
      setLoadingSpeakers(false);
    }
  };

  const handleSubmit = async (data: EventFormValues) => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Combine date and time
      const startDate = new Date(data.eventStartDate);
      const [startHour, startMin] = data.eventStartTime.split(':').map(Number);
      startDate.setHours(startHour, startMin, 0, 0);
      
      const endDate = new Date(data.eventEndDate);
      const [endHour, endMin] = data.eventEndTime.split(':').map(Number);
      endDate.setHours(endHour, endMin, 0, 0);
      
      const response = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          oratorId: data.oratorId,
          eventName: data.eventName,
          eventStartDate: startDate.toISOString(),
          eventEndDate: endDate.toISOString(),
          locationAddress: data.locationAddress,
          locationCoordinates: {
            type: "Point",
            coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
          },
        }),
      });

      if (response.ok) {
        router.push("/admin/events");
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Failed to create event");
      }
    } catch {
      setError("An error occurred while creating the event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <Link href="/admin/events">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
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

          <EventForm 
            onSubmit={handleSubmit} 
            isLoading={loading}
            speakers={speakers}
            loadingSpeakers={loadingSpeakers}
          />

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
    </>
  );
}
