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
    title: "印尼毕业线招募｜颠沛流离，也不愿说再见",
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
            { x: -84, y: -44, rotate: -16 },
            { x: 76, y: -38, rotate: 15 },
            { x: -92, y: 47, rotate: -20 },
          ];
          const restingPositions = [
            { x: 0, y: 0, rotate: 0 },
            { x: -3, y: -2, rotate: -3 },
            { x: 4, y: -3, rotate: 4 },
            { x: -5, y: -4, rotate: -6 },
          ];
          const restingPosition = restingPositions[index];
          const position = expanded ? hoverPositions[index] : restingPosition;
          const x = isTop && drag.active ? `${drag.x}px` : `${position.x}%`;
          const y = isTop && drag.active ? `${drag.y}px` : `${position.y}%`;
          const rotation = isTop && drag.active ? 0 : position.rotate;
          const scale = isTop && drag.active ? 1.04 : 1 - index * 0.028;

          return (
            <button
              type="button"
              className={`travel-swipe-card${isTop ? " is-top" : ""}${drag.active && isTop ? " is-dragging" : ""}`}
              key={imageIndex}
              aria-label={isTop ? "拖动这张图片切换下一张" : image.alt}
              tabIndex={isTop ? 0 : -1}
              style={{
                zIndex: cards.length - index,
                transform: `translate3d(${x}, ${y}, ${index * -10}px) rotate(${rotation}deg) scale(${scale})`,
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
              <img
                src={image.src}
                alt={image.alt}
                draggable={false}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
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
      <img
        src={frame.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
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
              <span>漫游 <strong>16</strong> 个国家</span>
            </div>
            <h3>{identity.statement}</h3>
            <p>
              “人生漫游者”是我的信条，我相信生活在别处能持续给我带来灵感。<br />从 2023 年开始，我组织了 30 多次旅行项目，建立了一个 4000 多人的社群，也把一路遇到的需求做成了产品。
            </p>
          </header>

          <div className="traveler-map-stage">
            <img
              src="/travel/world-map-handdrawn.png"
              alt="标有十六个到访国家的手绘世界地图"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <button type="button" className="traveler-next-cue" onClick={() => changePage(1)}>
              <span>旅行创业实践 · 2023.11 至今</span>
              <strong>旅行实验室</strong>
              <small>创始人 &amp; 产品负责人</small>
              <div>
                <b>组织 30+ 次旅行项目</b>
                <b>社群有 4000+ 名活跃成员</b>
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
                <span>一个从上海出发的青年旅行社群</span>
              </div>
              <div className="travel-detail-summary">
                <p className="travel-detail-lead">
                  我们是一群沪上高校领队和户外爱好者，组织户外、非遗、瑜伽和禅修等旅行活动。比起复制标准行程，我们更愿意从自己真正喜欢的体验开始设计。
                </p>
                <div className="travel-detail-role">
                  <strong>创始人 / 产品负责人</strong>
                  <span>负责战略、调研、产品规划和社群运营，也参与 AI 开发。</span>
                </div>
                <div className="travel-detail-metrics" aria-label="项目核心成果">
                  <div>
                    <strong>5k+</strong>
                    <span>旅行小精灵AI使用次数</span>
                  </div>
                  <div>
                    <strong>4000+</strong>
                    <span>四个月积累社群成员</span>
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
              <nav
                className="travel-route-links"
                aria-label="精彩旅行线路"
              >
                {routeLinks.map((route) => (
                  <a
                    href={route.href}
                    target="_blank"
                    rel="noreferrer"
                    key={route.href}
                  >
                    <span className="travel-route-cover">
                      <img
                        src={route.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
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
