# Interview Growth Coach Detail Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update only the expanded 05 project details so they accurately describe the current Interview Growth Coach Skill while preserving the existing card name, teaser, layout, and interaction.

**Architecture:** Keep the existing data-driven project-detail renderer unchanged. Replace only the approved fields in the 05 project data object, validate the unchanged identity and new detail concepts with a focused source audit, then publish the validated commit through the existing Sites and Vercel flows.

**Tech Stack:** TypeScript, React 19, Next.js 16, Vinext, Node.js test runner, OpenAI Sites, Vercel Git integration

**Spec:** `docs/superpowers/specs/2026-09-01-interview-growth-coach-detail-copy-design.md`

## Global Constraints

- Keep `number`, `kind`, `title`, `productName`, `summary`, and `link` unchanged for project 05.
- Modify only the project 05 `description`, `highlights`, `deliverables`, `comparison`, `focus`, and `note` fields in product source.
- Do not change layout, styling, responsive behavior, interactions, dependencies, social preview metadata, or any other project.
- Treat the current local `Interview-Prism-Skill/SKILL.md` as the factual source.
- Preserve unrelated uncommitted changes in `app/globals.css` and `.codex-audit/`.
- Do not add an exact-copy regression test: this change is human-facing prose with no logic branch, and `writing-good-tests.md` explicitly says prose for humans earns no test. Use the existing build and page tests plus a focused source audit instead.

---

### Task 1: Replace the project 05 detail copy

**Files:**
- Modify: `app/ai-builder-experience.tsx:301-360`
- Read: `docs/superpowers/specs/2026-09-01-interview-growth-coach-detail-copy-design.md`

**Interfaces:**
- Consumes: the existing project-detail data shape with `description`, `highlights`, `deliverables`, `comparison`, `focus`, and `note`
- Produces: updated string and array values that the existing detail renderer displays without component changes

- [ ] **Step 1: Replace the approved detail fields**

Keep lines 290-300 unchanged. Replace the detail fields with:

```tsx
        description:
          "上传或粘贴真实面试文字稿，也可以使用宿主提供的音频转写。Interview Prism 会保留原始证据，区分真实面试与模拟训练，再完成单场复盘、多场比较、能力画像和成长任务。它不仅解释面试官可能在考什么，也会标明证据边界，帮助你验证训练表现是否迁移到后续真实面试。",
        highlights: [
          "保留原始文字与稳定证据位置，让重要判断可以回到具体回答核对",
          "分开维护真实面试和模拟面试两本账，不混算训练表现与正式表现",
          "支持单场复盘、多场比较、能力画像和常见问题沉淀",
          "每次最多生成三项高优先级成长任务，并给出可观察的验收标准和真实面试验证条件",
          "可以按不同面试官风格进行模拟训练，并比较训练表现是否迁移到真实面试",
        ],
        deliverables: [
          {
            name: "analysis.md",
            detail: "单场复盘主报告，包含总体判断、逐题证据分析、模拟面试官总评和成长任务。",
          },
          {
            name: "qa-original.md",
            detail: "按原始证据片段还原问答，保留口头语、重复、错误和转写不确定标记。",
          },
          {
            name: "session.json",
            detail: "结构化保存面试类型、证据、观察、任务和反馈，便于校验与继续积累。",
          },
          {
            name: "ability-model.md",
            detail: "分别呈现真实面试与模拟训练的能力快照；样本不足时不制造趋势。",
          },
          {
            name: "frequent-questions.md",
            detail: "沉淀重复问题、考察点和证据缺口，形成可以持续更新的个人问题库。",
          },
        ],
        comparison: [
          {
            dimension: "从哪里开始",
            common: "多从模拟题、职位描述或一次性问答开始。",
            project: "从真实文字稿、宿主音频转写或明确创建的模拟面试开始。",
          },
          {
            dimension: "结论怎么来",
            common: "常给出分数、参考答案或笼统建议。",
            project: "重要判断回到原始证据，事实、推断、模拟与真实反馈分开标记。",
          },
          {
            dimension: "如何看待训练",
            common: "模拟训练和真实表现可能放在同一套指标中。",
            project: "真实与模拟分账管理，只把两者比较为训练迁移差距。",
          },
          {
            dimension: "如何持续成长",
            common: "通常保存单次报告或练习分数。",
            project: "把重复风险转成最多三项可验收任务，并等待真实面试验证。",
          },
          {
            dimension: "结果留在哪里",
            common: "结果多保留在一次对话或产品仪表盘中。",
            project: "固定生成五类本地文件，支持阅读、校验、比较和继续积累。",
          },
        ],
        focus: ["证据可追溯", "真实 / 模拟双账本", "可验证成长任务"],
        note: "默认处理你主动提供的面试材料。公开报告前，请检查姓名、公司、岗位和招聘信息；它可以用于面试后的复盘与模拟训练，但不会在真实招聘面试中提供隐蔽协助。",
```

