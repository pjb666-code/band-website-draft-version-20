import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  onClick,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        }
      },
      // Increased from 300px → 500px so images start loading earlier
      { rootMargin: "500px" },
    );

    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {/* Shimmer skeleton with correct dark-theme color while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 skeleton-shimmer"
          style={{ minHeight: "200px" }}
          aria-hidden="true"
        />
      )}

      {/* Space reservation — prevents layout shift */}
      {!isLoaded && (
        <div
          className="w-full"
          style={{ paddingBottom: "66.67%", minHeight: "200px" }}
          aria-hidden="true"
        />
      )}

      {/* Actual image — only fetched once in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "w-full h-auto object-contain transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0 absolute inset-0",
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
