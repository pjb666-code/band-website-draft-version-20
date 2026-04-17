import { useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetDesignConfig } from "../hooks/useQueries";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: designConfig } = useGetDesignConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoUrl = designConfig?.logo?.getDirectURL();
  const logoSize = Number(designConfig?.logoSize || 100);
  const accentColor = designConfig?.accentColor || "#00FF00";
  const hoverOutlineColor = designConfig?.hoverOutlineColor || accentColor;
  const showLogoInHeader = designConfig?.logoVisibility?.header ?? true;
  const isAdminPage = location.pathname.startsWith("/admin");

  const navItems = [
    { label: "Media", path: "/media" },
    { label: "Shows", path: "/shows" },
    { label: "Shop", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Booking", path: "/booking" },
  ];

  useEffect(() => {
    if (hoverOutlineColor) {
      document.documentElement.style.setProperty(
        "--hover-outline-color",
        hoverOutlineColor,
      );
    }
  }, [hoverOutlineColor]);

  if (isAdminPage) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer hover-outline-effect bg-transparent border-0 p-0"
          onClick={() => navigate({ to: "/" })}
        >
          {logoUrl && showLogoInHeader ? (
            <img
              src={logoUrl}
              alt="Oneiric"
              style={{ height: `${logoSize}px`, width: "auto" }}
            />
          ) : (
            <span className="text-3xl font-bold tracking-wider">ONEIRIC</span>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => navigate({ to: item.path })}
              className="text-sm font-medium transition-colors uppercase tracking-wide hover-outline-effect"
              style={{
                color: isActive(item.path) ? accentColor : undefined,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden hover-outline-effect"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto py-6 px-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => {
                  navigate({ to: item.path });
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium transition-colors uppercase tracking-wide hover-outline-effect"
                style={{
                  color: isActive(item.path) ? accentColor : undefined,
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
