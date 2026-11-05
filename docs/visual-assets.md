# 陶器の立体と展示用CG

ブラウザーの陶器とBlenderの静止画は、共通の断面データ `src/profiles.json` から制作しています。保田窯の実物・設備を再現したものではありません。

- `src/ceramics.js` は断面から厚みのある立体メッシュを組み立てます。成形時は粘土と器の断面を補間し、ろくろ台を回します。
- 陶器の色、ろくろ目、粒子、釉薬の境目はブラウザー内でテクスチャーに描画します。釉薬によって色と反射の粗さが変わります。
- `assets-source/render-studio.py` はBlender Cyclesで静止画をレンダリングします。窓を模した面光源と、器ごとの釉薬、素地の質感を設定しています。

公開用のWebPは `public/images/studio-bowl.webp`、`studio-cup.webp`、`studio-plate.webp`、`studio-collection.webp` です。読み込み中やWebGLが利用できない環境にも静止画を表示します。

再レンダリングはリポジトリ直下で以下を実行し、出力PNGを透過WebPに変換します。

```sh
Blender -b --factory-startup --python assets-source/render-studio.py -- /tmp/yasudagama-renders
```
