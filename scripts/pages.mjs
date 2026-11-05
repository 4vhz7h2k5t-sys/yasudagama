import { mkdir, writeFile } from 'node:fs/promises';
import { courses, faqs, jalan, asoview, mapUrl, verifiedDate } from '../src/content.js';

const arrow = '<span aria-hidden="true">↗</span>';
const right = '<span aria-hidden="true">→</span>';
const brand = `<a class="brand" href="/" aria-label="陶芸の里 保田窯 トップ">
  <span class="stamp" aria-hidden="true">保</span>
  <span class="brand-type"><small>陶芸の里</small>保田窯</span>
</a>`;
const poster = { hand: '/images/studio-cup.webp', wheel: '/images/studio-bowl.webp', pizza: '/images/studio-plate.webp' };
const external = (url, label, className = 'text-link') =>
  `<a href="${url}" class="${className}" target="_blank" rel="noopener noreferrer">${label} ${arrow}<span class="sr-only">（新しいタブ）</span></a>`;
const courseURL = id => `/courses/?course=${id}#course-selector`;

function header(isCourses, isError) {
  const booking = isError ? '/#reservation' : '#reservation';
  return `<a class="skip-link" href="#main">本文へスキップ</a>
  <div class="notice"><span>RENTA STUDIO 自主制作・非公式デモ</span><a href="#demo-info">このサイトについて ${right}</a></div>
  <header class="site-header">
    <div class="wrap header-row">
      ${brand}
      <nav class="desktop-nav" aria-label="メインナビゲーション">
        <a href="/#clay">Web陶芸</a>
        <a href="/courses/" ${isCourses ? 'aria-current="page"' : ''}>体験コース・料金</a>
        <a href="/#about">保田窯について</a>
        <a href="/#access">アクセス</a>
      </nav>
      <a class="button header-book" href="${booking}">予約方法 ${arrow}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">メニュー</button>
    </div>
    <nav class="mobile-menu" id="mobile-menu" aria-label="モバイルナビゲーション" hidden>
      <a href="/">トップ</a><a href="/#clay">Web陶芸</a><a href="/courses/">体験コース・料金</a>
      <a href="/#about">保田窯について</a><a href="/#first">初めての方へ</a><a href="/#access">アクセス</a><a href="${booking}">予約方法</a>
    </nav>
  </header>`;
}

function viewport(mode) {
  const isCourse = mode === 'course';
  return `<figure class="studio-view" ${isCourse ? '' : 'id="studio-view"'} data-studio="${mode}" data-state="${isCourse ? 'hand' : 'gallery'}">
    <div class="view-frame">
      <div class="view-halo" aria-hidden="true"></div>
      <div class="view-top"><span><i aria-hidden="true"></i>${isCourse ? 'コースの器' : 'Web陶芸の作業台'}</span><span data-view-label>${isCourse ? '手びねり' : '04　焼き上がり'}</span></div>
      <img class="studio-poster" src="${isCourse ? poster.hand : poster.wheel}" alt="${isCourse ? '手びねりの形を表現した陶器のCG' : '灰緑色の釉薬をまとった茶碗のCG'}" width="1160" height="860" fetchpriority="high">
      <canvas class="studio-canvas" aria-label="陶器の立体モデル" aria-describedby="${isCourse ? 'course-view-caption' : 'studio-view-caption'}" hidden></canvas>
      <div class="view-guide"><span class="cross" aria-hidden="true">+</span><span data-view-guide>${isCourse ? '器のイメージ' : 'ろくろ台に置いた焼き上がりの器'}</span><span class="cross" aria-hidden="true">+</span></div>
    </div>
    <figcaption id="${isCourse ? 'course-view-caption' : 'studio-view-caption'}">展示用CG ／ 保田窯の実物・設備とは異なります</figcaption>
  </figure>`;
}

const glazes = [
  ['ash', '灰緑', 'ash'],
  ['rice', '生成り', 'rice'],
  ['iron', '鉄赤', 'iron'],
];

function orbitControls() {
  return `<div class="orbit-tools" role="group" aria-label="器の見る角度">
    <button type="button" data-orbit="-1" aria-label="器を左に回す" disabled>↶</button>
    <button type="button" data-orbit="1" aria-label="器を右に回す" disabled>↷</button>
    <button type="button" data-tilt aria-label="器の内側を見る" aria-pressed="false" disabled>上から</button>
  </div>`;
}

