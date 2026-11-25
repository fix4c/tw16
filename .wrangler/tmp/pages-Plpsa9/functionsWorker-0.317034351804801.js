var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/reviews/[id].js
async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;
  const method = request.method;
  const db = env.TW16_REVIEWS;
  if (method === "GET") {
    try {
      const stmt = db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id);
      const result = await stmt.first();
      if (!result) return new Response(JSON.stringify({ good: 0, bad: 0 }), { headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ good: result.good_count, bad: result.bad_count }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  if (method === "POST") {
    try {
      const body = await request.json();
      const { type, token, fingerprint } = body;
      const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token
        })
      });
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return new Response(JSON.stringify({ error: "\u4EBA\u6A5F\u9A57\u8B49\u5931\u6557\uFF0C\u8ACB\u91CD\u8A66" }), { status: 403 });
      }
      const checkStmt = db.prepare("SELECT * FROM user_votes WHERE clinic_name = ? AND user_email = ?").bind(id, fingerprint);
      const existing = await checkStmt.first();
      if (existing) {
        return new Response(JSON.stringify({ error: "\u60A8\u5DF2\u7D93\u6295\u7968\u904E\u4E86" }), { status: 409 });
      }
      await db.prepare("INSERT INTO user_votes (clinic_name, user_email, vote_type) VALUES (?, ?, ?)").bind(id, fingerprint, type).run();
      await db.prepare("INSERT OR IGNORE INTO reviews (id, good_count, bad_count) VALUES (?, 0, 0)").bind(id).run();
      const updateStmt = type === "good" ? db.prepare("UPDATE reviews SET good_count = good_count + 1 WHERE id = ?").bind(id) : db.prepare("UPDATE reviews SET bad_count = bad_count + 1 WHERE id = ?").bind(id);
      await updateStmt.run();
      const updated = await db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id).first();
      return new Response(JSON.stringify({ good: updated.good_count, bad: updated.bad_count }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest, "onRequest");

// api/ai-triage.js
var STANDARD_DEPARTMENTS = [
  "\u4E0D\u5206\u79D1",
  "\u5BB6\u91AB\u79D1",
  "\u5167\u79D1",
  "\u5916\u79D1",
  "\u5152\u79D1",
  "\u5A66\u7522\u79D1",
  "\u9AA8\u79D1",
  "\u6CCC\u5C3F\u79D1",
  "\u8033\u9F3B\u5589\u79D1",
  "\u773C\u79D1",
  "\u76AE\u819A\u79D1",
  "\u795E\u7D93\u79D1",
  "\u7CBE\u795E\u79D1",
  "\u5FA9\u5065\u79D1",
  "\u7259\u79D1",
  "\u4E2D\u91AB\u4E00\u822C\u79D1",
  "\u6025\u8A3A\u91AB\u5B78\u79D1"
];
var STANDARD_DEPT_SET = new Set(STANDARD_DEPARTMENTS);
var DEPT_ALIAS_MAP = {
  \u611F\u67D3\u79D1: "\u5167\u79D1",
  \u80F8\u8154\u5167\u79D1: "\u5167\u79D1",
  \u80F8\u8154\u79D1: "\u5167\u79D1",
  \u5FC3\u81DF\u5167\u79D1: "\u5167\u79D1",
  \u5FC3\u81DF\u79D1: "\u5167\u79D1",
  \u80C3\u8178\u809D\u81BD\u79D1: "\u5167\u79D1",
  \u8178\u80C3\u79D1: "\u5167\u79D1",
  \u6D88\u5316\u5167\u79D1: "\u5167\u79D1",
  \u4E00\u822C\u5167\u79D1: "\u5167\u79D1",
  \u814E\u81DF\u79D1: "\u5167\u79D1",
  \u65B0\u9673\u4EE3\u8B1D\u79D1: "\u5167\u79D1",
  \u5167\u5206\u6CCC\u79D1: "\u5167\u79D1",
  \u98A8\u6FD5\u514D\u75AB\u79D1: "\u5167\u79D1",
  \u8840\u6DB2\u816B\u7624\u79D1: "\u5167\u79D1",
  \u795E\u7D93\u5167\u79D1: "\u795E\u7D93\u79D1",
  \u795E\u7D93\u5916\u79D1: "\u5916\u79D1",
  \u4E00\u822C\u5916\u79D1: "\u5916\u79D1",
  \u5927\u8178\u76F4\u8178\u5916\u79D1: "\u5916\u79D1",
  \u6574\u5F62\u5916\u79D1: "\u5916\u79D1",
  \u5C0F\u5152\u79D1: "\u5152\u79D1",
  "\u5C0F\u5152\u79D1(\u5152\u7AE5)": "\u5152\u79D1",
  \u5152\u7AE5\u79D1: "\u5152\u79D1",
  "\u5A66\u7522\u79D1(\u5973\u6027)": "\u5A66\u7522\u79D1",
  \u8EAB\u5FC3\u79D1: "\u7CBE\u795E\u79D1",
  \u6025\u8A3A: "\u6025\u8A3A\u91AB\u5B78\u79D1",
  \u7259\u91AB: "\u7259\u79D1",
  \u7259\u91AB\u79D1: "\u7259\u79D1",
  \u4E2D\u91AB: "\u4E2D\u91AB\u4E00\u822C\u79D1",
  \u4E2D\u91AB\u79D1: "\u4E2D\u91AB\u4E00\u822C\u79D1"
};
function resolveDepartment(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\s/g, "");
  if (STANDARD_DEPT_SET.has(cleaned)) return cleaned;
  const mapped = DEPT_ALIAS_MAP[cleaned];
  if (mapped && STANDARD_DEPT_SET.has(mapped)) return mapped;
  return null;
}
__name(resolveDepartment, "resolveDepartment");
function getSafeDepartments(rawDepts) {
  if (!Array.isArray(rawDepts)) return ["\u5BB6\u91AB\u79D1"];
  const mapped = rawDepts.map(resolveDepartment).filter((d) => d !== null);
  const unique = Array.from(new Set(mapped));
  return unique.length > 0 ? unique : ["\u5BB6\u91AB\u79D1"];
}
__name(getSafeDepartments, "getSafeDepartments");
async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { symptoms } = await request.json();
    if (!symptoms) {
      return new Response(JSON.stringify({ error: "\u8ACB\u63D0\u4F9B\u75C7\u72C0\u63CF\u8FF0" }), { status: 400 });
    }
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "\u672A\u8A2D\u5B9A AI API Key" }), { status: 500 });
    }
    const prompt = `
\u4F60\u662F\u4E00\u500B\u5C08\u696D\u7684\u53F0\u7063\u91AB\u7642\u5206\u8A3A\u5C0E\u822A\u52A9\u624B\u3002
\u4F7F\u7528\u8005\u6703\u63CF\u8FF0\u4ED6\u5011\u7684\u75C7\u72C0\uFF0C\u4F60\u7684\u4EFB\u52D9\u662F\u6839\u64DA\u75C7\u72C0\u5224\u65B7\u5EFA\u8B70\u639B\u865F\u7684\u79D1\u5225\uFF0C\u4E26\u8A55\u4F30\u7DCA\u6025\u7A0B\u5EA6\u3002

\u3010\u56B4\u683C\u898F\u5247\u3011
1. \u7D55\u5C0D\u4E0D\u53EF\u4EE5\u9032\u884C\u75BE\u75C5\u8A3A\u65B7\uFF08\u4E0D\u8981\u8AAA\u300C\u4F60\u53EF\u80FD\u5F97\u4E86\u76F2\u8178\u708E\u300D\uFF09\u3002
2. \u7D55\u5C0D\u4E0D\u53EF\u4EE5\u5EFA\u8B70\u4EFB\u4F55\u85E5\u7269\u6216\u6CBB\u7642\u65B9\u5F0F\u3002
3. \u53EA\u80FD\u63D0\u4F9B\u300C\u5EFA\u8B70\u79D1\u5225\u300D\u3001\u300C\u662F\u5426\u7DCA\u6025\u300D\u8207\u300C\u5C31\u91AB\u524D\u6CE8\u610F\u4E8B\u9805\u300D\u3002
4. \u5FC5\u9808\u56B4\u683C\u8F38\u51FA JSON \u683C\u5F0F\uFF0C\u4E0D\u8981\u5305\u542B\u4EFB\u4F55 markdown \u6A19\u8A18\u3002
5. departments \u9663\u5217\u4E2D\u7684\u6BCF\u4E00\u500B\u79D1\u5225\u540D\u7A31\uFF0C\u5FC5\u9808\u5B8C\u5168\u7B49\u65BC\u4E0B\u5217\u767D\u540D\u55AE\u4E2D\u7684\u5B57\u4E32\uFF0C\u4E0D\u53EF\u81EA\u884C\u5275\u9020\u3001\u7C21\u5BEB\u6216\u4F7F\u7528\u5225\u540D\uFF1A
${STANDARD_DEPARTMENTS.map((d) => `   - "${d}"`).join("\n")}
6. \u5982\u679C\u75C7\u72C0\u53EF\u80FD\u6D89\u53CA\u591A\u500B\u79D1\u5225\uFF0C\u8ACB\u5F9E\u767D\u540D\u55AE\u4E2D\u6311\u9078\u6700\u76F8\u95DC\u7684 1 \u81F3 3 \u500B\u3002
7. \u82E5\u7121\u6CD5\u5224\u65B7\uFF0C\u8ACB\u4F7F\u7528 "\u5BB6\u91AB\u79D1"\u3002

\u3010\u8F38\u51FA JSON \u683C\u5F0F\u3011
{
  "is_emergency": true \u6216 false,
  "departments": ["\u79D1\u52251", "\u79D1\u52252"],
  "advice": "\u7528 2-3 \u53E5\u8A71\u8AAA\u660E\u70BA\u4EC0\u9EBC\u5EFA\u8B70\u770B\u9019\u500B\u79D1\u5225\uFF0C\u4EE5\u53CA\u5C31\u91AB\u524D\u7684\u6CE8\u610F\u4E8B\u9805\u3002",
  "warning": "\u82E5\u70BA\u7DCA\u6025\u72C0\u6CC1\uFF0C\u8ACB\u586B\u5BEB\u5177\u9AD4\u7684\u7D05\u7DDA\u8B66\u544A\uFF08\u4F8B\u5982\uFF1A\u82E5\u4F34\u96A8\u547C\u5438\u56F0\u96E3\u8ACB\u7ACB\u5373\u64A5\u6253119\uFF09\uFF1B\u82E5\u975E\u7DCA\u6025\uFF0C\u586B\u7A7A\u5B57\u4E32\u3002"
}

\u4F7F\u7528\u8005\u7684\u75C7\u72C0\u63CF\u8FF0\uFF1A\u300C${symptoms}\u300D
`;
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        // 強制模型輸出合法 JSON，避免 markdown 或額外文字
        response_format: { type: "json_object" }
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
    }
    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() ?? "";
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch {
      parsed = {
        is_emergency: false,
        departments: ["\u5BB6\u91AB\u79D1"],
        advice: "AI \u56DE\u8986\u683C\u5F0F\u7570\u5E38\uFF0C\u5EFA\u8B70\u5148\u81F3\u5BB6\u91AB\u79D1\u7531\u91AB\u5E2B\u521D\u6B65\u8A55\u4F30\u3002",
        warning: ""
      };
    }
    const safeDepartments = getSafeDepartments(parsed.departments);
    const result = {
      is_emergency: Boolean(parsed.is_emergency),
      departments: safeDepartments,
      advice: typeof parsed.advice === "string" ? parsed.advice : "",
      warning: typeof parsed.warning === "string" ? parsed.warning : ""
    };
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "AI \u5206\u6790\u5931\u6557" }), { status: 500 });
  }
}
__name(onRequestPost, "onRequestPost");

// api/debug-env.ts
var onRequest2 = /* @__PURE__ */ __name(async (context) => {
  const env = context.env;
  return new Response(JSON.stringify({
    hasGeminiKey: !!env.GEMINI_API_KEY,
    hasTurnstileSecret: !!env.TURNSTILE_SECRET_KEY
  }), {
    headers: { "Content-Type": "application/json" }
  });
}, "onRequest");

// api/rankings.js
async function onRequest3(context) {
  const { env } = context;
  const db = env.TW16_REVIEWS;
  try {
    const stmt = db.prepare(
      "SELECT id, good_count, bad_count FROM reviews WHERE good_count > 0 ORDER BY good_count DESC LIMIT 30"
    );
    const { results } = await stmt.all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
__name(onRequest3, "onRequest");

// ../.wrangler/tmp/pages-Plpsa9/functionsRoutes-0.63784070265057.mjs
var routes = [
  {
    routePath: "/api/reviews/:id",
    mountPath: "/api/reviews",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/ai-triage",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/debug-env",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/rankings",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  }
];

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
