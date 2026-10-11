# Coffee Journey

図解とクイズで、コーヒーの産地・精製・焙煎・抽出を学ぶ初心者向けPWAです。学習進捗と抽出記録はブラウザ内に保存されます。

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
