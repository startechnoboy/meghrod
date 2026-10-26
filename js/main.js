const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const backdrop = document.getElementById("nav-backdrop");
const year = document.getElementById("year");
const form = document.getElementById("booking-form");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-image");
const lightboxVideo = lightbox.querySelector(".lightbox-video");

if (year) year.textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-lock", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (backdrop) {
    backdrop.hidden = !open;
    backdrop.classList.toggle("is-visible", open);
  }
}

toggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

backdrop?.addEventListener("click", () => setMenu(false));

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMenu(false);
});

const cards = [...document.querySelectorAll(".review-card")];
let reviewIndex = 0;

function showReview(next) {
  cards[reviewIndex].classList.remove("is-active");
  reviewIndex = (next + cards.length) % cards.length;
  cards[reviewIndex].classList.add("is-active");
}

document.querySelector("[data-next]")?.addEventListener("click", () => showReview(reviewIndex + 1));
document.querySelector("[data-prev]")?.addEventListener("click", () => showReview(reviewIndex - 1));

setInterval(() => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showReview(reviewIndex + 1);
  }
}, 7000);

document.querySelectorAll(".gallery-item").forEach((button) => {
  const previewVideo = button.querySelector("video");
  if (previewVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    previewVideo.muted = true;
    previewVideo.playsInline = true;
    previewVideo.play().catch(() => {});
  }

  button.addEventListener("click", () => {
    const videoSrc = button.dataset.video;
    if (videoSrc) {
      lightboxImg.classList.add("hidden");
      lightboxImg.removeAttribute("src");
      lightboxVideo.classList.remove("hidden");
      lightboxVideo.src = videoSrc;
      lightboxVideo.play().catch(() => {});
    } else {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.classList.add("hidden");
      lightboxImg.classList.remove("hidden");
      lightboxImg.src = button.dataset.full;
      lightboxImg.alt = button.querySelector("img")?.alt || "";
    }
    lightbox.classList.add("is-open");
    lightbox.classList.remove("hidden");
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
  lightboxVideo.classList.add("hidden");
  lightboxImg.classList.remove("hidden");
}

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const success = form.querySelector(".form-success");
  const error = form.querySelector(".form-error");
  const submitBtn = form.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    _subject: "Meghrod Homestay callback request",
    name: data.name,
    phone: data.phone,
    arrival: data.arrival,
    departure: data.departure,
    guests: data.guests,
  };

  success.classList.add("hidden");
  error.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    const response = await fetch("https://formsubmit.co/ajax/meghrod.homestay@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Request failed");
    success.classList.remove("hidden");
    form.reset();
  } catch {
    const body = [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Arrival: ${data.arrival}`,
      `Departure: ${data.departure}`,
      `Guests: ${data.guests}`,
    ].join("\n");
    window.location.href = `mailto:meghrod.homestay@gmail.com?subject=${encodeURIComponent(
      "Meghrod Homestay callback request"
    )}&body=${encodeURIComponent(body)}`;
    error.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Request a callback";
  }
});

document.querySelectorAll(".about-video").forEach((video) => {
  video.muted = true;
  video.playsInline = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
    return;
  }
  video.play().catch(() => {});
});

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}
