"use client";

import { useEffect, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";

type PhotographerIdentity = {
  name: string;
  intro: string;
};

const photos = Array.from(
  { length: 27 },
  (_, index) => `/photography/photo-${String(index + 1).padStart(2, "0")}.webp`,
).filter((_, index) => index !== 18);

const lanes = [0, 1, 2].map((lane) =>
  photos.filter((_, index) => index % 3 === lane),
);

const autoSpeeds = [18, 12, 15];
const gestureDepth = [1, 0.88, 1.08];

function wrap(value: number, height: number) {
  return height > 0 ? ((value % height) + height) % height : 0;
}

export default function PhotographerExperience({ identity }: {
  identity: PhotographerIdentity;
}) {
  const [copyHidden, setCopyHidden] = useState(false);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const offsets = useRef([0, 0, 0]);
  const groupHeights = useRef([1, 1, 1]);
  const manualUntil = useRef(0);
  const lastFrame = useRef(0);
  const drag = useRef<{ pointerId: number; y: number } | null>(null);

  const renderTracks = () => {
    trackRefs.current.forEach((track, index) => {
      if (!track) return;
      offsets.current[index] = wrap(offsets.current[index], groupHeights.current[index]);
      track.style.transform = `translate3d(0, ${-offsets.current[index]}px, 0)`;
    });
  };

  const moveBy = (delta: number) => {
    offsets.current = offsets.current.map(
      (offset, index) => offset + delta * gestureDepth[index],
    );
    renderTracks();
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observers: ResizeObserver[] = [];

    trackRefs.current.forEach((track, index) => {
      const group = track?.querySelector<HTMLElement>(".photo-waterfall-group");
      if (!group) return;

      const measure = () => {
        groupHeights.current[index] = Math.max(group.offsetHeight, 1);
        renderTracks();
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(group);
      observers.push(observer);
    });

    let frame = 0;
    const animate = (time: number) => {
      const elapsed = lastFrame.current ? Math.min((time - lastFrame.current) / 1000, 0.05) : 0;
      lastFrame.current = time;

      if (!reducedMotion.matches && time > manualUntil.current && !drag.current) {
        offsets.current = offsets.current.map(
          (offset, index) => offset + autoSpeeds[index] * elapsed,
        );
        renderTracks();
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY > 3) setCopyHidden(true);
    if (event.deltaY < -3) setCopyHidden(false);
    manualUntil.current = performance.now() + 900;
    moveBy(Math.max(-120, Math.min(120, event.deltaY)));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, y: event.clientY };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const delta = event.clientY - drag.current.y;
    drag.current.y = event.clientY;
    if (delta < -3) setCopyHidden(true);
    if (delta > 3) setCopyHidden(false);
    moveBy(-delta);
  };

  const endPointerGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    manualUntil.current = performance.now() + 900;
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    setCopyHidden(event.key === "ArrowDown");
    manualUntil.current = performance.now() + 900;
    moveBy(event.key === "ArrowDown" ? 120 : -120);
  };

  return (
    <section className="photo-waterfall-page" aria-label="摄影作品瀑布流">
      <header className={`photographer-copy${copyHidden ? " is-hidden" : ""}`}>
        <h2>{identity.name}</h2>
        <h3>影像的意义在于把尽兴的瞬间变成永恒</h3>
        <p>{identity.intro}</p>
      </header>
      <div
        className="photo-waterfall-stream"
        tabIndex={0}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerGesture}
        onPointerCancel={endPointerGesture}
        onKeyDown={handleKeyDown}
      >
        {lanes.map((lane, laneIndex) => (
          <div className="photo-waterfall-lane" key={laneIndex}>
            <div
              className="photo-waterfall-track"
              ref={(element) => {
                trackRefs.current[laneIndex] = element;
              }}
            >
              {[0, 1].map((cycle) => (
                <div
                  className="photo-waterfall-group"
                  key={cycle}
                  aria-hidden={cycle === 1}
                >
                  {lane.map((src, index) => (
                    <figure className="photo-waterfall-item" key={`${cycle}-${src}`}>
                      <img
                        src={src}
                        alt={
                          cycle === 0
                            ? `摄影作品 ${String(laneIndex + index * 3 + 1).padStart(2, "0")}`
                            : ""
                        }
                        loading={cycle === 0 && index < 3 ? "eager" : "lazy"}
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
