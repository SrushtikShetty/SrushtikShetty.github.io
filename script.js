const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const revealElements = document.querySelectorAll('.reveal');
const scrollProgress = document.querySelector('.scroll-progress');
const backToTopButton = document.querySelector('.back-to-top');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    const targetSection = document.querySelector(targetId);
    if (!targetSection) {
      return;
    }

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (!matchingLink) {
      return;
    }

    const isActive =
      scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight;

    matchingLink.classList.toggle('active', isActive);
  });
};

const updateScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;

  if (backToTopButton) {
    backToTopButton.classList.toggle('visible', window.scrollY > 500);
  }
};

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', () => {
  setActiveLink();
  updateScrollProgress();
});

window.addEventListener('load', () => {
  setActiveLink();
  updateScrollProgress();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
});
