import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Loader2, Music, Video } from "lucide-react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetBookingConfig } from "../hooks/useQueries";

export default function BookingPage() {
  const { data: bookingConfig, isLoading } = useGetBookingConfig();

  const handleCopyEmail = () => {
    if (bookingConfig?.email) {
      navigator.clipboard.writeText(bookingConfig.email);
      toast.success("Email copied to clipboard");
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pressKitFile = bookingConfig?.files?.find(
    (f) => f.fileType === "pressKit",
  );
  const techRiderFile = bookingConfig?.files?.find(
    (f) => f.fileType === "techRider",
  );
  const hospitalityRiderFile = bookingConfig?.files?.find(
    (f) => f.fileType === "hospitalityRider",
  );

  const musicLinks =
    bookingConfig?.links?.filter((l) => l.type === "music") || [];
  const videoLinks =
    bookingConfig?.links?.filter((l) => l.type === "video") || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Booking Information
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Everything you need to book Oneiric for your event
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Downloads Card */}
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pressKitFile && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-outline-effect"
                    onClick={() =>
                      handleDownload(
                        pressKitFile.file.getDirectURL(),
                        pressKitFile.name,
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Press Kit
                  </Button>
                )}
                {techRiderFile && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-outline-effect"
                    onClick={() =>
                      handleDownload(
                        techRiderFile.file.getDirectURL(),
                        techRiderFile.name,
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tech Rider
                  </Button>
                )}
                {hospitalityRiderFile && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover-outline-effect"
                    onClick={() =>
                      handleDownload(
                        hospitalityRiderFile.file.getDirectURL(),
                        hospitalityRiderFile.name,
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Hospitality Rider
                  </Button>
                )}
                {!pressKitFile && !techRiderFile && !hospitalityRiderFile && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No files available for download
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {bookingConfig?.callToAction || "Book Us Now"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingConfig?.email && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Booking Email
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-muted rounded-md font-mono text-sm">
                        {bookingConfig.email}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyEmail}
                        className="hover-outline-effect"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Get in touch to discuss availability, pricing, and technical
                  requirements.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Music Links */}
          {musicLinks.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Listen to Our Music
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {musicLinks.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      className="justify-start hover-outline-effect"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.linkLabel}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Links */}
          {videoLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Watch Our Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {videoLinks.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      className="justify-start hover-outline-effect"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.linkLabel}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
