# 作陶写真の管理

初期版コミット `de848cd` の既存AI生成素材から、作陶の手元を示す2カットを選びました。

| 掲載位置 | ファイル | 表示 |
| --- | --- | --- |
| TOPのHero | `public/images/pottery-wheel.webp` とスマートフォン用 `public/images/pottery-wheel-mobile.webp` | ろくろでの作陶イメージ |
| 保田窯について | `public/images/handbuilding.webp` | 手びねりの作陶イメージ |

人物・工房・作品を記録した写真とは区別し、各画像のすぐ下に「AI生成イメージ・実景ではありません」と表示しています。撮影済みの実写が正式契約により提供された場合は、以下の手順で更新できます。

1. 掲載許可済みの写真をWebPに書き出し、`public/images/` に追加します。
2. `scripts/pages.mjs` の `photos.hero`、`photos.about` でファイルパス・代替テキスト・キャプション・出典表示（`credit`）を更新します。Heroのモバイル用画像も同じ撮影素材に更新します。
3. フッターの素材説明を更新します。必要に応じて `src/style.css` の `object-position` を調整します。
4. `npm run build` と `npm run check` を実行し、PC・スマートフォン幅で人物・手元の切れ方を確認します。
