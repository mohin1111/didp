import { useState, useEffect, useCallback } from 'react';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface DemoSpotlightProps {
  selector: string | null;
  padding?: number;
}

export function DemoSpotlight({ selector, padding = 8 }: DemoSpotlightProps) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  const updateRect = useCallback(() => {
    if (!selector) {
      setRect(null);
      return;
    }

    const element = document.querySelector(selector);
    if (element) {
      const domRect = element.getBoundingClientRect();
      setRect({
        top: domRect.top - padding,
        left: domRect.left - padding,
        width: domRect.width + padding * 2,
        height: domRect.height + padding * 2,
      });
    } else {
      setRect(null);
    }
  }, [selector, padding]);

  useEffect(() => {
    updateRect();

    // Update on resize and scroll
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    // Also update periodically in case of animations
    const interval = setInterval(updateRect, 200);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      clearInterval(interval);
    };
  }, [updateRect]);

  if (!rect) {
    // No spotlight - just show dark overlay
    return <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />;
  }

  // Create spotlight effect with CSS clip-path
  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${rect.left}px 100%,
            ${rect.left}px ${rect.top}px,
            ${rect.left + rect.width}px ${rect.top}px,
            ${rect.left + rect.width}px ${rect.top + rect.height}px,
            ${rect.left}px ${rect.top + rect.height}px,
            ${rect.left}px 100%,
            100% 100%,
            100% 0%
          )`,
        }}
      />

      {/* Highlight border around element */}
      <div
        className="fixed z-40 pointer-events-none transition-all duration-300"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: '12px',
          boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.4)',
        }}
      />

      {/* Pulse animation ring */}
      <div
        className="fixed z-40 pointer-events-none animate-pulse"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          borderRadius: '16px',
          border: '2px solid rgba(99, 102, 241, 0.4)',
        }}
      />
    </>
  );
}
