# 検証記録

検証日：2026-11-05（日本時間）

本番URL： https://yasudagama.ur24-jp.workers.dev/

本番公開後もHTTP検証を実行し、5経路すべて成功しました。PC幅1440px・モバイル幅390pxで本番の表示、コース切り替え、コース指定URL、器の完成操作を再確認し、この本番確認中のブラウザエラー・警告は0件でした。実測値は `production-http.json`、公開画面は `published-desktop.png` と `published-courses-mobile.png` を参照してください。

## 結果

- `npm run build` 成功。Vite 7.3.7。
- `npm run check` 成功。HTML3文書（TOP・COURSES・404）、内部リンク・アセット61件、ID重複、ページ内・ページ間アンカー、外部リンクの安全なタブ分離、noindex、画像容量を検証。
- `npm run qa` をWorkersローカル環境で実行し成功。TOP / COURSES / robots.txt / Hero画像は200、存在しないページは404。すべてに `X-Robots-Tag: noindex, nofollow, noarchive` とCSP。
- npm audit：既知の脆弱性0件（実行時点）。
- 320 / 390 / 768 / 1024 / 1440pxの各幅で両ページをブラウザ確認。ページ全体の横はみ出しなし。主な本文は16px。比較表の領域内だけ横スクロール可能。
- 全3コースの切り替え、料金・年齢・所要時間・人数・外部プランURLの連動を確認。
- コースを指定したURLへの直接アクセス、タブの左右矢印・Home操作、選択状態とフォーカスの一致を確認。
- モバイルメニューの開閉、Escapeで閉じる・フォーカス復帰、FAQの開閉を確認。
- 土のかたまり→成形→焼成→器の状態、スライダーのEnd操作、釉薬3色の切り替えを確認。
- 地図は初期状態でiframeなし。「地図を表示する」操作後にタイトル付きGoogle マップiframeが1件生成されることを確認。
- 予約フォーム・予約確定動作・決済・メール送信なし。外部予約サービスに進むリンクのみ。
- `prefers-reduced-motion` のCSS・JS分岐をコード確認。端末の実際のアクセシビリティ設定の切り替えによる試験は未実施。

## 軽量化

- アプリJS：11.55 kB（gzip約5.20 kB）。UIフレームワーク・3Dランタイム・外部フォントなし。
- CSS：37.44 kB（gzip約8.49 kB）。
- 公開WebP4ファイルの合計：441,548 bytes。モバイルHeroは36,510 bytes。
- 常時動く描画ループなし。器の描画は操作時だけ。写真はHero以外lazy指定。地図は利用者の操作時に読み込み。

## 記録ファイル

- `responsive.json`：画面幅・ページ幅・主本文サイズ・noindexの実測。
- `home-desktop.png` / `home-desktop-full.png` / `home-mobile.png`：TOP。
- `clay-desktop.png` / `clay-mobile.png`：操作型の器。
- `courses-mobile.png`：コースを指定した直接リンク。

ブラウザでの確認はデスクトップのブラウザと画面幅エミュレーションです。実機すべて・全ブラウザの網羅試験、実際の予約送信、店舗への電話確認は行っていません。予約先の外部ページは運営者により変更される場合があります。
