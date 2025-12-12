---
title: Velite 入门指南
slug: getting-started-with-velite
date: 2024-03-20
excerpt: 学习如何在 Vite 项目中集成 Velite 以实现类型安全的内容管理。
metaTitle: "Velite 教程：Vite 的类型安全内容管理"
metaDescription: "在 Vite 项目中配置 Velite 管理 Markdown 内容的分步指南。"
keywords: ["Velite", "Vite", "内容管理", "TypeScript"]
---

# Velite 入门指南

Velite 是一个强大的工具，用于在 Vite 项目中管理内容。它可以将 Markdown、MDX、YAML 和 JSON 文件转换为类型安全的数据，您可以直接将其导入到应用程序中。

## 安装

要开始使用，请安装 Velite：

```bash
pnpm add -D velite
```

## 配置

在项目根目录下创建一个 `velite.config.ts` 文件：

```ts
import { defineConfig, defineCollection, s } from 'velite'

export default defineConfig({
  // ... 配置
})
```

## 用法

直接导入您的内容：

```ts
import { posts } from '.velite'
```

享受类型安全的内容带来的便利吧！
