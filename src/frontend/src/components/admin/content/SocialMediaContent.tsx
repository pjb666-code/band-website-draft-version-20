import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SocialMediaLink } from "../../../backend";
import {
  useGetSocialMediaLinks,
  useUpdateSocialMediaLinks,
} from "../../../hooks/useQueries";

export default function SocialMediaContent() {
  const { data: socialLinks, isLoading } = useGetSocialMediaLinks();
  const updateLinks = useUpdateSocialMediaLinks();
  const [links, setLinks] = useState<SocialMediaLink[]>([]);

  useEffect(() => {
    if (socialLinks) {
      setLinks(socialLinks);
    }
  }, [socialLinks]);

  const addLink = () => {
    const newLink: SocialMediaLink = {
      id: `social-${Date.now()}`,
      platform: "New Platform",
      url: "https://",
      icon: "music",
      enabled: true,
      order: BigInt(links.length),
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<SocialMediaLink>) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    );
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    [newLinks[index], newLinks[targetIndex]] = [
      newLinks[targetIndex],
      newLinks[index],
    ];
    newLinks.forEach((link, idx) => {
      link.order = BigInt(idx);
    });
    setLinks(newLinks);
  };

  const handleSave = async () => {
    try {
      await updateLinks.mutateAsync(links);
      toast.success("Social media links updated successfully");
    } catch (error) {
      toast.error("Failed to update social media links");
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
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Configure social media links displayed in the footer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link, index) => (
            <div
              key={link.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLink(index, "up")}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLink(index, "down")}
                      disabled={index === links.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{link.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={link.enabled}
                    onCheckedChange={(checked) =>
                      updateLink(link.id, { enabled: checked as boolean })
                    }
                  />
                  <Label className="text-sm">Enabled</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input
                    value={link.platform}
                    onChange={(e) =>
                      updateLink(link.id, { platform: e.target.value })
                    }
                    placeholder="e.g., Facebook, Instagram"
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
              </div>
            </div>
          ))}
          <Button onClick={addLink} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Social Media Link
          </Button>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={updateLinks.isPending}
        size="lg"
        className="w-full"
      >
        {updateLinks.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Save Changes
      </Button>
    </div>
  );
}
