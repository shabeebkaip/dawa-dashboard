"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Edit, 
  Trash2,
  User,
  Globe,
  Phone,
  Mail,
  Users,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, parseResponse } from "@/lib/api";
import { useParams } from "next/navigation";

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
  description?: string;
  eventType?: string;
  maxAttendees?: number;
  registeredAttendees?: number;
  contactEmail?: string;
  contactPhone?: string;
  eventUrl?: string;
  active?: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEventDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${params.id}`);
      const data = await parseResponse<Event>(response);
      setEvent(data);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) {
      return { 
        label: "Completed", 
        color: "bg-gray-100 text-gray-700",
        icon: CheckCircle2
      };
    }
    if (now >= start && now <= end) {
      return { 
        label: "Live Now", 
        color: "bg-red-100 text-red-700",
        icon: AlertCircle
      };
    }
    return { 
      label: "Upcoming", 
      color: "bg-green-100 text-green-700",
      icon: Calendar
    };
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.abs(end.getTime() - start.getTime()) / 36e5;
    
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${Math.round(hours)} hours`;
    } else {
      const days = Math.round(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 lg:px-8">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="h-96 bg-white rounded-lg animate-pulse" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-white rounded-lg animate-pulse" />
              <div className="h-48 bg-white rounded-lg animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-white rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              The event you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/admin/events">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getEventStatus(event.eventStartDate, event.eventEndDate);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <Link href="/admin/events">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
              <p className="text-sm text-muted-foreground">ID: {event._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/events/edit/${event._id}`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden border shadow-sm">
          <div className="relative h-64">
            {event.oratorThumbnail ? (
              <>
                <Image
                  src={event.oratorThumbnail}
                  alt={event.eventName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-primary/80 to-primary" />
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge className={`${status.color} text-xs`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {event.eventName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2">
                {event.oratorName && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="h-4 w-4" />
                    <span>{event.oratorName}</span>
                  </div>
                )}
                
                {event.featured && (
                  <Badge variant="secondary" className="text-xs">
                    Featured
                  </Badge>
                )}
                
                {event.active !== undefined && (
                  <Badge variant={event.active ? "default" : "secondary"} className="text-xs">
                    {event.active ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Description */}
            {event.description && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Date & Time Details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Starts</p>
                    <p className="font-medium text-gray-900">{formatDateTime(event.eventStartDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ends</p>
                    <p className="font-medium text-gray-900">{formatDateTime(event.eventEndDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">
                    Duration: <span className="font-semibold text-gray-900">
                      {calculateDuration(event.eventStartDate, event.eventEndDate)}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.locationAddress}</p>
                    {event.locationCoordinates && (
                      <p className="text-xs text-gray-500 mt-1">
                        {event.locationCoordinates.coordinates[1]}, {event.locationCoordinates.coordinates[0]}
                      </p>
                    )}
                  </div>
                </div>

                {event.locationCoordinates && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-xs"
                    onClick={() => {
                      const [lng, lat] = event.locationCoordinates!.coordinates;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on Maps
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-4">
            {/* Contact Information */}
            {(event.contactEmail || event.contactPhone || event.eventUrl) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {event.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-gray-500" />
                      <a href={`mailto:${event.contactEmail}`} className="text-primary hover:underline truncate">
                        {event.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {event.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-gray-500" />
                      <a href={`tel:${event.contactPhone}`} className="text-primary hover:underline">
                        {event.contactPhone}
                      </a>
                    </div>
                  )}
                  
                  {event.eventUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3.5 w-3.5 text-gray-500" />
                      <a 
                        href={event.eventUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Attendance Info */}
            {(event.maxAttendees || event.registeredAttendees !== undefined) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.registeredAttendees !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">Registered</span>
                        <span className="font-semibold text-gray-900">
                          {event.registeredAttendees}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                        </span>
                      </div>
                      {event.maxAttendees && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min((event.registeredAttendees / event.maxAttendees) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {event.maxAttendees && (
                    <div className="text-xs">
                      <span className="text-gray-600">Capacity: </span>
                      <span className="font-semibold text-gray-900">{event.maxAttendees}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tags & Event Type Combined */}
            {((event.tags && event.tags.length > 0) || event.eventType) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.eventType && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Type</p>
                      <Badge variant="outline" className="text-xs">
                        {event.eventType}
                      </Badge>
                    </div>
                  )}
                  
                  {event.tags && event.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {event.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium text-gray-900">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {event.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated</span>
                    <span className="font-medium text-gray-900">
                      {new Date(event.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <span className="text-gray-500">ID: </span>
                  <code className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {event._id}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
