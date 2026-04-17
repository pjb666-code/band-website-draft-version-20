import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Mail } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiSpotify,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetContactConfig } from "../hooks/useQueries";

const getSocialIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes("facebook")) return SiFacebook;
  if (platformLower.includes("instagram")) return SiInstagram;
  if (platformLower.includes("twitter") || platformLower.includes("x"))
    return SiX;
  if (platformLower.includes("youtube")) return SiYoutube;
  if (platformLower.includes("spotify")) return SiSpotify;
  return Mail;
};

export default function ContactPage() {
  const { data: contactConfig, isLoading } = useGetContactConfig();

  const handleCopyEmail = () => {
    if (contactConfig?.email) {
      navigator.clipboard.writeText(contactConfig.email);
      toast.success("Email copied to clipboard");
    }
  };

  const enabledSocialLinks =
    contactConfig?.socialMediaLinks
      ?.filter((link) => link.enabled)
      .sort((a, b) => Number(a.order) - Number(b.order)) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {contactConfig?.headline || "Contact Us"}
          </h1>
          <p className="text-center text-muted-foreground mb-10">
            For inquiries, reach out via email or find us on social media.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactConfig?.email && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-muted rounded-md font-mono text-sm">
                      {contactConfig.email}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopyEmail}
                      className="hover-outline-effect"
                      aria-label="Copy email address"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {enabledSocialLinks.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Follow Us
                  </Label>
                  <div className="flex gap-4">
                    {enabledSocialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors hover-outline-effect"
                          aria-label={link.platform}
                        >
                          <Icon className="h-6 w-6" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
