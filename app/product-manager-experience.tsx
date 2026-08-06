"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type ProductManagerIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  skills: string;
};

const subscribeToNothing = () => () => {};

type ProductExperience = {
  id: string;
  company: string;
  logo: string;
  team: string;
  role: string;
  period: string;
  summary: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  details: Array<{
    title: string;
    body: string;
  }>;
};

const experiences: ProductExperience[] = [
  {
    id: "bytedance-ai-commerce",
    company: "字节跳动",
    logo: "/companies/bytedance.svg",
    team: "中国电商 AI 应用",
    role: "AI 应用产品经理实习",
    period: "2026.06 - 至今",
    summary:
      "负责 AI 小应的直播选品与 AI 话术生成能力，参与产品设计、实验验证、效果评测与迭代优化。",
    metrics: [
      { value: "+7.48%", label: "DAU" },
      { value: "+3%", label: "直播 GMV" },
      { value: "+20%", label: "人均选品率" },
    ],
    details: [
      {
        title: "AI 直播选品 Skill",
        body:
          "针对中低等级达人不会找品组品、缺乏货盘意识的问题，基于达人画像、同类优质直播间货盘与商品转化表现，设计商品分角色召回与组装策略，并新增 Agent 组品入口。经 AB 实验验证，人均选品率提升 20%，开播渗透提升 0.36%，人均 GMV 提升 2%。",
      },
      {
        title: "AI 直播话术 Skill",
        body:
          "针对达人备词成本高的问题，搭建基于达人画像、行业高转化话术框架与流量策略的实时话术生成能力。负责达人人设蒸馏 Skill，定义人设抽取策略、话术理想态与 12 个维度的评测标准。直播话术 UV 采纳率提升 36.19%，开播渗透提升 0.09%。",
      },
      {
        title: "Agent 基建",
        body:
          "主导巨量百应、AI 小应、AI 客服与观客器融合，负责意图识别、智能分流路由、跨容器上下文和 Query 携带方案，实现 Query 自动分发与无缝流转，提升 AI 应用访问渗透率并降低拒答率。",
      },
    ],
  },
  {
    id: "douyin-selected",
    company: "字节跳动",
    logo: "/companies/bytedance.svg",
    team: "抖音精选",
    role: "AI 产品经理实习",
    period: "2026.01 - 2026.06",
    summary:
      "从 0 到 1 搭建抖音精选首个全局 AI Agent，落地交互式推荐与个性化主题播单。",
    metrics: [
      { value: "4×", label: "入口点击率" },
      { value: "4×", label: "执行渗透" },
      { value: "73%", label: "推荐相关性" },
    ],
    details: [
      {
        title: "交互式推荐",
        body:
          "针对用户主动调整首页推荐视频的需求，建设自然语言指令调整 feed 流能力，通过即时强插与 7 天意图有效期机制，平衡短期明确需求和长期内容多样性，并通过 badcase 归因解决意图识别、内容召回与分发稳定性问题。",
      },
      {
        title: "个性化播单",
        body:
          "参与兴趣主题播单搭建和全链路交互 UI 设计，制定用户兴趣画像准入与清洗规则，独立负责兴趣点清洗、意图分流、文案生成等全链路 Prompt 调试。定义内容排序权重，推动内容消费从碎片化向结构化主题升级。",
      },
      {
        title: "入口体验与渗透优化",
        body:
          "针对用户入口认知弱、使用率低的问题，设计专属入口图标与轻量化气泡引导。入口点击率从 0.48% 提升至 1.83%，确认执行渗透从 0.03% 提升至 0.12%，均实现约 4 倍提升。",
      },
      {
        title: "语义匹配链路升级",
        body:
          "推动语义匹配链路从关键词规则匹配升级为 LLM Query Refine 改写匹配，协同算法优化意图识别与内容召回效果，视频推荐相关性从 50% 提升至 73%。",
      },
    ],
  },
  {
    id: "xiaomi-xiaoai",
    company: "小米科技",
    logo: "/companies/xiaomi.svg",
    team: "小爱",
    role: "大模型产品经理实习",
    period: "2025.08 - 2026.01",
    summary:
      "负责翻译与闹钟两大高流量垂域的云端 AI 交互架构、模型优化与策略迭代。",
    metrics: [
      { value: "+14.27%", label: "整体满足率" },
      { value: "95%", label: "Agent 替代逻辑" },
      { value: "+23%", label: "P00 解决率" },
    ],
    details: [
      {
        title: "理想态建设",
        body:
          "主导小爱多模态翻译评测体系从 0 到 1 落地与标注人员培训，对标竞品并锚定用户需求，牵引体验和垂域满足率提升。",
      },
      {
        title: "Agent 迁移",
        body:
          "针对传统规则策略和小模型在意图理解与结果满足环节僵化的问题，并行推进闹钟垂域 Agent 在手机、音箱、电视、座舱、眼镜 5 个终端落地。沉淀高效迁移方法，推动 Agent 整体替代逻辑从 46% 提升至 95%。",
      },
      {
        title: "大模型能力迭代与策略优化",
        body:
          "搭建数据构建、评测诊断、策略调优闭环，设计模型评测方案，制定黑白盒测试集和微调训练集，落地十余项 badcase 治理专项，推动 P00 badcase 解决率提升 23%。同时完成文本、图片翻译供应商接入，并通过备选供应商与缓存机制加强质量保障。",
      },
    ],
  },
];

