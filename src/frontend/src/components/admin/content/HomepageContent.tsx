import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaType } from "../../../backend";
import {
  useGetHomepageConfig,
  useGetMediaItems,
  useGetProducts,
  useGetShows,
  useUpdateHomepageConfig,
} from "../../../hooks/useQueries";

export default function HomepageContent() {
  const { data: homepageConfig, isLoading } = useGetHomepageConfig();
  const { data: mediaItems } = useGetMediaItems();
  const { data: shows } = useGetShows();
  const { data: products } = useGetProducts();
  const updateConfig = useUpdateHomepageConfig();

  const [latestReleaseId, setLatestReleaseId] = useState<string | undefined>(
    undefined,
  );
  const [autoUpcomingShows, setAutoUpcomingShows] = useState(true);
  const [selectedShowIds, setSelectedShowIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (homepageConfig) {
      setLatestReleaseId(homepageConfig.latestReleaseId || undefined);
      setAutoUpcomingShows(homepageConfig.autoUpcomingShows);
      setSelectedShowIds(homepageConfig.upcomingShowIds);
      setSelectedProductIds(homepageConfig.featuredProductIds);
    }
  }, [homepageConfig]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        latestReleaseId: latestReleaseId || undefined,
        autoUpcomingShows,
        upcomingShowIds: autoUpcomingShows ? [] : selectedShowIds,
        featuredProductIds: selectedProductIds,
      });
      toast.success("Homepage configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update homepage configuration");
      console.error(error);
    }
  };

  const toggleShowSelection = (showId: string) => {
    setSelectedShowIds((prev) =>
      prev.includes(showId)
        ? prev.filter((id) => id !== showId)
        : [...prev, showId],
    );
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // Filter music releases (singles and albums)
  const musicReleases =
    mediaItems?.filter(
      (item) =>
        item.mediaType === MediaType.single ||
        item.mediaType === MediaType.album,
    ) || [];

  // Get future shows
  const now = Date.now() * 1000000; // Convert to nanoseconds
  const futureShows = shows?.filter((show) => Number(show.date) > now) || [];

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
          <CardTitle>Latest Release</CardTitle>
          <CardDescription>
            Select which release appears as "Latest Release" on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latest-release">Select Release</Label>
            <Select
              value={latestReleaseId || "none"}
              onValueChange={(value) =>
                setLatestReleaseId(value === "none" ? undefined : value)
              }
            >
              <SelectTrigger id="latest-release">
                <SelectValue placeholder="Select a release" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {musicReleases.map((release) => (
                  <SelectItem key={release.id} value={release.id}>
                    {release.title} ({release.mediaType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shows</CardTitle>
          <CardDescription>
            Configure which shows appear on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-shows">
                Automatically show next 3 upcoming shows
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the homepage will automatically display the next 3
                future shows
              </p>
            </div>
            <Switch
              id="auto-shows"
              checked={autoUpcomingShows}
              onCheckedChange={setAutoUpcomingShows}
            />
          </div>

          {!autoUpcomingShows && (
            <div className="space-y-2 pt-4 border-t">
              <Label>Manually Select Shows</Label>
              {futureShows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming shows available
                </p>
              ) : (
                <div className="space-y-2">
                  {futureShows.map((show) => (
                    <div key={show.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`show-${show.id}`}
                        checked={selectedShowIds.includes(show.id)}
                        onCheckedChange={() => toggleShowSelection(show.id)}
                      />
                      <Label
                        htmlFor={`show-${show.id}`}
                        className="font-normal cursor-pointer flex-1"
                      >
                        {show.title} -{" "}
                        {new Date(
                          Number(show.date) / 1000000,
                        ).toLocaleDateString("en-US")}{" "}
                        - {show.venue}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>
            Select which products appear in the "Featured Products" section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!products || products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products available
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProductIds.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                  <Label
                    htmlFor={`product-${product.id}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {product.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
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
        Save Homepage Configuration
      </Button>
    </div>
  );
}
