"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, MapPin, Clock, User, Save } from "lucide-react";
import { eventFormSchema, type EventFormValues } from "@/lib/validations/event";
import { cn } from "@/lib/utils";

interface Speaker {
  _id: string;
  name: string;
}

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
  speakers: Speaker[];
  loadingSpeakers?: boolean;
}

export function EventForm({
  defaultValues,
  onSubmit,
  isEdit = false,
  isLoading = false,
  speakers,
  loadingSpeakers = false,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues || {
      oratorId: "",
      eventName: "",
      eventStartTime: "10:00",
      eventEndTime: "12:00",
      locationAddress: "",
      latitude: "",
      longitude: "",
    },
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(defaultValues?.eventStartDate);

  const onFormSubmit = async (data: EventFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Event Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="eventName">
              Event Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eventName"
              {...register("eventName")}
              placeholder="e.g., Understanding Tawheed"
              className={cn(errors.eventName && "border-red-500")}
            />
            {errors.eventName && (
              <p className="text-sm text-red-500">{errors.eventName.message}</p>
            )}
          </div>

          {/* Speaker Selection */}
          <div className="space-y-2">
            <Label>
              Speaker <span className="text-red-500">*</span>
            </Label>
            {loadingSpeakers ? (
              <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <Controller
                control={control}
                name="oratorId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.oratorId && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select a speaker..." />
                    </SelectTrigger>
                    <SelectContent>
                      {speakers.map((speaker) => (
                        <SelectItem key={speaker._id} value={speaker._id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            {speaker.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.oratorId && (
              <p className="text-sm text-red-500">{errors.oratorId.message}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="eventStartDate"
                render={({ field }) => (
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.eventStartDate && "border-red-500"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? field.value.toLocaleDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setSelectedStartDate(date);
                          setStartDateOpen(false);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.eventStartDate && (
                <p className="text-sm text-red-500">{errors.eventStartDate.message}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="eventStartTime">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="eventStartTime"
                  type="time"
                  {...register("eventStartTime")}
                  className={cn("pl-10", errors.eventStartTime && "border-red-500")}
                />
              </div>
              {errors.eventStartTime && (
                <p className="text-sm text-red-500">{errors.eventStartTime.message}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>
                End Date <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="eventEndDate"
                render={({ field }) => (
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.eventEndDate && "border-red-500"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? field.value.toLocaleDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setEndDateOpen(false);
                        }}
                        disabled={(date) => {
                          const today = new Date(new Date().setHours(0, 0, 0, 0));
                          if (date < today) return true;
                          if (selectedStartDate) {
                            const startDay = new Date(selectedStartDate.setHours(0, 0, 0, 0));
                            return date < startDay;
                          }
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.eventEndDate && (
                <p className="text-sm text-red-500">{errors.eventEndDate.message}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="eventEndTime">
                End Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="eventEndTime"
                  type="time"
                  {...register("eventEndTime")}
                  className={cn("pl-10", errors.eventEndTime && "border-red-500")}
                />
              </div>
              {errors.eventEndTime && (
                <p className="text-sm text-red-500">{errors.eventEndTime.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Location Address */}
          <div className="space-y-2">
            <Label htmlFor="locationAddress">
              Location Address <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="locationAddress"
              {...register("locationAddress")}
              placeholder="e.g., Masjid Al-Haram, Makkah"
              rows={3}
              className={cn(
                "w-full px-3 py-2 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                errors.locationAddress && "border-red-500"
              )}
            />
            {errors.locationAddress && (
              <p className="text-sm text-red-500">{errors.locationAddress.message}</p>
            )}
          </div>

          {/* Coordinates */}
          <div>
            <Label className="mb-3 block">
              Coordinates <span className="text-red-500">*</span>
            </Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-xs text-gray-600">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="text"
                  {...register("latitude")}
                  placeholder="e.g., 21.4225"
                  className={cn(errors.latitude && "border-red-500")}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-xs text-gray-600">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="text"
                  {...register("longitude")}
                  placeholder="e.g., 39.8262"
                  className={cn(errors.longitude && "border-red-500")}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude.message}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tip: You can find coordinates on Google Maps by right-clicking a location
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Event" : "Create Event")}
        </Button>
      </div>
    </form>
  );
}
