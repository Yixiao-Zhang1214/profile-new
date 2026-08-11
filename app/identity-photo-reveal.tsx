"use client";

import { useEffect, useRef } from "react";

export default function IdentityPhotoReveal() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = revealRef.current;
    const section = reveal?.parentElement;
    if (!reveal || !section) return;

    const updateReveal = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = reveal.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      reveal.style.setProperty("--identity-brush-x", `${(x + 0.5) * 100}%`);
      reveal.style.setProperty("--identity-brush-y", `${(y + 0.5) * 100}%`);
      reveal.style.setProperty("--identity-brush-opacity", "0.72");
    };

    const hideReveal = () => {
      reveal.style.setProperty("--identity-brush-opacity", "0");
    };

    section.addEventListener("pointermove", updateReveal);
    section.addEventListener("pointerleave", hideReveal);

    return () => {
      section.removeEventListener("pointermove", updateReveal);
      section.removeEventListener("pointerleave", hideReveal);
    };
  }, []);

  return (
    <div className="identity-photo-reveal" ref={revealRef} aria-hidden="true">
      <div className="identity-home-collage" />
    </div>
  );
}
