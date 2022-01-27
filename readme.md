# PIXI.js で黄金比のアニメーションを作る
https://yuki-sakaguchi.github.io/pixi-golden-spiral/goldenspiral/dist/index.html
https://user-images.githubusercontent.com/16290220/151393375-f6c3323e-8a87-463b-9aa3-aaf3cbbefdac.mov

## 参考
- https://www.creativecruise.nl/
- https://www.youtube.com/watch?v=czETLIAeAUU&list=WL&index=55&t=3414s

## やったこと
- 黄金比の計算
  - 黄金比に合わせて線を引く
  - 黄金比に合わせて画像を配置
  - 黄金比に合わせて回転アニメーション
- リサイズで再描画
- スクロールに合わせてアニメーションを動かす
- 無限スクロール

## まだできていないこと
- スマホ対応（自作は嫌なのでいい感じのライブラリを探したい）
- アニメーションのコンテナを分けて違うスピードのアニメーション（参考だと雲と川で違う速度）

## 実装
Parcelを使って以下のコマンドで実装できるようにしました
どこにおいても動くようにビルド時だけ相対パスにしてます

```bash
npm run dev   # parcel index.html
npm run build # parcel build index.html --public-url ./
```

parcel始めて使ったけどめっちゃ便利だった。
`import * as PIXI from 'pixi.js';` とか書いただけで `npm run dev` で勝手にインストールされる。
