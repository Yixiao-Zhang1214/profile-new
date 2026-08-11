"use client";

import { useEffect, useRef } from "react";

type ParticleSample = {
  u: number;
  v: number;
  color: [number, number, number];
  edgeDepth: number;
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
    const size = width * height;
    const opaque = new Uint8Array(size);
    const distance = new Uint16Array(size);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        const isOpaque = pixels[index * 4 + 3] >= 72;
        opaque[index] = isOpaque ? 1 : 0;
        distance[index] = isOpaque
          ? (x === 0 || y === 0 || x === width - 1 || y === height - 1 ? 1 : 65535)
          : 0;
      }
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (!opaque[index]) continue;
        if (x > 0) distance[index] = Math.min(distance[index], distance[index - 1] + 1);
        if (y > 0) distance[index] = Math.min(distance[index], distance[index - width] + 1);
      }
    }

    let maximumDepth = 1;
    for (let y = height - 1; y >= 0; y -= 1) {
      for (let x = width - 1; x >= 0; x -= 1) {
        const index = y * width + x;
        if (!opaque[index]) continue;
        if (x < width - 1) distance[index] = Math.min(distance[index], distance[index + 1] + 1);
        if (y < height - 1) distance[index] = Math.min(distance[index], distance[index + width] + 1);
        maximumDepth = Math.max(maximumDepth, distance[index]);
      }
    }

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const offset = (y * width + x) * 4;
        if (pixels[offset + 3] < 72) continue;
        const depth = distance[y * width + x];
        candidates.push({
          u: x / width,
          v: y / height,
          color: [pixels[offset], pixels[offset + 1], pixels[offset + 2]],
          edgeDepth: clamp((depth - 1) / Math.max(1, maximumDepth - 1)),
        });
      }
    }
  }

  if (candidates.length === 0) {
    return Array.from({ length: count }, () => ({
      u: 0.5,
      v: 0.5,
      color: [92, 88, 76] as [number, number, number],
      edgeDepth: 0,
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
      const scrollDistance = window.innerHeight - introBounds.top;
      const triggerDistance = Math.max(10, window.innerHeight * 0.012);
      if (scrollDistance <= triggerDistance) return 0;
      return clamp(
        (scrollDistance - triggerDistance) / (window.innerHeight * 0.58),
      );
    };

    const draw = (progress: number) => {
      heroImage.style.opacity = String(1 - smoothstep(0.025, 0.38, progress));
      targetImages.forEach((image, index) => {
        const reveal = smoothstep(0.64 + index * 0.014, 0.96, progress);
        const link = image.closest<HTMLElement>("a");
        link?.style.setProperty("--persona-opacity", String(reveal));
        link?.style.setProperty("--persona-rise", `${(1 - reveal) * 26}px`);
      });

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (progress <= 0.012 || progress >= 0.992 || particles.length === 0) return;

      const liveSourceRect = getContainedImageRect(heroImage);
      const sourceAnchor = smoothstep(0.01, 0.08, progress);
      const sourceRect = new DOMRect(
        liveSourceRect.x,
        liveSourceRect.y + window.scrollY * sourceAnchor,
        liveSourceRect.width,
        liveSourceRect.height,
      );
      const targetRects = targetImages.map(getContainedImageRect);
      const movement = smoothstep(0.3, 0.94, progress);
      const dissolve = smoothstep(0.005, 0.09, progress);
      const settleFade = smoothstep(0.82, 0.98, progress);
      const particleOpacity = dissolve * (1 - settleFade);
      const driftPhase = Math.sin(Math.PI * smoothstep(0.025, 0.9, progress));

      particles.forEach((particle) => {
        const targetRect = targetRects[particle.targetIndex];
        const sourceX = sourceRect.x + sourceRect.width * particle.source.u;
        const sourceY = sourceRect.y + sourceRect.height * particle.source.v;
        const targetX = targetRect.x + targetRect.width * particle.target.u;
        const targetY = targetRect.y + targetRect.height * particle.target.v;
        const releaseStart = particle.source.edgeDepth * 0.31 + particle.seed * 0.018;
        const release = smoothstep(releaseStart, releaseStart + 0.13, progress);
        const driftEnvelope = driftPhase * release;
        const driftDistance = 88 + particle.seed * 132 + (1 - particle.source.edgeDepth) * 74;
        const drift = driftDistance * driftEnvelope;
        const particleMovement = movement * release;
        const x =
          sourceX + (targetX - sourceX) * particleMovement + particle.directionX * drift;
        const y =
          sourceY +
          (targetY - sourceY) * particleMovement +
          particle.directionY * drift -
          driftEnvelope * (18 + particle.seed * 42);
        const red = Math.round(
          particle.source.color[0] +
            (particle.target.color[0] - particle.source.color[0]) * particleMovement,
        );
        const green = Math.round(
          particle.source.color[1] +
            (particle.target.color[1] - particle.source.color[1]) * particleMovement,
        );
        const blue = Math.round(
          particle.source.color[2] +
            (particle.target.color[2] - particle.source.color[2]) * particleMovement,
        );
        const radius = particle.radius * (1 + driftEnvelope * 0.58);
        const opacity = particleOpacity * (0.08 + release * 0.92) * (0.72 + particle.seed * 0.28);

        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      });
    };

    const animate = (time: number) => {
      frame = 0;
      if (!assetsReady || disposed) return;

      const elapsed = previousFrameTime ? Math.min(34, time - previousFrameTime) : 16;
      previousFrameTime = time;
      const difference = desiredProgress - renderedProgress;
      const timeConstant = difference >= 0 ? 130 : 150;
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
        const particleCount = window.innerWidth <= 720 ? 2400 : 5200;
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
