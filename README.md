# Trail Transit Planner

公共交通で登山に行くユーザー向けの、登山アクセス計画支援MVPです。

## Features

- 山名検索と人気の山一覧
- 山ごとの入山口・下山口選択
- 山行日、登山開始希望時刻、下山予定時刻、自宅最寄り駅の入力
- 往路・復路の固定サンプル公共交通ルート表示
- 終バス時刻と終バスリスク判定
- YAMAP転記用サマリー
- Google Maps確認リンク
- LINE共有リンク
- 注意文とサポート導線

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- 外部APIなし
- 外部DBなし
- ログインなし

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## 山・登山口データの追加

外部DBを使わないMVPのため、データはコード内の固定データで管理しています。

1. 山を追加する場合は `data/mountains.ts` に追加
2. 入山口・下山口を追加する場合は `data/trailheads.ts` に追加
3. 山と入山口・下山口の対応は `data/mountainTrailheads.ts` に追加
4. 下山時の終バス時刻は `data/busSchedules.ts` に追加
5. 公共交通ルートの基本形は `data/sampleRoutes.ts` と `lib/getSampleRoute.ts` で調整
