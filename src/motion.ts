import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Elements that enter as the visitor scrolls. Sections themselves are left
// alone: they carry CSS transitions for the language switch, which would
// fight GSAP over opacity and transform.
const revealItems = [
  ".section-heading .eyebrow",
  ".section-heading .text-link",
  ".category-filter",
  ".work-card",
  ".work-pager",
  ".stat",
  ".stats-note",
  ".services-list li",
  ".clients-section > .eyebrow",
  ".clients-marquee",
  ".tools-band > .eyebrow",
  ".tool-group",
  ".career-timeline article",
  ".contact-intro > *",
  ".contact-link",
].join(", ");

const cleared = "transform,opacity,visibility,clipPath,filter,transition";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Wipe direction follows reading direction, like a transition across a cut.
const hiddenClip = () =>
  document.documentElement.dir === "rtl" ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

function introHero() {
  const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });

  timeline
    // A flash frame, then the shot settles: the photo starts over-exposed and
    // steps down to normal like a few frames of a cut-in.
    .fromTo(
      ".hero-photo",
      { scale: 1.16 },
      { scale: 1, duration: 1.8 },
    )
    .fromTo(
      ".hero-photo",
      { filter: "brightness(2.3) contrast(1.15)" },
      { filter: "brightness(1) contrast(1)", duration: 0.42, ease: "steps(5)", clearProps: "filter" },
      0,
    )
    .fromTo(
      ".hero-letter",
      { yPercent: 70, autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" },
      {
        yPercent: 0,
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        stagger: { each: 0.05, from: "random" },
        clearProps: "clipPath",
      },
      0.25,
    )
    .fromTo(
      ".hero-copy > *",
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, clearProps: cleared },
      0.75,
    );
}

function parallaxHero() {
  const scrub = { trigger: ".hero-stage", start: "top top", end: "bottom top", scrub: true };

  gsap.to(".hero-photo", { yPercent: 14, ease: "none", scrollTrigger: scrub });
  gsap.to(".hero-name", { yPercent: -60, ease: "none", scrollTrigger: { ...scrub } });
}

function revealOnScroll() {
  const items = gsap.utils.toArray<HTMLElement>(revealItems);
  gsap.set(items, { autoAlpha: 0, y: 44 });

  ScrollTrigger.batch(items, {
    start: "top 92%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.07,
        overwrite: true,
        clearProps: cleared,
      }),
  });

  gsap.utils.toArray<HTMLElement>(".section-heading h2, .contact-intro h2").forEach((heading) => {
    gsap.fromTo(
      heading,
      { clipPath: hiddenClip() },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        ease: "expo.inOut",
        clearProps: "clipPath",
        scrollTrigger: { trigger: heading, start: "top 90%", once: true },
      },
    );
  });
}

// "4+" counts up from zero to 4 and keeps its suffix. The target comes from
// data-count because the text itself is overwritten while counting.
function countStats() {
  gsap.utils.toArray<HTMLElement>(".stat strong[data-count]").forEach((stat) => {
    const label = stat.dataset.count ?? "";
    const target = Number.parseInt(label, 10);
    const suffix = label.replace(/^\d+/, "");
    if (!Number.isFinite(target)) {
      return;
    }

    const counter = { value: 0 };
    stat.textContent = `0${suffix}`;
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power3.out",
      snap: { value: 1 },
      onUpdate: () => {
        stat.textContent = `${counter.value}${suffix}`;
      },
      scrollTrigger: { trigger: stat, start: "top 92%", once: true },
    });
  });
}

// Fast cut between pages of the work grid: cards drop in one after another.
export function cutInWorkCards(grid: HTMLElement | null) {
  if (!grid || prefersReducedMotion()) {
    return;
  }

  gsap.fromTo(
    grid.querySelectorAll(".work-card"),
    { autoAlpha: 0, y: 26, scale: 0.97, transition: "none" },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.045,
      overwrite: true,
      clearProps: cleared,
    },
  );
}

export function refreshMotion() {
  ScrollTrigger.refresh();
}

/** Starts smooth scrolling and every scroll animation; returns the cleanup. */
export function startMotion() {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  // Lenis smooths wheel scrolling only; touch keeps the phone's native feel.
  const lenis = new Lenis({ anchors: { offset: -96 } });
  const raf = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.set(revealItems, { transition: "none" });
    introHero();
    parallaxHero();
    revealOnScroll();
    countStats();
  });

  return () => {
    context.revert();
    // Reverting stops the counters mid-way; put the real numbers back.
    document.querySelectorAll<HTMLElement>(".stat strong[data-count]").forEach((stat) => {
      stat.textContent = stat.dataset.count ?? "";
    });
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
}
