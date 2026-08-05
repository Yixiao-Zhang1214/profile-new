"use client";

import { useEffect, useRef } from "react";

export default function HeroCover() {
  const heroRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateDepth = (x: number, y: number) => {
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
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
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
      onPointerLeave={() => updateDepth(0, 0)}
    >
      <div className="hero-meta hero-meta-left">
        <span>Your Name</span>
        <span>AI Product Manager</span>
      </div>
      <div className="hero-meta hero-meta-right">
        <span>Portfolio</span>
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
        <p>HELLO, I AM</p>
        <h1>ABOUT ME</h1>
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
  );
}
