import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Yixiao \| AI 产品经理与创作者<\/title>/i);
  assert.match(html, /个人作品集/);
  assert.match(html, /五个身份/);
  assert.match(html, /教育信息/);
  assert.match(html, /AI 项目/);
  assert.match(html, /联系我/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("publishes the current contact actions and resume", async () => {
  const [page, navigation] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/identity-nav-menu.tsx", import.meta.url), "utf8"),
    access(new URL("../public/documents/yixiao-zhang-resume.pdf", import.meta.url)),
  ]);

  assert.match(page, /href="\/documents\/yixiao-zhang-resume\.pdf"/);
  assert.match(page, /查看我的简历/);
  assert.doesNotMatch(page, /发邮件给我/);
  assert.match(navigation, /removeAttribute\("open"\)/);
  assert.match(navigation, /#identity-sage/);
  assert.match(navigation, /#identity-blue/);
});
