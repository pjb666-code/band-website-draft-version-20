import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px" } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Single play — disconnect after first trigger
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    // Small delay so the element is fully painted before observation starts
    const timer = setTimeout(() => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
