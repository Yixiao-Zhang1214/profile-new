"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type BuilderIdentity = {
  english: string;
};

type BuilderProject = {
  number: string;
  kind: string;
  title: string;
  summary: string;
  tagline?: string;
  description: string;
  descriptionRich?: ReactNode;
  focus: string[];
  visual?: {
    src: string;
    alt: string;
  };
  sections?: Array<{
    title: string;
    body: ReactNode;
  }>;
  reportTable?: Array<{
    section: string;
    question: string;
  }>;
  note?: string;
  preview?: "comment" | "memento";
  demo?: "comment" | "memento";
  gallery?: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  video?: {
    src: string;
    poster: string;
    alt: string;
  };
  download?: {
    href: string;
    label: string;
  };
  embed?: {
    src: string;
    title: string;
  };
  link?: {
    href: string;
    label: string;
    installHref?: string;
  };
  flow?: Array<{
    title: string;
    detail: string;
  }>;
};

const aigcGallery = [
  { src: "/ai-builder/aigc/work-01.webp", alt: "云海、彩虹与气球中的白发女孩", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-02.webp", alt: "被书页环绕的阅读者", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-03.webp", alt: "头发化作秋叶与飞鸟的超现实人物", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-04.webp", alt: "漂浮纸张中的人物肖像", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-05.webp", alt: "夕阳湖畔奔跑的白裙女孩", width: 1915, height: 1078 },
  { src: "/ai-builder/aigc/work-06.webp", alt: "花瓣飞舞的金色湖畔场景", width: 1915, height: 1078 },
  { src: "/ai-builder/aigc/work-07.webp", alt: "夕阳下弹吉他的女孩", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-08.webp", alt: "风暴般书页中的阅读者", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-09.webp", alt: "暖色海边弹吉他的女孩", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-10.webp", alt: "脑海上生长建筑的超现实人物", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-11.webp", alt: "书页世界中的白裙阅读者", width: 731, height: 1299 },
  { src: "/ai-builder/aigc/work-12.webp", alt: "红线与机械结构中的幻想人物", width: 979, height: 1299 },
  { src: "/ai-builder/aigc/work-13.webp", alt: "暴风云下的蓝色雪山", width: 731, height: 1299 },
];

const aigcImageProject: BuilderProject = {
  number: "A",
  kind: "AIGC IMAGE",
  title: "AIGC 生图作品",
  summary: "人物、场景与超现实概念探索",
  description: "围绕人物情绪、电影感场景与超现实意象进行的视觉探索。",
  focus: ["视觉叙事", "风格控制", "画面表达"],
  gallery: aigcGallery,
  note: "共 13 幅作品，来自个人 AIGC 生图作品集。",
};

const aigcVideoProject: BuilderProject = {
  number: "B",
  kind: "AIGC VIDEO · LAB COLLABORATION",
  title: "《黄河捞尸人》宣传片",
  summary: "实验室合作项目 · 项目负责人",
  description:
    "恐怖短片《黄河捞尸人》的宣传片，由实验室合作完成。我担任项目负责人，统筹前期资产准备、视觉生成与视频制作流程。",
  focus: ["项目负责人", "AIGC 工作流", "一致性控制"],
  video: {
    src: "/ai-builder/aigc-video.mp4",
    poster: "/ai-builder/aigc-video-poster.jpg",
    alt: "恐怖短片《黄河捞尸人》AIGC 宣传片作品节选",
  },
  note: "作品节选 12 秒；完整制作以一致性与协调性为核心质量标准。",
};

