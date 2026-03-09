---
title: "適用於可擴展應用程式的高階 TypeScript 模式"
slug: advanced-typescript-patterns
date: 2024-03-25
author: "John Doe"
reviewer: "Jane Smith"
readTime: 3 minutes
excerpt: "深入探討高階 TypeScript 功能，如 Conditional Types、Mapped Types 與 Utility Types，以編寫更健壯且易於維護的程式碼。"
metaTitle: "精通高階 TypeScript 模式 - 2024 指南"
metaDescription: "學習如何使用 TypeScript 的高階功能，包含 Conditional Types、Mapped Types 與 Template Literal Types，以建立可擴展的應用程式。"
keywords: ["TypeScript", "Advanced", "Generics", "Utility Types"]
cover: /static/content_posts_image/advanced-typescript-patterns/cover.png
---

## 1. Conditional Types (條件型別)

Conditional Types 允許您根據其他型別來建立新的型別。它們的語法類似於 JavaScript 中的三元運算子：`T extends U ? X : Y`。

### 範例：提取回傳型別

一個常見的使用情境是提取函式的回傳型別。TypeScript 提供了內建的 `ReturnType<T>` 實用工具，但我們來看看如何使用 Conditional Types 自行實作它。

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = MyReturnType<typeof getUser>;
// type User = { id: number; name: string }
```

在這個例子中，`infer R` 允許我們捕捉函式簽章的回傳型別，並將其用在條件型別的為真分支 (true branch) 中。

## 2. Mapped Types (映射型別)

Mapped Types 允許您透過迭代現有型別的屬性來建立新的型別。這對於建立介面 (interface) 的各種變體非常有用，例如將所有屬性設為可選 (optional) 或唯讀 (readonly)。

### 範例：建立靈活的配置

假設您有一個設定物件，其中所有欄位都是必填的，但您希望允許部分更新。

```typescript
interface AppConfig {
  theme: 'light' | 'dark';
  notifications: boolean;
  version: string;
}

// 內建的 Partial<T> 底部使用了 Mapped Types
type UpdateConfig = {
  [K in keyof AppConfig]?: AppConfig[K];
};

function updateSettings(settings: UpdateConfig) {
  // ...
}

updateSettings({ theme: 'dark' }); // 合法 (Valid)
```

您也可以新增或移除修飾詞。例如，若要讓所有屬性變成可變的（移除 `readonly`）：

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

## 3. Template Literal Types (模板字面量型別)

Template Literal Types 建立在字串字面量型別 (string literal types) 之上，並能夠透過聯集 (unions) 展開成多個字串。它們與 JavaScript 中的模板字面量字串語法相同，但是用於型別宣告的位置。

### 範例：產生事件名稱

如果您正在建立一個事件系統，您可以自動強制執行命名規則。

```typescript
type Entity = 'User' | 'Post' | 'Comment';
type Action = 'create' | 'update' | 'delete';

type EventName = `${Entity}:${Action}`;
// type EventName = "User:create" | "User:update" | "User:delete" | ...
```

這可確保您在整個應用程式中只能發送有效的事件，並在編譯時捕捉錯字 (typos)。

## 4. Discriminated Unions (可辨識聯集)

Discriminated Unions 是一種模式，您可以使用一個常見的字面量屬性（「判別式」）來縮小聯集型別的範圍。這對於以型別安全的方式處理不同狀態或訊息類型來說至關重要。

### 範例：處理 API 回應

```typescript
interface SuccessState {
  status: 'success';
  data: { id: string; value: number };
}

interface ErrorState {
  status: 'error';
  error: string;
}

interface LoadingState {
  status: 'loading';
}

type ApiResponse = SuccessState | ErrorState | LoadingState;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      // TypeScript 在此知道 response 是 SuccessState
      console.log(response.data.value);
      break;
    case 'error':
      // TypeScript 在此知道 response 是 ErrorState
      console.error(response.error);
      break;
    case 'loading':
      console.log('請稍候...');
      break;
  }
}
```

## 結論

精通這些高階的 TypeScript 模式，能讓您直接在型別系統中表達複雜的邏輯與限制。這不僅能讓程式碼更安全，也能達到自我文件的效果。在您持續建立可擴展應用程式的過程中，請尋找機會利用這些工具來減少執行階段的錯誤，並提高開發效率。
