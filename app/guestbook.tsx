import "./guestbook.css";

export default function Guestbook() {
  return (
    <section className="guestbook" aria-labelledby="guestbook-title" id="guestbook">
      <div className="guestbook-intro">
        <h4 id="guestbook-title">留句话吧</h4>
        <p>想说的话、对作品的建议，都可以匿名告诉我。</p>
      </div>
      <a className="guestbook-link"
        href="https://bytedance.larkoffice.com/share/base/form/shrcn6WdJH02jhcG05ybwwtQ5Lf"
        target="_blank" rel="noopener noreferrer"
        aria-label="给我留言，在新标签页打开飞书表单">
        给我留言 <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
