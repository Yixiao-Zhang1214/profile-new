type JournalismIdentity = {
  english: string;
  name: string;
  statement: string;
  intro: string;
  skills: string;
};

const education = [
  {
    period: "2020—2024",
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
    period: "2024—2027",
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
    description:
      "担任华东师范大学传播学院首届学生会主席，摄影协会、模拟联合国协会副社长。",
  },
  {
    number: "02",
    title: "青年与 AI",
    description:
      "以青年学生代表受邀参加联合国大学驻澳门研究所 2024 人工智能大会，参与数字鸿沟等 AI 前沿话题讨论。",
  },
  {
    number: "03",
    title: "国际模拟联合国",
    description:
      "参加外交学院、北京大学、澳门大学“东亚”等国际性模拟联合国大会，获荣誉提名、最佳立场、最佳潜力等荣誉。",
  },
];

const interviewWorks = [
  {
    number: "01",
    type: "人物采访",
    title: "新闻采访作品标题 · 待补充",
    description: "这里将放置采访背景、报道对象与作品简介。",
  },
  {
    number: "02",
    type: "深度报道",
    title: "新闻采访作品标题 · 待补充",
    description: "这里将放置报道议题、个人角色与作品简介。",
  },
];

export default function JournalismExperience({ identity }: { identity: JournalismIdentity }) {
  return (
    <div className="journalism-experience">
      <header className="journalism-copy">
        <p>{identity.english}</p>
        <div>
          <h2>教育背景</h2>
          <small>{identity.skills}</small>
        </div>
        <h3>{identity.statement.replace("\n", "")}</h3>
        <span>{identity.intro}</span>
      </header>

      <div className="journalism-main-grid">
        <section className="education-section" aria-labelledby="education-title">
          <div className="section-kicker">
            <p id="education-title">EDUCATION · 学历背景</p>
            <span>2020—2027</span>
          </div>

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
                    {item.details.map((detail) => (
                      <p key={detail}>{detail}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="student-activity-section" aria-labelledby="activity-title">
          <div className="section-kicker">
            <p id="activity-title">STUDENT ACTIVITIES · 学生活动</p>
            <span>3 EXPERIENCES</span>
          </div>
          <div className="student-activity-list">
            {studentActivities.map((activity) => (
              <article className="student-activity-item" key={activity.number}>
                <span>{activity.number}</span>
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
        <div className="section-kicker">
          <p id="interview-title">SELECTED INTERVIEWS · 新闻采访作品</p>
          <span>2 STORIES</span>
        </div>
        <div className="interview-list">
          {interviewWorks.map((work) => (
            <article className="interview-placeholder" key={work.number}>
              <div className="interview-number" aria-hidden="true">
                <span>STORY</span>
                <strong>{work.number}</strong>
              </div>
              <div>
                <p>{work.type}</p>
                <h4>{work.title}</h4>
                <span>{work.description}</span>
              </div>
              <small>LINK PLACEHOLDER ↗</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
