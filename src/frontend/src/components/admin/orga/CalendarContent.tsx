import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CalendarEvent } from "../../../backend";
import {
  useAddCalendarEvent,
  useDeleteCalendarEvent,
  useGetCalendarEvents,
  useUpdateCalendarEvent,
} from "../../../hooks/useQueries";

export default function CalendarContent() {
  const { data: events, isLoading } = useGetCalendarEvents();
  const addEvent = useAddCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setEditingEvent(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !date) {
      toast.error("Title and date are required");
      return;
    }

    const event: CalendarEvent = {
      id: editingEvent?.id || `event_${Date.now()}`,
      title,
      description,
      date: BigInt(new Date(date).getTime() * 1000000),
      location,
    };

    try {
      if (editingEvent) {
        await updateEvent.mutateAsync(event);
        toast.success("Event updated successfully");
      } else {
        await addEvent.mutateAsync(event);
        toast.success("Event added successfully");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save event");
      console.error(error);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(new Date(Number(event.date) / 1000000).toISOString().split("T")[0]);
    setLocation(event.location);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent.mutateAsync(id);
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error("Failed to delete event");
        console.error(error);
      }
    }
  };

  const sortedEvents = events?.sort((a, b) => Number(a.date - b.date)) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Band Calendar</h3>
          <p className="text-muted-foreground">
            Manage internal band events and schedules
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event location"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addEvent.isPending || updateEvent.isPending}
              >
                {(addEvent.isPending || updateEvent.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingEvent ? "Update" : "Add"} Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Band schedule and events</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No events scheduled
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {event.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        Number(event.date) / 1000000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
