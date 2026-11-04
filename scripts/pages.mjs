import { writeFile, mkdir } from 'node:fs/promises';
import { courses, faqs, jalan, asoview, mapUrl, verifiedDate } from '../src/content.js';

const arrow = '<span aria-hidden="true">↗</span>';
const right = '<span aria-hidden="true">→</span>';
const pot = `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 25c2 20 9 26 22 26s20-6 22-26"/><ellipse cx="32" cy="25" rx="22" ry="5"/><path d="M17 35c9 5 21 5 30 0M23 45c6 2 13 2 18 0M25 15c-4-4 4-6 0-10M37 15c-4-4 4-6 0-10"/></g></svg>`;
const brand = `<a class="brand" href="/" aria-label="陶芸の里 保田窯 トップページ">${pot}<span><span class="brand-small">陶芸の里</span><span class="brand-name">保田窯</span></span></a>`;
const external = (url, text, cls = '') => `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">${text}${arrow}<span class="sr-only">（外部サイト・新しいタブで開きます）</span></a>`;
const heading = (n, label, title, desc = '') => `<div class="section-head"><div><p class="eyebrow"><span>${n}</span>${label}</p><h2>${title}</h2></div>${desc ? `<p class="section-desc">${desc}</p>` : ''}</div>`;

function header(isCourses) {
  return `<a class="skip-link" href="#main">本文へスキップ</a>
  <div class="demo-bar">RENTA STUDIO 自主制作 <span>｜</span> 非公式デモサイト <a href="#demo-info">このサイトについて ${right}</a></div>
  <header class="site-header"><div class="header-inner">${brand}<nav class="desktop-nav" aria-label="メインナビゲーション">
  <a href="/courses/" ${isCourses ? 'aria-current="page"' : ''}>体験コース</a><a href="/#about">保田窯について</a><a href="/#first">初めての方へ</a><a href="/#access">アクセス</a></nav>
  <a class="button dark header-cta" href="#reservation">体験を予約する ${arrow}</a>
  <button class="menu-toggle" type="button" aria-label="メニューを開く" aria-controls="mobile-menu" aria-expanded="false"><span class="menu-lines" aria-hidden="true"></span><span>メニュー</span></button></div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="モバイルナビゲーション" hidden><a href="/">トップ</a><a href="/courses/">体験コース・料金</a><a href="/#about">保田窯について</a><a href="/#first">初めての方へ</a><a href="/#access">アクセス</a><a href="#reservation">予約方法を見る ${arrow}</a></nav></header>`;
}

function coursePanel(c, isCourses) {
  return `<div class="course-visual"><img src="${c.image}" alt="${c.alt}" width="1200" height="800" loading="lazy"><span class="image-note">体験を表現した生成イメージ</span><span class="course-image-number" aria-hidden="true">${c.number}</span></div>
  <div class="course-copy"><p class="small-tag">${c.tag}</p><h3>${c.name}<span>体験</span></h3><p class="course-catch">${c.catch}</p><p>${c.description}</p>
  <div class="course-price"><span>掲載料金 / 1名</span><strong>${c.price}<small>円〜</small></strong></div>
  <dl class="course-facts"><div><dt>所要時間</dt><dd>${c.time}</dd></div><div><dt>対象年齢</dt><dd>${c.age}</dd></div><div><dt>参加人数</dt><dd>${c.people}</dd></div></dl>
  ${isCourses ? `<p class="included"><b>料金に含まれるもの</b>${c.includes}</p><p class="muted">${c.note}</p><ol class="mini-steps">${c.steps.map(s => `<li>${s}</li>`).join('')}</ol>${external(c.plan, 'この体験をじゃらんで確認', 'button dark wide')}${c.wheelPlan ? external(c.wheelPlan, '電動ろくろ＋ピザ焼きのプランを見る', 'text-link') : ''}` : `<a class="text-link course-detail" href="/courses/?course=${c.id}#course-selector">このコースを詳しく見る ${right}</a>`}
  </div>`;
}

