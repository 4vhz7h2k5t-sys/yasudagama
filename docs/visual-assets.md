# 独自ビジュアル

作成方法：組み込み `image_gen`。公式素材は使用していません。公開用にWebP化・縮小し、生成元PNGを変更せず、以下に保存しています。

- `public/images/pottery-wheel.webp`（1400px、98,272 bytes）
- `public/images/pottery-wheel-mobile.webp`（760px、36,510 bytes）
- `public/images/handbuilding.webp`（1400px、105,004 bytes）
- `public/images/pizza.webp`（1400px、201,762 bytes）

生成素材は実在の施設・人物・作品を再現する目的で制作していません。サイト上でもその旨を示します。

## 最終プロンプト

### 電動ろくろ / Hero

Use case: photorealistic-natural. Asset type: wide editorial website hero photograph for a Japanese pottery workshop concept demo. Primary request: beautiful close-up of two adult hands shaping a small soft wet clay bowl on an electric pottery wheel, candid tactile craft moment, fingers anatomically accurate and naturally placed inside and outside the bowl. Generic unidentifiable workshop, not a depiction of an actual named business. Scene: warm dark rustic pottery studio, rich blurred shelves and a hint of soft leafy outdoor light in the distant background. Composition: landscape 3:2, hands and bowl dominate the central and right portions, camera near tabletop with side angle, no faces, no text. Soft late-afternoon side lighting, muted terracotta and warm charcoal, earthy stone beige clay, pale linen apron, detailed concentric wheel rings, fine water droplets, subtle analog grain, high-end Japanese craft magazine art direction. Authentic warm welcoming feel, restrained natural color, deep shadows with soft highlights. No logos, no watermark, no writing, no collage, no decorative graphics.

### 手びねり

Use case: photorealistic-natural. Asset type: landscape editorial pottery website photograph. Close view of an adult's hands gently pinching and coiling a small irregular handmade clay cup on a worn light wooden worktable, not on an electric wheel. Tactile natural beige clay with clearly visible clay coils, linen sleeves, quiet unidentifiable Japanese craft workshop. Cropped at forearms, no faces. Side sunlight, oatmeal and clay brown palette, subtle film grain, high-end craft magazine photography, beautifully imperfect artisan feel, authentic fingers, shallow depth of field. Landscape 3:2. No text, logo, watermark. Generic illustrative scene, not a real named studio.

### ピザ

Use case: photorealistic-natural. Asset type: landscape editorial pottery and pizza workshop website photograph. Freshly baked rustic margherita pizza with basil on a wooden board at the mouth of a generic rustic brick wood-fired pizza oven, a small warm fire glowing out of focus at the far back, tactile pale weathered brick and warm terracotta stone. Soft natural daylight, appetizing authentic handcrafted pizza, golden blistered crust, restrained warm palette, craft lifestyle magazine editorial photography, landscape 3:2. No text, logos, watermark, people, collage. Generic concept visual, not a real named workshop.

## コードで制作した素材

器のマーク（`public/favicon.svg` と `scripts/pages.mjs`）、里山と2つの器のイラスト、土→器→焼成→釉薬の操作型SVGは、このデモのためのオリジナルです。
