import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type BookingConfig,
  type BookingFile,
  type BookingLink,
  ExternalBlob,
} from "../../../backend";
import {
  useGetBookingConfig,
  useUpdateBookingConfig,
} from "../../../hooks/useQueries";

export default function BookingContent() {
  const { data: bookingConfig, isLoading } = useGetBookingConfig();
  const updateConfig = useUpdateBookingConfig();

  const [email, setEmail] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [files, setFiles] = useState<BookingFile[]>([]);
  const [links, setLinks] = useState<BookingLink[]>([]);

  useEffect(() => {
    if (bookingConfig) {
      setEmail(bookingConfig.email);
      setCallToAction(bookingConfig.callToAction);
      setFiles(bookingConfig.files || []);
      setLinks(bookingConfig.links || []);
    }
  }, [bookingConfig]);

  const handleFileUpload = async (file: File, fileType: string) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);

    const newFile: BookingFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      file: blob,
      fileType,
    };

    setFiles(files.filter((f) => f.fileType !== fileType).concat(newFile));
  };

  const removeFile = (fileType: string) => {
    setFiles(files.filter((f) => f.fileType !== fileType));
  };

  const addLink = () => {
    const newLink: BookingLink = {
      id: `link-${Date.now()}`,
      linkLabel: "New Link",
      url: "",
      type: "music",
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<BookingLink>) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    );
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleSave = async () => {
    try {
      const config: BookingConfig = {
        email,
        callToAction,
        files,
        links,
      };
      await updateConfig.mutateAsync(config);
      toast.success("Booking configuration updated");
    } catch (error) {
      toast.error("Failed to update booking configuration");
      console.error(error);
    }
  };

  const pressKitFile = files.find((f) => f.fileType === "pressKit");
  const techRiderFile = files.find((f) => f.fileType === "techRider");
  const hospitalityRiderFile = files.find(
    (f) => f.fileType === "hospitalityRider",
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Page Configuration</CardTitle>
          <CardDescription>Customize the booking page content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Booking Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="booking@oneiric.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call-to-Action Text</Label>
            <Input
              id="cta"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="Book Us Now"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Downloadable Files</CardTitle>
          <CardDescription>
            Upload press kit, tech rider, and hospitality rider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Press Kit</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "pressKit")
                }
              />
              {pressKitFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("pressKit")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {pressKitFile && (
              <p className="text-sm text-muted-foreground">
                Current: {pressKitFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tech Rider</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "techRider")
                }
              />
              {techRiderFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("techRider")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {techRiderFile && (
              <p className="text-sm text-muted-foreground">
                Current: {techRiderFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Hospitality Rider</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "hospitalityRider")
                }
              />
              {hospitalityRiderFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("hospitalityRider")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {hospitalityRiderFile && (
              <p className="text-sm text-muted-foreground">
                Current: {hospitalityRiderFile.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Music & Video Links</CardTitle>
          <CardDescription>Add links to your music and videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Link</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={link.linkLabel}
                    onChange={(e) =>
                      updateLink(link.id, { linkLabel: e.target.value })
                    }
                    placeholder="e.g., Spotify"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateLink(link.id, { url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={link.type}
                    onValueChange={(value) =>
                      updateLink(link.id, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addLink} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={updateConfig.isPending}
        size="lg"
        className="w-full"
      >
        {updateConfig.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Save All Changes
      </Button>
    </div>
  );
}
