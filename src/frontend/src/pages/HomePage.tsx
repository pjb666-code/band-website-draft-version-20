import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Headphones,
  MapPin,
  ShoppingBag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeroMediaType } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  useGetDesignConfig,
  useGetHomepageConfig,
  useGetMediaItems,
  useGetProducts,
  useGetShows,
} from "../hooks/useQueries";

export default function HomePage() {
  const {
    data: mediaItems,
    isLoading: mediaLoading,
    error: mediaError,
  } = useGetMediaItems();
  const {
    data: shows,
    isLoading: showsLoading,
    error: showsError,
  } = useGetShows();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProducts();
  const {
    data: designConfig,
    isLoading: designLoading,
    error: designError,
  } = useGetDesignConfig();
  const {
    data: homepageConfig,
    isLoading: homepageLoading,
    error: homepageError,
  } = useGetHomepageConfig();
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const accentColor = designConfig?.accentColor || "#00FF00";
  const heroImage = designConfig?.heroImage?.getDirectURL();
  const heroVideo = designConfig?.heroVideo;
  const heroMediaType = designConfig?.heroMediaType || HeroMediaType.image;
  const tagline = designConfig?.tagline || "";
  const heroSubtitle = designConfig?.heroSubtitle || "";
  const logoUrl = designConfig?.logo?.getDirectURL();
  const logoSize = Number(designConfig?.logoSize || 100);
  const showLogoInHero = designConfig?.logoVisibility?.hero ?? true;
  const quickButtons = designConfig?.quickButtons || [];
  const enabledQuickButtons = quickButtons
    .filter((btn) => btn.enabled)
    .sort((a, b) => Number(a.order) - Number(b.order));

  // Determine if we should show video
  const showVideo =
    heroMediaType === HeroMediaType.video &&
    heroVideo &&
    (heroVideo.file || heroVideo.externalUrl);
  const videoUrl =
    heroVideo?.file?.getDirectURL() || heroVideo?.externalUrl || "";

  // Handle video mute toggle
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Get button styles
  const buttonStyle = designConfig?.buttonStyle;
  const getButtonBorderRadius = () => {
    if (buttonStyle?.shape === "square") return "0px";
    if (buttonStyle?.shape === "pill") return "9999px";
    return `${buttonStyle?.borderRadius || 8}px`;
  };

  // Icon mapping for quick buttons based on label keywords
  const getButtonIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("listen") || lowerLabel.includes("music")) {
      return <Headphones className="h-5 w-5" />;
    }
    if (lowerLabel.includes("show") || lowerLabel.includes("tour")) {
      return <Calendar className="h-5 w-5" />;
    }
    if (lowerLabel.includes("shop") || lowerLabel.includes("merch")) {
      return <ShoppingBag className="h-5 w-5" />;
    }
    return null;
  };

  // Check if all critical data is loading
  const isLoading =
    mediaLoading ||
    showsLoading ||
    productsLoading ||
    designLoading ||
    homepageLoading;

  // Check if any critical data failed to load
  const hasError =
    mediaError || showsError || productsError || designError || homepageError;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state if data fetch failed
  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load content</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get latest release based on homepage config
  const latestRelease = homepageConfig?.latestReleaseId
    ? mediaItems?.find((item) => item.id === homepageConfig.latestReleaseId)
    : undefined;

  // Get upcoming shows based on homepage config
  const now = Date.now() * 1000000; // Convert to nanoseconds
  const futureShows = shows?.filter((show) => Number(show.date) > now) || [];

  const upcomingShows = homepageConfig?.autoUpcomingShows
    ? futureShows.slice(0, 3)
    : futureShows.filter((show) =>
        homepageConfig?.upcomingShowIds.includes(show.id),
      );

  // Get featured products based on homepage config
  const featuredProducts =
    products?.filter((product) =>
      homepageConfig?.featuredProductIds.includes(product.id),
    ) || [];

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleQuickButtonClick = (url: string) => {
    if (url.startsWith("/")) {
      navigate({ to: url });
    } else if (url.startsWith("#")) {
      const element = document.querySelector(url);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = url;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Media */}
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={heroVideo?.autoplay ?? true}
              loop={heroVideo?.shouldLoop ?? true}
              muted={isMuted}
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-24 right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all backdrop-blur-sm"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              style={{
                color: accentColor,
              }}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </>
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: heroImage ? `url(${heroImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {logoUrl && showLogoInHero && (
            <img
              src={logoUrl}
              alt="Oneiric"
              className="mx-auto mb-8 animate-fade-in"
              style={{ height: `${logoSize}px` }}
            />
          )}
          {tagline && (
            <h1
              className="font-bold mb-4 animate-fade-in"
              style={{
                color: designConfig?.heroTextColor || "#FFFFFF",
                fontSize: `${designConfig?.heroTextSize || 48}px`,
                animationDelay: "0.2s",
              }}
            >
              {tagline}
            </h1>
          )}
          {heroSubtitle && (
            <p
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in"
              style={{
                color: designConfig?.heroTextColor || "#FFFFFF",
                opacity: 0.9,
                animationDelay: "0.4s",
              }}
            >
              {heroSubtitle}
            </p>
          )}
          {enabledQuickButtons.length > 0 && (
            <div
              className="flex flex-wrap gap-4 justify-center mb-8 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              {enabledQuickButtons.map((btn) => {
                const icon = getButtonIcon(btn.buttonLabel);
                return (
                  <button
                    type="button"
                    key={btn.id}
                    onClick={() => handleQuickButtonClick(btn.url)}
                    className="px-6 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor:
                        buttonStyle?.backgroundColor || accentColor,
                      color: buttonStyle?.textColor || "#000",
                      borderColor: buttonStyle?.borderColor || accentColor,
                      borderWidth: `${buttonStyle?.borderWidth || 2}px`,
                      borderStyle: buttonStyle?.borderStyle || "solid",
                      borderRadius: getButtonBorderRadius(),
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                    onMouseEnter={(e) => {
                      if (buttonStyle) {
                        e.currentTarget.style.backgroundColor =
                          buttonStyle.hoverBackgroundColor;
                        e.currentTarget.style.color =
                          buttonStyle.hoverTextColor;
                        e.currentTarget.style.borderColor =
                          buttonStyle.hoverBorderColor;
                        e.currentTarget.style.boxShadow = `0 0 30px ${accentColor}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (buttonStyle) {
                        e.currentTarget.style.backgroundColor =
                          buttonStyle.backgroundColor;
                        e.currentTarget.style.color = buttonStyle.textColor;
                        e.currentTarget.style.borderColor =
                          buttonStyle.borderColor;
                        e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}40`;
                      }
                    }}
                  >
                    {icon}
                    <span className={icon ? "ml-2" : ""}>
                      {btn.buttonLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scroll Down Indicator - Simple Animated Arrow */}
        <button
          type="button"
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group animate-scroll-bounce z-10"
          aria-label="Scroll down"
        >
          <ChevronDown
            className="h-8 w-8 group-hover:scale-110 transition-transform"
            style={{ color: accentColor }}
          />
        </button>
      </section>

      <main className="flex-1">
        {/* Latest Releases */}
        {latestRelease && (
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Latest Releases
              </h2>
              <Card
                className="max-w-4xl mx-auto cursor-pointer hover:border-accent/50 transition-all"
                onClick={() => navigate({ to: "/media" })}
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {latestRelease.images[0] && (
                        <img
                          src={latestRelease.images[0].file.getDirectURL()}
                          alt={latestRelease.title}
                          className="w-full h-auto object-contain"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <Badge
                        className="mb-4 w-fit"
                        style={{ backgroundColor: accentColor, color: "#000" }}
                      >
                        {latestRelease.mediaType}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-4">
                        {latestRelease.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {latestRelease.description}
                      </p>
                      {latestRelease.streamingPlatforms &&
                        latestRelease.streamingPlatforms.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-muted-foreground uppercase">
                              Stream On
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {latestRelease.streamingPlatforms.map(
                                (platform, idx) => (
                                  <Button
                                    // biome-ignore lint/suspicious/noArrayIndexKey: streaming order
                                    key={idx}
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(platform.url, "_blank");
                                    }}
                                  >
                                    {platform.platformLabel}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </Button>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Upcoming Shows */}
        {upcomingShows.length > 0 && (
          <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Upcoming Shows
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {upcomingShows.map((show) => (
                  <Card
                    key={show.id}
                    className="cursor-pointer hover:border-accent/50 transition-all"
                    onClick={() => navigate({ to: "/shows" })}
                  >
                    <CardContent className="p-6">
                      {show.flyer && (
                        <div className="mb-4 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={show.flyer.getDirectURL()}
                            alt={show.title}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                      <div className="flex items-start gap-3 mb-4">
                        <Calendar
                          className="h-5 w-5 mt-1"
                          style={{ color: accentColor }}
                        />
                        <div>
                          <p className="font-bold text-lg">{show.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              Number(show.date) / 1000000,
                            ).toLocaleDateString("en-US")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin
                          className="h-5 w-5 mt-1"
                          style={{ color: accentColor }}
                        />
                        <div>
                          <p className="font-medium">{show.venue}</p>
                          <p className="text-sm text-muted-foreground">
                            {show.location}
                          </p>
                        </div>
                      </div>
                      {show.ticketLink && (
                        <Button
                          className="w-full"
                          style={{
                            backgroundColor: accentColor,
                            color: "#000",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(show.ticketLink, "_blank");
                          }}
                        >
                          Get Tickets
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/shows" })}
                >
                  View All Shows
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Merch */}
        {featuredProducts.length > 0 && (
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Featured Merch
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:border-accent/50 transition-all"
                    onClick={() => navigate({ to: "/shop" })}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        {product.categories &&
                          product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.categories.map((cat, idx) => (
                                <Badge
                                  // biome-ignore lint/suspicious/noArrayIndexKey: category order
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          )}
                        <h3 className="font-bold mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        {product.variants[0] && (
                          <p className="font-bold">
                            €
                            {(Number(product.variants[0].price) / 100).toFixed(
                              2,
                            )}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/shop" })}
                >
                  View Shop
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
