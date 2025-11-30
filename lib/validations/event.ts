import { z } from "zod";

export const eventFormSchema = z.object({
  oratorId: z.string().min(1, "Please select a speaker"),
  eventName: z.string().min(3, "Event name must be at least 3 characters").max(200, "Event name is too long"),
  eventStartDate: z.date({
    message: "Start date is required",
  }),
  eventStartTime: z.string().min(1, "Start time is required"),
  eventEndDate: z.date({
    message: "End date is required",
  }),
  eventEndTime: z.string().min(1, "End time is required"),
  locationAddress: z.string().min(5, "Location must be at least 5 characters").max(500, "Location is too long"),
  latitude: z.string().min(1, "Latitude is required").regex(/^-?\d+\.?\d*$/, "Invalid latitude format"),
  longitude: z.string().min(1, "Longitude is required").regex(/^-?\d+\.?\d*$/, "Invalid longitude format"),
}).refine((data) => {
  if (data.eventStartDate && data.eventEndDate && data.eventStartTime && data.eventEndTime) {
    const start = new Date(data.eventStartDate);
    const end = new Date(data.eventEndDate);
    const [startHour, startMin] = data.eventStartTime.split(':').map(Number);
    const [endHour, endMin] = data.eventEndTime.split(':').map(Number);
    start.setHours(startHour, startMin);
    end.setHours(endHour, endMin);
    return start < end;
  }
  return true;
}, {
  message: "End date and time must be after start date and time",
  path: ["eventEndTime"],
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
