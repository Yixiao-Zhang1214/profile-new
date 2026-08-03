const roles = [
  {
    label: "新闻与传播学生",
    headline: "先理解人，\n再定义问题。",
    body: "我练习采访、观察与叙事，也把这些方法带进产品工作。",
    media: "人物或校园纪实照片",
    ratio: "4 : 5",
    artifact: "采访稿、研究报告或内容作品",
    note: "观察 / 提问 / 表达",
  },
  {
    label: "AI 产品经理",
    headline: "把模糊需求，\n变成清晰路径。",
    body: "从用户问题出发，连接模型能力、产品体验与真实业务结果。",
    media: "产品界面或工作现场",
    ratio: "16 : 10",
    artifact: "PRD、用户旅程或产品案例",
    note: "洞察 / 策略 / 交付",
  },
  {
    label: "旅行家",
    headline: "换一个坐标，\n也换一种判断。",
    body: "陌生环境让我持续校准偏见，理解不同生活方式如何塑造需求。",
    media: "旅途中的横幅照片",
    ratio: "3 : 2",
    artifact: "旅行笔记、地图或目的地故事",
    note: "探索 / 适应 / 连接",
  },
  {
    label: "摄影师",
    headline: "留住没被说出\n口的细节。",
    body: "我用画面组织信息，也用构图训练对情绪、节奏与细节的感知。",
    media: "个人摄影代表作",
    ratio: "4 : 5",
    artifact: "摄影系列、出版物或展览页面",
    note: "构图 / 情绪 / 记录",
  },
  {
    label: "AI Builder",
    headline: "从一张空白页，\n做到可以使用。",
    body: "我用 AI 与代码快速搭建原型，让想法尽早接受真实反馈。",
    media: "原型演示或构建过程",
    ratio: "16 : 10",
    artifact: "可交互原型、代码仓库或演示视频",
    note: "原型 / 验证 / 迭代",
  },
];

const projects = [
  {
    className: "project-card project-card-green",
    title: "校园信息体验重构",
    type: "用户研究与产品设计",
    summary: "从访谈与观察出发，重新组织学生获取重要信息的路径。",
    media: "研究过程与方案图",
  },
  {
    className: "project-card project-card-blue",
    title: "AI 行程共创助手",
    type: "AI 产品案例",
    summary: "把模糊的旅行愿望，转化为可以讨论和调整的计划。",
    media: "产品封面或演示画面",
  },
  {
    className: "project-card project-card-ink",
    title: "旅途中看见的人",
    type: "摄影与叙事",
    summary: "用影像和短文记录不同城市里真实而具体的生活。",
    media: "摄影项目封面",
  },
  {
    className: "project-card project-card-violet",
    title: "一周一个 AI 原型",
    type: "独立构建实验",
    summary: "用短周期验证交互方式、模型边界与真实使用价值。",
    media: "原型合集封面",
  },
];

const capabilities = [
  ["/产品策略", "把机会、约束与目标整理成可以行动的方向。"],
  ["/用户研究", "用访谈、观察与数据找到值得解决的问题。"],
  ["/AI 原型", "快速搭建可交互版本，尽早验证关键假设。"],
  ["/内容叙事", "把复杂信息组织成清晰、有记忆点的表达。"],
  ["/摄影", "用视觉记录情绪、场景和没有说出口的信息。"],
  ["/快速构建", "连接设计、代码与 AI，把想法做成可用体验。"],
];

const journey = [
  {
    time: "现在",
    title: "寻找 AI 产品机会",
    body: "持续研究真实需求，练习把模型能力转化为可靠、易用的产品体验。",
  },
  {
    time: "在校期间",
    title: "新闻与传播学习",
    body: "通过采访、写作与视觉表达，训练观察问题和理解人的基本功。",
  },
  {
    time: "持续进行",
    title: "旅行、摄影与独立构建",
    body: "在不同场景中积累素材，也用小型作品检验自己的判断。",
  },
];

const faq = [
  ["你正在寻找什么机会？", "以 AI 产品经理为核心，也愿意参与早期产品探索、用户研究和 AI 原型构建。"],
  ["这些内容是真实简历吗？", "当前页面使用示例内容搭建结构。真实经历、项目成果与媒体素材可在同一位置直接替换。"],
  ["可以放哪些项目？", "适合放产品案例、研究报告、内容作品、摄影系列、旅行记录和可交互原型。"],
  ["需要准备哪些图片？", "建议准备一张个人主视觉、五张角色图片、三到五张项目封面，以及一张个人故事横幅。"],
  ["如何联系你？", "替换页面中的示例邮箱与社交链接后，访客可以直接通过页尾联系区找到你。"],
];

