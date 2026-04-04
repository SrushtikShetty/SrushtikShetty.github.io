const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const scrollProgress = document.querySelector(".scroll-progress");
const backToTopButton = document.querySelector(".back-to-top");
const contactForm = document.querySelector(".contact-form");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");
    const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (!matchingLink) {
      return;
    }

    const isActive =
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight;

    matchingLink.classList.toggle("active", isActive);
  });
};

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
  backToTopButton.classList.toggle("visible", scrollTop > 500);
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px"
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

window.addEventListener("scroll", () => {
  setActiveLink();
  updateScrollProgress();
});

window.addEventListener("load", () => {
  setActiveLink();
  updateScrollProgress();

  document.querySelectorAll(".hero .reveal").forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("visible");
    }, 150 + index * 180);
  });
});

// This keeps the demo form polished without requiring a backend.
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  const originalText = submitButton.textContent;
  submitButton.textContent = "Message Saved";
  submitButton.disabled = true;

  setTimeout(() => {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    contactForm.reset();
  }, 1800);
});
