import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetDesignConfig, useGetShows } from "../hooks/useQueries";

export default function ShowsPage() {
  const { data: shows, isLoading } = useGetShows();
  const { data: designConfig } = useGetDesignConfig();

  const accentColor = designConfig?.accentColor || "#8b5cf6";

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (timestamp: bigint) => {
    const showDate = new Date(Number(timestamp) / 1000000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return showDate >= today;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading shows...
        </div>
      </div>
    );
  }

  const sortedShows = shows?.sort((a, b) => Number(a.date - b.date)) || [];
  const upcomingShows = sortedShows.filter((show) => isUpcoming(show.date));
  const pastShows = sortedShows
    .filter((show) => !isUpcoming(show.date))
    .reverse();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Tour Dates</h1>

          {sortedShows.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No shows scheduled
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Shows */}
              {upcomingShows.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Upcoming Shows</h2>
                  <div className="space-y-4">
                    {upcomingShows.map((show) => (
                      <Card
                        key={show.id}
                        className="transition-all duration-200 hover:scale-[1.01]"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            `0 6px 24px ${accentColor}20`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "";
                        }}
                      >
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                          {/* Flyer Image */}
                          {show.flyer && (
                            <div className="flex-shrink-0 w-full md:w-64">
                              <div className="relative w-full h-64 md:h-full flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
                                <img
                                  src={show.flyer.getDirectURL()}
                                  alt={`${show.title} flyer`}
                                  loading="lazy"
                                  decoding="async"
                                  className="max-w-full max-h-full w-auto h-auto object-contain"
                                />
                              </div>
                            </div>
                          )}

                          {/* Show Details */}
                          <div className="flex-1 flex flex-col">
                            <CardHeader className="p-0 mb-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <CardTitle className="text-2xl">
                                      {show.title}
                                    </CardTitle>
                                    <Badge
                                      variant="outline"
                                      style={{
                                        borderColor: accentColor,
                                        color: accentColor,
                                      }}
                                    >
                                      Upcoming
                                    </Badge>
                                  </div>
                                  <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(show.date)}
                                  </CardDescription>
                                </div>
                                {show.ticketLink && (
                                  <Button asChild>
                                    <a
                                      href={show.ticketLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Tickets
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">{show.venue}</p>
                                  <p>{show.location}</p>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Shows */}
              {pastShows.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Past Shows</h2>
                  <div className="space-y-4">
                    {pastShows.map((show) => (
                      <Card
                        key={show.id}
                        className="opacity-75 transition-all duration-200 hover:scale-[1.005] hover:opacity-90"
                      >
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                          {/* Flyer Image */}
                          {show.flyer && (
                            <div className="flex-shrink-0 w-full md:w-64">
                              <div className="relative w-full h-64 md:h-full flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
                                <img
                                  src={show.flyer.getDirectURL()}
                                  alt={`${show.title} flyer`}
                                  loading="lazy"
                                  decoding="async"
                                  className="max-w-full max-h-full w-auto h-auto object-contain"
                                />
                              </div>
                            </div>
                          )}

                          {/* Show Details */}
                          <div className="flex-1 flex flex-col">
                            <CardHeader className="p-0 mb-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <CardTitle className="text-2xl">
                                      {show.title}
                                    </CardTitle>
                                    <Badge
                                      variant="outline"
                                      style={{
                                        borderColor: accentColor,
                                        color: accentColor,
                                      }}
                                    >
                                      Past
                                    </Badge>
                                  </div>
                                  <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(show.date)}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">{show.venue}</p>
                                  <p>{show.location}</p>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
