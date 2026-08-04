"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

type TravelerIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  skills: string;
};

const travelCountries = [
  { name: "中国", location: [35.86, 104.2] as [number, number] },
  { name: "日本", location: [36.2, 138.25] as [number, number] },
  { name: "泰国", location: [15.87, 100.99] as [number, number] },
  { name: "新加坡", location: [1.35, 103.82] as [number, number] },
  { name: "印度尼西亚", location: [-0.79, 113.92] as [number, number] },
  { name: "马来西亚", location: [4.21, 101.98] as [number, number] },
  { name: "德国", location: [51.17, 10.45] as [number, number] },
  { name: "荷兰", location: [52.13, 5.29] as [number, number] },
  { name: "冰岛", location: [64.96, -19.02] as [number, number] },
  { name: "希腊", location: [39.07, 21.82] as [number, number] },
  { name: "西班牙", location: [40.46, -3.75] as [number, number] },
  { name: "意大利", location: [41.87, 12.57] as [number, number] },
  { name: "埃及", location: [26.82, 30.8] as [number, number] },
  { name: "比利时", location: [50.5, 4.47] as [number, number] },
  { name: "梵蒂冈", location: [41.9, 12.45] as [number, number] },
  { name: "菲律宾", location: [12.88, 121.77] as [number, number] },
];

const photoPlaceholders = Array.from({ length: 8 }, (_, index) => ({
  number: String(index + 1).padStart(2, "0"),
  label: ["CITY WALK", "ON THE ROAD", "LOCAL LIFE", "BLUE HOUR"][index % 4],
}));

function TravelGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(-0.7);
  const dragStartRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let size = Math.max(container.offsetWidth, 1);
    let animationFrame = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    const globe = createGlobe(canvas, {
      width: size,
      height: size,
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      phi: rotationRef.current,
      theta: 0.18,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4.6,
      mapBaseBrightness: 0.08,
      baseColor: [0.7, 0.72, 0.58],
      markerColor: [0.94, 0.36, 0.16],
      glowColor: [0.97, 0.93, 0.82],
      markerElevation: 0.035,
      scale: 0.94,
      opacity: 0.96,
      markers: travelCountries.map((country, index) => ({
        id: `country-${index + 1}`,
        location: country.location,
        size: country.name === "梵蒂冈" ? 0.025 : 0.038,
      })),
    });

    const globeWrapper = canvas.parentElement;
    const resizeObserver = new ResizeObserver(() => {
      size = Math.max(container.offsetWidth, 1);
    });

    const render = () => {
      if (dragStartRef.current === null && !reducedMotionRef.current) {
        rotationRef.current += 0.0024;
      }

      globe.update({
        width: size,
        height: size,
        phi: rotationRef.current + dragOffsetRef.current,
        theta: 0.18,
      });
      animationFrame = window.requestAnimationFrame(render);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };

    resizeObserver.observe(container);
    motionQuery.addEventListener("change", handleMotionChange);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      globe.destroy();

      if (globeWrapper && globeWrapper !== container && globeWrapper.parentElement === container) {
        container.insertBefore(canvas, globeWrapper);
        globeWrapper.remove();
      }
    };
  }, []);

  const finishDrag = (pointerId: number) => {
    if (dragStartRef.current === null) return;
    rotationRef.current += dragOffsetRef.current;
    dragOffsetRef.current = 0;
    dragStartRef.current = null;
    if (canvasRef.current?.hasPointerCapture(pointerId)) {
      canvasRef.current.releasePointerCapture(pointerId);
    }
  };

  return (
    <div className="travel-globe-shell" ref={containerRef}>
      <div className="travel-globe-fallback" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="travel-globe-canvas"
        role="img"
        aria-label="标记了十六个到访国家的可旋转地球"
        onPointerDown={(event) => {
          dragStartRef.current = event.clientX;
          dragOffsetRef.current = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStartRef.current === null) return;
          dragOffsetRef.current = (event.clientX - dragStartRef.current) / 160;
        }}
        onPointerUp={(event) => finishDrag(event.pointerId)}
        onPointerCancel={(event) => finishDrag(event.pointerId)}
      />
      <span className="travel-globe-instruction">拖动地球 · 探索足迹</span>
    </div>
  );
}

function TravelPhotoRail() {
  const loopedPhotos = [...photoPlaceholders, ...photoPlaceholders];

  return (
    <div className="travel-photo-rail" aria-label="旅行照片占位轮播">
      <div className="travel-photo-track">
        {loopedPhotos.map((photo, index) => {
          const isDuplicate = index >= photoPlaceholders.length;
          return (
            <figure
              className={`travel-photo-card travel-photo-tone-${(index % 4) + 1}`}
              key={`${photo.number}-${index}`}
              tabIndex={isDuplicate ? -1 : 0}
              aria-hidden={isDuplicate || undefined}
            >
              <div aria-hidden="true">
                <span>PHOTO</span>
                <strong>{photo.number}</strong>
              </div>
              <figcaption>
                <span>{photo.label}</span>
                <small>照片占位 · 待替换</small>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export default function TravelerExperience({ identity }: { identity: TravelerIdentity }) {
  return (
    <section className="traveler-experience" aria-label="旅行家足迹">
      <header className="traveler-copy">
        <p>{identity.english}</p>
        <div>
          <h2>{identity.name}</h2>
          <span>
            <strong>16</strong>
            COUNTRIES
          </span>
        </div>
        <h3>{identity.statement.replace("\n", " ")}</h3>
        <p>{identity.intro}</p>
        <small>{identity.skills}</small>
      </header>

      <div className="traveler-visual">
        <div className="traveler-globe-column">
          <TravelGlobe />
          <ul className="traveler-country-list" aria-label="去过的十六个国家">
            {travelCountries.map((country) => (
              <li key={country.name}>{country.name}</li>
            ))}
          </ul>
        </div>
        <TravelPhotoRail />
      </div>
    </section>
  );
}
