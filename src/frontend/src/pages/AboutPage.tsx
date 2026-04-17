import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useState } from "react";
import type { ExternalBlob } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Lightbox from "../components/Lightbox";
import OptimizedImage from "../components/OptimizedImage";
import { useGetAboutContent, useGetDesignConfig } from "../hooks/useQueries";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function AboutPage() {
  const {
    data: aboutContent,
    isLoading: aboutLoading,
    error: aboutError,
  } = useGetAboutContent();
  const { data: designConfig, isLoading: designLoading } = useGetDesignConfig();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const accentColor = designConfig?.accentColor || "#8b5cf6";

  const mainSection = useScrollAnimation({ threshold: 0.1, rootMargin: "0px" });
  const gallerySection = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px",
  });

  const handleDownloadPressKit = () => {
    if (aboutContent?.pressKit) {
      const url = aboutContent.pressKit.getDirectURL();
      window.open(url, "_blank");
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (!aboutContent?.photos) return;
    setLightboxIndex((prev) => (prev + 1) % aboutContent.photos.length);
  };

  const prevImage = () => {
    if (!aboutContent?.photos) return;
    setLightboxIndex(
      (prev) =>
        (prev - 1 + aboutContent.photos.length) % aboutContent.photos.length,
    );
  };

  const isLoading = aboutLoading || designLoading;

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

  if (aboutError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load content</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainPhoto: ExternalBlob | undefined = aboutContent?.photos?.[0];
  const additionalPhotos: ExternalBlob[] = aboutContent?.photos?.slice(1) ?? [];
  const allPhotos: ExternalBlob[] = aboutContent?.photos ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-12">About Us</h1>

          {/* Main Section: Image Left, Biography Right */}
          <div
            ref={mainSection.ref}
            className={cn(
              "grid lg:grid-cols-2 gap-12 mb-16 transition-all duration-700",
              mainSection.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10",
            )}
          >
            {/* Main Band Image - Left */}
            <div className="order-1">
              <div
                className="bg-muted rounded-lg overflow-hidden sticky top-32 cursor-pointer group"
                style={{ minHeight: "280px" }}
              >
                {mainPhoto ? (
                  <OptimizedImage
                    src={mainPhoto.getDirectURL()}
                    alt="Band Photo"
                    className="w-full group-hover:opacity-90 transition-opacity duration-200"
                    onClick={() => openLightbox(0)}
                    priority
                  />
                ) : (
                  <div className="w-full flex items-center justify-center text-muted-foreground min-h-[400px]">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Biography and Info - Right */}
            <div className="order-2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                {aboutContent?.biography ? (
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-lg">
                      {aboutContent.biography}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-lg">
                    Content coming soon
                  </p>
                )}
              </div>

              {aboutContent?.bandMembers &&
                aboutContent.bandMembers.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Band Members</h3>
                    <ul className="space-y-2">
                      {aboutContent.bandMembers.map((member) => (
                        <li
                          key={member}
                          className="text-lg text-muted-foreground"
                        >
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {aboutContent?.pressKit && (
                <Card className="p-6 bg-card/50 border-accent/20">
                  <h3 className="text-2xl font-bold mb-4">Press Kit</h3>
                  <p className="text-muted-foreground mb-6">
                    Download our complete press kit with high-resolution photos,
                    biography, and promotional materials.
                  </p>
                  <Button
                    onClick={handleDownloadPressKit}
                    size="lg"
                    style={{ backgroundColor: accentColor }}
                    className="text-black hover:opacity-90 font-semibold"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Press Kit
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Additional Photos Gallery */}
          {additionalPhotos.length > 0 && (
            <div
              ref={gallerySection.ref}
              className={cn(
                "transition-all duration-700 delay-100",
                gallerySection.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10",
              )}
            >
              <h2 className="text-4xl font-bold mb-8">Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalPhotos.map((photo, index) => {
                  const photoIndex = index + 1;
                  const handleKeyDown = (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(photoIndex);
                    }
                  };
                  return (
                    <button
                      key={photo.getDirectURL()}
                      type="button"
                      className="overflow-hidden rounded-lg bg-muted group cursor-pointer hover:ring-2 transition-all w-full text-left"
                      style={{ minHeight: "200px" }}
                      onClick={() => openLightbox(photoIndex)}
                      onKeyDown={handleKeyDown}
                      aria-label={`Open gallery photo ${photoIndex + 1}`}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          `0 0 0 2px ${accentColor}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "";
                      }}
                    >
                      <OptimizedImage
                        src={photo.getDirectURL()}
                        alt={`Band photo ${photoIndex + 1}`}
                        className="w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!aboutContent?.biography &&
            !mainPhoto &&
            !aboutContent?.bandMembers?.length && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Content coming soon
                </p>
              </div>
            )}
        </div>
      </main>

      {/* Lightbox */}
      {allPhotos.length > 0 && (
        <Lightbox
          images={allPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={nextImage}
          onPrevious={prevImage}
        />
      )}

      <Footer />
    </div>
  );
}
