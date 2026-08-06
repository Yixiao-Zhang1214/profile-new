"use client";

import { useEffect, useRef, useState } from "react";

type TravelerIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  character: string | null;
};

const routeLinks = [
  {
    href: "https://mp.weixin.qq.com/s/AbFVRO-soz3lelil_eJu6w",
    image: "/travel/routes/xiapu.jpg",
    title: "五一霞浦｜相约人间塞尔达",
  },
  {
    href: "https://mp.weixin.qq.com/s/WCBj2s7mrfz8GxmS7Dh-yg",
    image: "/travel/routes/thailand.jpg",
    title: "五月泰国毕业线｜夏日大作战",
  },
  {
    href: "https://mp.weixin.qq.com/s/NLoQMCfc-__FNJQREICA4Q",
    image: "/travel/routes/indonesia.jpg",
    title: "印尼招募｜颠沛流离，也不愿说再见",
  },
];

const travelFrames = [
  { place: "冰岛", note: "北纬 64°" },
  { place: "意大利", note: "街巷与日常" },
  { place: "埃及", note: "沿尼罗河" },
  { place: "泰国", note: "热带旅程" },
  { place: "日本", note: "城市观察" },
];

function TravelFrame({ index, compact = false }: { index: number; compact?: boolean }) {
  const frame = travelFrames[index % travelFrames.length];

  return (
    <figure className={`travel-frame travel-frame-${(index % 5) + 1}${compact ? " is-compact" : ""}`}>
      <img src="/travel/world-map-handdrawn.png" alt="" aria-hidden="true" />
      <div aria-hidden="true" />
      {!compact && (
        <figcaption>
          <strong>{frame.place}</strong>
          <span>{frame.note} · 照片待替换</span>
        </figcaption>
      )}
    </figure>
  );
}

