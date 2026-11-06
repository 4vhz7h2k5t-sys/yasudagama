import { mkdir, writeFile } from 'node:fs/promises';
import { courses, faqs, jalan, asoview, mapUrl, verifiedDate } from '../src/content.js';

const arrow = '<span aria-hidden="true">↗</span>';
const right = '<span aria-hidden="true">→</span>';
const brand = `<a class="brand" href="/" aria-label="陶芸の里 保田窯 トップ">
  <span class="stamp" aria-hidden="true">保</span>
  <span class="brand-type"><small>陶芸の里</small>保田窯</span>
</a>`;
const external = (url, label, className = 'text-link') =>
  `<a href="${url}" class="${className}" target="_blank" rel="noopener noreferrer">${label} ${arrow}<span class="sr-only">（新しいタブ）</span></a>`;
const historySource = 'https://camp-fire.jp/projects/299809/view';
const interview = 'https://michishirube.info/host/detail/23/';

// Each slot can be replaced with a licensed photograph and its own caption.
const photos = {
  hero: {
    src: '/images/pottery-wheel.webp',
    mobile: '/images/pottery-wheel-mobile.webp',
    alt: 'ろくろで土を引き上げ、器を成形する手元のイメージ',
    caption: 'ろくろでの作陶イメージ',
    credit: 'AI生成イメージ・実景ではありません',
  },
  about: {
    src: '/images/handbuilding.webp',
    alt: '粘土のひもを重ね、手で器をつくるイメージ',
    caption: '手びねりの作陶イメージ',
    credit: 'AI生成イメージ・実景ではありません',
  },
};

function photo(slot) {
  const image = photos[slot];
  const hero = slot === 'hero';
  return `<figure class="photo photo-${slot}" data-scroll="${slot}">
    <div class="photo-window">
      <picture>
        ${image.mobile ? `<source media="(max-width: 650px)" srcset="${image.mobile}">` : ''}
        <img src="${image.src}" alt="${image.alt}" width="1400" height="933" ${hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
      </picture>
    </div>
    <figcaption><span>${image.caption}</span><span>${image.credit}</span></figcaption>
  </figure>`;
}

function header(page) {
  const booking = page === 'error' ? '/#reservation' : '#reservation';
  const nav = `<a href="/#about">保田窯について</a><a href="/courses/" ${page === 'courses' ? 'aria-current="page"' : ''}>体験コース</a>
    <a href="/#first">体験の流れ</a><a href="/#access">アクセス</a>`;
  return `<a class="skip-link" href="#main">本文へスキップ</a>
  <div class="notice"><span>RENTA STUDIO 自主制作・非公式デモ</span><a href="#demo-info">このサイトについて ${right}</a></div>
  <header class="site-header">
    <div class="wrap header-row">
      ${brand}
      <nav class="desktop-nav" aria-label="メインナビゲーション">${nav}</nav>
      <a class="button header-book" href="${booking}">ご予約 ${arrow}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" hidden>メニュー</button>
    </div>
    <nav class="mobile-menu wrap" id="mobile-menu" aria-label="モバイルナビゲーション" hidden>
      <a href="/">トップ</a>${nav}<a href="${booking}">予約方法</a>
    </nav>
  </header>`;
}

function hero() {
  return `<section class="hero" aria-labelledby="home-title">
    <div class="hero-copy">
      <p class="eyebrow"><span></span>東広島・黒瀬の陶芸体験</p>
      <h1 id="home-title">土にふれて、<br>自分の器を。</h1>
      <p class="hero-lead">黒瀬の里山にある、陶芸の里 保田窯。<br>中屋ご夫妻に教わりながら、<br class="desktop-break">手のひらから器が生まれる時間を。</p>
      <div class="hero-actions">
        <a class="button solid" href="#courses">体験コースを見る ${right}</a>
        <a class="text-link" href="#reservation">予約方法 ${arrow}</a>
      </div>
      <div class="hero-facts"><span>初心者歓迎</span><span>手びねり 3,850円〜</span></div>
    </div>
    ${photo('hero')}
  </section>
  <div class="hero-end wrap">
    <p>土をさわる。形をつくる。焼き上がりを待つ。</p>
    <a href="#about" class="text-link">保田窯のこと <span aria-hidden="true">↓</span></a>
  </div>`;
}

function heading(number, label, title, text = '') {
  return `<header class="section-heading">
    <p class="eyebrow"><span></span><b>${number}</b> ${label}</p>
    <h2>${title}</h2>
    ${text ? `<p class="section-lead">${text}</p>` : ''}
  </header>`;
}

