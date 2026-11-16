// ============================================================
//  useGsapAnimations — every animation on the portfolio.
//  Install:  npm i gsap @gsap/react
//  Use once in App.jsx:  useGsapAnimations();
//
//  Targets your existing class names, so no JSX changes needed.
//  "Reduce motion" users get a static site; touch screens skip
//  the cursor + magnetic effects; the sideways project scroll is
//  desktop only (phones get a swipe carousel from CSS).
// ============================================================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ✏️ Words for the scrolling bands that replace the .section-divider lines
const MARQUEE_WORDS = ["Creative Developer", "React", "UI / UX", "WordPress", "Pixel Perfect", "Motion"];

const all = (sel) => gsap.utils.toArray(sel);
const one = (sel, root = document) => root.querySelector(sel);

// Reveal elements in staggered batches as they scroll into view
function batchReveal(selector, from, to = {}, start = "top 88%") {
  const els = all(selector);
  if (!els.length) return;
  gsap.set(els, { autoAlpha: 0, ...from });
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        overwrite: true,
        clearProps: "transform,opacity,visibility", // hand :hover back to CSS
        ...to,
      }),
  });
}

// Giant outlined title behind a section drifts as you scroll
function ghost(section) {
  if (!section) return;
  gsap.fromTo(
    section,
    { "--ghost-y": "90px" },
    {
      "--ghost-y": "-90px",
      ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

// ---------- HEADER ----------
function header(cleanups) {
  const h = one(".header");
  if (!h) return;
  gsap.from(h, { yPercent: -100, autoAlpha: 0, duration: 1.2, ease: "expo.out", delay: 0.9 });

  // hide when scrolling down, show when scrolling up
  let hidden = false;
  const st = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const shouldHide = self.direction === 1 && self.scroll() > 300;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(h, { yPercent: hidden ? -110 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      }
    },
  });
  cleanups.push(() => st.kill());
}

// ---------- HERO ----------
function hero() {
  const sec = one(".home-section");
  if (!sec) return;

  const frame = one(".home-img", sec);
  const photo = frame && one("img", frame);
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.3 } });
  const from = (sel, vars, pos) => {
    const t = sec.querySelectorAll(sel);
    if (t.length) tl.from(t, vars, pos);
  };

  // oxblood panel wipes in
  tl.fromTo(sec, { "--reveal": 0 }, { "--reveal": 1, duration: 1.6, ease: "expo.inOut" });

  if (frame) {
    gsap.set(frame, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    // arch "curtain" reveal from the bottom
    tl.fromTo(
      frame,
      { clipPath: "inset(100% -40px -40px -40px)" },
      { clipPath: "inset(-40px -40px -40px -40px)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" },
      "-=0.9",
    );
    if (photo) tl.from(photo, { scale: 1.45, duration: 2.2, clearProps: "transform" }, "<");
    gsap.to(frame, { y: -12, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 3 });
  }

  from(".typewriter", { y: 24, autoAlpha: 0 }, "-=1.2");

  const name = sec.querySelectorAll(".name");
  if (name.length) {
    tl.fromTo(
      name,
      { clipPath: "inset(-20% -5% 100% -5%)", y: 40 },
      { clipPath: "inset(-20% -5% -20% -5%)", y: 0, duration: 1.4, clearProps: "clipPath,transform" },
      "<0.1",
    );
  }

  from(".description", { y: 30, autoAlpha: 0 }, "<0.3");
  from(".buttons .btn", { y: 30, autoAlpha: 0, stagger: 0.12 }, "<0.15");
  from(
    ".social-icons a",
    { scale: 0, autoAlpha: 0, stagger: 0.08, ease: "back.out(2.2)", duration: 0.9, clearProps: "transform" },
    "<0.1",
  );

  // text floats away as you scroll past
  const right = one(".home-right", sec);
  if (right) {
    gsap.to(right, {
      yPercent: -14,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: sec, start: "top top", end: "bottom top", scrub: true },
    });
  }
}

