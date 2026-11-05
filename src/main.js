import { courses } from './content.js';

const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');

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

const view = document.querySelector('[data-studio]');
if (view) mountStudio(view);

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

function mountStudio(view) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isCourse = view.dataset.studio === 'course';
  const canvas = view.querySelector('canvas');
  const poster = view.querySelector('.studio-poster');
  const label = view.querySelector('[data-view-label]');
  const guide = view.querySelector('[data-view-guide]');
  const section = view.closest('section');
  const status = section.querySelector('[data-studio-status]');
  const stageButtons = [...section.querySelectorAll('[data-stage]')];
  const glazeButtons = [...section.querySelectorAll('[data-glaze]')];
  const orbitButtons = [...section.querySelectorAll('[data-orbit]')];
  const tilt = section.querySelector('[data-tilt]');
  const range = section.querySelector('#form-amount');
  const formTool = section.querySelector('.form-tool');
  const glazeTools = section.querySelector('.glaze-tools');
  const tabs = [...section.querySelectorAll('[data-course]')];
  const panels = [...section.querySelectorAll('[data-course-panel]')];

  const stages = {
    clay: ['01　土に触れる', '土を左右になぞるか、下のスライダーを動かしてみましょう。'],
    throw: ['02　ろくろで成形', '左右になぞると、ろくろが回り、土が器に立ち上がります。'],
    fire: ['03　窯で焼く', '窯の熱で土の色が変わります。「器を眺める」で釉薬の仕上がりへ。'],
    gallery: ['04　焼き上がり', '釉薬を選び、器の縁や内側に映る光を眺めてみましょう。'],
  };
  const exhibits = {
    hand: {profile:'cup', finish:'rice', image:'/images/studio-cup.webp', alt:'手びねりの形を表現した湯呑みのCG'},
    wheel: {profile:'bowl', finish:'ash', image:'/images/studio-bowl.webp', alt:'ろくろで成形する茶碗のCG'},
    pizza: {profile:'plate', finish:'iron', image:'/images/studio-plate.webp', alt:'食卓に使う皿を表現したCG'},
  };

  let studio = null;
  let stage = 'gallery';
  let glaze = 'ash';
  let amount = 0;
  let activeCourse = 'hand';
  let topView = false;
  let drag = null;

  function syncOrbit() {
    const enabled = !!studio && (isCourse || stage === 'gallery');
    tilt.closest('.orbit-tools').hidden = !!studio && !isCourse && stage !== 'gallery';
    for (const button of orbitButtons) button.disabled = !enabled;
    tilt.disabled = !enabled;
    canvas.tabIndex = studio ? 0 : -1;
  }

  function syncStage({immediate = false} = {}) {
    if (!studio) return;
    const forming = stage === 'throw';
    const shaping = stage === 'clay' || forming;
    const firing = stage === 'fire';
    view.dataset.state = stage;
    label.textContent = stages[stage][0];
    status.textContent = stages[stage][1];
    guide.textContent = shaping ? '左右になぞると成形' : firing ? '焼成中の土の表情' : '左右にドラッグして回す';
    for (const button of stageButtons) button.setAttribute('aria-pressed', String(button.dataset.stage === stage));
    formTool.hidden = !shaping;
    glazeTools.hidden = stage !== 'gallery';
    range.value = Math.round(amount * 100);
    syncOrbit();
    studio.update({
      amount: shaping ? amount : 1,
      finish: shaping ? 'clay' : firing ? 'fired' : glaze,
      forming, firing, immediate,
    });
  }

  function switchStage(next) {
    if (!studio) return;
    stage = next;
    if (next === 'clay') amount = 0;
    if (next === 'throw' && amount === 0) amount = .43;
    topView = false;
    tilt.setAttribute('aria-pressed','false');
    tilt.textContent = '上から';
    tilt.setAttribute('aria-label','器の内側を見る');
    studio.tilt(false);
    syncStage();
  }

  function shapeTo(value) {
    if (!studio) return;
    const isFirstTouch = stage === 'clay' && value > 0;
    amount = Math.max(0, Math.min(1, value));
    if (isFirstTouch) {
      stage = 'throw';
      syncStage();
      return;
    }
    range.value = Math.round(amount * 100);
    studio.update({amount, finish:'clay', forming:true});
  }

  function selectCourse(id, updateURL = true) {
    const course = courses.find(item => item.id === id);
    if (!course) return;
    activeCourse = id;
    const exhibit = exhibits[id];
    for (const tab of tabs) {
      const selected = tab.dataset.course === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.coursePanel !== id;
    label.textContent = course.name;
    view.dataset.state = id;
    poster.src = exhibit.image;
    poster.alt = exhibit.alt;
    if (studio) {
      studio.update({...exhibit, forming:id === 'wheel', firing:id === 'pizza'});
      studio.orbit(id === 'hand' ? -.28 : .32);
    }
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('course',id);
      history.replaceState(null,'',url);
    }
  }

  if (isCourse) {
    section.querySelector('.course-rail').setAttribute('role','tablist');
    tabs.forEach((tab, index) => {
      tab.id = 'tab-' + tab.dataset.course;
      tab.setAttribute('role','tab');
      tab.setAttribute('aria-controls','detail-' + tab.dataset.course);
      tab.addEventListener('click', event => {
        event.preventDefault();
        selectCourse(tab.dataset.course);
      });
      tab.addEventListener('keydown', event => {
        const keys = {ArrowLeft:(index+2)%3,ArrowRight:(index+1)%3,Home:0,End:2};
        if (!(event.key in keys)) return;
        event.preventDefault();
        const next = tabs[keys[event.key]];
        selectCourse(next.dataset.course);
        next.focus();
      });
    });
    for (const panel of panels) {
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby','tab-' + panel.dataset.coursePanel);
      panel.tabIndex = 0;
    }
    const query = new URLSearchParams(location.search).get('course');
    const hashCourse = location.hash.replace('#detail-', '');
    const chosen = courses.find(c => c.id === query) ?? courses.find(c => c.id === hashCourse);
    selectCourse(chosen?.id ?? 'hand',false);
  }

  function fallback() {
    studio = null;
    canvas.hidden = true;
    poster.hidden = false;
    view.dataset.render = 'static';
    view.dataset.state = isCourse ? activeCourse : 'gallery';
    if (!isCourse) {
      label.textContent = stages.gallery[0];
      status.textContent = 'この環境では器を静止画で展示しています。';
      formTool.hidden = true;
      glazeTools.hidden = false;
    }
    guide.textContent = '静止画で展示中';
    for (const button of [...stageButtons,...glazeButtons]) button.disabled = true;
    syncOrbit();
  }

  async function enable3D() {
    try {
      const {createStudio} = await import('./ceramics.js');
      studio = createStudio(canvas, {course:isCourse, reducedMotion, onLost:fallback});
      canvas.hidden = false;
      poster.hidden = true;
      view.dataset.render = '3d';
      for (const button of [...stageButtons,...glazeButtons]) button.disabled = false;
      syncOrbit();
      if (isCourse) {
        studio.update({...exhibits[activeCourse], immediate:true});
        guide.textContent = '左右にドラッグして回す';
      } else syncStage({immediate:true});
    } catch {
      fallback();
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if ('requestIdleCallback' in window) requestIdleCallback(enable3D,{timeout:900});
      else setTimeout(enable3D,0);
    }, {rootMargin:'140px'});
    observer.observe(view);
  } else enable3D();

  for (const button of stageButtons) button.addEventListener('click', () => switchStage(button.dataset.stage));
  section.querySelector('[data-start-studio]')?.addEventListener('click', () => {
    if (studio) switchStage('clay');
    else stage = 'clay';
  });
  for (const button of glazeButtons) button.addEventListener('click', () => {
    glaze = button.dataset.glaze;
    for (const option of glazeButtons) option.setAttribute('aria-pressed',String(option === button));
    if (studio) studio.update({finish:glaze, immediate:true});
    status.textContent = button.getAttribute('aria-label') + 'の釉薬。器を回すと、光の映り込みが変わります。';
  });
  for (const button of orbitButtons) button.addEventListener('click', () => studio?.orbit(Number(button.dataset.orbit) * .53));
  tilt.addEventListener('click', () => {
    topView = !topView;
    tilt.setAttribute('aria-pressed', String(topView));
    tilt.textContent = topView ? '斜めから' : '上から';
    tilt.setAttribute('aria-label',topView ? '器を斜めから見る' : '器の内側を見る');
    studio?.tilt(topView);
  });
  range?.addEventListener('input', () => shapeTo(Number(range.value) / 100));

  canvas.addEventListener('pointerdown', event => {
    if (!studio || !event.isPrimary || event.button !== 0) return;
    drag = {x:event.clientX, total:0};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || !studio || !event.isPrimary) return;
    const delta = event.clientX - drag.x;
    drag.x = event.clientX;
    drag.total += Math.abs(delta);
    if (isCourse || stage === 'gallery') studio.orbit(-delta * .012);
    else if (stage !== 'fire' && drag.total > 3) shapeTo(amount + Math.abs(delta) / 290);
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && drag.total < 4 && !isCourse && (stage === 'clay' || stage === 'throw')) shapeTo(amount + .15);
    drag = null;
  });
  canvas.addEventListener('pointercancel', () => { drag = null; });
  canvas.addEventListener('keydown', event => {
    if (!studio || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    if (isCourse || stage === 'gallery') studio.orbit(direction * .32);
    else if (stage !== 'fire') shapeTo(amount + direction * .1);
  });
}
