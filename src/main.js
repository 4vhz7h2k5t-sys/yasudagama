import { courses } from './content.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'メニューを閉じる' : 'メニューを開く');
});
menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(true); });
document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const selector = document.querySelector('.course-selector');
if (selector) {
  const panel = selector.querySelector('#course-panel');
  const tabs = [...selector.querySelectorAll('[role=tab]')];
  const detailed = selector.dataset.detailed === 'true';
  function selectCourse(id, focus = false, updateUrl = true) {
    const c = courses.find(c => c.id === id);
    if (!c) return;
    tabs.forEach(tab => {
      const active = tab.dataset.course === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    const image = panel.querySelector('img');
    image.src = c.image;
    image.alt = c.alt;
    panel.querySelector('.course-image-number').textContent = c.number;
    panel.querySelector('.small-tag').textContent = c.tag;
    panel.querySelector('h3').innerHTML = `${c.name}<span>体験</span>`;
    panel.querySelector('.course-catch').textContent = c.catch;
    panel.querySelector('.course-copy > p:not([class])').textContent = c.description;
    panel.querySelector('.course-price strong').innerHTML = `${c.price}<small>円〜</small>`;
    [c.time, c.age, c.people].forEach((value, i) => panel.querySelectorAll('dd')[i].textContent = value);
    if (detailed) {
      panel.querySelector('.included').innerHTML = `<b>料金に含まれるもの</b>${c.includes}`;
      panel.querySelector('.muted').textContent = c.note;
      panel.querySelectorAll('.mini-steps li').forEach((li, i) => { li.textContent = c.steps[i]; });
      panel.querySelector('.button').href = c.plan;
      let wheelLink = panel.querySelector('.wheel-pizza-link');
      if (id === 'pizza' && !wheelLink) {
        wheelLink = document.createElement('a');
        wheelLink.className = 'text-link wheel-pizza-link';
        wheelLink.href = c.wheelPlan;
        wheelLink.target = '_blank';
        wheelLink.rel = 'noopener noreferrer';
        wheelLink.innerHTML = '電動ろくろ＋ピザ焼きのプランを見る <span aria-hidden="true">↗</span><span class="sr-only">（外部サイト・新しいタブで開きます）</span>';
        panel.querySelector('.course-copy').append(wheelLink);
      } else if (id !== 'pizza') wheelLink?.remove();
    } else panel.querySelector('.course-detail').href = `/courses/?course=${id}#course-selector`;
    if (!reducedMotion.matches) {
      panel.querySelectorAll('.course-visual img, .course-copy').forEach(el => el.animate([{opacity: .55, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 240, easing: 'ease-out'}));
    }
    if (detailed && updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('course', id);
      history.replaceState(null, '', url);
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCourse(tab.dataset.course));
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { e.preventDefault(); selectCourse(tabs[target].dataset.course, true); }
    });
  });
  const initial = new URLSearchParams(location.search).get('course');
  if (initial) selectCourse(initial, false, false);
  // Warm the two tiny images after the main image has loaded, without competing with the hero.
  addEventListener('load', () => {
    const preload = () => courses.slice(1).forEach(c => { const img = new Image(); img.src = c.image; });
    if ('requestIdleCallback' in window) requestIdleCallback(preload, {timeout: 2500});
    else setTimeout(preload, 1500);
  }, {once: true});
}

document.querySelector('#load-map')?.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent('陶芸の里 保田窯 広島県東広島市黒瀬町小多田558') + '&output=embed&hl=ja';
  frame.title = '陶芸の里 保田窯の所在地（Google マップ）';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.allowFullscreen = true;
  document.querySelector('.map-placeholder').replaceWith(frame);
  frame.focus();
});

