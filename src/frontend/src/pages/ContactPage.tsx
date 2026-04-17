import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, Mail, Music } from "lucide-react";
import { useState } from "react";
import {
  SiApplemusic,
  SiBandcamp,
  SiFacebook,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetContactConfig, useGetDesignConfig } from "../hooks/useQueries";

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return SiFacebook;
  if (p.includes("instagram")) return SiInstagram;
  if (p.includes("twitter") || p.includes("x.com") || p === "x") return SiX;
  if (p.includes("youtube")) return SiYoutube;
  if (p.includes("spotify")) return SiSpotify;
  if (p.includes("apple")) return SiApplemusic;
  if (p.includes("tiktok")) return SiTiktok;
  if (p.includes("soundcloud")) return SiSoundcloud;
  if (p.includes("bandcamp")) return SiBandcamp;
  return Music;
};

export default function ContactPage() {
  const { data: contactConfig, isLoading: contactLoading } =
    useGetContactConfig();
  const { data: designConfig } = useGetDesignConfig();

  const [copied, setCopied] = useState(false);

  const accentColor = designConfig?.accentColor || "#8b5cf6";
  const bandName = designConfig?.tagline || "Oneiric";

  const handleCopyEmail = () => {
    if (!contactConfig?.email) return;
    navigator.clipboard.writeText(contactConfig.email);
    setCopied(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const enabledSocialLinks =
    contactConfig?.socialMediaLinks
      ?.filter((link) => link.enabled)
      .sort((a, b) => Number(a.order) - Number(b.order)) ?? [];

  if (contactLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-0">
        {/* Hero — bold headline with radial accent glow */}
        <div
          className="relative py-24 px-4 text-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accentColor}18 0%, transparent 65%)`,
          }}
          data-ocid="contact.hero_section"
        >
          {/* Decorative background ring */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            }}
          />

          <div className="relative max-w-3xl mx-auto">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 mx-auto"
              style={{
                backgroundColor: `${accentColor}18`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
              }}
            >
              <Mail className="h-9 w-9" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 leading-none">
              {contactConfig?.headline || "Get In Touch"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Have a question, press inquiry, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6 -mt-2">
          {/* Email Card */}
          {contactConfig?.email && (
            <div
              className="rounded-2xl p-8 border"
              style={{
                borderColor: `${accentColor}25`,
                background:
                  "linear-gradient(135deg, oklch(0.205 0 0) 0%, oklch(0.18 0 0) 100%)",
              }}
              data-ocid="contact.email_card"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
                Reach Out Directly
              </p>
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="text-xl md:text-2xl font-semibold hover:underline underline-offset-4 transition-colors min-w-0 truncate"
                  style={{ color: accentColor }}
                  data-ocid="contact.email_link"
                >
                  {contactConfig.email}
                </a>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="shrink-0 gap-2 hover-outline-effect"
                  style={
                    copied
                      ? { borderColor: accentColor, color: accentColor }
                      : {}
                  }
                  aria-label="Copy email address"
                  data-ocid="contact.copy_email_button"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                We read every message and aim to respond within a few days.
              </p>
            </div>
          )}

          {/* Social Links — larger, grid layout */}
          {enabledSocialLinks.length > 0 && (
            <div
              className="rounded-2xl border p-8"
              style={{ borderColor: `${accentColor}25` }}
              data-ocid="contact.socials_section"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">
                Follow &amp; Connect
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {enabledSocialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 rounded-xl border border-border px-4 py-5 text-center transition-all duration-200 hover-outline-effect"
                      aria-label={link.platform}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = accentColor;
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          `0 0 16px ${accentColor}25`;
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "";
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "";
                      }}
                      data-ocid={`contact.social_link.${link.platform.toLowerCase().replace(/\s+/g, "_")}`}
                    >
                      <Icon
                        className="h-8 w-8 shrink-0 transition-colors duration-200"
                        style={{ color: accentColor }}
                      />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {link.platform}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state if no config set */}
          {!contactConfig?.email && enabledSocialLinks.length === 0 && (
            <div
              className="rounded-2xl border border-dashed border-border p-16 text-center"
              data-ocid="contact.empty_state"
            >
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                Contact information will appear here once configured in the
                admin panel.
              </p>
            </div>
          )}
        </div>

        {/* Closing section — visual anchor at the bottom */}
        <div
          className="py-16 px-4 text-center"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.18 0 0) 100%)",
            borderTop: `1px solid ${accentColor}12`,
          }}
          data-ocid="contact.closing_section"
        >
          <div className="max-w-xl mx-auto">
            <div
              className="w-12 h-0.5 mx-auto mb-6"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-2xl font-bold mb-2 tracking-tight">{bandName}</p>
            <p className="text-muted-foreground text-sm">
              Music that moves you.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