function about() {
  return `<section class="about section-pad" id="about">
    <div class="wrap">
      ${heading('01', '保田窯について', 'ふたりで築いた窯。<br>手から伝わる、つくる喜び。')}
      <div class="about-grid">
        <div class="about-image">${photo('about')}</div>
        <div class="about-story">
          <p class="about-intro">東広島市黒瀬町の里山で、陶芸家の中屋新平さん・公弥子さんご夫妻が営む保田窯。作品をつくり続けるかたわら、子どもから大人まで、土に触れる楽しさを伝えてきました。</p>
          <ol class="history" aria-label="保田窯の歩み">
            <li data-scroll="history">
              <time datetime="1986">1986</time>
              <div><h3>自分たちの手で、登り窯を築く。</h3>
              <p>ご夫妻は半年かけて、全長約10メートル、五つの部屋を持つ登り窯を築きました。焼き上がりを見ながら、よりよい焼成を求めて窯の形にも手を入れ続けました。</p></div>
            </li>
            <li data-scroll="history">
              <time datetime="1987">1987</time>
              <div><h3>陶芸教室を始める。</h3>
              <p>一からものをつくる喜びを知ってもらいたい。その思いから陶芸体験が始まりました。今も、ご夫妻に教わりながら、自分の手で土を器にしていく時間を過ごせます。</p></div>
            </li>
          </ol>
          <div class="about-aside"><p class="eyebrow"><span></span>里山の工房</p>
            <p>敷地内には、東広島市指定史跡の保田古墳があります。陶芸のあとにピザを焼くコースも、ご夫妻が陶芸に親しむきっかけとして考えた体験です。</p>
            <div class="source-links">${external(historySource, '登り窯の記録')}${external(interview, 'ご夫妻のインタビュー')}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function facts(c) {
  return `<dl class="facts">
    <div><dt>所要時間</dt><dd>${c.time}</dd></div>
    <div><dt>対象年齢</dt><dd>${c.age}</dd></div>
    <div><dt>参加人数</dt><dd>${c.people}</dd></div>
  </dl>`;
}

function price(c) {
  return `<p class="price"><b>${c.price}</b><span>円〜 / 1名</span></p>`;
}

function experience() {
  const shortCopy = {
    hand: '土を手でのばし、重ねて形にします。小さなお子さまと一緒に、自分のペースで。',
    wheel: '回る土に指を添え、茶碗などの形を引き上げます。先生のサポートがあるので、初めてでも挑戦できます。',
    pizza: '器づくりのあとにピザをつくって窯で焼く、家族や仲間と楽しむコース。',
  };
  return `<section class="experience section-pad" id="courses"><div class="wrap experience-grid">
    <div class="experience-intro">
      ${heading('02', '陶芸体験', 'あなたに合う<br>器づくり。', '手で形をつくるか、ろくろを回すか。年齢と過ごし方から、ぴったりの体験をお選びください。')}
      <a href="/courses/" class="text-link">全コース・料金を見る ${right}</a>
    </div>
    <div class="experience-list">
      ${courses.map(c => `<article class="experience-row" data-scroll="course">
        <span class="item-number" aria-hidden="true">${c.number}</span>
        <div><p class="small-label">${c.tag}</p><h3>${c.name}</h3>
          <p class="experience-description">${shortCopy[c.id]}</p>
          ${facts(c)}
        </div>
        <div class="experience-links">${price(c)}
          <a href="/courses/#detail-${c.id}" class="text-link" aria-label="${c.name}の詳細を見る">コース詳細 ${right}</a>
        </div>
      </article>`).join('')}
      <p class="fine">掲載料金。送料別途。ピザ焼きは手びねりセットの条件です。</p>
      <a class="button solid" href="#reservation">予約方法を見る ${arrow}</a>
    </div>
  </div></section>`;
}

function firstVisit() {
  const steps = [
    ['コースを予約する', '体験内容・参加条件を見て、外部の予約サイトで希望日を選びます。'],
    ['工房へ向かう', '動きやすく、汚れてもよい服装で。集合場所と時刻は予約時にご確認ください。'],
    ['土から器をつくる', '先生に教わりながら、手びねりやろくろで形をつくります。陶芸のみは約2時間が目安です。'],
    ['焼き上がりを待つ', '作品は乾燥・焼成後に郵送されます。掲載プランでは約2か月が目安で、送料が別途かかります。'],
  ];
  return `<section class="process section-pad" id="first"><div class="wrap">
    ${heading('03', '体験の流れ', '予約から、器が届くまで。')}
    <ol class="process-steps">
      ${steps.map(([title, body], i) => `<li><span class="item-number">0${i + 1}</span><h3>${title}</h3><p>${body}</p></li>`).join('')}
    </ol>
    <a class="text-link" href="/courses/#faq">服装や配送のよくある質問 ${right}</a>
  </div></section>`;
}

function access() {
  return `<section class="access section-pad" id="access"><div class="wrap split">
    <div>
      ${heading('04', 'アクセス', '陶芸の里 保田窯')}
      <address>〒739-2501<br>広島県東広島市黒瀬町小多田558</address>
      <dl class="access-list">
        <div><dt>駐車場</dt><dd>無料駐車場あり（15台の掲載）</dd></div>
        <div><dt>営業時間・休業日</dt><dd>予約サービスかお電話でご確認ください</dd></div>
        <div><dt>保田窯への電話</dt><dd><a class="phone" href="tel:0823826466">0823-82-6466</a></dd></div>
      </dl>
      <p class="fine">集合場所と時刻は、ご予約のプランをご確認ください。</p>
    </div>
    <div class="access-map">
      <p class="eyebrow"><span></span>広島県東広島市</p>
      <p class="map-town">黒瀬町 小多田</p>
      <p>保田窯への経路を地図で確認できます。</p>
      <div class="map-actions">${external(mapUrl, 'Google マップで経路を見る', 'button outline')}
        <button class="text-link" id="load-map" type="button" hidden>地図を表示</button></div>
    </div>
  </div></section>`;
}

function reservation() {
  return `<section class="booking section-pad" id="reservation"><div class="wrap split">
    <div>${heading('05', 'ご予約', '里山で、陶芸を。')}
      <p>希望の日程・体験を選び、外部予約サイトで最新の料金と空き状況をご確認ください。</p></div>
    <div class="booking-links">
      ${external(jalan + 'activity_plan/', 'じゃらんで体験・空き状況を確認', 'button solid')}
      ${external(asoview, 'アソビュー！で掲載プランを確認', 'button outline')}
      <p class="fine">予約・決済は各外部サービスで行います。</p>
    </div>
  </div></section>`;
}

function footer(page) {
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-brand">${brand}<a href="#top" class="text-link">ページの先頭へ ↑</a></div>
    <div class="footer-details" id="demo-info">
      <div>
        <h2>このサイトは非公式の自主制作デモです。</h2>
        <p>RENTA STUDIOがデザイン・開発の作例として制作しました。店舗・運営者との提携や公認はありません。掲載画像はAI生成の作陶イメージです。実際の工房・ご夫妻・作品とは異なります。店舗情報は公開資料に基づきます。</p>
        ${external('https://github.com/4vhz7h2k5t-sys/yasudagama/issues/new?title=' + encodeURIComponent('掲載内容の修正・削除について'), '掲載内容の修正・削除（GitHub）')}
      </div>
      <details><summary>掲載情報の出典・確認日</summary>
        <p>体験条件の確認日　${verifiedDate}</p>
        <ul>
          <li>${external('https://higashihiroshima-kanko.jp/spot/yasudagama/', '東広島観光サイト｜保田窯')}</li>
          <li>${external('https://higashihiroshima-kanko.jp/activity/tougei_yasudagama/', '東広島観光サイト｜陶芸体験')}</li>
          <li>${external(historySource, '保田窯による登り窯の記録')}</li>
          <li>${external(interview, 'みちしるべ｜中屋ご夫妻')}</li>
          <li>${external(jalan, 'じゃらん｜体験プラン')}</li>
          <li>${external(asoview, 'アソビュー！｜保田窯')}</li>
        </ul>
      </details>
    </div>
    <p class="copyright">© 2026 RENTA STUDIO</p>
  </div></footer>
  <nav class="mobile-booking" aria-label="体験・予約へのショートカット">
    <a href="${page === 'courses' ? '#course-selector' : '/courses/'}">体験コース・料金</a><a href="${page === 'error' ? '/#reservation' : '#reservation'}">予約方法 ${arrow}</a>
  </nav>`;
}

