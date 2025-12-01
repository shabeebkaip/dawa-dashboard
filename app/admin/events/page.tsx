"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Plus, Search, Filter, User, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, parseResponse } from "@/lib/api";

interface Event {
  _id: string;
  oratorId: string;
  oratorName?: string;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  locationAddress: string;
  oratorThumbnail?: string;
  locationCoordinates?: {
    type: string;
    coordinates: [number, number];
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events`);
      const data = await parseResponse<Event[]>(response);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) return { label: "Completed", color: "bg-gray-100 text-gray-700" };
    if (now >= start && now <= end) return { label: "Live", color: "bg-red-100 text-red-700" };
    return { label: "Upcoming", color: "bg-green-100 text-green-700" };
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.oratorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.locationAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingCount = events.filter((e) => getEventStatus(e.eventStartDate, e.eventEndDate).label === "Upcoming").length;
  const liveCount = events.filter((e) => getEventStatus(e.eventStartDate, e.eventEndDate).label === "Live").length;
  const completedCount = events.filter((e) => getEventStatus(e.eventStartDate, e.eventEndDate).label === "Completed").length;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <Badge variant="secondary" className="text-xs">
              {events.length} events
            </Badge>
          </div>
          <Link href="/admin/events/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-8 space-y-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, speakers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Events</p>
                  <p className="text-xl font-bold text-foreground mt-1">{events.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-xl font-bold text-foreground mt-1">{upcomingCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Live Now</p>
                  <p className="text-xl font-bold text-foreground mt-1">{liveCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-foreground mt-1">{completedCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 animate-pulse rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first event"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event.eventStartDate, event.eventEndDate);
              const eventDate = new Date(event.eventStartDate);
              return (
                <Card
                  key={event._id}
                  className="group relative shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => window.location.href = `/admin/events/${event._id}`}
                >
                  <CardContent className="p-0">
                    {/* Event Image/Header with Gradient Overlay */}
                    <div className="relative h-56 overflow-hidden">
                      {event.oratorThumbnail ? (
                        <>
                          <Image
                            src={event.oratorThumbnail}
                            alt={event.eventName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600">
                          <div className="flex items-center justify-center h-full">
                            <Calendar className="h-20 w-20 text-white/30" />
                          </div>
                        </div>
                      )}
                      
                      {/* Status Badge - Top Right */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className={`${status.color} border-0 shadow-lg backdrop-blur-sm font-semibold`}>
                          {status.label === "Live" && (
                            <span className="flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                          {status.label}
                        </Badge>
                      </div>

                      {/* Event Date Box - Bottom Left */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="bg-white rounded-xl shadow-xl p-3 min-w-[70px] text-center">
                          <div className="text-xs font-bold text-primary uppercase tracking-wider">
                            {eventDate.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                          <div className="text-3xl font-bold text-gray-900 leading-none mt-1">
                            {eventDate.getDate()}
                          </div>
                          <div className="text-xs font-medium text-gray-500 mt-1">
                            {eventDate.getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Details Section */}
                    <div className="p-5 bg-white">
                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {event.eventName}
                      </h3>
                      
                      <div className="space-y-2.5 mb-4">
                        {/* Orator */}
                        {event.oratorName && (
                          <div className="flex items-center gap-2.5 text-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-semibold text-gray-700 truncate">{event.oratorName}</span>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-start gap-2.5 text-sm">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 shrink-0 mt-0.5">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-gray-600 line-clamp-2 leading-relaxed">{event.locationAddress}</span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2.5 text-sm">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 shrink-0">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            {formatTime(event.eventStartDate)} - {formatTime(event.eventEndDate)}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/admin/events/${event._id}`;
                        }}
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredEvents.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={events.length < 10}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
