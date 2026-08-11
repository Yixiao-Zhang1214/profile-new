import Image from "next/image";
import ContactSpotlight from "./contact-spotlight";
import HeroCover from "./hero-cover";
import IdentityNavMenu from "./identity-nav-menu";
import IdentityPhotoReveal from "./identity-photo-reveal";
import IdentityShowcase from "./identity-showcase";
import PersonaParticleTransition from "./persona-particle-transition";

const identities = [
  {
    name: "新闻与传播学生",
    shortName: "求学者",
    english: "JOURNALISM & COMMUNICATION",
    statement: "先读懂人，\n再讲好故事",
    intro:
      "新传的学习让我 理解“终身学习”的含义，习惯跟踪新事物，习惯把复杂的事研究清楚。后来做产品，我也一直沿用这套方法。",
    skills: "采访研究 / 内容策划 / 叙事表达",
    character: "/personas/news-interviewer-camera-transparent.png",
    introCharacter: "/personas/clean/journalism-person.png",
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
    shortName: "AI 产品经理",
    english: "AI PRODUCT MANAGER",
    statement: "从AI native的视角，\n让模型能力落地产品",
    intro:
      "从小爱的 C 端大模型策略调优能力，到抖音精选的 AI + 推荐能力，再到电商直播的 AI + 业务场景，我持续把模型能力转化为用户可感知、业务可验证的产品体验。",
    skills: "用户洞察 / 产品策略 / 方案交付",
    character: "/personas/ai-product-manager-transparent.png",
    introCharacter: "/personas/clean/product-manager-solo.png",
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
    name: "AI Builder",
    shortName: "AI Builder",
    english: "AI BUILDER",
    statement: "成为合格的AI builder，\n快乐玩AI",
    intro:
      "从面向真实用户的产品、可复用 Skill，到标注系统，我从生活和工作出发，用 AI、设计把想法变成真实体验。",
    skills: "AI 原型 / 快速开发 / 实验迭代",
    character: "/personas/ai-builder-transparent.png",
    introCharacter: "/personas/clean/ai-builder-solo.png",
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
  {
    name: "旅行家",
    shortName: "旅行家",
    english: "TRAVELER",
    statement: "地球online持续探索中",
    intro:
      "“人生漫游者”是我的信条，我相信生活在别处能持续给我带来灵感。从 2023 年开始，我组织了 30 多次旅行项目，建立了一个 4000 多人的社群，也把一路遇到的需求做成了产品。",
    skills: "田野观察 / 跨文化感知 / 旅行书写",
    character: "/personas/traveler-hiking-boots-transparent.png",
    introCharacter: "/personas/clean/traveler-solo.png",
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
    shortName: "摄影师",
    english: "PHOTOGRAPHER",
    statement: "留住那些，\n没被说出口的。",
    intro:
      "当你回看的时候，回忆起当时的心情，影像会让这段回忆变得更加具体，也更加鲜活",
    skills: "视觉叙事 / 纪实摄影 / 编辑策展",
    character: "/personas/photographer-transparent.png",
    introCharacter: "/personas/clean/photographer-solo.png",
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
];

const capabilities = [
  "用户研究",
  "产品策略",
  "AI 原型",
  "叙事表达",
  "摄影",
  "快速构建",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="返回首页">
          <strong>个人作品集</strong>
          <span>AI 产品经理 · 创作者</span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          <a href="#about">关于我</a>
          <IdentityNavMenu />
          <a href="#contact">联系我</a>
        </nav>
      </header>

      <HeroCover />

      <PersonaParticleTransition
        source="/personas/hero-laughing-person-cutout.png"
        targets={identities.map((identity) => identity.introCharacter)}
      />

      <section className="identity-intro" id="about">
        <IdentityPhotoReveal />
        <div className="identity-intro-copy">
          <p></p>
          <h2>
            五个身份，
            <br />
            组成一个好奇的人。
          </h2>
          <span></span>
        </div>
        <nav className="identity-intro-personas" aria-label="选择一个身份继续浏览">
          {identities.map((identity) => (
            <a
              href={`#identity-${identity.tone}`}
              aria-label={`查看${identity.name}`}
              key={identity.name}
            >
              <Image
                src={identity.introCharacter}
                alt={`${identity.name}人物形象`}
                width={520}
                height={820}
                unoptimized
                sizes="(max-width: 720px) 34vw, 17vw"
              />
              <span>
                {identity.shortName}
                <i aria-hidden="true">↘</i>
              </span>
            </a>
          ))}
        </nav>
        <a
          className="identity-intro-scroll-cue"
          href={`#identity-${identities[0].tone}`}
          aria-label={`向下查看${identities[0].name}`}
        >
          <span>向下探索身份</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <IdentityShowcase identities={identities} />

      <section className="capability-strip" aria-label="能力关键词">
        <div className="capability-track">
          {[...capabilities, ...capabilities, ...capabilities, ...capabilities].map((capability, index) => (
            <span key={`${capability}-${index}`}>
              {capability}
              <i aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <ContactSpotlight />
        <div className="contact-background" aria-hidden="true">
          <span className="contact-orb contact-orb-blue" />
          <span className="contact-orb contact-orb-yellow" />
          <span className="contact-orb contact-orb-center" />
        </div>

        <div className="contact-layout">
          <div className="contact-copy">
            <h2>
              <span className="contact-title-line">如果你在找一个</span>
              <span className="contact-title-line">
                <span className="contact-title-accent">能自己把想法做出来</span>的产品人
              </span>
            </h2>
            <p className="contact-lead">
              <strong>AI native 的产品人</strong>，持续学习，对 AI 和新技术保持兴趣。
              <br />
              <strong>正在寻找 AI 产品方向的机会，也欢迎有意思的合作。</strong>
            </p>

            <div className="contact-traits" aria-label="个人特点">
              <span>好奇，边做边学</span>
              <span>懂得AI能力边界</span>
              <span>AI 的答案不是终点</span>
              <span>保有自己的判断</span>
              <span>爱折腾，不随大流</span>
            </div>

            <div className="contact-actions">
              <a
                className="contact-secondary-action"
                href="/documents/yixiao-zhang-resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                查看我的简历
              </a>
            </div>
          </div>

          <aside className="contact-card" aria-label="联系方式">
            <h3>找到我</h3>
            <div><strong>邮箱</strong><a href="mailto:172938960@qq.com">172938960@qq.com</a></div>
            <div><strong>电话</strong><span>13868422320</span></div>
            <div><strong>微信</strong><span>sunnyzyx1214</span></div>
            <div>
              <strong>个人简历</strong>
              <a href="/documents/yixiao-zhang-resume.pdf" target="_blank" rel="noreferrer">
                查看简历
              </a>
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <span>个人作品集 · 2026</span>
        <div>
          <a href="mailto:172938960@qq.com">邮箱</a>
          <span>13868422320</span>
          <span>sunnyzyx1214</span>
        </div>
      </footer>
    </main>
  );
}