function courseDetails(c) {
  return `<article class="course-detail" id="detail-${c.id}" data-scroll="course">
    <div class="course-story">
      <p class="eyebrow"><b>${c.number}</b> ${c.tag}</p>
      <h2>${c.name}</h2>
      <p class="course-catch">${c.catch}</p>
      <p>${c.description}</p>
      <ol class="course-steps">${c.steps.map(step => `<li>${step}</li>`).join('')}</ol>
    </div>
    <div class="course-book">
      <p class="small-label">掲載料金</p>
      ${price(c)}
      ${facts(c)}
      <p class="course-includes">${c.includes}</p>
      <p class="fine">${c.note}</p>
      ${external(c.plan, 'じゃらんでプランを確認', 'button solid')}${c.wheelPlan ? '\n      ' + external(c.wheelPlan, '電動ろくろ＋ピザ焼きのプラン') : ''}
    </div>
  </article>`;
}

function comparison() {
  const plans = [
    ...courses.map(c => ({...c, title: c.id === 'pizza' ? '手びねり＋ピザ焼き' : c.name})),
    {title:'電動ろくろ＋ピザ焼き',price:'5,940',time:'予約先で確認',age:'予約先で確認',people:'3名〜',plan:courses[2].wheelPlan},
  ];
  return `<section class="comparison section-pad" id="comparison"><div class="wrap">
    ${heading('02', '料金と条件', '全プランを比較')}
    <div class="comparison-ledger">
      ${plans.map(c => `<article class="comparison-row">
        <h3>${c.title}</h3>${price(c)}${facts(c)}
        ${external(c.plan, 'プラン確認')}
      </article>`).join('')}
    </div>
    <p class="fine comparison-note">完成作品の送料が別途かかります。お子さまだけでの予約・参加はできません。</p>
  </div></section>`;
}