// ---------- DIVIDER MARQUEES ----------
function marquees(cleanups) {
  const dividers = all(".section-divider");
  if (!dividers.length) return;

  const group = MARQUEE_WORDS.map(
    (w) => `<span class="marquee-item">${w}<span class="marquee-star">✦</span></span>`,
  ).join("");

  const tweens = dividers.map((d, i) => {
    d.classList.add("has-marquee");
    d.setAttribute("aria-hidden", "true");
    const inner = document.createElement("div");
    inner.className = "marquee-inner";
    inner.innerHTML = `<div class="marquee-group">${group}</div><div class="marquee-group">${group}</div>`;
    d.appendChild(inner);
    cleanups.push(() => {
      inner.remove();
      d.classList.remove("has-marquee");
      d.removeAttribute("aria-hidden");
    });

    const leftward = i % 2 === 0;
    const tw = gsap.fromTo(
      inner,
      { xPercent: leftward ? 0 : -50 },
      { xPercent: leftward ? -50 : 0, duration: 32, ease: "none", repeat: -1 },
    );
    tw.totalTime(tw.duration() * 100); // lets it run "backwards" on scroll-up
    return tw;
  });

  // speed up with scroll velocity, flip direction with scroll direction
  let dir = 1;
  let target = 1;
  let current = 1;
  const st = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      dir = self.direction;
      target = dir * (1 + Math.min(Math.abs(self.getVelocity()) / 250, 6));
    },
  });
  const tick = () => {
    current += (target - current) * 0.08;
    target += (dir - target) * 0.04;
    tweens.forEach((t) => t.timeScale(current));
  };
  gsap.ticker.add(tick);
  cleanups.push(() => {
    gsap.ticker.remove(tick);
    st.kill();
  });
}

// ---------- EXPERTISE ----------
function expertise() {
  const sec = one(".expertise-section");
  if (!sec) return;
  ghost(sec);
  batchReveal(".expertise-content > *", { y: 50 }, { stagger: 0.14 });

  const tiles = all(".skills-wrapper .skill");
  if (tiles.length) {
    gsap.set(tiles, { autoAlpha: 0, rotateY: -90, transformPerspective: 700 });
    ScrollTrigger.create({
      trigger: one(".skills-wrapper"),
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(tiles, {
          autoAlpha: 1,
          rotateY: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.05, from: "random" },
          clearProps: "transform,opacity,visibility",
        }),
    });
  }
}

