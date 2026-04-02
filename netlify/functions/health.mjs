// Health check endpoint — pinged by uptime monitors
// Tests: function runtime, API key present, OpenRouter reachable, Bible API reachable

export default async (req, context) => {
  const start = Date.now();
  const checks = {
    timestamp: new Date().toISOString(),
    function: "ok",
    apiKey: !!process.env.OPENROUTER_API_KEY ? "ok" : "MISSING",
    openrouter: "checking...",
    bibleApi: "checking...",
  };

  // Test OpenRouter
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` },
    });
    checks.openrouter = res.ok ? "ok" : `error: ${res.status}`;
  } catch (err) {
    checks.openrouter = `error: ${err.message}`;
  }

  // Test Bible API
  try {
    const res = await fetch("https://bible-api.com/John+3:16?translation=kjv");
    checks.bibleApi = res.ok ? "ok" : `error: ${res.status}`;
  } catch (err) {
    checks.bibleApi = `error: ${err.message}`;
  }

  checks.responseTime = `${Date.now() - start}ms`;
  const allOk = checks.apiKey === "ok" && checks.openrouter === "ok" && checks.bibleApi === "ok";
  checks.status = allOk ? "healthy" : "degraded";

  return new Response(JSON.stringify(checks, null, 2), {
    status: allOk ? 200 : 503,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/api/health",
};