function ExperienceDialog({
  experience,
  onClose,
}: {
  experience: ProductExperience;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
          ),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  return (
    <div className="pm-dialog-backdrop" onPointerDown={onClose}>
      <aside
        ref={dialogRef}
        className="pm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${experience.id}-title`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="pm-dialog-header">
          <div className="pm-dialog-company">
            <img src={experience.logo} alt="" />
            <div>
              <p>{experience.company}</p>
              <span>{experience.team}</span>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="pm-dialog-title-row">
          <p>{experience.period}</p>
          <h2 id={`${experience.id}-title`}>{experience.role}</h2>
          <p className="pm-dialog-summary">{experience.summary}</p>
        </div>

        <div className="pm-dialog-metrics" aria-label="关键结果">
          {experience.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="pm-dialog-details">
          {experience.details.map((detail, index) => (
            <article className="pm-dialog-detail" key={detail.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function ProductManagerExperience({
  identity,
}: {
  identity: ProductManagerIdentity;
}) {
  const [selectedExperience, setSelectedExperience] =
    useState<ProductExperience | null>(null);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  return (
    <div className="product-manager-experience">
      <header className="pm-copy">
        <div className="pm-copy-meta">
          <h2>{identity.name}</h2>
          <span>{identity.english}</span>
        </div>
        <h3>{identity.statement.replace("\n", " ")}</h3>
        <p>{identity.intro}</p>
      </header>

      <section className="pm-experience-section" aria-label="产品实习经历">
        <div className="pm-section-heading">
          <h3>实习经历</h3>
          <span>选择一段经历，查看项目方法与结果</span>
        </div>

        <div className="pm-experience-list">
          {experiences.map((experience) => (
            <button
              className="pm-experience-row"
              type="button"
              key={experience.id}
              aria-haspopup="dialog"
              onClick={() => setSelectedExperience(experience)}
            >
              <span className="pm-timeline-logo" aria-hidden="true">
                <img src={experience.logo} alt="" />
              </span>
              <time>{experience.period}</time>
              <div className="pm-role-copy">
                <div className="pm-company-line">
                  <div>
                    <h4>{experience.company}</h4>
                    <span>{experience.team}</span>
                  </div>
                </div>
                <strong>{experience.role}</strong>
                <p>{experience.summary}</p>
              </div>
              <span className="pm-row-action" aria-hidden="true">
                <span>详情</span>
                <i>→</i>
              </span>
            </button>
          ))}
        </div>
      </section>

      {mounted &&
        selectedExperience &&
        createPortal(
          <ExperienceDialog
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />,
          document.body,
        )}
    </div>
  );
}
