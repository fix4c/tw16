import { onRequest as __api_reviews__id__js_onRequest } from "C:\\Users\\Administrator\\projects\\tw16\\functions\\api\\reviews\\[id].js"
import { onRequestPost as __api_ai_triage_js_onRequestPost } from "C:\\Users\\Administrator\\projects\\tw16\\functions\\api\\ai-triage.js"
import { onRequest as __api_debug_env_ts_onRequest } from "C:\\Users\\Administrator\\projects\\tw16\\functions\\api\\debug-env.ts"
import { onRequest as __api_rankings_js_onRequest } from "C:\\Users\\Administrator\\projects\\tw16\\functions\\api\\rankings.js"

export const routes = [
    {
      routePath: "/api/reviews/:id",
      mountPath: "/api/reviews",
      method: "",
      middlewares: [],
      modules: [__api_reviews__id__js_onRequest],
    },
  {
      routePath: "/api/ai-triage",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ai_triage_js_onRequestPost],
    },
  {
      routePath: "/api/debug-env",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_debug_env_ts_onRequest],
    },
  {
      routePath: "/api/rankings",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_rankings_js_onRequest],
    },
  ]