export const onRequest = async (context: any) => {
  const env = context.env;
  return new Response(JSON.stringify({
    hasGeminiKey: !!env.GEMINI_API_KEY,
    hasTurnstileSecret: !!env.TURNSTILE_SECRET_KEY,
  }), {
    headers: { "Content-Type": "application/json" },
  });
};