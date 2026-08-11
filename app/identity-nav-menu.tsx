"use client";

import { useRef } from "react";

export default function IdentityNavMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details className="identity-nav-menu" ref={detailsRef}>
      <summary>五个身份</summary>
      <div className="identity-nav-dropdown" onClick={closeMenu}>
        <a href="#identity-sage">教育信息</a>
        <a href="#identity-sand">实习情况</a>
        <a href="#identity-ink">AI 项目</a>
        <a href="#identity-clay">创业情况</a>
        <a href="#identity-blue">兴趣爱好</a>
      </div>
    </details>
  );
}
