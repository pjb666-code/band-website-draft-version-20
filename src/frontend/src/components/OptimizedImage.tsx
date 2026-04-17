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
  // Observe the container div so it works even before the img is rendered
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
      {
        // Start loading 200px before the image enters the viewport
        rootMargin: "200px",
      },
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
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
      {/* Placeholder shown while image hasn't loaded yet */}
      <div
        className={cn(
          "absolute inset-0 bg-muted transition-opacity duration-500",
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        aria-hidden="true"
      />

      {/* Reserve space so the container has height before img loads */}
      {!isLoaded && (
        <div
          className="w-full"
          style={{ paddingBottom: "66.67%" }}
          aria-hidden="true"
        />
      )}

      {/* Actual image — only fetched once in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-auto object-contain transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0 absolute inset-0",
          )}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}
