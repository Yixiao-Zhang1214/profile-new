"use client";

import { useEffect } from "react";

const resourcesByIntent: Record<string, string[]> = {
  "新闻与传播": [
    "/journalism/interview-card-reference.png",
    "/personas/news-interviewer-camera-transparent.png",
  ],
  "AI 产品经理": [
    "/product-experience/bytedance-commerce.png",
    "/product-experience/douyin-selected.png",
    "/product-experience/xiaomi-ai.png",
  ],
  "AI Builder": [
    "/ai-builder/xhs-comment-prototype.jpg",
    "/ai-builder/sunrise-sunset-simulator.png",
    "/ai-builder/memento-original-card.jpg",
    "/ai-builder/xingwua-navigation-poster.png",
    "/ai-builder/badcase-01-tool-home.png",
    "/ai-builder/business-evaluation-platform.png",
  ],
  "旅行家": [
    "/travel/world-map-handdrawn.png",
    "/travel/inspiration/stack-01.jpg",
    "/travel/inspiration/stack-02.jpg",
    "/travel/inspiration/stack-03.jpg",
    "/travel/routes/xiapu.jpg",
    "/travel/routes/thailand.jpg",
    "/travel/routes/indonesia.jpg",
  ],
  "摄影师": Array.from(
    { length: 8 },
    (_, index) => `/photography/photo-${String(index + 1).padStart(2, "0")}.webp`,
  ),
  "日出日落模拟器": [
    "/living-ocean/",
    "/ai-builder/sunrise-sunset-simulator.png",
  ],
  "大家补充了什么": ["/ai-builder/xhs-comment-prototype.jpg"],
  Memento: [
    "/ai-builder/memento-original-card.jpg",
    "/ai-builder/memento-cup-sample.jpg",
    "/ai-builder/memento-travel-sample.jpg",
  ],
  "行无碍": ["/ai-builder/xingwua-navigation-poster.png"],
  "Badcase评测&管理平台": [
    "/ai-builder/badcase-01-tool-home.png",
    "/ai-builder/badcase-02-evaluation-task.png",
    "/ai-builder/badcase-03-prompt-tuning.png",
    "/ai-builder/badcase-04-case-management.png",
    "/ai-builder/badcase-05-case-discussion.png",
    "/ai-builder/badcase-06-evaluation-results.png",
  ],
  "业务评测平台": ["/ai-builder/business-evaluation-platform.png"],
};

const warmed = new Set<string>();

function warmResource(url: string, priority: "high" | "low" = "high") {
  if (warmed.has(url)) return;
  warmed.add(url);

  if (url.endsWith("/")) {
    void fetch(url, { cache: "force-cache", priority: priority === "high" ? "high" : "low" });
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  image.src = url;
  void image.decode().catch(() => undefined);
}

function warmIntent(text: string) {
  for (const [intent, resources] of Object.entries(resourcesByIntent)) {
    if (text.includes(intent)) resources.forEach((resource) => warmResource(resource));
  }
}

export function ResourcePreheater() {
  useEffect(() => {
    const handleIntent = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, [role='button']");
      if (interactive) warmIntent(interactive.textContent ?? "");
    };

    document.addEventListener("pointerover", handleIntent, { passive: true, capture: true });
    document.addEventListener("focusin", handleIntent, true);

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const canWarmInBackground = !connection?.saveData && connection?.effectiveType !== "2g";
    const warmLikelyNext = () => {
      if (!canWarmInBackground) return;
      resourcesByIntent["AI Builder"].slice(0, 4).forEach((resource) => warmResource(resource, "low"));
    };
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(warmLikelyNext, { timeout: 3500 })
      : window.setTimeout(warmLikelyNext, 1800);

    return () => {
      document.removeEventListener("pointerover", handleIntent, true);
      document.removeEventListener("focusin", handleIntent, true);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  return null;
}
