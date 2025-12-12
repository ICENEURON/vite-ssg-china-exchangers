---
title: Velite 入門ガイド
slug: getting-started-with-velite
date: 2024-03-20
excerpt: Vite プロジェクトに Velite を統合して、タイプセーフなコンテンツ管理を実現する方法を学びます。
metaTitle: "Velite チュートリアル: Vite 用のタイプセーフなコンテンツ"
metaDescription: "Vite プロジェクトで Markdown コンテンツを管理するための Velite のセットアップに関するステップバイステップガイド。"
keywords: ["Velite", "Vite", "コンテンツ管理", "TypeScript"]
---

# Velite 入門ガイド

Velite は、Vite プロジェクトでコンテンツを管理するための強力なツールです。Markdown、MDX、YAML、JSON ファイルをタイプセーフなデータに変換し、アプリケーションに直接インポートできます。

## インストール

開始するには、Velite をインストールします。

```bash
pnpm add -D velite
```

## 設定

プロジェクトのルートに `velite.config.ts` ファイルを作成します。

```ts
import { defineConfig, defineCollection, s } from 'velite'

export default defineConfig({
  // ... 設定
})
```

## 使い方

コンテンツを直接インポートします。

```ts
import { posts } from '.velite'
```

タイプセーフなコンテンツをお楽しみください！
