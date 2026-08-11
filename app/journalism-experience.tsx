"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type JournalismIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  skills: string;
};

const subscribeToNothing = () => () => {};

const education = [
  {
    period: "2020-2024",
    school: "华东师范大学",
    logo: "/education/ecnu-logo.svg",
    logoClass: "is-ecnu",
    program: "播音与主持艺术",
    badges: ["985", "双一流"],
    details: [
      "学业成绩 90.31（1 / 25）· 推荐免试攻读硕士学位研究生",
      "校优秀毕业生 · 优秀学生 · 校特等奖学金 · “圆梦浙里”奖学金",
    ],
  },
  {
    period: "2024-2027",
    school: "华中科技大学",
    logo: "/education/hust-crest.jpg",
    logoClass: "is-crest",
    program: "新闻与传播",
    badges: ["985", "双一流"],
    details: [
      "教育部大数据与国家传播战略实验室成员",
      "研究生学业一等奖学金 · 科技创新奖学金",
    ],
  },
  {
    period: "2025",
    school: "亚琛工业大学",
    logo: "/education/rwth-aachen-logo.png",
    logoClass: "is-rwth",
    program: "学期交流",
    badges: ["QS 105"],
    details: ["以人机交互课程补充产品与跨文化研究视角。"],
  },
];

const studentActivities = [
  {
    number: "01",
    title: "校园领导力",
    description: (
      <>
        担任华东师范大学传播学院<strong>首届学生会主席</strong>，
        <strong>摄影协会、模拟联合国协会副社长</strong>。
      </>
    ),
  },
  {
    number: "02",
    title: "青年与 AI",
    description: (
      <>
        作为青年学生代表受邀参加
        <strong>联合国大学驻澳门研究所 2024 人工智能大会</strong>
        ，参与数字鸿沟等 AI 前沿话题讨论。
      </>
    ),
  },
  {
    number: "03",
    title: "国际模拟联合国",
    description: (
      <>
        参加外交学院、北京大学、澳门大学“东亚”等国际性模拟联合国大会，获
        <strong>荣誉提名、最佳立场、最佳潜力</strong>等荣誉。
      </>
    ),
  },
];

const interviewWorks = [
  {
    number: "01",
    type: "深度采访",
    title: "陪诊师：陌生的“临时家人”",
    description: "被收录于《大学生》杂志",
    format: "magazine",
    href: "https://mp.weixin.qq.com/s/JWM0_bjNcivnsb_bzMybyg",
  },
  {
    number: "02",
    type: "人物采访",
    title: "胡斐斐：逐梦国际传播，传递中国声音",
    description: "国际传播人物专访",
    format: "magazine",
    href: "https://mp.weixin.qq.com/s/iKRA9is73Xn7S7XJmMes7Q",
  },
  {
    number: "03",
    type: "视频采访",
    title: "寻非遗——七宝皮影",
    description: "以影像记录传统技艺与当代传承",
    format: "video",
    href: "https://weixin.qq.com/sph/AMBOj2vzwU",
  },
  {
    number: "04",
    type: "澎湃新闻国际部",
    title: "署名作品档案",
    description: "国际报道 / 2023 / 13 篇署名作品",
    format: "archive",
    archive: true,
  },
];

const thePaperWorks = [
  {
    date: "2023.05.23",
    type: "国际报道",
    title: "研究：地球上近一半物种正经历种群数量快速下降",
    href: "https://www.thepaper.cn/newsDetail_forward_23190841",
  },
  {
    date: "2023.05.14",
    type: "全球速报",
    title: "土耳其大选启动：竞争对手民调略领先，埃尔多安连任面临挑战",
    href: "https://www.thepaper.cn/newsDetail_forward_23077794",
  },
  {
    date: "2023.05.11",
    type: "全球速报",
    title: "以色列空袭加沙地带至少24人丧生，包括多名杰哈德指挥官",
    href: "https://www.thepaper.cn/newsDetail_forward_23039431",
  },
  {
    date: "2023.05.09",
    type: "国际报道",
    title: "柏林法院批准警方动议，禁止在5月9日展示俄罗斯和苏联标志",
    href: "https://www.thepaper.cn/newsDetail_forward_23012178",
  },
  {
    date: "2023.05.05",
    type: "全球速报",
    title: "美智库战争研究所：克宫遭无人机袭击可能是俄“自导自演”",
    href: "https://www.thepaper.cn/newsDetail_forward_22961166",
  },
  {
    date: "2023.04.24",
    type: "科技动态",
    title: "朝令夕改？推特免费恢复一部分“百万大V”的蓝标认证",
    href: "https://www.thepaper.cn/newsDetail_forward_22829208",
  },
  {
    date: "2023.04.14",
    type: "全球速报",
    title: "美国得州一奶牛场发生疑似甲烷爆炸，致1.8万头奶牛死亡",
    href: "https://www.thepaper.cn/newsDetail_forward_22697469",
  },
  {
    date: "2023.04.04",
    type: "国际报道",
    title: "泰国警方：中国女生在泰遇害案还有第四名嫌疑人",
    href: "https://www.thepaper.cn/newsDetail_forward_22572186",
  },
  {
    date: "2023.03.31",
    type: "国际解读",
    title: "四问“特朗普被诉”：特朗普和美国的政治体系将经历什么？",
    href: "https://www.thepaper.cn/newsDetail_forward_22522945",
  },
  {
    date: "2023.03.07",
    type: "战事追踪",
    title: "持续追踪｜俄军近乎包围巴赫穆特，真要拿下“战略要地”了？",
    href: "https://www.thepaper.cn/newsDetail_forward_22166748",
  },
  {
    date: "2023.03.03",
    type: "国际解读",
    title: "俄乌冲突超一年，非洲国家为何仍坚持自己的对俄中立立场？",
    href: "https://www.thepaper.cn/newsDetail_forward_22138347",
  },
  {
    date: "2023.02.20",
    type: "国际报道",
    title: "大赞瓦格纳雇佣军战斗能力，车臣领导人称卸任后将创设私人军事集团",
    href: "https://www.thepaper.cn/newsDetail_forward_21990268",
  },
  {
    date: "2023.02.09",
    type: "国际深度",
    title: "雪上加霜的叙利亚：救援难覆盖，古堡逃过战火却在地震中坍塌",
    href: "https://www.thepaper.cn/newsDetail_forward_21859503",
  },
];

