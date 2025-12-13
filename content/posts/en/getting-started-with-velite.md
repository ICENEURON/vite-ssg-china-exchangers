---
title: Getting Started with Velite
slug: getting-started-with-velite
date: 2024-03-20
excerpt: Learn how to integrate Velite into your Vite project for type-safe content management.
metaTitle: "Velite Tutorial: Type-Safe Content for Vite"
metaDescription: "A step-by-step guide to setting up Velite for managing markdown content in Vite projects."
keywords: ["Velite", "Vite", "Content Management", "TypeScript"]
cover: /static/content_posts_image/getting-started-with-velite/cover.png
---

# Getting Started with Velite

Velite is a powerful tool for managing content in your Vite projects. It converts Markdown, MDX, YAML, and JSON files into type-safe data that you can import directly into your application.

## Installation

To get started, install Velite:

```bash
pnpm add -D velite
```

## Configuration

Create a `velite.config.ts` file in your project root:

```ts
import { defineConfig, defineCollection, s } from 'velite'

export default defineConfig({
  // ... configuration
})
```

## Usage

Import your content directly:

```ts
import { posts } from '.velite'
```

Enjoy type-safe content!
