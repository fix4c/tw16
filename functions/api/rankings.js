export async function onRequest(context) {
  const { env } = context;
  const db = env.TW16_REVIEWS;

  try {
    // 查詢推薦數大於 0 的機構，按推薦數降序排列，取前 30 名
    const stmt = db.prepare(
      "SELECT id, good_count, bad_count FROM reviews WHERE good_count > 0 ORDER BY good_count DESC LIMIT 30"
    );
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}