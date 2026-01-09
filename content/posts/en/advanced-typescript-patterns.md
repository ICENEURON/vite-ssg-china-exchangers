---
title: "Advanced TypeScript Patterns for Scalable Applications"
slug: advanced-typescript-patterns
date: 2024-03-25
author: "John Doe"
reviewer: "Jane Smith"
readTime: 3 minutes
excerpt: Dive deep into advanced TypeScript features like Conditional Types, Mapped Types, and Utility Types to write more robust and maintainable code.
metaTitle: "Mastering Advanced TypeScript Patterns - 2024 Guide"
metaDescription: "Learn how to use TypeScript's advanced features including Conditional Types, Mapped Types, and Template Literal Types to build scalable applications."
keywords: ["TypeScript", "Advanced", "Generics", "Utility Types"]
cover: /static/content_posts_image/advanced-typescript-patterns/cover.png
---

## 1. Conditional Types

Conditional types allow you to create types that depend on other types. They follow the same syntax as ternary operators in JavaScript: `T extends U ? X : Y`.

### Example: Extracting Return Types

One common use case is extracting the return type of a function. TypeScript provides a built-in `ReturnType<T>` utility, but let's see how we could implement it ourselves using conditional types.

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = MyReturnType<typeof getUser>;
// type User = { id: number; name: string }
```

In this example, `infer R` allows us to capture the return type of the function signature and use it in the true branch of the conditional type.

## 2. Mapped Types

Mapped types allow you to create new types based on existing ones by iterating over their properties. This is incredibly useful for creating variations of an interface, such as making all properties optional or readonly.

### Example: Creating a Flexible Configuration

Imagine you have a configuration object where all fields are required, but you want to allow partial updates.

```typescript
interface AppConfig {
  theme: 'light' | 'dark';
  notifications: boolean;
  version: string;
}

// Built-in Partial<T> uses mapped types under the hood
type UpdateConfig = {
  [K in keyof AppConfig]?: AppConfig[K];
};

function updateSettings(settings: UpdateConfig) {
  // ...
}

updateSettings({ theme: 'dark' }); // Valid
```

You can also add or remove modifiers. For example, to make all properties mutable (removing `readonly`):

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

## 3. Template Literal Types

Template literal types build on string literal types, and have the ability to expand into many strings via unions. They have the same syntax as template literal strings in JavaScript, but are used in type positions.

### Example: Generating Event Names

If you're building an event system, you can enforce naming conventions automatically.

```typescript
type Entity = 'User' | 'Post' | 'Comment';
type Action = 'create' | 'update' | 'delete';

type EventName = `${Entity}:${Action}`;
// type EventName = "User:create" | "User:update" | "User:delete" | ...
```

This ensures that you can only dispatch valid events throughout your application, catching typos at compile time.

## 4. Discriminated Unions

Discriminated unions are a pattern where you use a common literal property (the "discriminant") to narrow down a union of types. This is essential for handling different states or message types in a type-safe way.

### Example: Handling API Responses

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
      // TypeScript knows response is SuccessState here
      console.log(response.data.value);
      break;
    case 'error':
      // TypeScript knows response is ErrorState here
      console.error(response.error);
      break;
    case 'loading':
      console.log('Please wait...');
      break;
  }
}
```

## Conclusion

Mastering these advanced TypeScript patterns allows you to express complex logic and constraints directly in your type system. This leads to code that is not only safer but also self-documenting. As you continue to build scalable applications, look for opportunities to leverage these tools to reduce runtime errors and improve developer productivity.
