# Coffee Journey

図解とクイズで、コーヒーの産地・精製・焙煎・抽出を学ぶ初心者向けPWAです。「コーヒーの基礎」「世界の豆と産地」「ハンドドリップ実践」の全56レッスン・384問を収録しています。学習進捗とコーヒー記録はブラウザ内に保存されます。

## ローカル起動

```bash
pnpm install
pnpm dev
```

## テストとビルド

```bash
pnpm test
pnpm build
```

## GitHub Pagesで公開

1. このフォルダをGitHubの新しいリポジトリへpushします。
2. リポジトリの **Settings → Pages → Build and deployment** で **GitHub Actions** を選びます。
3. `main` ブランチへのpush時に `.github/workflows/deploy.yml` がテスト、ビルド、公開を行います。

Viteの相対パス設定を使用しているため、ユーザーサイト・プロジェクトサイトのどちらでも動作します。

## データについて

- ログインや外部送信はありません。
- 記録は利用中のブラウザの `localStorage` に保存されます。
- 設定画面からJSON形式でバックアップ／復元できます。
- 教材は `src/curriculum` 内で段階・地域別に管理しています。
- 保存形式v3では教材バージョンとユーザーデータ形式を分離しています。
