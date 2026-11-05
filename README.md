# 陶芸の里 保田窯 — 非公式Webサイト制作デモ

RENTA STUDIOによる自主制作。店舗の公式サイトではなく、提携・公認はありません。

- 公開URL: https://yasudagama.ur24-jp.workers.dev/
- TOP `/`、COURSES `/courses/` の2ページ。カスタム404を含みます。
- Vite + Vanilla JS + Three.js / Blender / Cloudflare Workers Static Assets。
- CMS・DB・会員機能・フォーム送信・決済・予約処理はありません。

## 開発

```sh
npm ci
npm run dev
npm run build
npm run check
```

Node.js 22.12以上を推奨。`npm run dev` は127.0.0.1で起動します。

## 公開とHTTP検証

```sh
npm run deploy
npx wrangler dev --ip 127.0.0.1 --port 8793
npm run qa
QA_BASE_URL=https://yasudagama.ur24-jp.workers.dev npm run qa
```

WranglerにはCloudflareの既存アカウント認証が必要です。資格情報をリポジトリに保存しないでください。

## 編集箇所

- `src/content.js`: コース料金・条件・予約先・FAQ。
- `scripts/pages.mjs`: TOP / COURSES / 404の静的HTML生成、共通ナビ、告知・アクセス等。
- `src/main.js`: 工程・コース・釉薬の操作、メニュー、地図の遅延表示。
- `src/ceramics.js` と `src/profiles.json`: 陶器の断面、形状変化、ライティングと表面材質。
- `src/style.css`: レイアウト、レスポンシブ、reduced motion対応。
- `src/worker.js`: セキュリティヘッダーと全応答のnoindex。
- `docs/research.md`: 出典・未確認事項。
- `docs/visual-assets.md`: 立体と静止画の制作方法・保存先。

`index.html`、`courses/index.html`、`404.html` は生成済みファイルです。構成変更は生成元を編集し、`npm run build` を実行してください。

## 修正・削除の対応

制作元の [Issues](https://github.com/4vhz7h2k5t-sys/yasudagama/issues) が窓口です。店舗への予約相談は、外部予約サービスまたは店舗へ直接お願いします。

全ページに非公式表記・創作CG表記を設け、HTML meta / X-Robots-Tag / robots.txtで検索登録を抑止しています。公開情報を修正するときは研究記録も更新し、ビルド・検証・再公開してください。緊急時はCloudflare側でWorkerを停止できます。