function selector(isCourses = false) {
  return `<div class="course-selector" id="course-selector" data-detailed="${isCourses}">
  <div class="course-tabs" role="tablist" aria-label="体験コースを選ぶ">${courses.map((c, i) => `<button type="button" class="course-tab ${i === 0 ? 'active' : ''}" id="tab-${c.id}" role="tab" aria-selected="${i === 0}" aria-controls="course-panel" tabindex="${i === 0 ? 0 : -1}" data-course="${c.id}"><span class="tab-number">${c.number}</span><span>${c.name}</span><span class="tab-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
  <div id="course-panel" class="course-panel" role="tabpanel" aria-labelledby="tab-hand" tabindex="0">${coursePanel(courses[0], isCourses)}</div>
  <p class="source-note">${verifiedDate}確認の掲載情報です。料金・条件は変更される場合があります。送料は別途。最新の条件は各予約プランでご確認ください。</p>
  <noscript><p>各コースの条件は<a href="/courses/#comparison">コース比較表</a>でも確認できます。</p></noscript></div>`;
}

function clayExperience() {
  const stages = ['土にふれる', 'かたちにする', '窯で焼く', '暮らしの器へ'];
  return `<section class="clay-section" id="clay" aria-labelledby="clay-title"><div class="container">
  <div class="clay-intro"><p class="eyebrow light"><span>02</span>土から器へ</p><h2 id="clay-title">その手で生まれる、<br>小さな「できた」。</h2><p>土にふれて、かたちをつくる。<br>まずはここで、器が生まれるまでをひとめぐり。</p></div>
  <div class="clay-playground"><div class="clay-scene" data-stage="0"><span class="scene-caption">ひとつの土の、その先へ。</span>
  <svg class="clay-svg" viewBox="0 0 500 410" role="img" aria-label="粘土から器になる様子を表現したイラスト">
  <defs><linearGradient id="body-shade" x1="0" x2="1"><stop offset="0" stop-color="#6a4c3c"/><stop offset=".22" stop-color="#ab8060"/><stop offset=".48" stop-color="#c4a080"/><stop offset=".7" stop-color="#9b7255"/><stop offset="1" stop-color="#503a2e"/></linearGradient>
  <radialGradient id="inside-shade"><stop stop-color="#5f4334"/><stop offset=".7" stop-color="#8f6c52"/><stop offset="1" stop-color="#b18b6b"/></radialGradient>
  <radialGradient id="kiln-glow"><stop stop-color="#e17a3e" stop-opacity=".45"/><stop offset="1" stop-color="#e17a3e" stop-opacity="0"/></radialGradient>
  <filter id="ceramic-grain"><feTurbulence baseFrequency=".48" numOctaves="2" seed="8" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".13"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <clipPath id="vessel-clip"><path id="vessel-mask" d="M140 280C140 322 126 360 165 360Q250 378 335 360C374 360 360 322 360 280Z"/></clipPath></defs>
  <circle class="orbit" cx="250" cy="225" r="179"/><ellipse class="orbit" cx="250" cy="352" rx="218" ry="37"/>
  <ellipse fill="#000" opacity=".18" cx="250" cy="372" rx="154" ry="17"/>
  <ellipse fill="#55594c" cx="250" cy="360" rx="190" ry="29"/><ellipse fill="#646758" cx="250" cy="354" rx="190" ry="26"/>
  <g class="wheel-rings" fill="none" stroke="#a2a38b" stroke-opacity=".25"><ellipse cx="250" cy="354" rx="175" ry="22"/><ellipse cx="250" cy="354" rx="150" ry="19"/><ellipse cx="250" cy="354" rx="125" ry="16"/></g>
  <ellipse id="fire-glow" cx="250" cy="295" rx="210" ry="110" fill="url(#kiln-glow)" opacity="0"/>
  <path id="clay-mound" d="M146 340C145 309 179 267 222 260C282 241 346 279 354 336Q350 366 250 367Q155 366 146 340Z" fill="url(#body-shade)" filter="url(#ceramic-grain)"/>
  <g id="vessel" filter="url(#ceramic-grain)" opacity="0"><path id="vessel-body" d="M140 280C140 322 126 360 165 360Q250 378 335 360C374 360 360 322 360 280Z" fill="url(#body-shade)"/>
  <g id="vessel-lines" clip-path="url(#vessel-clip)" fill="none" stroke="#dfc5a4" stroke-opacity=".17" stroke-width="1">${Array.from({length: 18}, (_,i) => `<ellipse cx="250" cy="${190 + i * 9}" rx="154" ry="27"/>`).join('')}</g>
  <ellipse id="vessel-rim" cx="250" cy="280" rx="110" ry="15" fill="url(#inside-shade)" stroke="#c5a17e" stroke-width="5"/>
  <path id="glaze-shine" d="M159 235Q164 300 199 319" stroke="#fff" opacity="0" stroke-width="9" fill="none" stroke-linecap="round"/></g>
  <g class="heat-lines" fill="none" stroke="#df9c6b" stroke-width="2" stroke-linecap="round" opacity="0"><path d="M215 145q-15-20 0-40t0-40M250 130q-15-20 0-40t0-40M285 145q-15-20 0-40t0-40"/></g>
  </svg><span class="scene-stage" aria-hidden="true">01 / 04</span><span class="scene-mark" aria-hidden="true">土</span></div>
  <div class="clay-controls"><label for="clay-progress">スライダーで、器を育ててみる <span aria-hidden="true">↔</span></label><input id="clay-progress" type="range" min="0" max="100" value="0" step="1" aria-valuetext="土にふれる">
  <div class="stage-buttons" role="group" aria-label="器づくりの工程">${stages.map((s, i) => `<button type="button" data-stage="${i}" aria-pressed="${i === 0}"><span>0${i+1}</span>${s}</button>`).join('')}</div>
  <div class="stage-copy" aria-live="polite"><h3 id="stage-title">ひんやり、やわらか。土と出会う。</h3><p id="stage-description">はじまりは、ひとかたまりの土。手のひらで感触を確かめながら、つくりたい器を思い描きます。</p></div>
  <div class="glaze-options" hidden><span>器の色を変えてみる</span><div role="group" aria-label="イメージの釉薬を選ぶ"><button type="button" data-glaze="sand" class="glaze sand" aria-label="生成り" aria-pressed="true"></button><button type="button" data-glaze="green" class="glaze green" aria-label="織部を思わせる緑" aria-pressed="false"></button><button type="button" data-glaze="blue" class="glaze blue" aria-label="藍色" aria-pressed="false"></button></div></div>
  <p class="clay-note">工程・色はイメージです。実際の釉薬・焼き上がりとは異なります。</p></div></div></div></section>`;
}

function about() {
  return `<section class="about-section section-space" id="about"><div class="container about-grid"><div class="about-art" aria-hidden="true"><svg viewBox="0 0 540 560" fill="none"><circle cx="270" cy="256" r="222" stroke="#b4b3a1" stroke-width="1"/><path d="M12 403c72-40 101-18 143-47s66-59 112-30 95 31 137-10 97-40 136-17v261H12Z" fill="#e0e2d5"/><path d="M0 459c60-60 109-59 167-28s90 23 155-3 141-30 218 27v105H0Z" fill="#c1c6b2"/><path d="M71 478q56 35 123 0l22-177H47Z" fill="#b68362"/><ellipse cx="131" cy="301" rx="85" ry="19" fill="#b7906e"/><ellipse cx="131" cy="301" rx="73" ry="11" fill="#7a5846"/><path d="M70 346q55 16 126 0M67 361q60 19 131 0M65 376q63 22 135 0M63 391q67 22 140 0" stroke="#c99c77" stroke-width="2"/><path d="M298 473q52 30 105 0l30-111H269Z" fill="#737d66"/><ellipse cx="351" cy="362" rx="82" ry="20" fill="#a2aa90"/><ellipse cx="351" cy="362" rx="71" ry="13" fill="#4c5747"/><path d="M282 403q61 23 140 0" stroke="#9ba78a"/><path d="M178 165c47-45 135-42 172 13M200 187c38-32 103-30 132 8" stroke="#a76d51" stroke-linecap="round"/><path d="m340 158 10 20-23 2" stroke="#a76d51" stroke-linecap="round"/><path d="M452 130v65M420 163h65" stroke="#9ca38d"/><circle cx="91" cy="164" r="4" fill="#a76d51"/></svg><p>つくる時間も、たからもの。</p><span class="art-note">オリジナルイラスト / 実際の作品ではありません</span></div>
  <div class="about-copy"><p class="eyebrow"><span>03</span>保田窯について</p><h2>里山で出会う、<br>土と、人のぬくもり。</h2><p>広島県東広島市、黒瀬町の里山にある保田窯。<br class="desktop-only">陶芸家の中屋ご夫妻が、1987年から陶芸体験を続けてきた窯元です。</p><p>大切にしているのは、ものづくりの楽しさ。<br>初めての一歩にも先生が寄り添い、一人ひとりの「つくってみたい」をかたちにしていきます。</p><div class="about-detail"><span>この場所ならではの楽しみ</span><p>敷地内には市指定史跡の保田古墳があり、歴史を感じられる環境も魅力。陶芸とピザ焼きを楽しめるプランも紹介されています。</p></div><a class="text-link" href="#access">保田窯への行き方を見る ${right}</a></div></div></section>`;
}

function firstVisit() {
  return `<section class="first-section section-space" id="first"><div class="container">${heading('04', '初めての方へ', 'はじめての陶芸を、<br class="mobile-only">楽しむために。', '準備は少し。あとは、つくる気持ちを持って。')}<ol class="visit-steps">
  <li><span class="step-no">01</span><h3>コースを選んで予約</h3><p>人数と年齢に合う体験を選び、外部の予約サービスで日時・料金・条件を確認してお申し込み。</p><a href="/courses/" class="text-link">体験を比較する ${right}</a></li>
  <li><span class="step-no">02</span><h3>身軽な服装で工房へ</h3><p>動きやすく、汚れてもよい服装がおすすめ。エプロンなど必要な持ち物は予約時に確認しましょう。</p><span class="step-tag">爪は短めだと作業がしやすくなります</span></li>
  <li><span class="step-no">03</span><h3>自分だけの器づくり</h3><p>先生の説明を聞いて、いよいよ制作。体験の目安は陶芸のみで約2時間、手びねり＋ピザで約5時間。</p><span class="step-tag">焦らず、自分のペースで</span></li>
  <li><span class="step-no">04</span><h3>焼き上がりを待つ</h3><p>作品は乾燥・焼成後に郵送。掲載プランでは約2か月が目安です。当日の持ち帰りはできません。</p><span class="step-tag">送料は別途 / 発送時期は当日に確認</span></li></ol><a class="text-link faq-more" href="/courses/#faq">服装・配送など、よくある質問を見る ${right}</a></div></section>`;
}

function access() {
  return `<section class="access-section section-space" id="access"><div class="container">${heading('05', 'アクセス', '里山へ、ちょっと寄り道。')}<div class="access-grid"><div><h3>陶芸の里 保田窯</h3><address>〒739-2501<br>広島県東広島市黒瀬町小多田558</address><dl class="access-list"><div><dt>駐車場</dt><dd>無料駐車場あり（15台の掲載）</dd></div><div><dt>営業時間・休業日</dt><dd>予約サービス・お電話でご確認ください</dd></div><div><dt>お問い合わせ</dt><dd><a class="telephone" href="tel:0823826466">0823-82-6466</a><span>保田窯への電話です</span></dd></div></dl><p class="muted">集合時刻・集合場所は、ご予約のプランをご確認ください。道路状況を確かめ、ゆとりを持ってお出かけを。</p>${external(mapUrl, 'Google マップでルートを見る', 'button outline')}</div><div class="map-shell"><div class="map-placeholder"><span class="map-pin" aria-hidden="true">${pot}</span><h3>陶芸の里 保田窯</h3><p>広島県東広島市黒瀬町</p><button type="button" class="button dark" id="load-map">地図を表示する ${right}</button><p class="map-privacy">Google マップを読み込みます</p></div></div></div></div></section>`;
}

function reservation() {
  return `<section class="reservation-section" id="reservation"><div class="container reservation-inner"><div><p class="eyebrow"><span>ご予約</span>あなたの「つくってみたい」から</p><h2>次のお休みは、<br>土にふれてみませんか。</h2><p>日時とコースを選んで、外部予約サイトへ。<br>最新の料金・条件・空き状況を確認できます。</p></div><div class="reservation-links">${external(jalan + 'activity_plan/', 'じゃらんで体験・空き状況を確認', 'button dark')}${external(asoview, 'アソビュー！で掲載プランを確認', 'button outline')}<p>外部サイトへ移動します。このデモサイトでは<br class="desktop-only">予約の受付・確定・決済は行っていません。</p><a href="/courses/" class="text-link">先にコースを比較する ${right}</a></div></div></section>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-top">${brand}<p>土から生まれる、世界にひとつ。</p><a href="#top" class="back-top">ページの先頭へ ↑</a></div><div class="demo-info" id="demo-info"><div><h2>このサイトは非公式の自主制作デモです。</h2><p>RENTA STUDIOがデザイン・開発の作例として制作しました。保田窯の公式サイトではなく、店舗・運営者との提携や公認はありません。写真風の画像はすべてAI生成素材、ロゴ・イラストは独自制作です。実際の店舗・人物・作品・提供内容を撮影したものではありません。</p><p>店舗の情報は公開資料をもとに記載しています。最新の営業・体験内容は予約先または店舗にご確認ください。掲載内容の修正・削除は、制作元の下記窓口で受け付けます。</p>${external('https://github.com/4vhz7h2k5t-sys/yasudagama/issues/new?title=' + encodeURIComponent('掲載内容の修正・削除について'), '制作元へ修正・削除を連絡（GitHub）', 'text-link')}<span class="contact-note">GitHubアカウントが必要です。店舗へのご連絡とは異なります。</span></div><details class="sources"><summary>掲載情報の出典・確認日</summary><p>確認日：${verifiedDate}<br>最新の予約条件を保証するものではありません。</p><ul><li>${external('https://higashihiroshima-kanko.jp/spot/yasudagama/', '東広島観光サイト｜保田窯')}</li><li>${external('https://higashihiroshima-kanko.jp/activity/tougei_yasudagama/', '東広島観光サイト｜陶芸体験')}</li><li>${external(jalan, 'じゃらん｜保田窯・体験プラン')}</li><li>${external(asoview, 'アソビュー！｜保田窯')}</li></ul><p>営業時間、定休日、ICからの所要時間は資料間で相違があるため断定していません。</p></details></div><div class="footer-bottom"><span>© 2026 RENTA STUDIO</span><span>UNOFFICIAL DESIGN DEMO</span></div></div></footer><nav class="mobile-booking" aria-label="体験・予約へのショートカット"><a href="/courses/">体験コース・料金</a><a href="#reservation">予約方法を見る ${arrow}</a></nav>`;
}

