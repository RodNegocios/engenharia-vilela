import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import business from "../site.config.js";

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let lenis;
const media = gsap.matchMedia();

// The document remains usable before JavaScript or when motion is disabled.
const updateHeader = () => {
  $(".header").classList.toggle("is-scrolled", window.scrollY > 50);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  $(".reading-progress").style.transform =
    `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
};
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Smooth wheel scrolling only on desktop. Touch, keyboard and reduced motion stay native.
media.add(
  "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
  () => {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    if (document.querySelector("dialog[open]")) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = undefined;
    };
  },
);

// Architectural depth: the same image aligns exactly in the background and roof mask.
// Every transform is relative to that shared plane; no generated or altered portrait.
media.add(
  {
    desktop: "(min-width: 761px)",
    mobile: "(max-width: 760px)",
    motion: "(prefers-reduced-motion: no-preference)",
  },
  (context) => {
    if (!context.conditions.motion) return;
    const mobile = context.conditions.mobile;
    const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
    entrance
      .from(".hero-word", { yPercent: 65, duration: 1.65 }, 0.05)
      .from(
        ".hero-kicker, .hero h1, .hero-action",
        { y: 26, autoAlpha: 0, stagger: 0.14, duration: 1 },
        0.3,
      );

    const camera = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: () => `+=${window.innerHeight * (mobile ? 1.02 : 1.5)}`,
        scrub: mobile ? 0.5 : 0.85,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    camera
      .to(
        ".hero-intro, .hero-bottom",
        { autoAlpha: 0, y: -25, duration: 0.18 },
        0,
      )
      .to(
        ".hero-world",
        { scale: mobile ? 2.8 : 3.7, duration: 1, ease: "power2.inOut" },
        0,
      )
      .to(
        ".hero-word",
        { yPercent: -10, scale: 1.1, duration: 1, ease: "power1.inOut" },
        0,
      )
      .to(".hero-gradient", { autoAlpha: 0, duration: 0.3 }, 0.2)
      .to(
        ".hero-veil",
        { opacity: 1, duration: 0.38, ease: "power1.inOut" },
        0.52,
      )
      .fromTo(
        ".hero-bridge",
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.35 },
        0.72,
      );

    // Editorial line reveals: 3D rotation, clip and stagger, inspired by React Bits ScrollFloat.
    $$("[data-line-reveal]").forEach((heading) => {
      const original = heading.innerHTML;
      const lines = original.split(/<br\s*\/?\s*>/i);
      heading.innerHTML = lines
        .map(
          (line) =>
            `<span class="reveal-line"><span class="reveal-inner">${line}</span></span>`,
        )
        .join("");
      gsap.from($$(".reveal-inner", heading), {
        yPercent: 108,
        rotationX: -35,
        transformPerspective: 700,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 89%", once: true },
      });
      // Restore original markup when the user changes the motion preference.
      heading._originalHTML = original;
    });
    gsap.fromTo(
      ".portrait-composition > img",
      { y: 45 },
      {
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".portrait-composition",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
    gsap.fromTo(
      ".portrait-blueprint",
      { y: -30, rotation: -4 },
      {
        y: 35,
        rotation: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".portrait-composition",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      },
    );
    gsap.fromTo(
      ".technical-stage img",
      { y: 35 },
      {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".technical-stage",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      },
    );
    $$(".plan-line, .plan-detail").forEach((path) => {
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".technical-stage",
            start: "top 85%",
            end: "center 40%",
            scrub: 1,
          },
        },
      );
    });
    gsap.fromTo(
      ".finance-lines",
      { rotation: -24, xPercent: 12 },
      {
        rotation: -8,
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".finance",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
    return () => {
      $$("[data-line-reveal]").forEach((heading) => {
        if (heading._originalHTML) heading.innerHTML = heading._originalHTML;
      });
    };
  },
);

// Local spotlight, adapted from React Bits' pointer-following CSS-variable pattern.
// Runs only while a fine pointer moves; no continuous render loop or WebGL.
const spotlight = $("[data-spotlight]");
spotlight.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const rect = spotlight.getBoundingClientRect();
  spotlight.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  spotlight.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
});

// Native dialogs supply focus trapping and Escape handling; restore the invoker explicitly.
const dialogInvokers = new WeakMap();
function openDialog(dialog, invoker) {
  dialogInvokers.set(dialog, invoker || document.activeElement);
  dialog.showModal();
  document.body.classList.add("modal-open");
  lenis?.stop();
}
function closeDialog(dialog) {
  dialog.close();
}
$$("dialog").forEach((dialog) => {
  $(".dialog-close, .menu-close", dialog)?.addEventListener("click", () =>
    closeDialog(dialog),
  );
  dialog.addEventListener("click", (event) => {
    const r = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom)
    )
      closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    lenis?.start();
    if (dialog.id === "mobile-menu")
      $(".menu-toggle").setAttribute("aria-expanded", "false");
    dialogInvokers.get(dialog)?.focus({ preventScroll: true });
  });
});
const mobileMenu = $("#mobile-menu");
$(".menu-toggle").addEventListener("click", (event) => {
  $(".menu-toggle").setAttribute("aria-expanded", "true");
  openDialog(mobileMenu, event.currentTarget);
});
window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => {
  if (e.matches && mobileMenu.open) closeDialog(mobileMenu);
});
$(".privacy-trigger").addEventListener("click", (event) =>
  openDialog($("#privacy-dialog"), event.currentTarget),
);
$$("[data-enquiry]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openDialog($("#project-dialog"), link);
  }),
);

// In-page links remain real URLs and are keyboard friendly, even with pinned content.
$$('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = $(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    if (mobileMenu.open) {
      dialogInvokers.set(mobileMenu, target);
      closeDialog(mobileMenu);
    }
    const offset = $(".header").offsetHeight + 20;
    if (lenis) lenis.scrollTo(target, { offset: -offset, duration: 1.2 });
    else
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    history.replaceState(null, "", link.getAttribute("href"));
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }),
);

// Accordion: one open section; hidden panels are removed from keyboard navigation.
$$(".service-trigger").forEach((button, index) =>
  button.addEventListener("click", () => {
    const wasOpen = button.getAttribute("aria-expanded") === "true";
    $$(".service-trigger").forEach((other) => {
      const panel = document.getElementById(
        other.getAttribute("aria-controls"),
      );
      const opening = other === button && !wasOpen;
      other.setAttribute("aria-expanded", String(opening));
      other.closest(".service-item").classList.toggle("is-active", opening);
      gsap.killTweensOf(panel);
      if (opening) {
        panel.hidden = false;
        if (!reducedMotion.matches)
          gsap.fromTo(
            panel,
            { height: 0 },
            {
              height: "auto",
              duration: 0.45,
              ease: "power2.inOut",
              onComplete: () => ScrollTrigger.refresh(),
            },
          );
        else panel.style.height = "auto";
      } else {
        panel.hidden = true;
        panel.style.height = "";
      }
    });
    if (!wasOpen)
      $(".stage-index").textContent = String(index + 1).padStart(2, "0");
    if (!reducedMotion.matches)
      gsap.to(".floorplan", {
        rotation: -12 + index * 7,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
    ScrollTrigger.refresh();
  }),
);

// Native horizontal gallery: keyboard, touch, buttons and fine-pointer dragging.
const gallery = $(".gallery");
const cards = $$(".project-card");
let galleryIndex = 0;
function positions() {
  return cards.map((card) => card.offsetLeft - cards[0].offsetLeft);
}
function updateGallery() {
  const max = gallery.scrollWidth - gallery.clientWidth;
  const current = gallery.scrollLeft;
  galleryIndex =
    current >= max - 3
      ? cards.length - 1
      : positions().reduce(
          (closest, x, i, all) =>
            Math.abs(x - current) < Math.abs(all[closest] - current)
              ? i
              : closest,
          0,
        );
  $(".gallery-count").innerHTML =
    `${String(galleryIndex + 1).padStart(2, "0")} <span>/ 04</span>`;
  $(".gallery-prev").disabled = current <= 3;
  $(".gallery-next").disabled = current >= max - 3;
}
function goToCard(index) {
  const i = Math.max(0, Math.min(cards.length - 1, index));
  gallery.scrollTo({
    left: positions()[i],
    behavior: reducedMotion.matches ? "instant" : "smooth",
  });
}
$(".gallery-prev").addEventListener("click", () => goToCard(galleryIndex - 1));
$(".gallery-next").addEventListener("click", () => goToCard(galleryIndex + 1));
gallery.addEventListener("scroll", updateGallery, { passive: true });
gallery.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    goToCard(galleryIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
let drag;
let suppressClick = false;
gallery.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  drag = { x: event.clientX, scroll: gallery.scrollLeft, active: false };
  suppressClick = false;
});
window.addEventListener("pointermove", (event) => {
  if (!drag) return;
  const difference = event.clientX - drag.x;
  if (Math.abs(difference) > 5) {
    drag.active = true;
    gallery.classList.add("is-dragging");
  }
  if (drag.active) {
    gallery.scrollLeft = drag.scroll - difference;
    suppressClick = true;
  }
});
const endDrag = () => {
  if (drag?.active) {
    gallery.classList.remove("is-dragging");
  }
  drag = undefined;
};
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);
window.addEventListener("blur", endDrag);
gallery.addEventListener("dragstart", (event) => event.preventDefault());
$$("[data-gallery]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    const dialog = $("#image-dialog");
    const source = $("img", link);
    $("img", dialog).src = link.href;
    $("img", dialog).alt = source.alt;
    $("#lightbox-caption").textContent = link.dataset.gallery;
    openDialog(dialog, link);
  }),
);
new ResizeObserver(updateGallery).observe(gallery);
updateGallery();

// No backend, tracking, storage or network submission. Only a user-confirmed WhatsApp draft.
const form = $("#enquiry-form");
form.addEventListener("input", (event) => event.target.setCustomValidity?.(""));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#client-name");
  const message = $("#project-message");
  const clean = (value) => value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  const client = clean(name.value);
  const plans = clean(message.value);
  if (client.length < 2)
    name.setCustomValidity("Informe pelo menos duas letras para seu nome.");
  if (plans.length < 10)
    message.setCustomValidity(
      "Conte um pouco mais sobre sua ideia (ao menos 10 caracteres).",
    );
  if (!form.reportValidity()) return;
  const type = $("#project-type").value;
  const allowedTypes = [...$("#project-type").options]
    .map((option) => option.value)
    .filter(Boolean);
  if (!allowedTypes.includes(type)) return;
  const text = `Olá, Vilela Engenharia! Meu nome é ${client}.\nTenho interesse em: ${type}.\n\n${plans}`;
  const url = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
  const fallback = $(".form-fallback");
  fallback.href = url;
  fallback.hidden = false;
  $("#form-status").textContent =
    "Sua mensagem está pronta. Se o WhatsApp não abrir, use o link abaixo.";
  window.open(url, "_blank", "noopener,noreferrer");
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.id !== "inicio")
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant", block: "start" }),
      );
  }
});