const aigcVideoWorkflow = [
  {
    phase: "前期准备",
    title: "先把故事资产写清楚",
    detail: "完成剧本、分镜、人物小传和场景表，为后续视觉生成建立统一依据。",
    items: ["剧本", "分镜", "人物小传", "场景表"],
  },
  {
    phase: "视觉资产",
    title: "建立角色、场景与道具图库",
    detail:
      "使用生图 AI 制作角色正面、侧面、背面全身照，以及展示五官细节的大头照；同时完成主要场景和道具图。",
    items: ["三视图全身照", "五官大头照", "主要场景", "关键道具"],
  },
  {
    phase: "视频生成",
    title: "用可灵组织 15 秒镜头",
    detail:
      "选择适配的 AI 视频工具可灵，为每段 15 秒视频提前准备首帧和尾帧，再进入逐镜头生成与衔接。",
    items: ["可灵", "15 秒镜头", "首帧", "尾帧"],
  },
] as const;

const commentSuggestions = [
  {
    label: "补充观察",
    text: "好有感觉！花瓣被风卷起来的瞬间，让整个画面像故事刚刚开始。",
  },
  {
    label: "说得具体",
    text: "好有感觉！夕阳的暖色、奔跑的动作和前景虚化都特别有电影感。",
  },
  {
    label: "回应作者",
    text: "好有感觉！很喜欢这组光影和动态，下次也想试试这样的叙事画面。",
  },
];