const range = document.querySelector('#clay-progress');
if (range) {
  const scene = document.querySelector('.clay-scene');
  const body = document.querySelector('#vessel-body');
  const mask = document.querySelector('#vessel-mask');
  const rim = document.querySelector('#vessel-rim');
  const colors = [...document.querySelectorAll('#body-shade stop')];
  const inside = [...document.querySelectorAll('#inside-shade stop')];
  const stages = [
    ['土にふれる', 'ひんやり、やわらか。土と出会う。', 'はじまりは、ひとかたまりの土。手のひらで感触を確かめながら、つくりたい器を思い描きます。', '土'],
    ['かたちにする', '指先から、かたちが生まれる。', '手で重ねたり、ろくろで引き上げたり。土をゆっくり整えて、思い思いの器のかたちにしていきます。', '形'],
    ['窯で焼く', '火の力で、土から陶器へ。', '乾燥・素焼きのあと、釉薬をかけて本焼きへ。窯の熱と時間が、やわらかな土を丈夫な器へと変えていきます。', '火'],
    ['暮らしの器へ', '「できた！」が、暮らしの中へ。', '焼き上がりの色や手ざわりも、一つひとつ。届いた器を使うたび、土に触れたあの日を思い出せそうです。', '器'],
  ];
  const palettes = {
    sand: ['#8b7f69', '#c0b49b', '#ddd3bd', '#c3b49b', '#796c57'],
    green: ['#273e32', '#557257', '#82967a', '#5d785b', '#25382e'],
    blue: ['#253d4e', '#476b7e', '#88a4af', '#4e7689', '#233e51'],
  };
  const clayColors = ['#6a4c3c', '#ab8060', '#c4a080', '#9b7255', '#503a2e'];
  let value = 0, frame = 0, currentStage = -1, glaze = 'sand';
  const mix = (a,b,t) => a + (b-a)*t;
  function colorMix(a, b, t) {
    const channels = [1,3,5].map(i => Math.round(mix(parseInt(a.slice(i,i+2),16), parseInt(b.slice(i,i+2),16), t)));
    return `rgb(${channels.join(',')})`;
  }
  function draw(v) {
    value = v;
    const shape = Math.min(1, v / 40), finish = Math.max(0, (v - 67) / 33);
    document.querySelector('#clay-mound').setAttribute('opacity', Math.max(0,1-v/18));
    document.querySelector('#vessel').setAttribute('opacity', Math.min(1,v/18));
    const top = mix(280, 209, shape), bottom = mix(355, 345, shape), rt = mix(110, 141, shape), rb = mix(85, 81, shape), height = bottom - top;
    const path = `M${250-rt} ${top}C${250-rt} ${top+height*.53} ${250-rb*1.45} ${bottom} ${250-rb} ${bottom}Q250 ${bottom+18} ${250+rb} ${bottom}C${250+rb*1.45} ${bottom} ${250+rt} ${top+height*.53} ${250+rt} ${top}Z`;
    body.setAttribute('d',path); mask.setAttribute('d',path);
    rim.setAttribute('cy',top); rim.setAttribute('rx',rt); rim.setAttribute('ry', mix(15,35,shape));
    rim.setAttribute('stroke', colorMix('#c5a17e', palettes[glaze][2], finish));
    colors.forEach((stop,i) => stop.setAttribute('stop-color',colorMix(clayColors[i],palettes[glaze][i],finish)));
    inside.forEach((stop,i) => stop.setAttribute('stop-color',colorMix(['#5f4334','#8f6c52','#b18b6b'][i],palettes[glaze][[0,1,2][i]],finish)));
    document.querySelector('#glaze-shine').setAttribute('opacity',finish*.3);
    const heat = Math.max(0, 1 - Math.abs(v - 65)/15);
    document.querySelector('#fire-glow').setAttribute('opacity',heat);
    document.querySelector('.heat-lines').setAttribute('opacity',heat*.7);
    document.querySelector('#vessel-lines').setAttribute('stroke-opacity',mix(.17,.07,finish));
    const stage = Math.min(3, Math.floor((v+3)/33.333));
    if (stage !== currentStage) {
      currentStage = stage;
      document.querySelector('#stage-title').textContent = stages[stage][1];
      document.querySelector('#stage-description').textContent = stages[stage][2];
      document.querySelector('.scene-stage').textContent = `0${stage+1} / 04`;
      document.querySelector('.scene-mark').textContent = stages[stage][3];
      scene.dataset.stage = stage;
      range.setAttribute('aria-valuetext',stages[stage][0]);
      document.querySelectorAll('.stage-buttons button').forEach((b,i) => b.setAttribute('aria-pressed',String(i===stage)));
      document.querySelector('.glaze-options').hidden = stage !== 3;
    }
  }
  range.addEventListener('input', () => { cancelAnimationFrame(frame); draw(Number(range.value)); });
  document.querySelectorAll('.stage-buttons button').forEach(button => button.addEventListener('click', () => {
    cancelAnimationFrame(frame);
    const target = [0, 36, 65, 100][Number(button.dataset.stage)], from = value, start = performance.now();
    range.value = target;
    if (reducedMotion.matches) return draw(target);
    function animate(now) {
      const t = Math.min(1,(now-start)/650), eased = 1 - Math.pow(1-t,3);
      draw(mix(from,target,eased));
      if (t<1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  }));
  document.querySelectorAll('[data-glaze]').forEach(button => button.addEventListener('click', () => {
    glaze = button.dataset.glaze;
    document.querySelectorAll('[data-glaze]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
    draw(value);
  }));
  // Static at rest. Rendering runs only while a visitor moves a control.
  draw(0);
}

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{opacity: .35, transform: 'translateY(18px)'},{opacity: 1, transform: 'translateY(0)'}],{duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)'});
      observer.unobserve(entry.target);
    });
  }, {threshold: .1});
  document.querySelectorAll('.section-head, .about-copy, .visit-steps li').forEach(el => observer.observe(el));
}
