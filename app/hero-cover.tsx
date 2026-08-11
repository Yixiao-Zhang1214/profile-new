"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroCover() {
  const heroRef = useRef<HTMLElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const updateDepth = (x: number, y: number, revealBrush = true) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const hero = heroRef.current;
      if (!hero) return;

      hero.style.setProperty("--hero-plane-x", `${x * 14}px`);
      hero.style.setProperty("--hero-plane-y", `${y * 10}px`);
      hero.style.setProperty("--hero-rotate-x", `${y * -1.4}deg`);
      hero.style.setProperty("--hero-rotate-y", `${x * 1.8}deg`);
      hero.style.setProperty("--hero-copy-x", `${x * -5}px`);
      hero.style.setProperty("--hero-copy-y", `${y * -3}px`);
      hero.style.setProperty("--hero-brush-x", `${(x + 0.5) * 100}%`);
      hero.style.setProperty("--hero-brush-y", `${(y + 0.5) * 100}%`);
      hero.style.setProperty("--hero-brush-opacity", revealBrush ? "0.72" : "0");
    });
  };

  useEffect(() => {
    let welcomeTimer: number | null = null;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShowWelcome(false);
    } else {
      welcomeTimer = window.setTimeout(() => setShowWelcome(false), 8000);
    }

    const skipWelcome = () => setShowWelcome(false);
    window.addEventListener("keydown", skipWelcome, { once: true });

    const previousScrollRestoration = window.history.scrollRestoration;
    let resetFrame: number | null = null;

    const resetHomePosition = () => {
      const isHomepage = window.location.pathname === "/";
      const hasSectionTarget =
        window.location.hash !== "" && window.location.hash !== "#top";

      if (!isHomepage || hasSectionTarget) return;

      window.history.scrollRestoration = "manual";
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);

      if (resetFrame !== null) cancelAnimationFrame(resetFrame);
      resetFrame = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousScrollBehavior;
        resetFrame = null;
      });
    };

    resetHomePosition();
    window.addEventListener("pageshow", resetHomePosition);

    return () => {
      window.removeEventListener("keydown", skipWelcome);
      window.removeEventListener("pageshow", resetHomePosition);
      window.history.scrollRestoration = previousScrollRestoration;
      if (welcomeTimer !== null) window.clearTimeout(welcomeTimer);
      if (resetFrame !== null) cancelAnimationFrame(resetFrame);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!showWelcome || !canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = canvas.getContext("2d");
    const heroImage = heroRef.current?.querySelector<HTMLImageElement>(".hero-character");
    if (!context || !heroImage) return;

    const source = new Image();
    let particleFrame: number | null = null;
    let cancelled = false;

    const prepareParticles = () => {
      if (cancelled) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const target = heroImage.getBoundingClientRect();
      const width = Math.max(1, Math.round(target.width));
      const height = Math.max(1, Math.round(target.height));
      const sampleStep = Math.max(7, Math.ceil(Math.sqrt((width * height) / 5000)));
      const buffer = document.createElement("canvas");
      const bufferContext = buffer.getContext("2d", { willReadFrequently: true });
      if (!bufferContext) return;

      canvas.width = Math.round(viewportWidth * dpr);
      canvas.height = Math.round(viewportHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buffer.width = width;
      buffer.height = height;
      bufferContext.drawImage(source, 0, 0, width, height);

      const pixels = bufferContext.getImageData(0, 0, width, height).data;
      const particles: Array<{
        color: string;
        delay: number;
        size: number;
        startX: number;
        startY: number;
        targetX: number;
        targetY: number;
      }> = [];

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const pixelIndex = (y * width + x) * 4;
          const alpha = pixels[pixelIndex + 3];
          if (alpha < 42) continue;

          const ribbonY = viewportHeight * (0.3 + Math.random() * 0.42);
          const ribbonX = viewportWidth * (-0.08 + Math.random() * 1.16);
          particles.push({
            color: `rgba(${pixels[pixelIndex]}, ${pixels[pixelIndex + 1]}, ${pixels[pixelIndex + 2]}, ${alpha / 255})`,
            delay: Math.random() * 520,
            size: sampleStep * (0.72 + Math.random() * 0.28),
            startX: ribbonX,
            startY: ribbonY + Math.sin(ribbonX * 0.014) * 92 + (Math.random() - 0.5) * 68,
            targetX: target.left + x,
            targetY: target.top + y,
          });
        }
      }

      const startedAt = performance.now();
      const assembleAt = 5000;
      const assembleDuration = 2350;

      const draw = (now: number) => {
        const elapsed = now - startedAt;
        context.clearRect(0, 0, viewportWidth, viewportHeight);

        if (elapsed >= assembleAt) {
          for (const particle of particles) {
            const progress = Math.max(0, Math.min(1, (elapsed - assembleAt - particle.delay) / assembleDuration));
            if (progress === 0) continue;
            const eased = 1 - Math.pow(1 - progress, 3);
            const drift = Math.sin((elapsed + particle.targetX) * 0.006) * 34 * (1 - eased);
            const x = particle.startX + (particle.targetX - particle.startX) * eased;
            const y = particle.startY + (particle.targetY - particle.startY) * eased + drift;
            const size = particle.size * (0.42 + eased * 0.58);
            context.globalAlpha = Math.min(1, progress * 4);
            context.fillStyle = particle.color;
            context.fillRect(x, y, size, size);
          }
        }

        context.globalAlpha = 1;
        if (!cancelled && elapsed < 7900) particleFrame = window.requestAnimationFrame(draw);
      };

      particleFrame = window.requestAnimationFrame(draw);
    };

    source.src = "/personas/hero-laughing-person-cutout.png";
    if (source.complete) prepareParticles();
    else source.addEventListener("load", prepareParticles, { once: true });

    return () => {
      cancelled = true;
      source.removeEventListener("load", prepareParticles);
      if (particleFrame !== null) window.cancelAnimationFrame(particleFrame);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [showWelcome]);

  return (
    <>
      {showWelcome && (
        <button
          className="welcome-intro"
          type="button"
          aria-label="跳过欢迎动画"
          onClick={() => setShowWelcome(false)}
        >
          <span className="welcome-ribbon welcome-ribbon-back" aria-hidden="true" />
          <span className="welcome-ribbon welcome-ribbon-middle" aria-hidden="true" />
          <span className="welcome-ribbon welcome-ribbon-front" aria-hidden="true" />
          <canvas className="welcome-particle-canvas" ref={particleCanvasRef} aria-hidden="true" />
          <span className="welcome-intro-word welcome-intro-hello">hello</span>
          <span className="welcome-intro-word welcome-intro-world">
            welcome to Yixiao’s world
          </span>
        </button>
      )}

      <section
        ref={heroRef}
        className="poster-hero"
        id="top"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;

          const bounds = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          updateDepth(x, y);
        }}
        onPointerLeave={() => updateDepth(0, 0, false)}
      >
        <div className="hero-brush-reveal" aria-hidden="true" />

        <div className="hero-meta hero-meta-left">
          <span>个人主页</span>
          <span>AI 产品经理</span>
        </div>
        <div className="hero-meta hero-meta-right">
          <span>作品集</span>
          <span>Shanghai · 2026</span>
        </div>

        <div className="hero-depth-plane">
          <img
            className="hero-character"
            src="/personas/hero-laughing-person-cutout.png"
            alt="开怀大笑的个人卡通形象"
          />
        </div>

        <div className="hero-message">
          <p>你好，我是</p>
          <h1>关于我</h1>
          <span>
            新闻与传播学生，也是 AI 产品经理、旅行家、摄影师和 AI Builder。
            <br />
            我在观察、表达与创造之间，寻找自己的答案。
          </span>
        </div>

        <a className="scroll-cue" href="#about">
          <span>向下认识我</span>
          <i aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