function TravelIntroRail({ active }: { active: boolean }) {
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number } | null>(null);
  const loopedFrames = [...travelFrames, ...travelFrames];

  useEffect(() => {
    if (!active || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let animationFrame = 0;

    const advance = () => {
      const viewport = viewportRef.current;
      const firstDuplicate = viewport?.querySelector<HTMLElement>("[data-intro-frame='5']");
      if (viewport && firstDuplicate) {
        viewport.scrollLeft += 0.42;
        if (viewport.scrollLeft >= firstDuplicate.offsetLeft) {
          viewport.scrollLeft -= firstDuplicate.offsetLeft;
        }
      }
      animationFrame = window.requestAnimationFrame(advance);
    };

    animationFrame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, paused]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setPaused(true);
      viewport.scrollLeft += event.deltaX + event.deltaY;
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section
      className="travel-intro-rail"
      aria-label="连续旅行照片轮播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      ref={viewportRef}
      onPointerDown={(event) => {
        dragRef.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
        event.currentTarget.setPointerCapture(event.pointerId);
        setPaused(true);
      }}
      onPointerMove={(event) => {
        if (!dragRef.current) return;
        event.currentTarget.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x);
      }}
      onPointerUp={(event) => {
        dragRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { dragRef.current = null; }}
    >
      <div className="travel-intro-track">
        {loopedFrames.map((frame, index) => (
          <div data-intro-frame={index} key={`${frame.place}-${index}`}>
            <TravelFrame index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TravelCarousel({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number } | null>(null);

  const goTo = (nextIndex: number) => {
    const normalized = (nextIndex + travelFrames.length) % travelFrames.length;
    const viewport = viewportRef.current;
    const item = viewport?.querySelector<HTMLElement>(`[data-travel-frame="${normalized}"]`);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (viewport && item) viewport.scrollTo({ left: item.offsetLeft, behavior });
    setIndex(normalized);
  };

  useEffect(() => {
    if (!active || interactionPaused || hovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goTo(index + 1), 4500);
    return () => window.clearInterval(timer);
  }, [active, index, interactionPaused, hovered]);

  return (
    <section
      className="travel-carousel"
      aria-label="旅行照片轮播"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="travel-carousel-heading">
        <p>旅行照片 · 待替换</p>
        <div>
          <span>{String(index + 1).padStart(2, "0")} / {String(travelFrames.length).padStart(2, "0")}</span>
          <button
            type="button"
            onClick={() => setInteractionPaused((current) => !current)}
            aria-label={interactionPaused ? "继续自动播放" : "暂停自动播放"}
          >
            {interactionPaused ? "播放" : "暂停"}
          </button>
          <button type="button" onClick={() => { setInteractionPaused(true); goTo(index - 1); }} aria-label="上一张旅行照片">←</button>
          <button type="button" onClick={() => { setInteractionPaused(true); goTo(index + 1); }} aria-label="下一张旅行照片">→</button>
        </div>
      </div>
      <div
        className="travel-carousel-viewport"
        ref={viewportRef}
        onPointerDown={(event) => {
          dragRef.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
          event.currentTarget.setPointerCapture(event.pointerId);
          setInteractionPaused(true);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return;
          event.currentTarget.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x);
        }}
        onPointerUp={(event) => {
          const viewport = event.currentTarget;
          dragRef.current = null;
          if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
          const items = [...viewport.querySelectorAll<HTMLElement>("[data-travel-frame]")];
          const nearest = items.reduce((best, item, itemIndex) =>
            Math.abs(item.offsetLeft - viewport.scrollLeft) < Math.abs(items[best].offsetLeft - viewport.scrollLeft)
              ? itemIndex
              : best, 0);
          goTo(nearest);
        }}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        <div className="travel-carousel-track">
          {travelFrames.map((frame, frameIndex) => (
            <div data-travel-frame={frameIndex} key={frame.place}>
              <TravelFrame index={frameIndex} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TravelerExperience({ identity }: { identity: TravelerIdentity }) {
  const [page, setPage] = useState(0);
  const chapterRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const wheelLockRef = useRef(0);

  const changePage = (nextPage: number) => setPage(Math.max(0, Math.min(1, nextPage)));

  return (
    <section
      className={`traveler-experience is-page-${page + 1}`}
      ref={chapterRef}
      aria-label="旅行家与旅行创业项目"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") changePage(1);
        if (event.key === "ArrowLeft") changePage(0);
      }}
      onWheel={(event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18) return;
        event.preventDefault();
        const now = Date.now();
        if (now - wheelLockRef.current < 520) return;
        wheelLockRef.current = now;
        changePage(event.deltaX > 0 ? 1 : 0);
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("a, button, .travel-carousel")) return;
        dragRef.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        if (!dragRef.current) return;
        const dx = event.clientX - dragRef.current.x;
        const dy = event.clientY - dragRef.current.y;
        dragRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) changePage(dx < 0 ? 1 : 0);
      }}
      onPointerCancel={() => { dragRef.current = null; }}
    >
      <div className="traveler-track" style={{ transform: `translate3d(-${page * 50}%, 0, 0)` }}>
        <article className="traveler-page traveler-intro-page" aria-hidden={page !== 0} inert={page !== 0}>
          <header className="traveler-copy">
            <div>
              <h2>{identity.name}</h2>
              <span><strong>16</strong> COUNTRIES</span>
            </div>
            <h3>{identity.statement}</h3>
            <p>{identity.intro}</p>
          </header>

          <div className="traveler-map-stage">
            <img src="/travel/world-map-handdrawn.png" alt="标有十六个到访国家的手绘世界地图" />
            <button type="button" className="traveler-next-cue" onClick={() => changePage(1)}>
              <span>旅行创业实践 · 2023.11 至今</span>
              <strong>Inspiration 旅行实验室</strong>
              <small>创始人 &amp; 产品负责人</small>
              <div>
                <b>30+ 次旅行项目</b>
                <b>4000+ 活跃成员</b>
              </div>
              <em>向左滑查看项目 →</em>
            </button>
          </div>

          <div className="traveler-intro-carousel">
            <TravelIntroRail active={page === 0} />
          </div>

        </article>

        <article className="traveler-page traveler-project-page" aria-hidden={page !== 1} inert={page !== 1}>
          <div className="travel-project-top">
            <header className="travel-project-copy">
              <div className="travel-project-title-row">
                <h2>Inspiration<br />旅行实验室</h2>
                <span>青年旅行社群</span>
              </div>
              <p>
                由沪上高校领队与户外爱好者发起，我们从真实旅行经验出发，组织户外、非遗、瑜伽与禅修等多种体验，探索不同于标准行程的青年旅行方式。
              </p>
              <nav className="travel-route-links" aria-label="精彩旅行线路">
                {routeLinks.map((route) => (
                  <a
                    href={route.href}
                    target="_blank"
                    rel="noreferrer"
                    key={route.href}
                  >
                    <span className="travel-route-cover">
                      <img src={route.image} alt="" aria-hidden="true" />
                    </span>
                    <span className="travel-route-copy">
                      <b>{route.title}</b>
                      <strong>阅读全文 ↗</strong>
                    </span>
                  </a>
                ))}
              </nav>
            </header>

            <figure className="travel-project-visual">
              <img src="/travel/inspiration-qr.png" alt="Inspiration 旅行实验室公众号二维码" />
              <figcaption>微信公众号 · 长按或扫码关注</figcaption>
            </figure>

            <button type="button" className="traveler-back-cue" onClick={() => changePage(0)} aria-label="返回旅行者介绍">
              ← 返回旅行者介绍
            </button>
          </div>

          <TravelCarousel active={page === 1} />
        </article>
      </div>
    </section>
  );
}
