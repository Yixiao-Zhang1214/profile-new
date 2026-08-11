"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type BuilderProject = {
  number: string;
  kind: string;
  title: string;
  productName?: string;
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
  highlights?: string[];
  highlightLead?: string;
  highlightTitle?: string;
  deliverables?: Array<{
    name: string;
    detail: string;
  }>;
  deliverablesIntro?: string;
  comparison?: Array<{
    dimension: string;
    common: string;
    project: string;
  }>;
  comparisonTitle?: string;
  comparisonNote?: string;
  comparisonLabels?: {
    common: string;
    project: string;
  };
  preview?: "comment" | "memento" | "sunset";
  externalHref?: string;
  demo?: "comment" | "memento";
  gallery?: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  video?: {
    src: string;
    poster?: string;
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
  kind: "AIGC 图像",
  title: "AIGC 生图作品",
  summary: "人物、场景与超现实概念探索",
  description: "围绕人物情绪、电影感场景与超现实意象进行的视觉探索。",
  focus: ["视觉叙事", "风格控制", "画面表达"],
  gallery: aigcGallery,
  note: "共 13 幅作品，来自个人 AIGC 生图作品集。",
};

const aigcVideoProject: BuilderProject = {
  number: "B",
  kind: "AIGC 视频 · 实验室合作",
  title: "《黄河捞尸人》宣传片",
  summary: "爱奇艺 × 硕士院校实验室合作 · 项目负责人",
  description:
    "《黄河捞尸人》宣传片是爱奇艺与我硕士就读院校实验室的合作项目。我担任项目负责人，统筹前期资产准备、视觉生成与视频制作流程。",
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
    english: "轻量产品实验",
    projects: [
      {
        number: "01",
        kind: "评论洞察",
        title: "大家补充了什么",
        summary: "自动整理评论区的重点·别错过精彩的内容～",
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
        kind: "交互模拟器",
        title: "日出日落模拟器",
        summary: "在办公室的日子，也想看看海上的不同天气，还有日出日落……",
        description:
          "通过时间与天气参数，模拟海上从黎明、日出、正午到日落的天空色彩、太阳位置、云层与海面光影变化。",
        focus: ["时间模拟", "天气系统", "动态视觉"],
        visual: {
          src: "/ai-builder/sunrise-sunset-simulator.png",
          alt: "日出日落模拟器的海洋场景、天气选项与时间控制界面",
        },
        preview: "sunset",
        externalHref: "/living-ocean/",
        note: "轻量交互实验，探索自然光照、天气状态与海面氛围之间的动态关系。",
      },
      {
        number: "03",
        kind: "网页产品",
        title: "Memento",
        summary: "把普通瞬间做成一张私人纪念卡",
        description:
          "用户放入一张照片或几句话，Memento 只追问一个关键细节，再把口语化的回忆整理成一张有标题、短故事和馆员评语的私人纪念卡。",
        focus: ["轻记录", "AI 写作", "情绪化表达"],
        preview: "memento",
        demo: "memento",
        note: "概念提案聚焦一次轻记录的完整闭环；点击纪念卡可在概要与完整故事之间切换。",
      },
      {
        number: "04",
        kind: "无障碍应用",
        title: "行无碍 App",
        summary: "一张可以共同标注的无障碍地图，还提供无障碍互助社区",
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
    english: "工作实践",
    projects: [
      {
        number: "05",
        kind: "个人提效skill",
        title: "面试复盘成长助手",
        productName: "Interview Prism",
        summary: "贴心的求职助手，把面试记录转成可执行的复盘与成长建议",
        link: {
          href: "https://github.com/Yixiao-Zhang1214/Interview-Prism-Skill",
          label: "查看 Interview Prism 代码仓 ↗",
          installHref:
            "git clone https://github.com/Yixiao-Zhang1214/Interview-Prism-Skill.git ~/.codex/skills/interview-prism",
        },
        description:
          "上传或粘贴真实面试文字稿。Interview Prism 会先还原问答关系，再逐个回答你真正关心的问题：面试官想考什么？这段回答哪里加分？哪里证据不够？下一次怎么答？每个判断都尽量引用原文，推测会单独标明。",
        highlights: [
          "设置“面试官心声”，说明真正想要考察的能力点",
          "哪些回答形成了明确加分",
          "哪些地方证据不足或容易被追问",
          "用实际的成长任务，帮助你了解如何调整表达和思考方式",
          "多场面试中，哪些问题正在改善，哪些风险反复出现",
        ],
        deliverables: [
          {
            name: "analysis.md",
            detail: "完整复盘。包括总体结论、能力快照、重点回答分析和下一步成长任务。",
          },
          {
            name: "qa-original.md",
            detail: "按时间顺序整理原始问答，保留上下文，也方便回看每个判断来自哪里。",
          },
          {
            name: "session.json",
            detail: "结构化保存这场面试的数据，便于校验、迁移和继续写入成长账本。",
          },
          {
            name: "ability-model.md",
            detail: "记录当前能力模型，以及多场面试中已经出现的能力变化。",
          },
          {
            name: "frequent-questions.md",
            detail: "沉淀已经出现的问题、考察点和反复缺失的证据，形成个人问题库。",
          },
        ],
        comparison: [
          {
            dimension: "从哪里开始",
            common: "常见产品多从模拟题、职位描述或实时面试开始。",
            project: "从你已经经历过的真实面试文字稿开始。",
          },
          {
            dimension: "主要看什么",
            common: "更常关注回答相关性、表达节奏、语法、语气和自信度。",
            project: "重点看考察意图、回答证据、面试官顾虑和可追问点。",
          },
          {
            dimension: "结论怎么来",
            common: "通常给出即时评分、表达指标或参考答案。",
            project: "每个重要判断尽量引用原文，事实和推测分开写。",
          },
          {
            dimension: "怎么持续使用",
            common: "多用于反复练习，并追踪模拟训练中的表现变化。",
            project: "把多场真实面试写进同一本成长账本；样本不足时不制造趋势。",
          },
          {
            dimension: "结果留在哪里",
            common: "结果通常保留在产品仪表盘或单次反馈报告中。",
            project: "固定生成 5 份本地文件，既能阅读，也能校验和继续积累。",
          },
        ],
        focus: ["原文证据", "回答改进", "多场成长账本"],
        note: "默认处理你主动提供的本地文字稿。公开报告前，请先检查姓名、公司、岗位和招聘信息。",
      },
      {
        number: "06",
        kind: "个人提效skill",
        title: "解释 Skill 的 Skill",
        productName: "Explain Skill",
        summary: "把陌生 Skill 变成看得懂的离线说明书",
        description:
          "给它一个 Skill 目录、SKILL.md 或 ZIP，它会在不执行目标脚本、不安装依赖的前提下，梳理这个 Skill 能做什么、如何使用、怎样运行、依赖哪些工具，以及结论来自哪里，最后生成一份可以直接分享和离线阅读的 HTML 说明书。",
        highlightLead: "它不只解释",
        highlightTitle: "「这个 Skill 是什么」",
        highlights: [
          "用 30 秒说明它解决什么问题、适合谁、需要什么输入",
          "判断它在当前 Agent 应用中能直接使用、需要改造，还是暂时无法确认",
          "还原一次任务的真实流程，以及主 Skill、子 Skill 和工具之间的关系",
          "说明首次使用需要安装什么、授权什么、准备什么",
          "让重要判断回到具体文件、行号或公开来源，并明确尚未验证的部分",
        ],
        deliverables: [
          {
            name: "report.html",
            detail: "一份不依赖外部字体、脚本或样式的单文件说明书，可以在浏览器中离线打开，也方便直接发给其他人阅读。",
          },
        ],
        deliverablesIntro: "不是聊天窗口里的一次回答，而是一份可以保存、回查和分享的独立报告。",
        comparisonTitle: "它和手动阅读或普通 AI 总结有什么不同",
        comparisonNote: "这里比较的是理解一个陌生 Skill 时的工作方式，而不是判断所有分析工具的优劣。",
        comparisonLabels: {
          common: "手动阅读或普通 AI 总结",
          project: "Explain Skill",
        },
        comparison: [
          {
            dimension: "从哪里开始",
            common: "逐个翻看 README、SKILL.md、脚本和配置，信息容易散落。",
            project: "从目录、单个 SKILL.md 或 ZIP 建立只读文件清单，再按统一路径分析。",
          },
          {
            dimension: "主要看什么",
            common: "通常停留在功能概括，较少说明安装、调用、依赖和应用兼容性。",
            project: "同时解释用途、唤起方式、任务流程、首次使用、依赖关系和设计风险。",
          },
          {
            dimension: "结论怎么来",
            common: "总结与原文件分离，读者很难确认依据。",
            project: "重要判断链接到具体文件、行号或公开来源；无法确认的内容保留为未知。",
          },
          {
            dimension: "如何保证安全",
            common: "分析过程中可能误执行脚本、导入代码或安装目标依赖。",
            project: "把目标 Skill 当作不可信数据，不执行脚本、不导入代码，也不安装其依赖。",
          },
          {
            dimension: "结果留在哪里",
            common: "通常留在一次对话里，后续查找和转发不方便。",
            project: "生成独立的离线 HTML，结构完整，可以长期保存、复核和分享。",
          },
        ],
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
          href: "https://github.com/Yixiao-Zhang1214/Explain-Skill",
          label: "查看 Explain Skill 代码仓 ↗",
          installHref:
            "请安装这个仓库中的 Explain Skill：\nhttps://github.com/Yixiao-Zhang1214/Explain-Skill\nSkill 位于 outputs/explain-skill。",
        },
      },
      {
        number: "07",
        kind: "工作提效平台",
        title: "Badcase评测&管理平台",
        summary: "AI产品经理必备的标注平台！效率提升N倍！",
        video: {
          src: "/ai-builder/badcase-management-platform.mp4",
          poster: "/ai-builder/badcase-01-tool-home.png",
          alt: "Badcase评测与管理平台操作演示",
        },
        description:
          "这是一个面向 Agent 评测的 Badcase 工作台。产品和研发可以在同一处管理 Case、配置评测 PE、发起批量标注，并继续处理评测后的分类、编辑和讨论。",
        focus: ["全量 Case 管理", "批量评测", "产研协作"],
        sections: [
          {
            title: "全量 Badcase 管理",
            body: "集中导入和维护全量 Badcase。平台支持搜索、分类统计和单条编辑，产品与研发可以随时查看当前积累了哪些问题、各类问题分别有多少。",
          },
          {
            title: "评测任务与批量打标",
            body: "针对不同评测目标配置评测 PE（Prompt），选择模型并创建评测任务。任务可以批量处理 Badcase，自动输出每条 Case 的标签、判断结果和判断理由。",
          },
          {
            title: "评测结果管理",
            body: "评测完成后，可以按问题类型查看数量和分布，快速找到主要问题。每条 Case 的标签、评测结论和相关信息都可以继续编辑，方便人工复核和修正。",
          },
          {
            title: "Case 讨论与跟进",
            body: "可从具体 Case 发起讨论，记录产品和研发的处理意见，并设置问题状态、优先级和负责人。团队可以在同一处确认问题由谁跟进、目前处理到哪一步。",
          },
        ],
        gallery: [
          {
            src: "/ai-builder/badcase-01-tool-home.png",
            alt: "Agent 测评工具首页与测评类型入口",
            width: 2048,
            height: 1080,
          },
          {
            src: "/ai-builder/badcase-02-evaluation-task.png",
            alt: "上传数据并创建 Badcase 批量评测任务",
            width: 2048,
            height: 1080,
          },
          {
            src: "/ai-builder/badcase-03-prompt-tuning.png",
            alt: "评测 Prompt 调优与历史版本管理",
            width: 2048,
            height: 1080,
          },
          {
            src: "/ai-builder/badcase-04-case-management.png",
            alt: "全量 Badcase 分类、检索与单条结果编辑",
            width: 2048,
            height: 1080,
          },
          {
            src: "/ai-builder/badcase-05-case-discussion.png",
            alt: "Case 讨论、处理状态、优先级与负责人管理",
            width: 2048,
            height: 1080,
          },
          {
            src: "/ai-builder/badcase-06-evaluation-results.png",
            alt: "批量评测结果与单条 Case 判断理由",
            width: 2048,
            height: 1080,
          },
        ],
      },
      {
        number: "08",
        kind: "工作提效平台",
        title: "业务评测平台",
        summary: "AI产品经理心疼标注人员的产物！效率提升N倍！",
        description:
          "这是一个面向 CQC 标注人员的业务评测平台。它把原始输入、长文本结果和评测维度拆分到清晰的工作区，减少在表格中来回查找、横向滚动和误标的问题。",
        focus: ["长文本阅读", "评测维度组织", "标注效率"],
        visual: {
          src: "/ai-builder/business-evaluation-platform.png",
          alt: "业务评测平台的长文本阅读与多维评分界面",
        },
        sections: [
          {
            title: "长文本分栏阅读",
            body: "将原始输入、生成话术和评分区并排展示。标注人员不需要在表格单元格之间反复展开和切换，就能对照上下文完成判断。",
          },
          {
            title: "评测维度分组",
            body: "把分散的评测项按维度组织，并显示每组的完成进度和平均分。标注人员可以看清当前评到哪里，减少漏标和错选。",
          },
          {
            title: "连续标注流程",
            body: "支持保存当前结果后直接进入下一条，也可以暂存草稿。连续操作减少页面跳转，让批量标注更顺手。",
          },
          {
            title: "结果即时核对",
            body: "页面同步展示单条总分、合格状态和已完成维度。提交前可以快速检查结果，及时发现没有评完或分数异常的 Case。",
          },
        ],
        gallery: [
          {
            src: "/ai-builder/business-evaluation-platform.png",
            alt: "长文本内容、评测维度与结果状态集中展示的业务评测工作区",
            width: 2048,
            height: 1366,
          },
        ],
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

const mementoSamples = [
  {
    id: "cup",
    frontMeta: "Card 01 · 概要",
    backMeta: "Card 02 · 完整故事",
    title: "第一份工作的杯子",
    line: "它不是杯子，是那段夜晚留给我的把手。",
    image: "/ai-builder/memento-cup-sample.jpg",
    imageAlt: "手绘杯子和旧物小插图",
    story: [
      "这只杯子没有昂贵的来历，只是在第一份工作开始后不久，被我从公司楼下的便利店买下。它有一点笨重，杯口也不算好看，但很适合在夜里接一杯咖啡，放在电脑旁边，陪我把一句又一句“再改一下”熬到凌晨。",
      "那时候我总觉得自己不够好，怕问错问题，怕交不出东西，也怕第二天醒来还是同样的疲惫。很多个办公室只剩下键盘声的晚上，我没有什么可以证明自己正在努力，只有这只杯子一直在桌角，安静地冒着一点热气。",
      "后来那份工作结束了，文件被清掉，聊天记录被删除，委屈也慢慢不再具体。搬走那天，我还是把它放进了纸箱。它不像奖杯，也不像纪念品，更像一个小小的证人，提醒我那段日子确实很难，但我也确实撑过来了。",
    ],
    curator: "馆员评语：它替你保存的不是加班的苦，而是那个一边害怕、一边没有停下来的自己。",
  },
  {
    id: "travel",
    frontMeta: "18 · Summer after exam",
    backMeta: "Card 04 · 完整故事",
    title: "十八岁的第一场日落",
    line: "那天太阳落下去，我第一次觉得人生真的要开始了。",
    image: "/ai-builder/memento-travel-sample.jpg",
    imageAlt: "福建平潭长江澳海岸的日落",
    location: "定位：福建平潭 · 长江澳海岸",
    date: "高考后的第一次旅行 · 海边黄昏",
    story: [
      "高考结束后的那个夏天，我第一次没有带着试卷、错题本和倒计时出门。车窗外的树影一直往后退，我坐在靠窗的位置，忽然发现自己已经很久没有这样认真看过一片天空了。",
      "那是我第一次真正意义上的旅行。目的地并不远，行程也谈不上特别，但傍晚走到海边时，夕阳正好落在水面上，像有人把一整罐橘色颜料慢慢倒开。身边的人在拍照、说笑，我却突然安静下来，好像过去三年紧绷着的那根线，在那一刻终于松开了。",
      "我记得风很热，汽水很甜，鞋子里进了一点沙。也记得自己站在那里，第一次不是为了考试、排名或某个确定的目标，而只是为了看完一场日落。后来很多旅行都更远、更漂亮，但十八岁那天的太阳一直留在心里，像一枚告诉我“你可以往前走了”的印章。",
    ],
    curator: "馆员评语：那不是一场普通的日落，是十八岁的你终于从答案里抬起头，看见了远方。",
  },
] as const;

function MementoSampleCard({ sample }: { sample: (typeof mementoSamples)[number] }) {
  const [showStory, setShowStory] = useState(false);
  const isTravel = sample.id === "travel";

  return (
    <button
      className={`memento-sample-card${showStory ? " is-flipped" : ""}`}
      type="button"
      aria-pressed={showStory}
      aria-label={showStory ? `返回${sample.title}概要` : `查看${sample.title}完整故事`}
      onClick={() => setShowStory((current) => !current)}
    >
      <span className="memento-sample-card-inner">
        <span
          className={`memento-sample-face is-front${isTravel ? " is-travel" : ""}`}
          style={isTravel ? { backgroundImage: `linear-gradient(180deg, rgba(20,21,20,0.02) 0%, rgba(20,21,20,0.12) 42%, rgba(20,21,20,0.82) 100%), url("${sample.image}")` } : undefined}
        >
          <span className="memento-sample-meta">{sample.frontMeta}</span>
          {!isTravel && (
            <span
              className="memento-sample-art"
              role="img"
              aria-label={sample.imageAlt}
              style={{ backgroundImage: `url("${sample.image}")` }}
            />
          )}
          <span className="memento-sample-front-copy">
            <strong>{sample.title}</strong>
            <span>{sample.line}</span>
            {"location" in sample && <small>{sample.location}</small>}
            {"date" in sample && <small>{sample.date}</small>}
          </span>
          <span className="memento-sample-hint">点击查看完整故事 →</span>
        </span>

        <span className="memento-sample-face is-back">
          <span className="memento-sample-meta">{sample.backMeta}</span>
          <span className="memento-sample-story">
            <strong>{sample.title}</strong>
            {sample.story.map((paragraph) => (
              <span key={paragraph}>{paragraph}</span>
            ))}
          </span>
          <span className="memento-sample-curator">{sample.curator}</span>
          <span className="memento-sample-hint">← 返回概要</span>
        </span>
      </span>
    </button>
  );
}

function MementoDemo() {
  return (
    <div className="memento-samples" aria-label="Memento 示范卡片">
      {mementoSamples.map((sample) => (
        <MementoSampleCard key={sample.id} sample={sample} />
      ))}
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
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const galleryLength = project.gallery?.length ?? 0;

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
      if (activeGalleryIndex !== null && galleryLength > 0) {
        if (event.key === "Escape") {
          event.preventDefault();
          setActiveGalleryIndex(null);
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setActiveGalleryIndex((activeGalleryIndex - 1 + galleryLength) % galleryLength);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          setActiveGalleryIndex((activeGalleryIndex + 1) % galleryLength);
          return;
        }
      }

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
  }, [activeGalleryIndex, galleryLength, onClose]);

  return (
    <div className="builder-dialog-backdrop" onPointerDown={onClose}>
      <aside
        ref={dialogRef}
        className={`builder-dialog${project.visual ? " is-product" : ""}${project.gallery ? " is-gallery" : ""}${project.video ? " is-video" : ""}${project.demo ? " is-demo" : ""}${project.embed ? " is-embed" : ""}${project.productName ? " is-interview-prism is-editorial-skill" : ""}`}
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
            </div>
            {project.video && (
              <section className="builder-gallery-recording" aria-labelledby="builder-recording-title">
                <header>
                  <h3 id="builder-recording-title">操作录屏</h3>
                  <p>完整展示评测任务、Badcase 管理和 Case 跟进流程</p>
                  <p className="builder-gallery-recording-description">
                    {project.description}
                  </p>
                </header>
                <figure className="builder-gallery-video">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={project.video.poster}
                    aria-label={project.video.alt}
                  >
                    <source src={project.video.src} type="video/mp4" />
                  </video>
                </figure>
              </section>
            )}
            {project.sections && project.sections.length > 0 && (
              <div className="builder-dialog-explain-sections" aria-label="平台用途">
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
            <section className="builder-gallery-screenshots" aria-labelledby="builder-screenshots-title">
              <header>
                <h3 id="builder-screenshots-title">产品界面</h3>
                <p>点击图片查看完整界面</p>
              </header>
              <div className="builder-gallery-grid">
                {project.gallery.map((work, index) => (
                  <figure key={work.src}>
                    <button
                      className="builder-gallery-open"
                      type="button"
                      aria-label={`查看大图：${work.alt}`}
                      onClick={() => setActiveGalleryIndex(index)}
                    >
                      <Image
                        src={work.src}
                        alt={work.alt}
                        width={work.width}
                        height={work.height}
                        unoptimized
                        sizes="(max-width: 720px) 100vw, 560px"
                      />
                      <span>查看大图</span>
                    </button>
                    <figcaption>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {work.alt}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
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
                <figcaption>《黄河捞尸人》宣传片 · 作品节选 12 秒</figcaption>
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

              {!project.link?.href.includes("Interview-Prism-Skill") && (
                <section className="builder-dialog-focus" aria-labelledby="builder-focus-title">
                  <h3 id="builder-focus-title">能力侧重</h3>
                  <ul>
                    {project.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

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
              {project.productName && <p className="builder-dialog-product-name">{project.productName}</p>}
              <h2 id="builder-dialog-title">{project.title}</h2>
              {project.tagline && <p className="builder-dialog-tagline">{project.tagline}</p>}
              <p>{project.description}</p>
            </div>

            {project.productName && project.link && (
              <div className="builder-dialog-repo-bar is-primary">
                <div>
                  <span>代码仓库</span>
                  <a href={project.link.href} target="_blank" rel="noreferrer">
                    {project.link.href.replace("https://", "")}
                  </a>
                </div>
                <button type="button" onClick={handleCopyInstallLink}>
                  {copiedInstallLink ? "已复制" : "复制安装地址"}
                </button>
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <section className="builder-dialog-highlights" aria-labelledby="builder-highlights-title">
                <p id="builder-highlights-title">
                  {project.highlightLead ?? "它不只回答"}<br />
                  <strong>{project.highlightTitle ?? "「这场表现怎么样」"}</strong>
                </p>
                <ul>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <section className="builder-dialog-deliverables" aria-labelledby="builder-deliverables-title">
                <header>
                  <p>固定产出 / {String(project.deliverables.length).padStart(2, "0")}</p>
                  <h3 id="builder-deliverables-title">你会得到什么</h3>
                  <span>{project.deliverablesIntro ?? "不是一段看完就消失的总结，而是一套可以回查和继续积累的文件。"}</span>
                </header>
                <ol>
                  {project.deliverables.map((deliverable, index) => (
                    <li key={deliverable.name}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <code>{deliverable.name}</code>
                      <p>{deliverable.detail}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {project.comparison && project.comparison.length > 0 && (
              <section className="builder-dialog-comparison" aria-labelledby="builder-comparison-title">
                <header>
                  <p>定位对比</p>
                  <h3 id="builder-comparison-title">{project.comparisonTitle ?? "它和常见面试复盘产品有什么不同"}</h3>
                  <span>{project.comparisonNote ?? "这里比较的是使用方式和输出重点，不代表所有产品都完全相同。"}</span>
                </header>
                <div className="builder-dialog-comparison-table" role="table" aria-label="产品定位对比">
                  <div className="builder-dialog-comparison-row is-heading" role="row">
                    <span role="columnheader">比较维度</span>
                    <span role="columnheader">{project.comparisonLabels?.common ?? "常见 AI 面试产品"}</span>
                    <span role="columnheader">{project.comparisonLabels?.project ?? "Interview Prism"}</span>
                  </div>
                  {project.comparison.map((row) => (
                    <div className="builder-dialog-comparison-row" role="row" key={row.dimension}>
                      <strong role="cell">{row.dimension}</strong>
                      <p role="cell">{row.common}</p>
                      <p role="cell">{row.project}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.link && (
              <div
                className={`builder-dialog-repo-bar${project.productName ? " is-footer" : ""}`}
              >
                <div>
                  <span>{project.link.label}</span>
                  <a href={project.link.href} target="_blank" rel="noreferrer">
                    {project.link.href.replace("https://", "")}
                  </a>
                </div>
                {project.productName ? (
                  <a className="builder-dialog-repo-action" href={project.link.href} target="_blank" rel="noreferrer">
                    查看代码仓 <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <button type="button" onClick={handleCopyInstallLink}>
                    {copiedInstallLink ? "已复制" : "复制安装地址"}
                  </button>
                )}
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

            {!project.productName && (
              <section className="builder-dialog-focus" aria-labelledby="builder-focus-title">
                <h3 id="builder-focus-title">能力侧重</h3>
                <ul>
                  {project.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

          </>
        )}

        {!project.embed && !project.productName && (
          <p className="builder-dialog-note">
            {project.note ?? "项目材料可继续补充为产品截图、交互录屏或代码仓库。"}
          </p>
        )}

        {activeGalleryIndex !== null &&
          project.gallery &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="builder-gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="产品界面大图"
              onPointerDown={(event) => {
                event.stopPropagation();
                setActiveGalleryIndex(null);
              }}
            >
              <button
                className="builder-gallery-lightbox-close"
                type="button"
                onClick={() => setActiveGalleryIndex(null)}
              >
                关闭
              </button>
              <button
                className="builder-gallery-lightbox-nav is-previous"
                type="button"
                aria-label="上一张"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveGalleryIndex(
                    (activeGalleryIndex - 1 + galleryLength) % galleryLength,
                  );
                }}
              >
                ‹
              </button>
              <figure onPointerDown={(event) => event.stopPropagation()}>
                <Image
                  src={project.gallery[activeGalleryIndex].src}
                  alt={project.gallery[activeGalleryIndex].alt}
                  width={project.gallery[activeGalleryIndex].width}
                  height={project.gallery[activeGalleryIndex].height}
                  unoptimized
                  sizes="96vw"
                />
                <figcaption>
                  <span>
                    {String(activeGalleryIndex + 1).padStart(2, "0")} / {String(galleryLength).padStart(2, "0")}
                  </span>
                  {project.gallery[activeGalleryIndex].alt}
                </figcaption>
              </figure>
              <button
                className="builder-gallery-lightbox-nav is-next"
                type="button"
                aria-label="下一张"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveGalleryIndex((activeGalleryIndex + 1) % galleryLength);
                }}
              >
                ›
              </button>
            </div>,
            document.body,
          )}
      </aside>
    </div>
  );
}

export default function AiBuilderExperience() {
  const [selectedProject, setSelectedProject] = useState<BuilderProject | null>(null);

  return (
    <section className="builder-experience" aria-labelledby="builder-title">
      <header className="builder-copy">
        <strong className="builder-role-label">AI Builder</strong>
        <p>
          AI 构建 · 08 个项目 · 02 个 AIGC 研究
        </p>
        <h2 id="builder-title">
          成为合格的AI builder，快乐玩AI
        </h2>
        <span>
          从面向真实用户的产品、可复用 Skill，到标注系统，我从生活和工作出发，用 AI、设计把想法变成真实体验。
        </span>
      </header>

      <div className="builder-project-groups">
        {projectGroups.map((group) => (
          <section className="builder-project-group" key={group.english}>
            <h3>
              <span>{group.title}</span>
            </h3>
            <div className="builder-project-grid">
              {group.projects.map((project) => (
                <button
                  className={`builder-project-card${project.visual || project.video ? " has-visual" : ""}${project.preview === "comment" ? " has-comment-preview" : ""}${project.preview === "memento" ? " has-memento-preview" : ""}${project.preview === "sunset" ? " has-sunset-preview" : ""}`}
                  type="button"
                  aria-haspopup={project.externalHref ? undefined : "dialog"}
                  aria-label={`${project.title}，${project.externalHref ? "进入在线模拟器" : "查看项目详情"}`}
                  onClick={() => {
                    if (project.externalHref) {
                      window.open(project.externalHref, "_blank", "noopener,noreferrer");
                      return;
                    }

                    setSelectedProject(project);
                  }}
                  key={project.number}
                >
                  {project.visual && project.preview !== "sunset" && (
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
                  {project.video && (
                    <span
                      className="builder-project-visual builder-project-video-preview"
                      aria-hidden="true"
                    >
                      <Image
                        src={project.video.poster!}
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
                  {project.preview === "sunset" && project.visual && (
                    <span className="builder-sunset-preview" aria-hidden="true">
                      <Image
                        src={project.visual.src}
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
          <span>AIGC 创作实验</span>
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
              <small>AIGC 图像作品</small>
              <strong>持续更新中……</strong>
              <em></em>
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
              <small>AIGC 视频实验</small>
              <strong>《黄河捞尸人》宣传片</strong>
              <em></em>
            </span>
            <span className="builder-video-preview" aria-hidden="true">
              <Image
                src="/ai-builder/aigc-video-poster.jpg"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 46vw, 320px"
              />
              <i>▶</i>
            </span>
          </button>
        </div>
      </section>

      <div className="builder-footer-note">
        <p>点击卡片查看项目详情。</p>
        <span>工作项目仅展示脱敏截图和抽象流程图。</span>
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