const projectGroups: Array<{ title: string; english: string; projects: BuilderProject[] }> = [
  {
    title: "轻量产品实验",
    english: "LIGHTWEIGHT PRODUCT EXPERIMENTS",
    projects: [
      {
        number: "01",
        kind: "COMMENT INSIGHT",
        title: "大家补充了什么",
        summary: "评论区划重点 · 点击可回到原评论",
        description:
          "当用户看完一篇笔记、准备进入评论区时，可以主动生成一张轻量卡片，快速看到有价值的补充、提醒、不同体验和近期变化。每个重点都能跳转到相关评论，让用户回到原始语境，自己判断总结是否可信。",
        descriptionRich: (
          <>
            当用户看完一篇笔记、准备进入评论区时，可以
            <strong>主动生成一张轻量卡片</strong>，快速看到
            <strong>有价值的补充、提醒、不同体验和近期变化</strong>。
            <strong>每个重点都能跳转到相关评论</strong>
            ，让用户回到原始语境，自己判断总结是否可信。
          </>
        ),
        focus: ["评论理解", "高价值信息筛选", "原评论跳转"],
        sections: [
          {
            title: "真实场景",
            body: (
              <>
                攻略、测评、教程与避坑内容的用户往往会继续阅读评论区，因为
                <strong>适用条件、踩坑提醒和不同体验</strong>常常藏在正文之外。
              </>
            ),
          },
          {
            title: "核心问题",
            body: (
              <>
                时间流、热度流和楼中楼让
                <strong>高信息量评论难以被快速发现</strong>
                ，用户明知评论区有用，却需要<strong>反复翻找与判断</strong>。
              </>
            ),
          },
          {
            title: "产品机制",
            body: (
              <>
                由<strong>用户主动生成轻量卡片</strong>
                ，用社区化语气呈现补充、提醒、分歧与近况，并让
                <strong>每个重点都可以回到原评论</strong>。
              </>
            ),
          },
        ],
        preview: "comment",
        note: "不默认打扰，只在用户需要时生成；保留评论区的社区人感，同时降低筛选与判断成本。",
        embed: {
          src: "/demos/xhs-interactive/index.html",
          title: "大家补充了什么交互演示",
        },
      },
      {
        number: "02",
        kind: "WEB",
        title: "Memento",
        summary: "把普通瞬间生成私人纪念卡",
        description:
          "用户放入一张照片或几句话，Memento 只追问一个关键细节，再把口语化的回忆整理成一张有标题、短故事和馆员评语的私人纪念卡。",
        focus: ["轻记录", "AI 写作", "情绪化表达"],
        preview: "memento",
        demo: "memento",
        note: "概念提案聚焦一次轻记录的完整闭环；点击纪念卡可在概要与完整故事之间切换。",
      },
      {
        number: "03",
        kind: "ACCESSIBLE APP",
        title: "行无碍 App",
        summary: "无障碍地图 · 共建标注 · 互助社区",
        description:
          "行无碍是一款面向残障人士、老年人，以及孕妇、伤病等行动不便人群的无障碍出行产品。它把无障碍设施地图、路线规划、用户标注与互助社区放进同一套移动端体验，让设施信息更及时，也让真实出行经验可以被共享。",
        focus: ["产品规划", "移动端设计", "AI + 地图"],
        visual: {
          src: "/ai-builder/xingwua-navigation-poster.png",
          alt: "行无碍 App 产品界面与无障碍出行场景",
        },
        sections: [
          {
            title: "精准导航",
            body: "接入高德地图能力，按无障碍停车位、卫生间、坡道等设施分类组织点位，并规划更适合行动不便人群的路线。",
          },
          {
            title: "全民共建",
            body: "用户可以标注、更新和评论点位，以 UGC 持续补足无障碍设施信息，改善传统地图更新慢、信息不完整的问题。",
          },
          {
            title: "互助社区",
            body: "通过出行故事、活动与攻略共享连接用户，并用 AI 辅助资讯推荐和社区内容治理。",
          },
        ],
        note: "产品材料来自《行无碍》路演方案与移动端原型。",
        download: {
          href: "/downloads/xingwua-roadshow.pptx",
          label: "下载路演 PPT · 187 MB",
        },
      },
    ],
  },
  {
    title: "工作实践",
    english: "WORK PRACTICE",
    projects: [
      {
        number: "04",
        kind: "INTERNAL SKILL",
        title: "解释 Skill 的 Skill",
        summary: "把陌生 Skill 变成看得懂的离线说明书",
        tagline: "把一个陌生 Agent Skill，翻译成任何人都能看懂的可视化说明书。",
        description:
          "Explain Skill 会安全地读取 Skill 的说明、脚本和参考文件，解释它能做什么、怎么工作、依赖什么、有哪些风险，以及应该如何使用，最后生成一份带证据、可离线打开的单文件 HTML 报告。",
        reportTable: [
          { section: "30 秒看懂", question: "这是什么，适合谁，输入和输出是什么？" },
          { section: "怎么唤起它", question: "在当前应用里应该说什么？是否需要改造？" },
          { section: "一次任务怎么走完", question: "Skill 会按什么顺序处理任务？" },
          { section: "首次使用", question: "需要安装、授权或准备哪些内容？" },
          { section: "它由什么构成", question: "SKILL.md、脚本、配置和参考文件分别负责什么？" },
          { section: "它依赖什么", question: "哪些依赖是必须的，哪些只是可选增强？" },
          { section: "Skill 设计体检", question: "有哪些亮点、风险和可复用的设计方法？" },
          { section: "还有哪些选择", question: "有哪些竞品、替代方案或相邻工具？" },
          { section: "证据与覆盖范围", question: "结论来自哪里，还有哪些内容没有验证？" },
        ],
        focus: ["看懂能力", "证据与边界", "离线说明书"],
        link: {
          href: "https://github.com/Yixiao-Zhang1214/silly-skill",
          label: "查看 Explain Skill 代码仓 ↗",
          installHref:
            "请安装这个仓库中的 Explain Skill：\nhttps://github.com/Yixiao-Zhang1214/silly-skill\nSkill 位于 outputs/explain-skill。",
        },
      },
      {
        number: "05",
        kind: "WORK SYSTEM",
        title: "标注协作平台 A",
        summary: "任务流转与团队协作",
        description: "围绕任务分发、标注流转与多人协作，组织内部工作系统的核心路径。",
        focus: ["流程设计", "多人协作", "系统搭建"],
      },
      {
        number: "06",
        kind: "WORK SYSTEM",
        title: "标注协作平台 B",
        summary: "反馈、质量与进度管理",
        description: "围绕反馈收集、质量检查与进度同步，设计更清晰的协作闭环。",
        focus: ["质量管理", "反馈闭环", "进度协同"],
      },
    ],
  },
];