function MediaSlot({
  label,
  ratio,
  inverse = false,
}: {
  label: string;
  ratio: string;
  inverse?: boolean;
}) {
  return (
    <div
      className={`media-slot${inverse ? " media-slot-inverse" : ""}`}
      role="img"
      aria-label={`图片占位：${label}，建议比例 ${ratio}`}
    >
      <span>{label}</span>
      <small>替换图片 · {ratio}</small>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="返回首页">
          <span className="wordmark-mark">Y</span>
          <span>Your Name</span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          <a href="#about">关于</a>
          <a href="#roles">角色</a>
          <a href="#work">项目</a>
          <a href="#journey">经历</a>
        </nav>

        <div className="header-actions">
          <a className="text-link" href="#contact">联系我</a>
          <span className="button button-disabled" aria-disabled="true">
            下载简历
          </span>
        </div>

        <details className="mobile-nav">
          <summary>菜单</summary>
          <div className="mobile-nav-panel">
            <a href="#about">关于</a>
            <a href="#roles">角色</a>
            <a href="#work">项目</a>
            <a href="#journey">经历</a>
            <a href="#contact">联系我</a>
          </div>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>
            把观察，变成产品。
            <span>把想法，做成现实。</span>
          </h1>
          <p>新闻传播背景的 AI 产品经理，也是一名旅行者、摄影师和独立构建者。</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              查看项目
            </a>
            <a className="button button-secondary" href="#roles">
              认识我
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            <MediaSlot label="个人主视觉或短视频" ratio="4 : 5" />
          </div>
          <div className="hero-note" aria-hidden="true">
            <span>当前关注</span>
            <strong>AI 如何帮助人们更好地理解、选择与创造？</strong>
          </div>
        </div>
      </section>

      <section className="identity-intro" id="about">
        <p>认识我。</p>
        <h2>
          五个身份，
          <br />
          同一个好奇的人。
        </h2>
      </section>

      <section className="roles" id="roles" aria-label="我的五个角色">
        {roles.map((role, index) => (
          <article className={`role-panel role-panel-${index + 1}`} key={role.label}>
            <div className="role-copy">
              <p className="role-label">{role.label}</p>
              <h3>{role.headline}</h3>
              <p className="role-body">{role.body}</p>
              <span className="role-note">{role.note}</span>
            </div>

            <div className="role-media">
              <MediaSlot label={role.media} ratio={role.ratio} />
            </div>

            <div className="artifact-slot" role="img" aria-label={`内容占位：${role.artifact}`}>
              <span>内容插槽</span>
              <strong>{role.artifact}</strong>
              <small>替换文字、链接或媒体</small>
            </div>
          </article>
        ))}
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <h2>把角色，变成作品。</h2>
          <p>这里预留了四种项目类型。替换封面与文字后，就能组成你的案例入口。</p>
        </div>

        <div className="project-stack" aria-label="精选项目">
          {projects.map((project, index) => (
            <article className={project.className} key={project.title}>
              <div className="project-topline">
                <span>{project.type}</span>
                <span>示例内容</span>
              </div>
              <div className="project-media">
                <MediaSlot label={project.media} ratio="16 : 10" inverse={index > 1} />
              </div>
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span className="project-link" aria-disabled="true">
                  案例链接待添加
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities-section" aria-labelledby="capability-title">
        <h2 id="capability-title">我如何参与一个项目</h2>
        <div className="capability-rail">
          {capabilities.map(([title, body]) => (
            <article className="capability-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <a className="button button-outline" href="#contact">
          联系我
        </a>
      </section>

      <section className="journey-section" id="journey">
        <div className="journey-media">
          <MediaSlot label="个人故事横幅、短片或旅行影像" ratio="16 : 9" />
        </div>
        <div className="journey-copy">
          <h2>我的路径不是直线，方向却越来越清楚。</h2>
          <p className="journey-intro">
            传播让我理解人，旅行让我保持开放，摄影让我看见细节，AI 产品让我把这些能力连接起来。
          </p>
          <div className="timeline">
            {journey.map((item) => (
              <article className="timeline-item" key={item.title}>
                <span>{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-wrap" id="contact">
        <div className="contact-panel">
          <div className="contact-symbol" aria-hidden="true">
            Y
          </div>
          <div>
            <h2>一起做点值得记住的事。</h2>
            <p>正在寻找 AI 产品相关机会，也欢迎研究、内容、旅行与摄影方向的合作。</p>
            <a className="button button-light" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">你可能想知道</h2>
        <div className="faq-list">
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Your Name</strong>
          <p>AI 产品经理，持续观察、表达与构建。</p>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@example.com">邮箱</a>
          <span aria-disabled="true">LinkedIn 待添加</span>
          <span aria-disabled="true">摄影主页待添加</span>
        </div>
        <p className="copyright">© 2026 Your Name</p>
      </footer>
    </main>
  );
}
