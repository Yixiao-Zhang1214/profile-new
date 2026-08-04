"use client";

import { useEffect, useRef, useState } from "react";
import JournalismExperience from "./journalism-experience";
import TravelerExperience from "./traveler-experience";

type IdentityProject = {
  type: string;
  title: string;
  result: string;
  media: string;
};

export type Identity = {
  name: string;
  english: string;
  statement: string;
  intro: string;
  skills: string;
  character: string | null;
  tone: string;
  projects: IdentityProject[];
};

function CharacterSlot({ index }: { index: number }) {
  return (
    <div className="character-slot" role="img" aria-label={`第 ${index} 个角色形象占位`}>
      <div className="character-silhouette" aria-hidden="true">
        <span className="silhouette-head" />
        <span className="silhouette-body" />
      </div>
      <div className="character-slot-label">
        <span>PERSONA {String(index).padStart(2, "0")}</span>
        <strong>放置角色形象</strong>
        <small>建议透明底 · 竖版全身</small>
      </div>
    </div>
  );
}

function ProjectModule({ project }: { project: IdentityProject }) {
  return (
    <article className="identity-project">
      <div className="project-cover" role="img" aria-label={`图片占位：${project.media}`}>
        <span>{project.media}</span>
        <small>替换图片 · 16 : 10</small>
      </div>
      <div className="project-details">
        <p>{project.type}</p>
        <h3>{project.title}</h3>
        <span>{project.result}</span>
        <small>CASE STUDY · 待添加</small>
      </div>
    </article>
  );
}

function IdentityDetails({ identity }: { identity: Identity }) {
  if (identity.name === "新闻与传播学生") {
    return <JournalismExperience identity={identity} />;
  }

  if (identity.name === "旅行家") {
    return <TravelerExperience identity={identity} />;
  }

  return (
    <>
      <div className="identity-heading">
        <p>{identity.english}</p>
        <h2>{identity.name}</h2>
        <h3>{identity.statement}</h3>
        <span>{identity.intro}</span>
        <small>{identity.skills}</small>
      </div>

      <div className="identity-projects" aria-label={`${identity.name}项目`}>
        {identity.projects.map((project) => (
          <ProjectModule project={project} key={project.title} />
        ))}
      </div>
    </>
  );
}

function getPanelClass(identity: Identity) {
  if (identity.name === "新闻与传播学生") return " journalism-panel";
  if (identity.name === "旅行家") return " traveler-panel";
  return "";
}

function getStageState(index: number, activeIndex: number) {
  if (index === activeIndex) return " is-active";
  return index < activeIndex ? " is-above" : " is-below";
}

function IdentityCharacter({ identity, index }: { identity: Identity; index: number }) {
  const isTraveler = identity.name === "旅行家";

  return (
    <div className={`identity-character${isTraveler ? " identity-character-traveler" : ""}`}>
      {identity.character ? (
        <img src={identity.character} alt={`${identity.name}角色形象`} />
      ) : (
        <CharacterSlot index={index + 1} />
      )}
      <div className="scene-index" aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <i />
        <span>05</span>
      </div>
    </div>
  );
}

export default function IdentityShowcase({ identities }: { identities: Identity[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1021px)");
    let observer: IntersectionObserver | null = null;

    const stopObserving = () => {
      observer?.disconnect();
      observer = null;
    };

    const startObserving = () => {
      stopObserving();
      if (!desktopQuery.matches) {
        setActiveIndex(0);
        return;
      }

      const ratios = new Map<Element, number>();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));

          let nextIndex = 0;
          let largestRatio = -1;
          triggerRefs.current.forEach((element, index) => {
            if (!element) return;
            const ratio = ratios.get(element) ?? 0;
            if (ratio > largestRatio) {
              largestRatio = ratio;
              nextIndex = index;
            }
          });

          if (largestRatio > 0) setActiveIndex(nextIndex);
        },
        { threshold: Array.from({ length: 101 }, (_, index) => index / 100) },
      );

      triggerRefs.current.forEach((element) => {
        if (element) observer?.observe(element);
      });
    };

    startObserving();
    desktopQuery.addEventListener("change", startObserving);

    return () => {
      stopObserving();
      desktopQuery.removeEventListener("change", startObserving);
    };
  }, [identities.length]);

  return (
    <section className="identity-list" id="identities" aria-label="我的五个身份">
      {identities.map((identity, index) => (
        <article
          className={`identity-trigger identity-${identity.tone}`}
          key={identity.name}
          ref={(element) => {
            triggerRefs.current[index] = element;
          }}
          aria-label={identity.name}
        >
          <IdentityCharacter identity={identity} index={index} />
          <div
            className={`identity-content identity-mobile-content${getPanelClass(identity)}`}
          >
            <IdentityDetails identity={identity} />
          </div>
        </article>
      ))}

      <div className="identity-desktop-stage">
        <div className="identity-desktop-sticky">
          <div className="identity-stage-left" aria-hidden="true">
            {identities.map((identity, index) => (
              <div
                className={`identity-stage-persona${
                  identity.name === "旅行家" ? " identity-stage-persona-traveler" : ""
                }${getStageState(index, activeIndex)}`}
                key={identity.name}
              >
                {identity.character ? (
                  <img src={identity.character} alt="" />
                ) : (
                  <CharacterSlot index={index + 1} />
                )}
              </div>
            ))}
          </div>
          <div className="identity-stage-right">
            {identities.map((identity, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  className={`identity-content identity-stage-panel${getPanelClass(identity)}${
                    isActive ? " is-active" : ""
                  }`}
                  key={identity.name}
                  aria-hidden={!isActive}
                >
                  <IdentityDetails identity={identity} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
