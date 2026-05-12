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
5. 山ごとの代表アクセスは `data/accessPlans.ts` に追加
6. まだ実用アクセスが未整備の山は `data/sampleRoutes.ts` と `lib/getSampleRoute.ts` の固定サンプルにフォールバック

### 高尾山のように実用アクセスを追加する手順

1. 公式時刻表URLを確認する
2. `data/trailheads.ts` に登山口・駅・バス停を登録する
3. `data/mountainTrailheads.ts` に入山口候補と下山口候補を紐付ける
4. `data/busSchedules.ts` に下山時に使う停留所の終バス・終電目安、方面、公式URL、確認日を入れる
5. `data/accessPlans.ts` に `mountainId + entryTrailheadId + exitTrailheadId` ごとの往路・復路ステップを作る
6. ステップごとに `lineName`、`operator`、`durationMinutes`、`waitBeforeMinutes`、`timetableUrl` を入れる
7. `npm run lint` と `npm run build` で確認する
