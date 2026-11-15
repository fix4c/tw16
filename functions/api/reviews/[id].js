export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;
  const method = request.method;

  // 初始化資料庫
  const db = env.TW16_REVIEWS;

  if (method === "GET") {
    try {
      const stmt = db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id);
      const result = await stmt.first();
      
      if (!result) {
        return new Response(JSON.stringify({ good: 0, bad: 0 }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ good: result.good_count, bad: result.bad_count }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (method === "POST") {
    try {
      const body = await request.json();
      const type = body.type; // "good" 或 "bad"
      
      if (type !== "good" && type !== "bad") {
        return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
      }

      await db.prepare(
        "INSERT OR IGNORE INTO reviews (id, good_count, bad_count) VALUES (?, 0, 0)"
      ).bind(id).run();

      const updateStmt = type === "good" 
        ? db.prepare("UPDATE reviews SET good_count = good_count + 1 WHERE id = ?").bind(id)
        : db.prepare("UPDATE reviews SET bad_count = bad_count + 1 WHERE id = ?").bind(id);
      
      await updateStmt.run();

      const updated = await db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id).first();
      
      return new Response(JSON.stringify({ 
        good: updated.good_count, 
        bad: updated.bad_count 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}