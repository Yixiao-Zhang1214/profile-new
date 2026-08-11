"use client";

import { useEffect, useRef } from "react";

type ParticleSample = {
  u: number;
  v: number;
  color: [number, number, number];
};

type Particle = {
  source: ParticleSample;
  target: ParticleSample;
  targetIndex: number;
  seed: number;
  directionX: number;
  directionY: number;
  radius: number;
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (start: number, end: number, value: number) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

const randomFrom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load particle source: ${src}`));
    image.src = src;
  });
}

function sampleImage(image: HTMLImageElement, count: number) {
  const maximumSide = 220;
  const scale = Math.min(1, maximumSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = width;
  canvas.height = height;
  context?.drawImage(image, 0, 0, width, height);

  const pixels = context?.getImageData(0, 0, width, height).data;
  const candidates: ParticleSample[] = [];

  if (pixels) {
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const offset = (y * width + x) * 4;
        if (pixels[offset + 3] < 72) continue;
        candidates.push({
          u: x / width,
          v: y / height,
          color: [pixels[offset], pixels[offset + 1], pixels[offset + 2]],
        });
      }
    }
  }

  if (candidates.length === 0) {
    return Array.from({ length: count }, () => ({
      u: 0.5,
      v: 0.5,
      color: [92, 88, 76] as [number, number, number],
    }));
  }

  return Array.from({ length: count }, (_, index) => {
    const candidateIndex = Math.floor(randomFrom(index + count * 0.37) * candidates.length);
    return candidates[candidateIndex];
  });
}

function getContainedImageRect(image: HTMLImageElement) {
  const bounds = image.getBoundingClientRect();
  const naturalRatio = image.naturalWidth / image.naturalHeight;
  const boundsRatio = bounds.width / bounds.height;

  if (!Number.isFinite(naturalRatio) || bounds.width === 0 || bounds.height === 0) {
    return bounds;
  }

  if (naturalRatio > boundsRatio) {
    const height = bounds.width / naturalRatio;
    return new DOMRect(bounds.x, bounds.y + (bounds.height - height) / 2, bounds.width, height);
  }

  const width = bounds.height * naturalRatio;
  return new DOMRect(bounds.x + (bounds.width - width) / 2, bounds.y, width, bounds.height);
}

export default function PersonaParticleTransition({
  source,
  targets,
}: {
  source: string;
  targets: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const heroImage = document.querySelector<HTMLImageElement>(".hero-character");
    const targetImages = Array.from(
      document.querySelectorAll<HTMLImageElement>(".identity-intro-personas img"),
    );
    const intro = document.querySelector<HTMLElement>("#about");

    if (!canvas || !context || !heroImage || !intro || targetImages.length !== targets.length) {
      return;
    }

    document.documentElement.classList.add("has-persona-particles");
    let particles: Particle[] = [];
    let frame = 0;
    let disposed = false;
    let assetsReady = false;
    let initialized = false;
    let desiredProgress = 0;
    let renderedProgress = 0;
    let previousFrameTime = 0;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const clearStyles = () => {
      heroImage.style.removeProperty("opacity");
      targetImages.forEach((image) => {
        const link = image.closest<HTMLElement>("a");
        link?.style.removeProperty("--persona-opacity");
        link?.style.removeProperty("--persona-rise");
      });
    };

    const readProgress = () => {
      const introBounds = intro.getBoundingClientRect();
      return clamp((window.innerHeight - introBounds.top) / (window.innerHeight * 0.86));
    };

    const draw = (progress: number) => {
      heroImage.style.opacity = progress < 0.045 ? "1" : "0";
      targetImages.forEach((image, index) => {
        const reveal = smoothstep(0.73 + index * 0.018, 0.965, progress);
        const link = image.closest<HTMLElement>("a");
        link?.style.setProperty("--persona-opacity", String(reveal));
        link?.style.setProperty("--persona-rise", `${(1 - reveal) * 26}px`);
      });

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (progress <= 0.012 || progress >= 0.992 || particles.length === 0) return;

      const liveSourceRect = getContainedImageRect(heroImage);
      const sourceAnchor = smoothstep(0.02, 0.11, progress);
      const sourceRect = new DOMRect(
        liveSourceRect.x,
        liveSourceRect.y + window.scrollY * sourceAnchor,
        liveSourceRect.width,
        liveSourceRect.height,
      );
      const targetRects = targetImages.map(getContainedImageRect);
      const movement = smoothstep(0.42, 0.95, progress);
      const dissolve = smoothstep(0.025, 0.16, progress);
      const settleFade = smoothstep(0.88, 0.992, progress);
      const particleOpacity = dissolve * (1 - settleFade);

      particles.forEach((particle) => {
        const targetRect = targetRects[particle.targetIndex];
        const sourceX = sourceRect.x + sourceRect.width * particle.source.u;
        const sourceY = sourceRect.y + sourceRect.height * particle.source.v;
        const targetX = targetRect.x + targetRect.width * particle.target.u;
        const targetY = targetRect.y + targetRect.height * particle.target.v;
        const edgeDistance = clamp(
          Math.abs(particle.source.u - 0.5) * 1.45 +
            Math.abs(particle.source.v - 0.5) * 0.82,
        );
        const releaseStart = 0.065 + (1 - edgeDistance) * 0.07 + particle.seed * 0.025;
        const release = smoothstep(releaseStart, releaseStart + 0.2, progress);
        const driftEnvelope =
          Math.sin(Math.PI * smoothstep(0.04, 0.88, progress)) * release;
        const driftDistance = 72 + particle.seed * 148 + edgeDistance * 92;
        const drift = driftDistance * driftEnvelope;
        const x =
          sourceX + (targetX - sourceX) * movement + particle.directionX * drift;
        const y =
          sourceY +
          (targetY - sourceY) * movement +
          particle.directionY * drift -
          driftEnvelope * (18 + particle.seed * 42);
        const red = Math.round(
          particle.source.color[0] +
            (particle.target.color[0] - particle.source.color[0]) * movement,
        );
        const green = Math.round(
          particle.source.color[1] +
            (particle.target.color[1] - particle.source.color[1]) * movement,
        );
        const blue = Math.round(
          particle.source.color[2] +
            (particle.target.color[2] - particle.source.color[2]) * movement,
        );
        const radius = particle.radius * (1 + driftEnvelope * 0.58);
        const opacity = particleOpacity * (0.7 + particle.seed * 0.3);

        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });
    };

    const animate = (time: number) => {
      frame = 0;
      if (!assetsReady || disposed) return;

      const elapsed = previousFrameTime ? Math.min(34, time - previousFrameTime) : 16;
      previousFrameTime = time;
      const difference = desiredProgress - renderedProgress;
      const timeConstant = difference >= 0 ? 300 : 220;
      const blend = 1 - Math.exp(-elapsed / timeConstant);

      renderedProgress =
        Math.abs(difference) < 0.0008
          ? desiredProgress
          : renderedProgress + difference * blend;
      draw(renderedProgress);

      if (Math.abs(desiredProgress - renderedProgress) > 0.0008) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const requestDraw = (instant = false) => {
      desiredProgress = readProgress();
      if (!assetsReady) return;

      if (!initialized || instant) {
        initialized = true;
        renderedProgress = desiredProgress;
        previousFrameTime = 0;
        draw(renderedProgress);
        return;
      }

      if (frame) return;
      previousFrameTime = performance.now();
      frame = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    Promise.all([loadImage(source), ...targets.map(loadImage)])
      .then(([sourceImage, ...targetSources]) => {
        if (disposed) return;
        const particleCount = window.innerWidth <= 720 ? 3800 : 9000;
        const targetCount = Math.floor(particleCount / targetSources.length);
        const sourceSamples = sampleImage(sourceImage, targetCount * targetSources.length);
        const targetSamples = targetSources.flatMap((image) => sampleImage(image, targetCount));

        particles = sourceSamples.map((sourceSample, index) => {
          const seed = randomFrom(index + 19);
          const angle = randomFrom(index + 47) * Math.PI * 2;

          return {
            source: sourceSample,
            target: targetSamples[index],
            targetIndex: Math.min(
              targetSources.length - 1,
              Math.floor(index / targetCount),
            ),
            seed,
            directionX: Math.cos(angle),
            directionY: Math.sin(angle),
            radius: 0.65 + Math.pow(randomFrom(index + 83), 1.55) * 1.85,
          };
        });
        assetsReady = true;
        requestDraw(true);
      })
      .catch(() => {
        clearStyles();
        document.documentElement.classList.remove("has-persona-particles");
      });

    const handleScroll = () => requestDraw();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const handleResize = () => {
      resizeCanvas();
      requestDraw(true);
    };

    window.addEventListener("resize", handleResize);
    requestDraw();

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearStyles();
      document.documentElement.classList.remove("has-persona-particles");
    };
  }, [source, targets]);

  return <canvas ref={canvasRef} className="persona-particle-canvas" aria-hidden="true" />;
}
