"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ProductManagerIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  skills: string;
};

type ProductExperience = {
  id: string;
  company: string;
  team: string;
  role: string;
  period: string;
  summary: string;
  metrics: string[];
  details: Array<{
    title: string;
    body: string;
  }>;
};

const experiences: ProductExperience[] = [
  {
    id: "bytedance-ai-commerce",
    company: "字节跳动",
    team: "中国电商 AI 应用",
    role: "AI 应用产品经理实习",
    period: "2026.06 - 至今",
    summary:
      "负责 AI 小应的直播选品与 AI 话术生成能力，参与产品设计、实验验证、效果评测与迭代优化。",
    metrics: ["DAU +7.48%", "直播 GMV +3%", "人均选品率 +20%"],
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
    team: "抖音精选",
    role: "AI 产品经理实习",
    period: "2026.01 - 2026.06",
    summary:
      "从 0 到 1 搭建抖音精选首个全局 AI Agent，落地交互式推荐与个性化主题播单。",
    metrics: ["入口点击率 4 倍", "执行渗透 4 倍", "相关性 50% → 73%"],
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
    team: "小爱",
    role: "大模型产品经理实习",
    period: "2025.08 - 2026.01",
    summary:
      "负责翻译与闹钟两大高流量垂域的云端 AI 交互架构、模型优化与策略迭代。",
    metrics: ["满足率 +14.27%", "Agent 替代 46% → 95%", "P00 解决率 +23%"],
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="pm-dialog-backdrop" onMouseDown={onClose}>
      <section
        className="pm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${experience.id}-title`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="pm-dialog-header">
          <div>
            <p>{experience.company}</p>
            <span>{experience.team}</span>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="pm-dialog-title-row">
          <div>
            <h2 id={`${experience.id}-title`}>{experience.role}</h2>
            <p>{experience.period}</p>
          </div>
          <div className="pm-dialog-metrics" aria-label="关键结果">
            {experience.metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>
        </div>

        <p className="pm-dialog-summary">{experience.summary}</p>

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
      </section>
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="product-manager-experience">
      <header className="pm-copy">
        <div className="pm-copy-meta">
          <div>
            <p>{identity.english}</p>
            <h2>{identity.name}</h2>
          </div>
          <small>{identity.skills}</small>
        </div>
        <h3>{identity.statement.replace("\n", " ")}</h3>
        <span>{identity.intro}</span>
      </header>

      <section className="pm-experience-section" aria-label="产品实习经历">
        <div className="pm-section-heading">
          <h3>实习经历</h3>
          <span>点击卡片查看项目方法与结果</span>
        </div>

        <div className="pm-experience-grid">
          {experiences.map((experience) => (
            <button
              className="pm-experience-card"
              type="button"
              key={experience.id}
              aria-haspopup="dialog"
              onClick={() => setSelectedExperience(experience)}
            >
              <div className="pm-card-topline">
                <span>{experience.period}</span>
                <i aria-hidden="true">展开</i>
              </div>
              <div className="pm-card-company">
                <h4>{experience.company}</h4>
                <p>{experience.team}</p>
              </div>
              <strong>{experience.role}</strong>
              <p className="pm-card-summary">{experience.summary}</p>
              <div className="pm-card-metrics" aria-label="关键结果">
                {experience.metrics.map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>
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