function BuilderCommentDemo() {
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  return (
    <div className="builder-comment-demo">
      <figure className="builder-comment-note">
        <Image
          src="/ai-builder/aigc/work-06.webp"
          alt="金色夕阳下花瓣飞舞的画面示例"
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 310px"
        />
        <figcaption>
          <strong>想把夏天留在这里</strong>
          <span>一张有风、有光，也有故事感的照片。</span>
        </figcaption>
      </figure>

      <div className="builder-comment-workspace">
        <div className="builder-comment-original">
          <span>原始评论</span>
          <p>好有感觉！</p>
        </div>

        <div className="builder-comment-options">
          <span>大家补充了什么</span>
          <div>
            {commentSuggestions.map((suggestion, index) => (
              <button
                className={index === activeSuggestion ? "is-active" : ""}
                type="button"
                aria-pressed={index === activeSuggestion}
                onClick={() => setActiveSuggestion(index)}
                key={suggestion.label}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="builder-comment-result" aria-live="polite">
          <span>完善后</span>
          <p>{commentSuggestions[activeSuggestion].text}</p>
        </div>
      </div>
    </div>
  );
}

const mementoProcess = [
  ["放入瞬间", "照片、文字或语音"],
  ["讲一句来历", "说明它为什么值得留下"],
  ["补一个细节", "系统只追问一个关键问题"],
  ["选择表达方式", "真实回忆、私人展签等语气"],
  ["生成纪念卡", "标题、故事与馆员评语"],
] as const;

function MementoDemo() {
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="memento-demo">
      <div className="memento-output-stage">
        <button
          className={`memento-specimen${showStory ? " is-flipped" : ""}`}
          type="button"
          aria-pressed={showStory}
          aria-label={showStory ? "返回纪念卡概要" : "查看纪念卡完整故事"}
          onClick={() => setShowStory((current) => !current)}
        >
          <span className="memento-specimen-inner">
            <span className="memento-specimen-face is-front">
              <span className="memento-specimen-meta">
                <b>MEMENTO</b>
                MEMORY 001
              </span>
              <span className="memento-specimen-object" aria-hidden="true">
                <i />
                <em>11:43 PM</em>
              </span>
              <span className="memento-specimen-copy">
                <small>第一份工作的杯子</small>
                <strong>
                  它不是杯子，<br />是那段夜晚留给我的把手。
                </strong>
                <span>深夜书桌 · 第一份工作</span>
              </span>
              <span className="memento-specimen-hint">点击翻到故事页 →</span>
            </span>

            <span className="memento-specimen-face is-back">
              <span className="memento-specimen-meta">
                <b>完整故事</b>
                CARD 02
              </span>
              <span className="memento-story-copy">
                <strong>第一份工作的杯子</strong>
                <p>
                  它很便宜，杯沿有一点磕碰。夜里十一点以后，办公室的灯一盏一盏暗下去，它还在电脑旁边，接住一杯又一杯快凉掉的咖啡。
                </p>
                <p>
                  离开那家公司时，我本来想把它丢掉，最后还是放进纸箱。看见它，我会想起那个很想逃走、却还是一天一天走下来的自己。
                </p>
              </span>
              <span className="memento-curator-note">
                馆员评语：它保存的不是一份工作的辛苦，而是你第一次学会在没人鼓掌的夜里，把自己带回明天。
              </span>
              <span className="memento-specimen-hint">← 返回概要页</span>
            </span>
          </span>
        </button>
        <p>产物预览 · 点击卡片翻面</p>
      </div>

      <section className="memento-process" aria-labelledby="memento-process-title">
        <div>
          <h3 id="memento-process-title">一次轻记录的生成过程</h3>
          <p>重点不是写长文，而是把一个瞬间变成可以保存的纪念物。</p>
        </div>
        <ol>
          {mementoProcess.map(([title, detail], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{title}</strong>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function BuilderProjectDialog({
  project,
  onClose,
}: {
  project: BuilderProject;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedInstallLink, setCopiedInstallLink] = useState(false);

  const handleCopyInstallLink = async () => {
    const installHref = project.link?.installHref ?? project.link?.href;
    if (!installHref) return;

    try {
      await navigator.clipboard.writeText(installHref);
      setCopiedInstallLink(true);
      window.setTimeout(() => setCopiedInstallLink(false), 1800);
    } catch {
      setCopiedInstallLink(false);
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button, a[href], [tabindex]:not([tabindex='-1'])",
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  return (
    <div className="builder-dialog-backdrop" onPointerDown={onClose}>
      <aside
        ref={dialogRef}
        className={`builder-dialog${project.visual ? " is-product" : ""}${project.gallery ? " is-gallery" : ""}${project.video ? " is-video" : ""}${project.demo ? " is-demo" : ""}${project.embed ? " is-embed" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="builder-dialog-title"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="builder-dialog-header">
          <p>
            {project.number} / {project.kind}
          </p>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            关闭
          </button>
        </header>

        {project.embed ? (
          <div className="builder-embed-layout">
            <section className="builder-embed-overview" aria-labelledby="builder-dialog-title">
              <div className="builder-embed-overview-copy">
                <h2 id="builder-dialog-title">{project.title}</h2>
                <p>{project.descriptionRich ?? project.description}</p>
              </div>
              <div className="builder-embed-overview-points" aria-label="项目介绍">
                {project.sections?.map((section) => (
                  <section key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </section>
                ))}
              </div>
            </section>
            <iframe
              className="builder-embed-frame"
              src={project.embed.src}
              title={project.embed.title}
            />
          </div>
        ) : project.gallery ? (
          <div className="builder-gallery">
            <div className="builder-gallery-intro builder-dialog-copy">
              <h2 id="builder-dialog-title">{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <div className="builder-gallery-grid">
              {project.gallery.map((work, index) => (
                <figure key={work.src}>
                  <Image
                    src={work.src}
                    alt={work.alt}
                    width={work.width}
                    height={work.height}
                    unoptimized
                    sizes="(max-width: 640px) 46vw, 220px"
                  />
                  <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : project.video ? (
          <div className="builder-video-project">
            <div className="builder-video-dialog">
              <div className="builder-dialog-copy builder-video-project-copy">
                <h2 id="builder-dialog-title">{project.title}</h2>
                <p className="builder-video-role">实验室合作项目 · 项目负责人</p>
                <p>{project.description}</p>
              </div>
              <figure>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={project.video.poster}
                  aria-label={project.video.alt}
                >
                  <source src={project.video.src} type="video/mp4" />
                </video>
                <figcaption>《黄河捞尸人》宣传片 · 作品节选 12 SEC</figcaption>
              </figure>
            </div>

            <section className="builder-video-workflow" aria-labelledby="builder-video-workflow-title">
              <header>
                <h3 id="builder-video-workflow-title">从文本资产到 15 秒镜头</h3>
                <p>
                  <strong>质量控制</strong>
                  角色、场景、道具与镜头衔接保持一致、协调。
                </p>
              </header>
              <ol>
                {aigcVideoWorkflow.map((stage, index) => (
                  <li key={stage.phase}>
                    <span className="builder-video-workflow-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <small>{stage.phase}</small>
                      <h4>{stage.title}</h4>
                      <p>{stage.detail}</p>
                      <div className="builder-video-workflow-tags" aria-label={`${stage.phase}产物`}>
                        {stage.items.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ) : project.demo === "comment" ? (
          <div className="builder-dialog-demo-layout">
            <div className="builder-dialog-copy">
              <h2 id="builder-dialog-title">{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <BuilderCommentDemo />
          </div>
        ) : project.demo === "memento" ? (
          <div className="builder-dialog-demo-layout is-memento">
            <div className="builder-dialog-copy">
              <h2 id="builder-dialog-title">{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <MementoDemo />
          </div>
        ) : project.visual ? (
          <div className="builder-dialog-product-layout">
            <figure className="builder-dialog-visual">
              <Image
                src={project.visual.src}
                alt={project.visual.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 290px"
              />
            </figure>

            <div className="builder-dialog-product-copy">
              <div className="builder-dialog-copy">
                <h2 id="builder-dialog-title">{project.title}</h2>
                <p>{project.description}</p>
              </div>

              <div className="builder-dialog-sections" aria-label="产品核心能力">
                {project.sections?.map((section) => (
                  <section key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </section>
                ))}
              </div>

              <section className="builder-dialog-focus" aria-labelledby="builder-focus-title">
                <h3 id="builder-focus-title">能力侧重</h3>
                <ul>
                  {project.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {project.download && (
                <a className="builder-dialog-download" href={project.download.href} download>
                  {project.download.label} <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="builder-dialog-copy">
              <h2 id="builder-dialog-title">{project.title}</h2>
              {project.tagline && <p className="builder-dialog-tagline">{project.tagline}</p>}
              <p>{project.description}</p>
            </div>

            {project.link && (
              <div className="builder-dialog-repo-bar">
                <div>
                  <span>CODE REPOSITORY · INSTALL PATH</span>
                  <a href={project.link.href} target="_blank" rel="noreferrer">
                    {project.link.href.replace("https://", "")}
                  </a>
                </div>
                <button type="button" onClick={handleCopyInstallLink}>
                  {copiedInstallLink ? "已复制" : "复制安装地址"}
                </button>
              </div>
            )}

            {project.reportTable && (
              <section className="builder-dialog-report-guide" aria-labelledby="builder-report-guide-title">
                <h3 id="builder-report-guide-title">一份报告能告诉你什么</h3>
                <p>生成的报告通常包含：</p>
                <div className="builder-dialog-report-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">章节</th>
                        <th scope="col">回答的问题</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.reportTable.map((row) => (
                        <tr key={row.section}>
                          <th scope="row">{row.section}</th>
                          <td>{row.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {project.sections && project.sections.length > 0 && (
              <div className="builder-dialog-explain-sections" aria-label="项目说明">
                {project.sections.map((section, index) => (
                  <section key={section.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  </section>
                ))}
              </div>
            )}

            <section className="builder-dialog-focus" aria-labelledby="builder-focus-title">
              <h3 id="builder-focus-title">能力侧重</h3>
              <ul>
                {project.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

          </>
        )}

        {!project.embed && (
          <p className="builder-dialog-note">
            {project.note ?? "项目材料可继续补充为产品截图、交互录屏或代码仓库。"}
          </p>
        )}
      </aside>
    </div>
  );
}

export default function AiBuilderExperience({ identity }: { identity: BuilderIdentity }) {
  const [selectedProject, setSelectedProject] = useState<BuilderProject | null>(null);

  return (
    <section className="builder-experience" aria-labelledby="builder-title">
      <header className="builder-copy">
        <p>
          {identity.english} <span aria-hidden="true">·</span> 06 PROJECTS + 02 AIGC STUDIES
        </p>
        <h2 id="builder-title">
          把 AI 做成能被使用的东西。
        </h2>
        <span>
          从面向真实用户的 App、可复用 Skill，到团队协作系统，我用 AI、设计与代码把想法变成真实体验。
        </span>
      </header>

      <div className="builder-project-groups">
        {projectGroups.map((group) => (
          <section className="builder-project-group" key={group.english}>
            <h3>
              <span>{group.english}</span>
              <i aria-hidden="true">·</i>
              {group.title}
            </h3>
            <div className="builder-project-grid">
              {group.projects.map((project) => (
                <button
                  className={`builder-project-card${project.visual ? " has-visual" : ""}${project.preview === "comment" ? " has-comment-preview" : ""}${project.preview === "memento" ? " has-memento-preview" : ""}`}
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`${project.title}，查看项目详情`}
                  onClick={() => setSelectedProject(project)}
                  key={project.number}
                >
                  {project.visual && (
                    <span className="builder-project-visual" aria-hidden="true">
                      <Image
                        src={project.visual.src}
                        alt=""
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 46vw, 220px"
                      />
                    </span>
                  )}
                  {project.preview === "comment" && (
                    <span className="builder-comment-preview" aria-hidden="true">
                      <Image
                        src="/ai-builder/xhs-comment-prototype.jpg"
                        alt=""
                        fill
                        unoptimized
                        sizes="96px"
                      />
                    </span>
                  )}
                  {project.preview === "memento" && (
                    <span className="builder-memento-preview" aria-hidden="true">
                      <Image
                        src="/ai-builder/memento-original-card.jpg"
                        alt=""
                        fill
                        unoptimized
                        sizes="110px"
                      />
                    </span>
                  )}
                  <span className="builder-project-meta">
                    {project.number} · {project.kind}
                  </span>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.summary}</p>
                  </div>
                  <span className="builder-project-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="builder-creative-lab" aria-labelledby="builder-creative-title">
        <h3 id="builder-creative-title">
          <span>AIGC CREATIVE LAB</span>
          <i aria-hidden="true">·</i>
          创作实验
        </h3>
        <div className="builder-creative-grid">
          <button
            className="builder-creative-item is-image"
            type="button"
            aria-haspopup="dialog"
            aria-label="AIGC 生图，查看 13 幅作品"
            onClick={() => setSelectedProject(aigcImageProject)}
          >
            <span>
              <small>13 WORKS</small>
              <strong>AIGC 生图</strong>
              <em>打开作品集 ↗</em>
            </span>
            <span className="builder-creative-thumbnails" aria-hidden="true">
              {["01", "05", "12"].map((work) => (
                <i key={work}>
                  <Image
                    src={`/ai-builder/aigc/work-${work}.webp`}
                    alt=""
                    fill
                    unoptimized
                    sizes="90px"
                  />
                </i>
              ))}
            </span>
          </button>

          <button
            className="builder-creative-item is-video"
            type="button"
            aria-haspopup="dialog"
            aria-label="AIGC 生视频，播放作品节选"
            onPointerEnter={(event) => {
              void event.currentTarget.querySelector("video")?.play();
            }}
            onPointerLeave={(event) => {
              event.currentTarget.querySelector("video")?.pause();
            }}
            onFocus={(event) => {
              void event.currentTarget.querySelector("video")?.play();
            }}
            onBlur={(event) => {
              event.currentTarget.querySelector("video")?.pause();
            }}
            onClick={() => setSelectedProject(aigcVideoProject)}
          >
            <span>
              <small>VIDEO STUDIES</small>
              <strong>AIGC 生视频</strong>
              <em>《黄河捞尸人》宣传片 ↗</em>
            </span>
            <span className="builder-video-preview" aria-hidden="true">
              <video
                muted
                loop
                playsInline
                preload="metadata"
                poster={aigcVideoProject.video?.poster}
              >
                <source src={aigcVideoProject.video?.src} type="video/mp4" />
              </video>
              <i>▶</i>
            </span>
          </button>
        </div>
      </section>

      <div className="builder-footer-note">
        <p>点击卡片，在弹窗中展开项目详情。</p>
        <span>工作实践使用脱敏截图或抽象流程图</span>
      </div>

      {selectedProject &&
        typeof document !== "undefined" &&
        createPortal(
          <BuilderProjectDialog
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />,
          document.body,
        )}
    </section>
  );
}