function workbench() {
  const stages = [
    ['clay', '土に触れる'],
    ['throw', 'ろくろで成形'],
    ['fire', '窯で焼く'],
    ['gallery', '器を眺める'],
  ];
  return `<section class="studio-dark" id="clay" aria-labelledby="home-title">
    <div class="wrap workbench">
      <div class="hero-copy">
        <p class="kicker"><span></span>広島・東広島の陶芸体験</p>
        <h1 id="home-title">土にふれる。<br><em>器が生まれる。</em></h1>
        <p class="hero-lead">黒瀬の里山にある窯元、保田窯。<br>まずは画面のろくろに手を添えて、<br class="desktop-only">自分の手で器が立ち上がる瞬間を。</p>
        <div class="hero-actions">
          <a class="button solid" href="#courses">体験コース・料金 ${right}</a>
          <a class="text-link" href="#reservation">予約方法 ${arrow}</a>
        </div>
        <div class="hero-facts"><p>手びねり 3,850円〜 <span>約2時間</span></p><a href="#studio-view" data-start-studio>土からつくる ↓</a></div>
      </div>
      ${viewport('workbench')}
      <div class="studio-desk" id="studio-controls">
        <div class="desk-title">
          <p class="kicker">陶芸の工程</p>
          <p data-studio-status aria-live="polite">焼き上がり。器の縁と釉薬の表情を眺めてみましょう。</p>
          <noscript><p>3D操作にはJavaScriptが必要です。</p></noscript>
        </div>
        <div class="desk-tools">
          <div class="stage-rail" role="group" aria-label="陶芸の工程">
            ${stages.map(([id, label], i) => `<button type="button" data-stage="${id}" aria-pressed="${id === 'gallery'}" disabled><span>0${i + 1}</span>${label}</button>`).join('')}
          </div>
          <div class="tool-shelf">
            <div class="glaze-tools" role="group" aria-label="釉薬の色">
              <span>釉薬</span>
              ${glazes.map(([id, label, cls]) => `<button type="button" class="glaze ${cls}" data-glaze="${id}" aria-label="${label}" title="${label}" aria-pressed="${id === 'ash'}" disabled><i aria-hidden="true"></i><span>${label}</span></button>`).join('')}
            </div>
            <div class="form-tool" hidden>
              <label for="form-amount">器の立ち上がり</label>
              <input id="form-amount" type="range" min="0" max="100" value="0">
            </div>
            ${orbitControls()}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function heading(label, title, summary = '') {
  return `<div class="section-head"><div><p class="kicker">${label}</p><h2>${title}</h2></div>${summary ? `<p>${summary}</p>` : ''}</div>`;
}

function ledger() {
  return `<section class="paper section-space" id="courses"><div class="wrap">
    ${heading('体験台帳', 'どんな器を、つくろう。', '料金・年齢・所要時間から、あなたに合う体験を。')}
    <div class="ledger">
      ${courses.map(c => `<a href="${courseURL(c.id)}" class="ledger-row">
        <span class="ledger-index">${c.number}</span><span class="ledger-name">${c.name}<small>${c.tag}</small></span>
        <span class="ledger-facts">${c.time} <span>${c.age}</span> <span>${c.people}</span></span>
        <span class="ledger-price"><b>${c.price}</b> 円〜</span><span class="ledger-arrow" aria-hidden="true">→</span>
      </a>`).join('')}
    </div>
    <div class="section-end"><p class="fine">1名の掲載料金・条件。送料別途。ピザ焼きは手びねりセットの条件です。</p><a class="text-link" href="/courses/#comparison">全プランを比較する ${right}</a></div>
  </div></section>`;
}

function about() {
  return `<section class="collection section-space" id="about"><div class="wrap collection-grid">
    <figure class="collection-figure">
      <img src="/images/studio-collection.webp" width="1160" height="860" alt="質感の異なる茶碗、湯呑み、皿を並べた展示用CG" loading="lazy">
      <figcaption>器の展示イメージ ／ オリジナルCG</figcaption>
    </figure>
    <div class="collection-copy">
      <p class="kicker"><span></span>保田窯について</p>
      <h2>里山で、<br>土と向き合う。</h2>
      <p>東広島市・黒瀬町の里山に、陶芸家の中屋ご夫妻が営む保田窯があります。1987年から陶芸体験を続け、初めての方にも器づくりを教えています。</p>
      <p>手の跡が残る器をつくったり、陶芸のあとに窯でピザを焼いたり。敷地内には市指定史跡の保田古墳もあります。</p>
      <a class="text-link" href="#access">工房へのアクセス ${right}</a>
    </div>
  </div></section>`;
}

function firstVisit() {
  const steps = [
    ['コースを選ぶ', '人数と年齢に合う体験を選び、外部の予約サービスで希望日と条件を確認します。'],
    ['身軽な服装で工房へ', '動きやすく、汚れてもよい服装がおすすめ。エプロンなどの持ち物は予約時にご確認ください。'],
    ['先生と器づくり', '手びねり・電動ろくろは約2時間。手びねりとピザ焼きのセットは約5時間が目安です。'],
    ['焼き上がりを待つ', '作品は乾燥・焼成後に郵送。掲載プランでは約2か月が目安で、送料が別途かかります。'],
  ];
  return `<section class="paper section-space" id="first"><div class="wrap two-col">
    <div>${heading('初めての方へ', '予約から<br>器が届くまで。')}<a href="/courses/#faq" class="text-link">持ち物・配送のよくある質問 ${right}</a></div>
    <ol class="visit-list">
      ${steps.map(([title, text], i) => `<li><span>0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}
    </ol>
  </div></section>`;
}

function access() {
  return `<section class="access section-space" id="access"><div class="wrap two-col">
    <div>
      ${heading('アクセス', '陶芸の里 保田窯')}
      <address>〒739-2501<br>広島県東広島市黒瀬町小多田558</address>
      <dl class="access-list">
        <div><dt>駐車場</dt><dd>無料駐車場あり（15台の掲載）</dd></div>
        <div><dt>営業時間・休業日</dt><dd>予約サービスかお電話でご確認ください</dd></div>
        <div><dt>保田窯への電話</dt><dd><a class="phone" href="tel:0823826466">0823-82-6466</a></dd></div>
      </dl>
      <p class="fine">集合場所と時刻は、ご予約のプランをご確認ください。</p>
    </div>
    <div class="access-map">
      <p class="kicker">広島県東広島市</p><p class="map-town">黒瀬町 小多田</p>
      <div class="map-actions">${external(mapUrl, 'Google マップでルートを見る', 'button outline')}
        <button class="button outline" id="load-map" type="button" hidden>地図を表示</button></div>
    </div>
  </div></section>`;
}

function reservation() {
  return `<section class="booking section-space" id="reservation"><div class="wrap two-col">
    <div>${heading('体験の予約', '次の休日、<br>土にふれに行く。')}
    <p>ご希望の日程と体験を外部の予約サービスでお選びください。</p></div>
    <div class="booking-links">
      ${external(jalan + 'activity_plan/', 'じゃらんで体験・空き状況を確認', 'button solid')}
      ${external(asoview, 'アソビュー！で掲載プランを確認', 'button outline')}
      <p class="fine">予約・決済は各外部サービスで行います。</p>
    </div>
  </div></section>`;
}

function footer(isError) {
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-brand">${brand}<a href="#top" class="text-link">ページの先頭へ ↑</a></div>
    <div class="footer-details" id="demo-info">
      <div>
        <h2>このサイトは非公式の自主制作デモです。</h2>
        <p>RENTA STUDIOがデザイン・開発の作例として制作しました。陶器や作業台のCGは体験をイメージした創作です。店舗情報は公開資料に基づきます。最新の営業・体験内容は予約先か店舗へご確認ください。</p>
        ${external('https://github.com/4vhz7h2k5t-sys/yasudagama/issues/new?title=' + encodeURIComponent('掲載内容の修正・削除について'), '掲載内容の修正・削除（GitHub）')}
      </div>
      <details><summary>掲載情報の出典・確認日</summary>
        <p>掲載情報の確認日　${verifiedDate}</p>
        <ul>
          <li>${external('https://higashihiroshima-kanko.jp/spot/yasudagama/', '東広島観光サイト｜保田窯')}</li>
          <li>${external('https://higashihiroshima-kanko.jp/activity/tougei_yasudagama/', '東広島観光サイト｜陶芸体験')}</li>
          <li>${external(jalan, 'じゃらん｜体験プラン')}</li>
          <li>${external(asoview, 'アソビュー！｜保田窯')}</li>
        </ul>
      </details>
    </div>
    <p class="copyright">© 2026 RENTA STUDIO</p>
  </div></footer>
  <nav class="mobile-booking" aria-label="体験・予約へのショートカット">
    <a href="/courses/">体験コース・料金</a><a href="${isError ? '/#reservation' : '#reservation'}">予約方法 ${arrow}</a>
  </nav>`;
}

function courseDetails(c) {
  return `<article class="course-panel" id="detail-${c.id}" data-course-panel="${c.id}">
    <p class="kicker">${c.number}　${c.tag}</p>
    <h2>${c.name}</h2>
    <p>${c.description}</p>
    <div class="course-facts">
      <p class="course-price"><b>${c.price}</b><span>円〜 / 1名</span></p>
      <dl><div><dt>所要時間</dt><dd>${c.time}</dd></div><div><dt>対象年齢</dt><dd>${c.age}</dd></div><div><dt>参加人数</dt><dd>${c.people}</dd></div></dl>
    </div>
    <p class="course-note">${c.includes}。 ${c.note}</p>
    ${external(c.plan, 'じゃらんでこのプランを確認', 'button solid')}${c.wheelPlan ? '\n    ' + external(c.wheelPlan, '電動ろくろ＋ピザ焼きのプラン') : ''}
  </article>`;
}

function courseStudio() {
  return `<section class="studio-dark" aria-labelledby="course-title"><div class="wrap">
    <div class="course-intro"><div><p class="kicker"><span></span>保田窯の陶芸体験</p><h1 id="course-title">体験コース・料金</h1></div>
      <p>手びねり、電動ろくろ、陶芸とピザ焼き。<br>日程を決める前に、内容と参加条件をご覧ください。</p></div>
    <div class="course-studio" id="course-selector">
      <nav class="course-rail" aria-label="コースを選ぶ">
        ${courses.map(c => `<a href="#detail-${c.id}" data-course="${c.id}"><span>${c.number}</span>${c.name}</a>`).join('')}
      </nav>
      <div class="course-stage">
        <div class="course-text">${courses.map(courseDetails).join('')}</div>
        <div class="course-object">${viewport('course')}${orbitControls()}</div>
      </div>
    </div>
    <div class="section-end"><p class="fine">${verifiedDate}確認の掲載情報。最新の料金・条件は予約先へ。</p>
    <a href="#comparison" class="text-link">全プランを比較 ↓</a></div>
  </div></section>`;
}

function comparison() {
  const plans = [
    ...courses.map(c => ({...c, title: c.id === 'pizza' ? '手びねり＋ピザ焼き' : c.name})),
    {title:'電動ろくろ＋ピザ焼き',price:'5,940',time:'予約先で確認',age:'予約先で確認',people:'3名〜',plan:courses[2].wheelPlan},
  ];
  return `<section class="paper section-space" id="comparison"><div class="wrap">
    ${heading('体験台帳', '全プランを比較')}
    <div class="comparison-ledger">
      ${plans.map((c, i) => `<article class="comparison-row">
        <span class="ledger-index">0${i+1}</span><h3>${c.title}</h3>
        <dl><div><dt>掲載料金 / 1名</dt><dd>${c.price}円〜</dd></div><div><dt>所要時間</dt><dd>${c.time}</dd></div><div><dt>対象年齢</dt><dd>${c.age}</dd></div><div><dt>参加人数</dt><dd>${c.people}</dd></div></dl>
        ${external(c.plan,'プラン確認')}
      </article>`).join('')}
    </div>
    <p class="fine comparison-note">完成作品の送料が別途かかります。お子さまだけでの予約・参加はできません。</p>
  </div></section>`;
}

function faq() {
  return `<section class="access section-space" id="faq"><div class="wrap two-col">
    <div>${heading('初めての方へ', 'よくあるご質問')}<p>体験に関するご質問は保田窯へ。</p><a class="phone" href="tel:0823826466">0823-82-6466</a></div>
    <div class="faq-list">${faqs.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>`;
}

function documentHtml(content, page) {
  const isCourses = page === 'courses';
  const isError = page === 'error';
  const title = isError ? 'ページが見つかりません' : isCourses ? '体験コース・料金' : '土にふれる。器が生まれる。';
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="description" content="広島県東広島市、陶芸の里 保田窯の体験コースを紹介するRENTA STUDIOの非公式制作デモです。">
  <meta name="theme-color" content="#1b1d18">
  <title>${title}｜陶芸の里 保田窯【非公式デモ】</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/style.css">
  <script type="module" src="/src/main.js"></script>
</head>
<body id="top" data-page="${page}">
${header(isCourses, isError)}
<main id="main">${content}</main>
${footer(isError)}
</body>
</html>
`;
}

await mkdir('courses', {recursive:true});
await Promise.all([
  writeFile('index.html', documentHtml(workbench() + ledger() + about() + firstVisit() + access() + reservation(), 'home')),
  writeFile('courses/index.html', documentHtml(courseStudio() + comparison() + faq() + reservation(), 'courses')),
  writeFile('404.html', documentHtml('<section class="paper section-space"><div class="wrap"><p class="kicker">404</p><h1>ページが見つかりません</h1><a class="text-link" href="/">トップへ戻る →</a></div></section>', 'error')),
]);
console.log('Generated TOP, COURSES, and 404 pages.');
