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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type AudioFile,
  ExternalBlob,
  type ImageFile,
  type MediaItem,
  MediaType,
  type StreamingPlatform,
} from "../../backend";
import {
  useAddMediaItem,
  useDeleteMediaItem,
  useGetMediaItems,
  useUpdateMediaItem,
} from "../../hooks/useQueries";

export default function MediaTab() {
  const { data: mediaItems, isLoading } = useGetMediaItems();
  const addMedia = useAddMediaItem();
  const updateMedia = useUpdateMediaItem();
  const deleteMedia = useDeleteMediaItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.single);
  const [price, setPrice] = useState("0");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [streamingPlatforms, setStreamingPlatforms] = useState<
    StreamingPlatform[]
  >([]);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaType(MediaType.single);
    setPrice("0");
    setYoutubeUrl("");
    setAudioFiles([]);
    setImages([]);
    setStreamingPlatforms([]);
    setEditingItem(null);
  };

  const handleAudioUpload = async (uploadedFile: File) => {
    setUploadingAudio(true);
    try {
      const bytes = new Uint8Array(await uploadedFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);

      const audioFile: AudioFile = {
        id: `audio_${Date.now()}_${Math.random()}`,
        title: uploadedFile.name.replace(/\.[^/.]+$/, ""),
        file: blob,
        duration: BigInt(0),
        trackNumber: BigInt(audioFiles.length + 1),
      };

      setAudioFiles([...audioFiles, audioFile]);
      toast.success("Audio file added");
    } catch (error) {
      toast.error("Failed to upload audio file");
      console.error(error);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageUpload = async (uploadedFile: File) => {
    setUploadingImage(true);
    try {
      const bytes = new Uint8Array(await uploadedFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);

      const imageFile: ImageFile = {
        id: `image_${Date.now()}_${Math.random()}`,
        file: blob,
        isCover: images.length === 0,
      };

      setImages([...images, imageFile]);
      toast.success("Image added");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeAudioFile = (id: string) => {
    setAudioFiles(audioFiles.filter((f) => f.id !== id));
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const toggleCoverImage = (id: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        isCover: img.id === id,
      })),
    );
  };

  const addStreamingPlatform = () => {
    setStreamingPlatforms([
      ...streamingPlatforms,
      {
        platform: "spotify",
        platformLabel: "Spotify",
        url: "",
      },
    ]);
  };

  const updateStreamingPlatform = (
    index: number,
    field: keyof StreamingPlatform,
    value: string,
  ) => {
    const updated = [...streamingPlatforms];
    updated[index] = { ...updated[index], [field]: value };
    setStreamingPlatforms(updated);
  };

  const removeStreamingPlatform = (index: number) => {
    setStreamingPlatforms(streamingPlatforms.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (
      mediaType !== MediaType.youtube &&
      mediaType !== MediaType.video &&
      audioFiles.length === 0
    ) {
      toast.error("At least one audio file is required");
      return;
    }

    const item: MediaItem = {
      id: editingItem?.id || `media_${Date.now()}`,
      title,
      description,
      mediaType,
      audioFiles,
      images,
      youtubeUrl: youtubeUrl || undefined,
      price: BigInt(Math.round(Number.parseFloat(price) * 100)),
      streamingPlatforms,
      createdAt: editingItem?.createdAt || BigInt(Date.now() * 1000000),
    };

    try {
      if (editingItem) {
        await updateMedia.mutateAsync(item);
        toast.success("Media updated successfully");
      } else {
        await addMedia.mutateAsync(item);
        toast.success("Media added successfully");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save media");
      console.error(error);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setMediaType(item.mediaType);
    setPrice((Number(item.price) / 100).toFixed(2));
    setYoutubeUrl(item.youtubeUrl || "");
    setAudioFiles(item.audioFiles || []);
    setImages(item.images || []);
    setStreamingPlatforms(item.streamingPlatforms || []);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this media item?")) {
      try {
        await deleteMedia.mutateAsync(id);
        toast.success("Media deleted successfully");
      } catch (error) {
        toast.error("Failed to delete media");
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
          <h2 className="text-2xl font-bold">Media Management</h2>
          <p className="text-muted-foreground">
            Manage singles, albums, and video content
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
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Media" : "Add New Media"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Media title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Media description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={mediaType}
                    onValueChange={(value) => setMediaType(value as MediaType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MediaType.single}>Single</SelectItem>
                      <SelectItem value={MediaType.album}>Album</SelectItem>
                      <SelectItem value={MediaType.video}>Video</SelectItem>
                      <SelectItem value={MediaType.youtube}>YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Streaming Platforms */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Streaming Platforms</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStreamingPlatform}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Platform
                  </Button>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  {streamingPlatforms.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No streaming platforms added
                    </p>
                  ) : (
                    streamingPlatforms.map((platform, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: position determines order
                        key={index}
                        className="flex gap-2 items-end p-3 bg-muted rounded"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Platform</Label>
                              <Select
                                value={platform.platform}
                                onValueChange={(value) =>
                                  updateStreamingPlatform(
                                    index,
                                    "platform",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="spotify">
                                    Spotify
                                  </SelectItem>
                                  <SelectItem value="apple">
                                    Apple Music
                                  </SelectItem>
                                  <SelectItem value="amazon">
                                    Amazon Music
                                  </SelectItem>
                                  <SelectItem value="youtube">
                                    YouTube Music
                                  </SelectItem>
                                  <SelectItem value="bandcamp">
                                    Bandcamp
                                  </SelectItem>
                                  <SelectItem value="soundcloud">
                                    SoundCloud
                                  </SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={platform.platformLabel}
                                onChange={(e) =>
                                  updateStreamingPlatform(
                                    index,
                                    "platformLabel",
                                    e.target.value,
                                  )
                                }
                                placeholder="Display name"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">URL</Label>
                            <Input
                              value={platform.url}
                              onChange={(e) =>
                                updateStreamingPlatform(
                                  index,
                                  "url",
                                  e.target.value,
                                )
                              }
                              placeholder="https://..."
                              className="h-9"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStreamingPlatform(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {mediaType === MediaType.youtube ? (
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              ) : (
                <>
                  {/* Audio Files */}
                  {(mediaType === MediaType.single ||
                    mediaType === MediaType.album) && (
                    <div className="space-y-2">
                      <Label>
                        Audio Files{" "}
                        {mediaType === MediaType.album && "(Tracks)"}
                      </Label>
                      <div className="border border-border rounded-lg p-4 space-y-2">
                        {audioFiles.map((audio, index) => (
                          <div
                            key={audio.id}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <div className="flex-1">
                              <Input
                                value={audio.title}
                                onChange={(e) => {
                                  const updated = [...audioFiles];
                                  updated[index] = {
                                    ...audio,
                                    title: e.target.value,
                                  };
                                  setAudioFiles(updated);
                                }}
                                placeholder="Track title"
                                className="mb-1"
                              />
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={Number(audio.trackNumber)}
                                  onChange={(e) => {
                                    const updated = [...audioFiles];
                                    updated[index] = {
                                      ...audio,
                                      trackNumber: BigInt(e.target.value),
                                    };
                                    setAudioFiles(updated);
                                  }}
                                  placeholder="Track #"
                                  className="w-24"
                                />
                                <Input
                                  type="number"
                                  value={Number(audio.duration)}
                                  onChange={(e) => {
                                    const updated = [...audioFiles];
                                    updated[index] = {
                                      ...audio,
                                      duration: BigInt(e.target.value),
                                    };
                                    setAudioFiles(updated);
                                  }}
                                  placeholder="Duration (s)"
                                  className="w-32"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAudioFile(audio.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div>
                          <Input
                            type="file"
                            accept="audio/*"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleAudioUpload(e.target.files[0])
                            }
                            disabled={uploadingAudio}
                          />
                          {uploadingAudio && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Uploading...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="border border-border rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.file.getDirectURL()}
                              alt="Preview"
                              className="w-full aspect-square object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleCoverImage(image.id)}
                              >
                                {image.isCover ? "Cover" : "Set Cover"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleImageUpload(e.target.files[0])
                          }
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Uploading...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={handleSubmit}
                disabled={addMedia.isPending || updateMedia.isPending}
              >
                {(addMedia.isPending || updateMedia.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingItem ? "Update" : "Add"} Media
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Items</CardTitle>
          <CardDescription>All uploaded media content</CardDescription>
        </CardHeader>
        <CardContent>
          {!mediaItems || mediaItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No media items yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tracks</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="capitalize">
                      {item.mediaType}
                    </TableCell>
                    <TableCell>{item.audioFiles?.length || 0}</TableCell>
                    <TableCell>{item.images?.length || 0}</TableCell>
                    <TableCell>
                      {item.streamingPlatforms?.length || 0}
                    </TableCell>
                    <TableCell>
                      €{(Number(item.price) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
