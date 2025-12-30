# 💪 パーソナルトレーナーアプリ MVP

無料テンプレート＋チケット課金でAIメニュー生成するフィットネスアプリ

## 機能

### 無料
- テンプレートメニュー閲覧（6カテゴリ）
- レベル別調整（初心者/中級/上級）

### 有料（チケット消費）
- AIカスタムメニュー生成
- 目標・時間・場所・制約に対応

## 技術スタック

| Frontend | Backend |
|----------|---------|
| React Native (Expo) | Node.js + Express |
| TypeScript | TypeScript |
| Zustand | Prisma + SQLite |
| React Navigation | - |

## 起動方法

### Backend
```bash
cd backend
npm install
echo 'DATABASE_URL="file:./dev.db"' > .env
npm run db:generate
npm run db:push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

## API

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | /auth/anonymous | ユーザー作成 |
| GET | /tickets/balance | 残高確認 |
| POST | /generate | AI生成 |
| GET | /workouts | 履歴一覧 |

## 今後の拡張
- [ ] 実LLM統合（OpenAI/Claude）
- [ ] Apple/Googleログイン
- [ ] App内課金（IAP）
- [ ] App Store公開

## 注意
このアプリは医療アドバイスではありません。

