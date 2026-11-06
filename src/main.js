import { courses } from './content.js';

const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.hidden = false;

function setMenu(open) {
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});
matchMedia('(min-width: 821px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

const mapButton = document.querySelector('#load-map');
if (mapButton) {
  mapButton.hidden = false;
  mapButton.addEventListener('click', () => {
    const map = document.createElement('iframe');
    const address = encodeURIComponent('陶芸の里 保田窯 広島県東広島市黒瀬町小多田558');
    map.src = `https://www.google.com/maps?q=${address}&output=embed&hl=ja`;
    map.title = '陶芸の里 保田窯の所在地（Google マップ）';
    mapButton.closest('.access-map').append(map);
    mapButton.hidden = true;
    map.focus();
  });
}

// Existing bookmarks from the tabbed course page lead to the new, static details.
if (document.body.dataset.page === 'courses' && (!location.hash || location.hash === '#course-selector')) {
  const id = new URLSearchParams(location.search).get('course');
  if (courses.some(course => course.id === id)) {
    const anchor = '#detail-' + id;
    history.replaceState(null, '', location.pathname + location.search + anchor);
    requestAnimationFrame(() => document.querySelector(anchor).scrollIntoView({behavior:'instant'}));
  }
}

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionElements = [...document.querySelectorAll('[data-scroll]')];

if (motionElements.length && 'IntersectionObserver' in window) {
  const active = new Set();
  let frame = 0;

  function renderMotion() {
    frame = 0;
    const viewport = innerHeight;
    // Read all positions before writing style values to avoid alternating layout and paint work.
    const updates = [...active].map(element => {
      const {top, height} = element.getBoundingClientRect();
      const kind = element.dataset.scroll;
      const raw = kind === 'hero'
        ? (100 - top) / Math.max(height * .77, 1)
        : (viewport * .93 - top) / (viewport * .59);
      const progress = Math.min(1, Math.max(0, raw));
      return [element, progress];
    });
    for (const [element, progress] of updates) {
      element.style.setProperty('--motion', progress.toFixed(3));
    }
  }

  function requestMotion() {
    if (!frame && active.size && !motionPreference.matches && !document.hidden) {
      frame = requestAnimationFrame(renderMotion);
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) active.add(entry.target);
      else active.delete(entry.target);
    }
    requestMotion();
  }, {rootMargin:'100px 0px'});

  function updateMotionPreference() {
    document.documentElement.classList.toggle('motion', !motionPreference.matches);
    if (motionPreference.matches) {
      observer.disconnect();
      active.clear();
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      motionElements.forEach(element => observer.observe(element));
    }
  }

  addEventListener('scroll', requestMotion, {passive:true});
  addEventListener('resize', requestMotion, {passive:true});
  document.addEventListener('visibilitychange', requestMotion);
  motionPreference.addEventListener('change', updateMotionPreference);
  updateMotionPreference();
}
