import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Facebook, Instagram, Music, Twitter, Youtube } from "lucide-react";
import { useGetSocialMediaLinks } from "../hooks/useQueries";

const getSocialIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes("facebook")) return Facebook;
  if (platformLower.includes("instagram")) return Instagram;
  if (platformLower.includes("twitter") || platformLower.includes("x"))
    return Twitter;
  if (platformLower.includes("youtube")) return Youtube;
  if (platformLower.includes("spotify") || platformLower.includes("music"))
    return Music;
  return Music;
};

export default function Footer() {
  const { data: socialLinks } = useGetSocialMediaLinks();
  const enabledLinks =
    socialLinks
      ?.filter((link) => link.enabled)
      .sort((a, b) => Number(a.order) - Number(b.order)) || [];

  return (
    <footer className="border-t border-border/40 py-8 px-4">
      <div className="container mx-auto">
        {enabledLinks.length > 0 && (
          <div className="flex justify-center gap-6 mb-6">
            {enabledLinks.map((link) => {
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
        )}

        <div className="flex justify-center gap-6 mb-4">
          <Link
            to="/imprint"
            className="text-sm text-muted-foreground hover:text-accent transition-colors hover-outline-effect"
          >
            Imprint
          </Link>
          <Link
            to="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-accent transition-colors hover-outline-effect"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-accent transition-colors hover-outline-effect"
          >
            Terms of Service
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2025. Built with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors hover-outline-effect"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