function faq() {
  return `<section class="faq section-pad" id="faq"><div class="wrap split">
    <div>${heading('03', '初めての方へ', 'よくあるご質問')}<p>体験に関するご質問は保田窯へ。</p><a class="phone" href="tel:0823826466">0823-82-6466</a></div>
    <div class="faq-list">${faqs.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>`;
}

function coursesPage() {
  return `<section class="courses-mast"><div class="wrap">
    <nav class="breadcrumb" aria-label="パンくず"><a href="/">トップ</a><span aria-hidden="true">/</span><span aria-current="page">体験コース・料金</span></nav>
    <div class="course-mast-copy">
      <div><p class="eyebrow"><span></span>保田窯の陶芸体験</p><h1>体験コース・料金</h1></div>
      <p>手びねり、電動ろくろ、陶芸とピザ焼き。<br>人数や年齢、当日の過ごし方からお選びください。</p>
    </div>
    <nav class="course-index" id="course-selector" aria-label="コース詳細へ">
      ${courses.map(c => `<a href="#detail-${c.id}"><span class="item-number">${c.number}</span><strong>${c.name}</strong><span class="course-index-price">${c.price}円〜</span><span aria-hidden="true">↓</span></a>`).join('')}
    </nav>
    <a class="text-link compare-link" href="#comparison">全プランの条件を比較 ${right}</a>
  </div></section>
  <section class="course-details section-pad" aria-label="コースの詳細"><div class="wrap">
    ${courses.map(courseDetails).join('')}
    <p class="fine comparison-note">${verifiedDate}確認の掲載情報。最新の条件は予約先へ。</p>
  </div></section>${comparison()}${faq()}${reservation()}`;
}

function documentHtml(content, page) {
  const title = page === 'error' ? 'ページが見つかりません' : page === 'courses' ? '体験コース・料金' : '東広島・黒瀬の陶芸体験';
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="description" content="広島県東広島市、陶芸の里 保田窯の体験コースを紹介するRENTA STUDIOの非公式制作デモです。">
  <meta name="theme-color" content="#f6f2e9">
  <title>${title}｜陶芸の里 保田窯【非公式デモ】</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/style.css">
  <script type="module" src="/src/main.js"></script>
</head>
<body id="top" data-page="${page}">
${header(page)}
<main id="main">${content}</main>
${footer(page)}
</body>
</html>
`.replace(/^[ \t]+$/gm, '');
}

await mkdir('courses', {recursive:true});
await Promise.all([
  writeFile('index.html', documentHtml(hero() + about() + experience() + firstVisit() + access() + reservation(), 'home')),
  writeFile('courses/index.html', documentHtml(coursesPage(), 'courses')),
  writeFile('404.html', documentHtml('<section class="section-pad"><div class="wrap"><p class="eyebrow">404</p><h1>ページが見つかりません</h1><a class="text-link" href="/">トップへ戻る →</a></div></section>', 'error')),
]);
console.log('Generated TOP, COURSES, and 404 pages.');
