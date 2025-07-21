function scroll(target) {
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth" });
}

function activateAccordionButton(target) {
  if (!target) return;
  const btn = target.classList.contains("accordion-button")
    ? target
    : target.querySelector(".accordion-button");
  if (btn && btn.classList.contains("collapsed")) {
    btn.click();
  }
}

function navigate(page, elementId = null) {
  const currentPath = window.location.pathname;

  if (currentPath !== page) {
    window.location.href = elementId ? `${page}#${elementId}` : page;
  } else if (elementId) {
    const target = document.getElementById(elementId);
    scroll(target);
    activateAccordionButton(target);
  }
}

function scrollToHash() {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      scroll(target);
      activateAccordionButton(target);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  scrollToHash();

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.page, el.dataset.elementId || null);
    });
  });

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }
});
