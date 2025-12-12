import { ViteReactSSG } from "vite-react-ssg";
import ProtectedRoute from "./routes/protected-route";
import PageLayout from "./layouts/page";
import { LanguageProvider } from "./context/language";
import { ROUTES, type RouteDef } from "./routes/config";
import { generateLocalizedRoutes } from "./utils/language-routing";
import "./index.css";
import "./i18n";
import type { RouteObject } from "react-router-dom";

// 检查是否启用认证功能
const enableAuth = import.meta.env.VITE_ENABLE_AUTH;

// 根据功能开关过滤路由
const activeRoutes = enableAuth
  ? ROUTES
  : ROUTES.filter((route) => route.nav !== "guest" && route.nav !== "auth");

// 生成本地化路由
const localizedRoutes = generateLocalizedRoutes(activeRoutes);

// 将自定义路由格式转换为 react-router RouteObject 格式
const createRouteObjects = (routes: RouteDef[], authType: "public" | "private") =>
  routes
    .filter((route) => route.auth === authType)
    .map((route) => ({
      path: route.path,
      Component: route.element,
    }));

const routes: RouteObject[] = [
  {
    element: <LanguageProvider />,
    children: [
      {
        element: <PageLayout />,
        children: [
          // 公共路由（无需认证）
          ...createRouteObjects(localizedRoutes, "public"),
          // 私有路由（仅在启用认证时包含，需要认证保护）
          ...(enableAuth
            ? [
                {
                  element: <ProtectedRoute />,
                  children: createRouteObjects(localizedRoutes, "private"),
                },
              ]
            : []),
        ],
      },
    ],
  },
];

export const createRoot = ViteReactSSG({ routes });
