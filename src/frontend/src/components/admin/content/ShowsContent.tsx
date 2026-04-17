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
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Show } from "../../../backend";
import { ExternalBlob } from "../../../backend";
import {
  useAddShow,
  useDeleteShow,
  useGetShows,
  useUpdateShow,
} from "../../../hooks/useQueries";

export default function ShowsContent() {
  const { data: shows, isLoading } = useGetShows();
  const addShow = useAddShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [flyer, setFlyer] = useState<ExternalBlob | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setVenue("");
    setLocation("");
    setTicketLink("");
    setStatus("upcoming");
    setFlyer(null);
    setFlyerPreview(null);
    setEditingShow(null);
  };

  const handleFlyerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingFlyer(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      setFlyer(blob);
      setFlyerPreview(URL.createObjectURL(file));
      toast.success("Flyer uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload flyer");
      console.error(error);
    } finally {
      setUploadingFlyer(false);
    }
  };

  const handleRemoveFlyer = () => {
    setFlyer(null);
    setFlyerPreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !date || !venue.trim() || !location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const show: Show = {
      id: editingShow?.id || `show_${Date.now()}`,
      title,
      date: BigInt(new Date(date).getTime() * 1000000),
      venue,
      location,
      ticketLink,
      status,
      flyer: flyer || undefined,
    };

    try {
      if (editingShow) {
        await updateShow.mutateAsync(show);
        toast.success("Show updated successfully");
      } else {
        await addShow.mutateAsync(show);
        toast.success("Show added successfully");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save show");
      console.error(error);
    }
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setTitle(show.title);
    setDate(new Date(Number(show.date) / 1000000).toISOString().split("T")[0]);
    setVenue(show.venue);
    setLocation(show.location);
    setTicketLink(show.ticketLink);
    setStatus(show.status);
    if (show.flyer) {
      setFlyer(show.flyer);
      setFlyerPreview(show.flyer.getDirectURL());
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this show?")) {
      try {
        await deleteShow.mutateAsync(id);
        toast.success("Show deleted successfully");
      } catch (error) {
        toast.error("Failed to delete show");
        console.error(error);
      }
    }
  };

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
          <h3 className="text-xl font-bold">Tour Dates</h3>
          <p className="text-muted-foreground">
            Manage upcoming shows and tour dates
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
              Add Show
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingShow ? "Edit Show" : "Add New Show"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Show title"
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
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Venue name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketLink">Ticket Link</Label>
                <Input
                  id="ticketLink"
                  value={ticketLink}
                  onChange={(e) => setTicketLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              {/* Flyer Upload */}
              <div className="space-y-2">
                <Label>Show Flyer (Optional)</Label>
                {flyerPreview ? (
                  <div className="relative">
                    <div className="relative w-full h-64 flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
                      <img
                        src={flyerPreview}
                        alt="Flyer preview"
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFlyer}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Input
                      id="flyer"
                      type="file"
                      accept="image/*"
                      onChange={handleFlyerUpload}
                      disabled={uploadingFlyer}
                      className="hidden"
                    />
                    <Label htmlFor="flyer" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploadingFlyer
                            ? "Uploading..."
                            : "Click to upload flyer image"}
                        </p>
                      </div>
                    </Label>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={addShow.isPending || updateShow.isPending}
              >
                {(addShow.isPending || updateShow.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingShow ? "Update" : "Add"} Show
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shows</CardTitle>
          <CardDescription>All scheduled shows</CardDescription>
        </CardHeader>
        <CardContent>
          {!shows || shows.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No shows scheduled
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Flyer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shows.map((show) => (
                  <TableRow key={show.id}>
                    <TableCell className="font-medium">{show.title}</TableCell>
                    <TableCell>
                      {new Date(
                        Number(show.date) / 1000000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{show.venue}</TableCell>
                    <TableCell>{show.location}</TableCell>
                    <TableCell>
                      {show.flyer ? (
                        <span className="text-xs text-muted-foreground">
                          ✓ Uploaded
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(show)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(show.id)}
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
