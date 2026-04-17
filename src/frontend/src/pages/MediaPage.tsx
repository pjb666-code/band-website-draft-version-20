import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import { MediaType } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MusicPlayer from "../components/MusicPlayer";
import { useGetDesignConfig, useGetMediaItems } from "../hooks/useQueries";

export default function MediaPage() {
  const { data: mediaItems, isLoading } = useGetMediaItems();
  const { data: designConfig } = useGetDesignConfig();
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const accentColor = designConfig?.accentColor || "#8b5cf6";

  const albums =
    mediaItems?.filter((item) => item.mediaType === MediaType.album) || [];
  const singles =
    mediaItems?.filter((item) => item.mediaType === MediaType.single) || [];
  const videoItems =
    mediaItems?.filter(
      (item) =>
        item.mediaType === MediaType.video ||
        item.mediaType === MediaType.youtube,
    ) || [];

  const selectedMedia = mediaItems?.find((item) => item.id === selectedMediaId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading media...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-12">Media</h1>

          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="music">
              {selectedMedia ? (
                <div className="space-y-8">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedMediaId(null)}
                    className="mb-4"
                  >
                    ← Back to Music
                  </Button>
                  <MusicPlayer
                    mediaItem={selectedMedia}
                    accentColor={accentColor}
                  />
                </div>
              ) : (
                <>
                  {albums.length > 0 && (
                    <div className="mb-16">
                      <h2 className="text-3xl font-bold mb-8">Albums</h2>
                      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album) => {
                          const coverImage =
                            album.images.find((img) => img.isCover) ||
                            album.images[0];
                          return (
                            <Card
                              key={album.id}
                              className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.boxShadow =
                                  `0 6px 24px ${accentColor}25`;
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.boxShadow = "";
                              }}
                              onClick={() => setSelectedMediaId(album.id)}
                            >
                              <CardContent className="p-0">
                                <div className="aspect-square bg-muted relative group flex items-center justify-center">
                                  {coverImage && (
                                    <img
                                      src={coverImage.file.getDirectURL()}
                                      alt={album.title}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-contain p-2"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play
                                      className="h-16 w-16"
                                      style={{ color: accentColor }}
                                    />
                                  </div>
                                </div>
                                <div className="p-4">
                                  <Badge
                                    className="mb-2"
                                    style={{
                                      backgroundColor: accentColor,
                                      color: "#000",
                                    }}
                                  >
                                    album
                                  </Badge>
                                  <h3 className="font-bold text-lg mb-1">
                                    {album.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {album.description}
                                  </p>
                                  {album.streamingPlatforms &&
                                    album.streamingPlatforms.length > 0 && (
                                      <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                          Stream On
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {album.streamingPlatforms.map(
                                            (platform, idx) => (
                                              <Button
                                                // biome-ignore lint/suspicious/noArrayIndexKey: streaming order
                                                key={idx}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(
                                                    platform.url,
                                                    "_blank",
                                                  );
                                                }}
                                              >
                                                {platform.platformLabel}
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                              </Button>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  {album.price > 0 && (
                                    <p className="text-sm font-bold mt-3">
                                      €{(Number(album.price) / 100).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {singles.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold mb-8">Singles</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {singles.map((single) => {
                          const coverImage =
                            single.images.find((img) => img.isCover) ||
                            single.images[0];
                          return (
                            <Card
                              key={single.id}
                              className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.boxShadow =
                                  `0 6px 24px ${accentColor}25`;
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.boxShadow = "";
                              }}
                              onClick={() => setSelectedMediaId(single.id)}
                            >
                              <CardContent className="p-0">
                                <div className="aspect-square bg-muted relative group flex items-center justify-center">
                                  {coverImage && (
                                    <img
                                      src={coverImage.file.getDirectURL()}
                                      alt={single.title}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-contain p-2"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play
                                      className="h-16 w-16"
                                      style={{ color: accentColor }}
                                    />
                                  </div>
                                </div>
                                <div className="p-4">
                                  <Badge
                                    className="mb-2"
                                    style={{
                                      backgroundColor: accentColor,
                                      color: "#000",
                                    }}
                                  >
                                    single
                                  </Badge>
                                  <h3 className="font-bold text-lg mb-1">
                                    {single.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {single.description}
                                  </p>
                                  {single.streamingPlatforms &&
                                    single.streamingPlatforms.length > 0 && (
                                      <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                                          Stream On
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {single.streamingPlatforms.map(
                                            (platform, idx) => (
                                              <Button
                                                // biome-ignore lint/suspicious/noArrayIndexKey: streaming order
                                                key={idx}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(
                                                    platform.url,
                                                    "_blank",
                                                  );
                                                }}
                                              >
                                                {platform.platformLabel}
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                              </Button>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  {single.price > 0 && (
                                    <p className="text-sm font-bold mt-3">
                                      €{(Number(single.price) / 100).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {albums.length === 0 && singles.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground text-lg">
                        No music available yet
                      </p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="videos">
              {videoItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    No videos available yet
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {videoItems.map((item) => {
                    const videoUrl = item.audioFiles[0]?.file.getDirectURL();
                    const youtubeUrl = item.youtubeUrl;

                    return (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-xl mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                          </p>
                          {youtubeUrl && (
                            <div className="aspect-video">
                              <iframe
                                title="Music video"
                                className="w-full h-full rounded-lg"
                                src={youtubeUrl.replace("watch?v=", "embed/")}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          {videoUrl && !youtubeUrl && (
                            <video
                              className="w-full rounded-lg"
                              controls
                              src={videoUrl}
                            >
                              <track kind="captions" />
                            </video>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