function WorkCardContent({ work }: { work: (typeof interviewWorks)[number] }) {
  return (
    <>
      <div className={`work-editorial-preview is-${work.number}`} aria-hidden="true">
      </div>
      <div className="work-editorial-copy">
        <span className="work-editorial-meta">{work.number} / {work.type}</span>
        <h4>{work.title}</h4>
        {work.archive ? (
          <div className="work-editorial-count">
            <strong>13</strong>
            <span>篇作品</span>
          </div>
        ) : (
          <p>{work.description}</p>
        )}
      </div>
      <span className="work-corner-arrow" aria-hidden="true">→</span>
    </>
  );
}

function ThePaperArchiveDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    <div className="journalism-dialog-backdrop" onPointerDown={onClose}>
      <aside
        ref={dialogRef}
        className="journalism-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="the-paper-archive-title"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="journalism-dialog-header">
          <div>
            <p>澎湃新闻 · 国际报道</p>
            <span>2023 / 13 篇署名作品</span>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="journalism-dialog-intro">
          <span>新闻作品档案</span>
          <h2 id="the-paper-archive-title">澎湃新闻国际部</h2>
          <p>在国际新闻现场中训练信息核验、快速研究与清晰表达。</p>
        </div>

        <div className="the-paper-work-list">
          {thePaperWorks.map((work, index) => (
            <a
              href={work.href}
              target="_blank"
              rel="noreferrer noopener"
              key={work.href}
            >
              <span className="the-paper-work-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="the-paper-work-meta">
                  <time>{work.date}</time>
                  <span>{work.type}</span>
                </div>
                <h3>{work.title}</h3>
              </div>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function JournalismExperience({ identity }: { identity: JournalismIdentity }) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  return (
    <div className="journalism-experience">
      <header className="journalism-copy">
        <div>
          <h2>新闻与传播</h2>
          <small>{identity.skills}</small>
        </div>
        <h3>{identity.statement.replace("\n", "")}</h3>
        <span>{identity.intro}</span>
      </header>

      <div className="journalism-main-grid">
        <section className="education-section" aria-labelledby="education-title">
          <h3 className="journalism-section-title" id="education-title">
            教育经历
          </h3>

          <div className="education-timeline">
            {education.map((item) => (
              <article
                className="education-timeline-item"
                key={`${item.period}-${item.school}`}
              >
                <time>{item.period}</time>
                <div className={`education-logo ${item.logoClass}`}>
                  <img src={item.logo} alt={`${item.school}校徽`} />
                </div>
                <div className="education-timeline-copy">
                  <div className="education-heading-row">
                    <h4>
                      {item.school}
                      <span aria-hidden="true"> · </span>
                      <span>{item.program}</span>
                    </h4>
                    <div className="education-badges" aria-label="学校标签">
                      {item.badges.map((badge) => (
                        <span key={badge}>{badge}</span>
                      ))}
                    </div>
                  </div>
                  <div className="education-timeline-details">
                    <p>{item.details.join(" · ")}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="student-activity-section" aria-labelledby="activity-title">
          <h3 className="journalism-section-title" id="activity-title">
            校园与公共参与
          </h3>
          <div className="student-activity-list">
            {studentActivities.map((activity) => (
              <article className="student-activity-item" key={activity.number}>
                <div>
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="interview-section" aria-labelledby="interview-title">
        <div className="interview-heading">
          <h3 className="journalism-section-title" id="interview-title">
            采访与报道
          </h3>
          <p>SELECTED STORIES / 04</p>
        </div>
        <div className="interview-list">
          {interviewWorks.map((work) =>
            work.archive ? (
              <button
                className={`interview-work is-${work.format}`}
                type="button"
                aria-haspopup="dialog"
                aria-label={`${work.type}：${work.title}，查看作品档案`}
                onClick={() => setArchiveOpen(true)}
                key={work.number}
              >
                <WorkCardContent work={work} />
              </button>
            ) : (
              <a
                className={`interview-work is-${work.format}`}
                href={work.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${work.type}：${work.title}，打开原文`}
                key={work.number}
              >
                <WorkCardContent work={work} />
              </a>
            ),
          )}
        </div>
      </section>

      {mounted &&
        archiveOpen &&
        createPortal(
          <ThePaperArchiveDialog onClose={() => setArchiveOpen(false)} />,
          document.body,
        )}
    </div>
  );
}
