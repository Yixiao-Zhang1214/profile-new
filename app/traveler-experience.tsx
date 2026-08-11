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

const travelFrames = Array.from({ length: 11 }, (_, index) => ({
    place: `旅行影像 ${String(index + 1).padStart(2, "0")}`,
    note: "Inspiration",
  image: `/travel/inspiration/full/photo-${String(index + 1).padStart(2, "0")}.jpg`,
}));

const swipeStackPlaceholders = [
  { src: "/travel/inspiration/stack-01.jpg", alt: "Inspiration 竖版旅行照片 1" },
  { src: "/travel/inspiration/stack-02.jpg", alt: "Inspiration 竖版旅行照片 2" },
  { src: "/travel/inspiration/stack-03.jpg", alt: "Inspiration 竖版旅行照片 3" },
  { src: "/travel/inspiration/stack-04.jpg", alt: "Inspiration 竖版旅行照片 4" },
];

function TravelSwipeStack() {
  const [cards, setCards] = useState(() => swipeStackPlaceholders.map((_, index) => index));
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [expanded, setExpanded] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const finishDrag = (target: HTMLButtonElement, pointerId: number) => {
    const distance = Math.hypot(drag.x, drag.y);
    if (distance > 50) {
      setCards(([first, ...rest]) => [...rest, first]);
    }
    pointerStart.current = null;
    setDrag({ x: 0, y: 0, active: false });
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
  };

  return (
    <div
      className="travel-swipe-stack"
      aria-label="可拖拽切换的旅行图片"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="travel-swipe-stack-stage">
        {cards.map((imageIndex, index) => {
          const image = swipeStackPlaceholders[imageIndex];
          const isTop = index === 0;
          const hoverPositions = [
            { x: 0, y: 0, rotate: 0 },
            { x: -122, y: -96, rotate: -14 },
            { x: 118, y: -84, rotate: 13 },
            { x: -132, y: 92, rotate: -18 },
          ];
          const restingPositions = [
            { x: 0, y: 0, rotate: 0 },
            { x: -8, y: -9, rotate: -3 },
            { x: 10, y: -15, rotate: 4 },
            { x: -14, y: -21, rotate: -6 },
          ];
          const restingPosition = restingPositions[index];
          const position = expanded ? hoverPositions[index] : restingPosition;
          const x = isTop && drag.active ? drag.x : position.x;
          const y = isTop && drag.active ? drag.y : position.y;
          const rotation = isTop && drag.active ? 0 : position.rotate;
          const scale = isTop && drag.active ? 1.04 : 1 - index * 0.045;

          return (
            <button
              type="button"
              className={`travel-swipe-card${isTop ? " is-top" : ""}${drag.active && isTop ? " is-dragging" : ""}`}
              key={imageIndex}
              aria-label={isTop ? "拖动这张图片切换下一张" : image.alt}
              tabIndex={isTop ? 0 : -1}
              style={{
                zIndex: cards.length - index,
                transform: `translate3d(${x}px, ${y}px, ${index * -10}px) rotate(${rotation}deg) scale(${scale})`,
              }}
              onPointerDown={isTop ? (event) => {
                pointerStart.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({ x: 0, y: 0, active: true });
              } : undefined}
              onPointerMove={isTop ? (event) => {
                if (!pointerStart.current) return;
                setDrag({
                  x: event.clientX - pointerStart.current.x,
                  y: event.clientY - pointerStart.current.y,
                  active: true,
                });
              } : undefined}
              onPointerUp={isTop ? (event) => finishDrag(event.currentTarget, event.pointerId) : undefined}
              onPointerCancel={isTop ? (event) => finishDrag(event.currentTarget, event.pointerId) : undefined}
              onKeyDown={isTop ? (event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                setCards(([first, ...rest]) => [...rest, first]);
              } : undefined}
            >
              <img src={image.src} alt={image.alt} draggable={false} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TravelFrame({ index, compact = false }: { index: number; compact?: boolean }) {
  const frame = travelFrames[index % travelFrames.length];

  return (
    <figure className={`travel-frame travel-frame-${(index % 5) + 1}${compact ? " is-compact" : ""}`}>
      <img src={frame.image} alt="" aria-hidden="true" />
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
              <span><strong>16</strong> 个国家</span>
            </div>
            <h3>{identity.statement}</h3>
            <p>
              去过 16 个国家，带领过 30+ 次旅行项目，也把旅途中观察到的真实需求，变成了一次成功的
              <strong>旅行创业实践。</strong>
            </p>
          </header>

          <div className="traveler-map-stage">
            <img src="/travel/world-map-handdrawn.png" alt="标有十六个到访国家的手绘世界地图" />
            <button type="button" className="traveler-next-cue" onClick={() => changePage(1)}>
              <span>旅行创业实践 · 2023.11 至今</span>
              <strong>旅行实验室</strong>
              <small>创始人 &amp; 产品负责人</small>
              <div>
                <b>30+ 次旅行项目</b>
                <b>4000+ 活跃成员</b>
              </div>
              <em className="traveler-click-hint">点击进入项目 →</em>
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
                <h2>Inspiration 旅行实验室</h2>
                <span>青年旅行社群</span>
              </div>
              <div className="travel-detail-summary">
                <p className="travel-detail-lead">
                  由沪上高校领队与户外爱好者发起，我们从真实旅行经验出发，组织户外、非遗、瑜伽与禅修等多种体验，探索不同于标准行程的青年旅行方式。
                </p>
                <div className="travel-detail-role">
                  <strong>创始人 · 主要产品经理</strong>
                  <span>战略制定 / 市场调研 / 产品规划 / 社群运营 / AI 开发</span>
                </div>
                <div className="travel-detail-metrics" aria-label="项目核心成果">
                  <div>
                    <strong>5k+</strong>
                    <span>旅行小精灵使用次数</span>
                  </div>
                  <div>
                    <strong>4000+</strong>
                    <span>四个月社群成员</span>
                  </div>
                  <div>
                    <strong>50w+</strong>
                    <span>项目累计流水</span>
                  </div>
                </div>
                <p className="travel-detail-reach">
                  以上海为中心辐射全国，为年轻人提供「轻户外」精品旅行服务，影响力覆盖十余所高校及企业。
                </p>
              </div>
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

            <div className="travel-project-visual">
              <TravelSwipeStack />
            </div>

            <button type="button" className="traveler-back-cue" onClick={() => changePage(0)} aria-label="返回旅行者介绍">
              ← 返回旅行者介绍
            </button>
          </div>

          <div className="traveler-intro-carousel">
            <TravelIntroRail active={page === 1} />
          </div>
        </article>
      </div>
    </section>
  );
}
