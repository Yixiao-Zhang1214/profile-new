"use client";

import { useEffect } from "react";

export default function ContactSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#contact, .identity-sage, .identity-sand, .identity-ink, .welcome-intro",
      ),
    );

    const cleanups = sections.map((section) => {
      const bounds = section.getBoundingClientRect();
      let targetX = bounds.width / 2;
      let targetY = bounds.height * 0.38;
      let currentX = targetX;
      let currentY = targetY;
      let frame = 0;

      const animate = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        section.style.setProperty("--pointer-x", `${currentX}px`);
        section.style.setProperty("--pointer-y", `${currentY}px`);

        if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
          frame = requestAnimationFrame(animate);
        } else {
          frame = 0;
        }
      };

      const startAnimation = () => {
        if (!frame) frame = requestAnimationFrame(animate);
      };

      const handlePointerMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        targetX = event.clientX - rect.left;
        targetY = event.clientY - rect.top;
        startAnimation();
      };

      const handlePointerLeave = () => {
        const rect = section.getBoundingClientRect();
        targetX = rect.width / 2;
        targetY = rect.height * 0.38;
        startAnimation();
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
        if (frame) cancelAnimationFrame(frame);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
