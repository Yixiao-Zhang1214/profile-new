import IdentityShowcase from "./identity-showcase";

const identities = [
  {
    name: "新闻与传播学生",
    english: "JOURNALISM & COMMUNICATION",
    statement: "先看见人，\n再讲好故事。",
    intro:
      "采访、观察与写作，让我习惯从真实的人出发。它们也是我理解用户、梳理问题和组织表达的起点。",
    skills: "采访研究 / 内容策划 / 叙事表达",
    character: "/personas/news-interviewer-transparent.png",
    tone: "sage",
    projects: [
      {
        type: "人物报道 · 示例项目",
        title: "一座校园里的十二种生活",
        result: "从深度访谈到专题策划，完成一组可替换的融合报道案例。",
        media: "报道封面 / 采访现场",
      },
      {
        type: "传播研究 · 示例项目",
        title: "年轻人的 AI 信息习惯",
        result: "预留研究背景、方法、核心发现与最终产出的位置。",
        media: "研究报告 / 数据图表",
      },
    ],
  },
  {
    name: "AI 产品经理",
    english: "AI PRODUCT MANAGER",
    statement: "把模糊需求，\n变成清晰路径。",
    intro:
      "我连接用户问题、模型能力与业务目标，把不确定的想法拆成可以验证、交付和持续迭代的产品。",
    skills: "用户洞察 / 产品策略 / 方案交付",
    character: "/personas/ai-product-manager-transparent.png",
    tone: "sand",
    projects: [
      {
        type: "AI 产品 · 示例项目",
        title: "个人知识共创助手",
        result: "这里放问题定义、关键决策、产品方案与验证结果。",
        media: "产品界面 / 原型演示",
      },
      {
        type: "产品策略 · 示例项目",
        title: "从机会判断到 MVP",
        result: "这里放你的角色、协作过程、指标与最终影响。",
        media: "用户旅程 / PRD 摘要",
      },
    ],
  },
  {
    name: "旅行家",
    english: "TRAVELER",
    statement: "换一个坐标，\n也换一种判断。",
    intro:
      "陌生环境不断校准我的偏见。旅行不是打卡，而是观察不同的人如何生活、选择，并与世界建立关系。",
    skills: "田野观察 / 跨文化感知 / 旅行书写",
    character: "/personas/traveler-hiking-boots-transparent.png",
    tone: "clay",
    projects: [
      {
        type: "旅行叙事 · 示例项目",
        title: "在地图之外认识一座城",
        result: "用路线、文字与影像，讲述目的地里具体的人和生活。",
        media: "旅行照片 / 路线地图",
      },
      {
        type: "内容专题 · 示例项目",
        title: "陌生人的一日提案",
        result: "预留旅途见闻、编辑思路和发布结果的位置。",
        media: "专题封面 / 手记",
      },
    ],
  },
  {
    name: "摄影师",
    english: "PHOTOGRAPHER",
    statement: "留住那些，\n没被说出口的。",
    intro:
      "镜头训练我注意情绪、节奏与微小变化。摄影也是另一种研究方式：不急于解释，先认真地看。",
    skills: "视觉叙事 / 纪实摄影 / 编辑策展",
    character: "/personas/photographer-transparent.png",
    tone: "blue",
    projects: [
      {
        type: "摄影系列 · 示例项目",
        title: "经过这里的人",
        result: "放置一组代表作品、创作说明与展览或发布信息。",
        media: "摄影作品 / 系列封面",
      },
      {
        type: "影像记录 · 示例项目",
        title: "城市的安静时刻",
        result: "预留横版、竖版照片和项目背景的灵活组合。",
        media: "照片组图 / 出版物",
      },
    ],
  },
  {
    name: "AI Builder",
    english: "AI BUILDER",
    statement: "让想法尽早，\n成为真实体验。",
    intro:
      "我用 AI、设计和代码快速做出可交互原型，让假设离开文档，尽早接受真实使用与反馈。",
    skills: "AI 原型 / 快速开发 / 实验迭代",
    character: null,
    tone: "ink",
    projects: [
      {
        type: "独立构建 · 示例项目",
        title: "一周一个 AI 原型",
        result: "放置可体验链接、构建过程、技术选择与学习结论。",
        media: "产品演示 / 代码仓库",
      },
      {
        type: "交互实验 · 示例项目",
        title: "与模型一起思考",
        result: "记录一次新交互方式从想法到被使用的完整路径。",
        media: "交互录屏 / 实验数据",
      },
    ],
  },
];

const capabilities = [
  "USER RESEARCH",
  "PRODUCT STRATEGY",
  "AI PROTOTYPING",
  "STORYTELLING",
  "PHOTOGRAPHY",
  "RAPID BUILDING",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="返回首页">
          <strong>Your Name</strong>
          <span>Creative Technologist</span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          <a href="#about">About</a>
          <a href="#identities">Five Sides</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-year" href="#identities">
          Portfolio — 2026
        </a>
      </header>

      <section className="poster-hero" id="top">
        <div className="hero-meta hero-meta-left">
          <span>Your Name</span>
          <span>AI Product Manager</span>
        </div>
        <div className="hero-meta hero-meta-right">
          <span>Portfolio</span>
          <span>Shanghai · 2026</span>
        </div>

        <img
          className="hero-character"
          src="/personas/hero-laughing-cutout.png"
          alt="开怀大笑的个人卡通形象"
        />

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

      <section className="identity-intro" id="about">
        <p>ONE PERSON · FIVE PERSPECTIVES</p>
        <h2>
          五个身份，
          <br />
          同一个好奇的人。
        </h2>
        <span>
          每个身份都不是标签，而是一种理解世界、解决问题和创造作品的方式。
        </span>
      </section>

      <IdentityShowcase identities={identities} />

      <section className="capability-strip" aria-label="能力关键词">
        <div className="capability-track">
          {[...capabilities, ...capabilities].map((capability, index) => (
            <span key={`${capability}-${index}`}>
              {capability}
              <i aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      <section className="personal-note">
        <div>
          <p>MY PATH</p>
          <h2>路径不是直线，视角却越来越完整。</h2>
        </div>
        <div>
          <p>
            传播让我理解人，旅行让我保持开放，摄影让我看见细节，产品与构建让我把这些能力连接起来。
          </p>
          <span>这里可以继续替换为个人经历、教育背景与当前关注。</span>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p>LET&apos;S MAKE SOMETHING MEANINGFUL</p>
        <h2>一起做点值得记住的事。</h2>
        <span>正在寻找 AI 产品相关机会，也欢迎研究、内容、旅行与摄影方向的合作。</span>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </section>

      <footer>
        <span>Your Name · Portfolio 2026</span>
        <div>
          <a href="mailto:hello@example.com">Email</a>
          <span>LinkedIn · 待添加</span>
          <span>Photography · 待添加</span>
        </div>
      </footer>
    </main>
  );
}