const table = `<section class="comparison-section section-space" id="comparison"><div class="container">${heading('02', '料金・条件の比較', 'あなたに合う体験を、ひと目で。')}<p class="table-hint">表は横にスクロールできます ${right}</p><div class="table-scroll" role="region" aria-label="体験コースの料金と条件の比較" tabindex="0"><table><caption>公開プランの掲載条件（${verifiedDate}確認）</caption><thead><tr><th scope="col">体験コース</th><th scope="col">1名の掲載料金</th><th scope="col">所要時間</th><th scope="col">対象年齢</th><th scope="col">必要人数</th><th scope="col">予約先</th></tr></thead><tbody>${courses.map(c => `<tr><th scope="row">${c.name}${c.id === 'pizza' ? '<small>手びねりセット</small>' : ''}</th><td><b>${c.price}</b>円〜</td><td>${c.time}</td><td>${c.age}</td><td>${c.people}</td><td>${external(c.plan, 'プラン確認')}</td></tr>`).join('')}<tr><th scope="row">陶芸 ＋ ピザ焼き<small>電動ろくろセット</small></th><td><b>5,940</b>円〜</td><td>予約先で確認</td><td>予約先で確認</td><td>3名〜</td><td>${external(courses[2].wheelPlan, 'プラン確認')}</td></tr></tbody></table></div><div class="comparison-notes"><p><b>料金に加えて</b>完成作品の送料が別途必要です。追加焼成などの条件・料金は、各予約プランで確認してください。</p><p><b>お子さまの参加</b>お子さまだけでの予約・参加はできません。保護者の参加条件もあわせてご確認ください。</p></div></div></section>`;
const faq = `<section class="faq-section section-space" id="faq"><div class="container faq-grid"><div><p class="eyebrow"><span>03</span>よくあるご質問</p><h2>気になること、<br>出かける前に。</h2><p>ここにないご質問は、保田窯へ<br>直接お問い合わせください。</p><a href="tel:0823826466" class="text-link">0823-82-6466 ${arrow}</a></div><div>${faqs.map(([q,a],i) => `<details class="faq-item"><summary><span class="q-mark" aria-hidden="true">Q</span><span>${q}</span><span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div></div></section>`;

const home = `<main id="main"><section class="hero container"><div class="hero-copy"><p class="hero-location"><span></span>広島・東広島の陶芸体験</p><h1>土から生まれる、<br>世界にひとつ。</h1><p class="hero-description">くるくる回る土に、そっと手を添えて。<br>つくる楽しさと、ちょっと夢中になる時間。<br>里山の窯元・保田窯で、はじめての陶芸を。</p><div class="hero-buttons"><a class="button dark" href="#courses">体験コースを見る ${right}</a><a class="hero-book" href="#reservation">予約する ${arrow}</a></div><div class="hero-detail"><span>初めての方も歓迎</span><span>手びねり 3,850円〜</span></div></div><div class="hero-visual"><div class="hero-orbit" aria-hidden="true"></div><figure class="hero-photo"><picture><source media="(max-width: 640px)" srcset="/images/pottery-wheel-mobile.webp"><img src="/images/pottery-wheel.webp" width="1536" height="1024" alt="電動ろくろで器をつくる手元を表現した生成イメージ" fetchpriority="high"></picture><figcaption>体験を表現したAI生成イメージ / 実際の工房写真ではありません</figcaption></figure><div class="hero-seal" aria-hidden="true"><span>手でつくる。</span>${pot}<span>心にのこる。</span></div></div><div class="hero-bottom"><span>その手のあとが、あなたらしさ。</span><a href="#courses">体験を見つける <span aria-hidden="true">↓</span></a></div></section>
  <section class="quick-info"><div class="container"><p>思い立ったら、<br><b>土にふれる休日へ。</b></p><div><span>選べる体験</span><strong>手びねり・ろくろ・ピザ付き</strong></div><div><span>陶芸のみの所要時間</span><strong>約2時間</strong></div><div><span>お車での来訪も</span><strong>無料駐車場あり</strong></div></div></section>
  <section class="course-section section-space" id="courses"><div class="container">${heading('01', '体験コース', '今日は、どんな「つくる」にしよう。', 'じっくり、くるくる、おいしく。<br>あなたの休日に合う体験を選んでみてください。')}${selector()}<a class="button outline all-courses" href="/courses/#comparison">すべてのコース・料金を比較 ${right}</a></div></section>${clayExperience()}${about()}${firstVisit()}${access()}${reservation()}</main>`;
const coursePage = `<main id="main"><section class="courses-hero container"><div class="breadcrumb"><a href="/">トップ</a><span aria-hidden="true">/</span>体験コース</div><div><p class="eyebrow"><span>体験コース</span>あなたの「つくる」を見つけよう</p><h1>手を動かす。<br>心が、ほどける。</h1><p>初めてでも、久しぶりでも。<br>土と向き合う時間を、あなたらしく楽しんでください。</p></div><div class="courses-hero-pot" aria-hidden="true">${pot}<span>あなただけの、ひとつを。</span></div><nav class="page-nav" aria-label="体験コースページ内"><a href="#course-selector">コース詳細 ↓</a><a href="#comparison">料金・条件の比較 ↓</a><a href="#faq">よくある質問 ↓</a></nav></section><section class="course-detail-section"><div class="container">${selector(true)}</div></section>${table}${faq}${reservation()}</main>`;

function documentHtml(content, isCourses = false, is404 = false) {
  const title = is404 ? 'ページが見つかりません' : isCourses ? '体験コース・料金' : '土から生まれる、世界にひとつ。';
  const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="description" content="広島県東広島市黒瀬町の陶芸の里 保田窯。手びねり・電動ろくろ・ピザ焼きセットの体験をご紹介するRENTA STUDIOの非公式自主制作デモです。"><meta name="theme-color" content="#f6f3ec"><title>${title}｜陶芸の里 保田窯【非公式デモ】</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/src/style.css"><script type="module" src="/src/main.js"></script></head><body id="top" data-page="${is404 ? '404' : isCourses ? 'courses' : 'home'}">${header(isCourses)}${content}${footer()}</body></html>`;
  return is404 ? html.replaceAll('href="#reservation"', 'href="/#reservation"') : html;
}
await mkdir('courses', {recursive: true});
await Promise.all([
  writeFile('index.html', documentHtml(home)),
  writeFile('courses/index.html', documentHtml(coursePage, true)),
  writeFile('404.html', documentHtml('<main id="main" class="error-page container"><p class="eyebrow">404</p><h1>少し、道に迷ったようです。</h1><p>お探しのページは見つかりませんでした。</p><a class="button dark" href="/">トップページへ戻る →</a></main>', false, true)),
]);
console.log('Generated TOP, COURSES, and 404 pages.');