// ---------- PROJECTS ----------
function projects(cleanups, isDesktop) {
  const sec = one(".projects-section");
  const cards = all(".projects-section .project-card");
  if (!sec || !cards.length) return;
  const track = one(".projects-track", sec);

  if (isDesktop && track) {
    sec.classList.add("is-horizontal");
    cleanups.push(() => sec.classList.remove("is-horizontal"));

    const last = cards[cards.length - 1];
    const getShift = () => {
      const x = gsap.getProperty(track, "x");
      const trackLeft = track.getBoundingClientRect().left - x;
      const lastRight = last.getBoundingClientRect().right - x;
      return Math.max(0, lastRight - (window.innerWidth - trackLeft));
    };

    if (getShift() > 0) {
      gsap.to(track, {
        x: () => -getShift(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => "+=" + getShift(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  ghost(sec);
  gsap.from(cards, {
    y: 120,
    autoAlpha: 0,
    duration: 1.4,
    ease: "expo.out",
    stagger: 0.1,
    clearProps: "transform,opacity,visibility",
    scrollTrigger: { trigger: sec, start: "top 70%", once: true },
  });
}

// ---------- EXPERIENCE ----------
function experience() {
  const sec = one(".experience-section");
  if (!sec) return;
  ghost(sec);

  all(".experience-section .timeline").forEach((t) => {
    gsap.fromTo(
      t,
      { "--progress": 0 },
      {
        "--progress": 1,
        ease: "none",
        scrollTrigger: { trigger: t, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      },
    );
  });

  all(".experience-section .timeline-item").forEach((item) => {
    const st = { trigger: item, start: "top 82%", once: true };
    const content = one(".timeline-content", item);
    const dot = one(".timeline-dot", item);
    if (content) {
      gsap.from(content, {
        y: 50,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: st,
      });
    }
    if (dot) {
      gsap.from(dot, { scale: 0, duration: 0.8, ease: "back.out(3)", delay: 0.2, scrollTrigger: { ...st } });
    }
  });

  const img = one(".experience-image", sec);
  if (img) {
    gsap.from(img, {
      y: 80,
      autoAlpha: 0,
      duration: 1.4,
      ease: "expo.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: img, start: "top 85%", once: true },
    });
  }
}

// ---------- CONTACT ----------
function contact() {
  const sec = one(".contact-section");
  if (!sec) return;
  ghost(sec);

  batchReveal(".contact-section .contact-form", { y: 70 }, { duration: 1.4 });
  batchReveal(".contact-section .form-group", { y: 30 }, { stagger: 0.1, delay: 0.25 });

  const btn = one(".btn-submit", sec);
  if (btn) {
    gsap.from(btn, {
      scale: 0,
      rotate: -120,
      duration: 1.2,
      ease: "back.out(1.8)",
      clearProps: "transform",
      scrollTrigger: { trigger: btn, start: "top 92%", once: true },
    });
  }

  const img = one(".contact-image img", sec);
  if (img) {
    gsap.from(img, {
      scale: 0.85,
      autoAlpha: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: img, start: "top 85%", once: true },
    });
    gsap.to(img, { y: -16, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true });
  }
}

// ---------- SCROLL PROGRESS BAR ----------
function progressBar(cleanups) {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  cleanups.push(() => bar.remove());
}

// ---------- CUSTOM CURSOR (mouse only) ----------
function cursor(cleanups) {
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  document.body.append(ring, dot);
  gsap.set([ring, dot], { autoAlpha: 0 });

  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 });
  const dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  let shown = false;

  const move = (e) => {
    if (!shown) {
      gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
      gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
      shown = true;
    }
    rx(e.clientX);
    ry(e.clientY);
    dx(e.clientX);
    dy(e.clientY);
  };
  const over = (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const interactive = t.closest("a, button, input, textarea, select, .nav-toggle, .close");
    ring.classList.toggle("is-hover", !!interactive);
    ring.classList.toggle("is-view", !interactive && !!t.closest(".project-card"));
  };
  const leave = () => {
    gsap.to([ring, dot], { autoAlpha: 0, duration: 0.3 });
    shown = false;
  };

  window.addEventListener("pointermove", move);
  document.addEventListener("pointerover", over);
  document.documentElement.addEventListener("pointerleave", leave);
  cleanups.push(() => {
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", over);
    document.documentElement.removeEventListener("pointerleave", leave);
    ring.remove();
    dot.remove();
  });
}

// ---------- MAGNETIC BUTTONS (mouse only) ----------
function magnetic(cleanups) {
  all(".home-section .btn, .social-icons a, .btn-submit, .nav-toggle").forEach((el) => {
    const strength = el.matches(".btn-submit") ? 0.45 : 0.3;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
}

// ============================================================
export default function useGsapAnimations() {
  useGSAP(() => {
    // Mark the row holding the project cards (needed for the CSS carousel too)
    const firstCard = one(".projects-section .project-card");
    const track = firstCard && (firstCard.closest(".row") || firstCard.parentElement?.parentElement);
    track?.classList.add("projects-track");

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        finePointer: "(hover: hover) and (pointer: fine)",
        isDesktop: "(min-width: 992px)",
      },
      (ctx) => {
        const { motion, finePointer, isDesktop } = ctx.conditions;
        if (!motion) return;

        const cleanups = [];
        // order matters: top-to-bottom so the pinned section measures correctly
        header(cleanups);
        hero();
        marquees(cleanups);
        expertise();
        projects(cleanups, isDesktop);
        experience();
        contact();
        progressBar(cleanups);

        if (finePointer) {
          cursor(cleanups);
          magnetic(cleanups);
        }

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        document.fonts?.ready.then(refresh);
        cleanups.push(() => window.removeEventListener("load", refresh));

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => {
      mm.revert();
      track?.classList.remove("projects-track");
    };
  }, []);
}