- [ ] **Step 2: Audit the approved copy boundary**

Run:

```bash
rg -n 'title: "面试复盘成长助手"|productName: "Interview Prism"|summary: "贴心的求职助手，把面试记录转成可执行的复盘与成长建议"|真实面试和模拟面试两本账|最多生成三项高优先级成长任务|训练表现是否迁移到真实面试|不会在真实招聘面试中提供隐蔽协助' app/ai-builder-experience.tsx
git diff -- app/ai-builder-experience.tsx
git diff --check -- app/ai-builder-experience.tsx
```

Expected: the unchanged title, product name, and summary are present; all four new detail concepts are present; only the approved project 05 detail fields changed; no whitespace errors are reported.

- [ ] **Step 3: Commit the implementation**

```bash
git add app/ai-builder-experience.tsx
git commit -m "docs: sync interview skill details"
```

### Task 2: Validate and publish the updated site

**Files:**
- Verify: `app/ai-builder-experience.tsx`
- Verify: `tests/rendered-html.test.mjs`
- Preserve: `app/globals.css`
- Preserve: `.codex-audit/`

**Interfaces:**
- Consumes: the committed project 05 copy and existing Vinext build configuration
- Produces: a validated Sites version and a Vercel production deployment from the same committed source

- [ ] **Step 1: Run the production build**

Run:

```bash
pnpm build
```

Expected: Vinext reports `Build complete` with no error.

- [ ] **Step 2: Run the complete page tests against the fresh build**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected: 2 tests pass and 0 tests fail.

- [ ] **Step 3: Publish through Sites**

Create a clean build from the committed tree and package it with the installed Sites helper:

```bash
site_commit=$(git rev-parse HEAD)
site_build_root=$(mktemp -d /private/tmp/profile-sites-build.XXXXXX)
mkdir "$site_build_root/source"
git archive "$site_commit" | tar -x -C "$site_build_root/source"
ln -s "$PWD/node_modules" "$site_build_root/source/node_modules"
cd "$site_build_root/source"
WRANGLER_LOG_PATH=.wrangler/wrangler.log ./node_modules/.bin/vinext build
bash /Users/bytedance/.codex/plugins/cache/openai-bundled/sites/0.1.46/scripts/package-site.sh "$site_build_root/source" "$site_build_root/site.tar.gz"
```

Prepare an exact-tree incremental source repository without copying unrelated working-tree changes:

```bash
site_source_root=$(mktemp -d /private/tmp/profile-sites-source.XXXXXX)
mkdir "$site_source_root/repo"
git checkout-index --all --prefix="$site_source_root/repo/"
git -C "$site_source_root/repo" init -b main
git -C "$site_source_root/repo" config user.name "Yixiao Zhang"
git -C "$site_source_root/repo" config user.email "172938960@qq.com"
git -C "$site_source_root/repo" add -Af .
test "$(git -C "$site_source_root/repo" write-tree)" = "$(git rev-parse HEAD^{tree})"
```

Then use `sites-hosting` with project ID `appgprj_6a70a01aeb408191a6e3753682d06246` to obtain a short-lived source credential, fetch the current Sites `main`, create one commit whose tree is the verified local tree and whose parent is the fetched Sites head, and push that commit with a per-command authorization header. Save the version with that pushed commit SHA and `$site_build_root/site.tar.gz`, deploy it with `deploy_private_site_version` only after re-verifying the existing owner-only access policy, and poll `get_deployment_status` until `succeeded`.

- [ ] **Step 4: Push the implementation commits to GitHub**

```bash
git push origin main
```

Expected: `origin/main` advances to the local implementation commit while uncommitted `app/globals.css` and `.codex-audit/` remain local.

- [ ] **Step 5: Verify Vercel production**

Use the linked Vercel project `zhangyixiao-profile` to confirm the deployment for the pushed commit reaches `READY`, its production alias includes `zhangyixiao-profile.online`, and the runtime error scan reports no new errors.

- [ ] **Step 6: Report the live result**

Return both production URLs:

```text
https://five-sides-portfolio.zhangyixiao1214.chatgpt.site
https://zhangyixiao-profile.online
```

State that only the detailed Interview Prism explanation changed and that the card name, teaser, layout, and unrelated local work were preserved.
