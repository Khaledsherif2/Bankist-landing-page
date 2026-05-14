'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnsOpenModal = document.querySelectorAll('.btn-show-modal');

const btnScrollTo = document.getElementsByClassName('btn-scroll-to')[0];
const section1 = document.getElementById('section-1');

const navLinks = document.querySelector('.nav-links');

const tabsContainer = document.querySelector('.operations-tab-container');
const tabs = document.querySelectorAll('.operations-tab');
const tabsContent = document.querySelectorAll('.operations-content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider-btn-left');
const btnRight = document.querySelector('.slider-btn-right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

const handleHover = function (e) {
  if (e.target.classList.contains('nav-link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav-link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sb => {
      if (sb !== link) sb.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

const releaveSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section-hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(releaveSection, {
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section-hidden');
});

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', _ =>
    entry.target.classList.remove('lazy-img'),
  );
  observer.unobserve(entry.target);
};
const imgOberver = new IntersectionObserver(loadImg, {
  threshold: 0.15,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgOberver.observe(img));

let curSlide = 0;
let maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
goToSlide(0);

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class='dots-dot' data-slide='${i}'></button>`,
    );
  });
};
createDots();

const activeDot = function (slide) {
  document
    .querySelectorAll('.dots-dot')
    .forEach(dot => dot.classList.remove('dots-dot-active'));
  document
    .querySelector(`.dots-dot[data-slide='${slide}']`)
    .classList.add('dots-dot-active');
};
activeDot(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
};

// Event Listeners
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav-link')) {
    const id = e.target.getAttribute('href');
    id !== '#' &&
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations-tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations-tab-active'));
  tabsContent.forEach(t => t.classList.remove('operations-content-active'));
  clicked.classList.add('operations-tab-active');
  document
    .querySelector(`.operations-content-${clicked.dataset.tab}`)
    .classList.add('operations-content-active');
});

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots-dot')) {
    curSlide = Number(e.target.dataset.slide);
    goToSlide(curSlide);
    activeDot(curSlide);
  }
});
