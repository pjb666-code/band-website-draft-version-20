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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  useGetAboutContent,
  useUpdateAboutContent,
} from "../../../hooks/useQueries";

export default function AboutContent() {
  const { data: aboutContent, isLoading } = useGetAboutContent();
  const updateContent = useUpdateAboutContent();

  const [biography, setBiography] = useState("");
  const [bandMembers, setBandMembers] = useState<string[]>([]);
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [pressKit, setPressKit] = useState<ExternalBlob | null>(null);
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    if (aboutContent) {
      setBiography(aboutContent.biography);
      setBandMembers(aboutContent.bandMembers);
      setPhotos(aboutContent.photos);
      setPressKit(aboutContent.pressKit || null);
    }
  }, [aboutContent]);

  const handlePhotoUpload = async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setPhotos([...photos, blob]);
  };

  const handlePressKitUpload = async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setPressKit(blob);
    toast.success("Press kit uploaded");
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addBandMember = () => {
    if (newMember.trim()) {
      setBandMembers([...bandMembers, newMember.trim()]);
      setNewMember("");
    }
  };

  const removeBandMember = (index: number) => {
    setBandMembers(bandMembers.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({
        biography,
        bandMembers,
        photos,
        pressKit: pressKit || undefined,
      });
      toast.success("About content updated successfully");
    } catch (error) {
      toast.error("Failed to update content");
      console.error(error);
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
      <Card>
        <CardHeader>
          <CardTitle>Band Biography</CardTitle>
          <CardDescription>Tell your story</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Write your band's biography..."
            rows={10}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Band Members</CardTitle>
          <CardDescription>List your band members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Member name"
              onKeyPress={(e) => e.key === "Enter" && addBandMember()}
            />
            <Button onClick={addBandMember}>Add</Button>
          </div>
          <div className="space-y-2">
            {bandMembers.map((member, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: member position matters
                key={index}
                className="flex items-center justify-between p-2 border border-border rounded"
              >
                <span>{member}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBandMember(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            Upload band photos (first photo will be the main image on About
            page)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handlePhotoUpload(e.target.files[0])
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: photo position matters
                key={index}
                className="relative group"
              >
                <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={photo.getDirectURL()}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Main
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Press Kit</CardTitle>
          <CardDescription>
            Upload a press kit file (PDF, ZIP, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf,.zip,.doc,.docx"
              onChange={(e) =>
                e.target.files?.[0] && handlePressKitUpload(e.target.files[0])
              }
              className="flex-1"
            />
            {pressKit && (
              <Button
                variant="outline"
                onClick={() => window.open(pressKit.getDirectURL(), "_blank")}
              >
                <Upload className="mr-2 h-4 w-4" />
                View Current
              </Button>
            )}
          </div>
          {pressKit && (
            <p className="text-sm text-muted-foreground">
              Press kit uploaded successfully
            </p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending}>
        {updateContent.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Changes
      </Button>
    </div>
  );
}
