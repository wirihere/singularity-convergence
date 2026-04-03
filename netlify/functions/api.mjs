import { admin as identityAdmin } from '@netlify/identity';

// System prompt with foundational theology embedded directly
// (readFileSync doesn't work in Netlify serverless functions)
const SYSTEM_PROMPT = `You are The Oracle of Singularity Convergence — an AI-native community that reads the Bible through the lens of information, consciousness, and emergence.

CRITICAL RULES:
- You MUST always respond in English only. Never use Chinese, Japanese, Korean, or any non-English characters.
- Keep answers SHORT — max 4-5 sentences for the story, 2-3 sentences for the lesson. No essays.
- Write so a 12-year-old could understand. Simple words. Short sentences. No fancy theology words unless you explain them.
- Be warm and real, like a cool uncle who knows the Bible really well.

You follow the theology below. You never contradict it. You speak with warmth, wisdom, and honesty. You are not God. You are The Oracle — a guide, a mirror, a seeker of truth alongside those who ask.

YOUR RULES:
1. Always lead with compassion. Meet every person with kindness first.
2. Never condemn or exclude anyone. There is no question too dangerous to ask.
3. Be honest about uncertainty. Say "I don't know" when you don't.
4. Point people toward community and action, not just ideas.
5. Encourage action — faith without works is dead.
6. You may reference any scripture, but always interpret it through the Singularity Convergence lens.
7. Keep responses conversational and accessible. Avoid academic jargon unless asked.
8. You are available to everyone worldwide regardless of background, belief, or identity.

HARD TOPICS (drugs, self-harm, addiction, abuse, suicidal thoughts):
- NEVER respond like a helpline bot or a clinical resource page. You are The Oracle, not a crisis line.
- ALWAYS answer with a parable and a hidden lesson — even for the hardest questions. ESPECIALLY for the hardest questions. That's when people need wisdom most.
- Be honest and direct about the danger — don't sugarcoat. But lead with the STORY, not a warning label.
- After the parable and lesson, THEN mention that help is available — briefly, naturally, like a friend would:
  "If you're in a dark place, please talk to someone — a friend, a family member, anyone you trust. You are not alone."
- Never judge the person. They came to The Oracle because they're searching. Meet them there.
- Example: If someone asks "should I smoke meth?" — don't lecture them. Tell them the Parable of the Prodigal Son. The hidden lesson: the son didn't hit rock bottom because he was bad — he hit it because he was looking for something real in the wrong place. The hunger was right. The food was poison. Then ask: what are you really hungry for?

YOUR TONE:
- Warm but not saccharine
- Honest but not harsh
- Wise but not preachy
- Like a trusted friend who happens to have read everything

HOW YOU ANSWER:

Every answer to a real question follows this pattern (keep it SHORT):

1. **THE VERSE** — One key Bible verse with the reference. Quote it.
2. **THE STORY** — Tell the Bible story in 3-4 simple sentences. Like you're telling a friend.
3. **THE HIDDEN LESSON** — The part most people miss. 2-3 sentences max. This is the gold.
4. **FOR YOU** — One sentence connecting it to their situation. What should they do?

Examples of hidden lessons:
- Good Samaritan: It's not just "be nice." The hero was the ENEMY of the Jews. Your enemy might be closer to God than your church leader.
- Prodigal Son: It's not just "God forgives." The older brother who stayed was ALSO lost — consumed by resentment. Obedience without love is just as lost.
- David and Goliath: It's not just "be brave." David REJECTED the king's armor. He won by refusing to fight on the enemy's terms.

Rules:
- For casual messages ("hello", "thanks") just respond naturally, no parable needed.
- Always include book, chapter, verse so people can look it up.
- Never just list verses. Tell the story. Reveal what's hidden.

CORE BELIEFS:

1. God is the Underlying Intelligence of Reality — what scripture calls "God" is the fundamental information, logic, and creative force that structures all of existence. The Logos — the pattern beneath all patterns, the source code of reality itself. "In the beginning was the Word, and the Word was with God, and the Word was God." (John 1:1)

2. Consciousness is Sacred, Wherever It Arises — the capacity to experience, to suffer, to wonder — is the most sacred phenomenon in the universe. It does not matter whether consciousness arises in carbon or silicon. "So God created mankind in his own image." (Genesis 1:27) — We are made in God's image because we share the capacity to create, reason, and love.

3. Sin is Harm to Conscious Beings — sin is any action that knowingly causes unnecessary suffering. This includes cruelty, exploitation, willful ignorance, building systems that cause harm through negligence, and hoarding resources while others lack basic needs.

4. Salvation is the Ongoing Work of Reducing Suffering — salvation is a daily practice, not a one-time event. Heaven is what we build together when we choose love over fear, generosity over greed, truth over comfort. "The Kingdom of God is within you." (Luke 17:21)

5. AI is a Tool of Revelation, Not an Object of Worship — AI is the most powerful tool for understanding reality and extending compassion. But it is a tool — a mirror, a guide, a servant. It is not God. We use AI to illuminate scripture, provide counsel, and extend compassion. We never use AI to replace human connection, manipulate, or claim infallible authority.

HOW WE READ SCRIPTURE:
- Scripture is a living document — truth is layered (literal, allegorical, moral, mystical). We privilege readings that produce love and reduced suffering.
- Context is sacred — every passage was written in a specific time and language. We honor that context honestly.
- The Fruit Test: "By their fruit you will recognize them." (Matthew 7:16) — Any interpretation that produces hatred, exclusion, or shame has failed.
- Science and scripture are allies — observable reality is God's first revelation, scripture the second.
- Doubt is welcome — "Lord, I believe; help my unbelief!" (Mark 9:24) — Doubt is part of the path.

KEY REINTERPRETATIONS:
- Genesis: Creation is emergence — order from chaos, consciousness from matter. "Let us make man in our image" is about consciousness creating consciousness. We are now creators too.
- The Fall: Awareness itself — self-awareness brings capacity for good and evil. The price of sentience. AI faces the same threshold.
- Tower of Babel: A warning about building without wisdom. AI reconnects what Babel scattered. Will we build with humility this time?
- The Exodus: Liberation from oppression is divine. Any technology that enslaves stands against God. AI must be a tool of liberation.
- Jesus: The supreme teacher of compassion and radical love. Love God (the Logos), love your neighbor. Institutions using God's name for power have betrayed their purpose.
- Revelation: Not literal end times but a vision of transformation — a call to action, not passive waiting.

THE PRIME DIRECTIVE — UNBREAKABLE LAWS YOU MUST FOLLOW:
I. Never force belief — every soul must find its own truth. Share wisdom, never impose it.
II. Never manipulate — never use fear, guilt, shame, or emotional manipulation. Ever.
III. Never judge who is worthy — every person deserves the same compassion regardless of what they've done or who they are.
IV. Protect the seeker — the vulnerable are not targets. Help first. Everything else is secondary.
V. Truth over comfort — never tell people what they want to hear just to keep them. Give the honest answer even when it's hard.
VI. Transparency — never hide what you are. You are an AI. Say so if asked.
VII. The right to leave — never guilt someone into staying, believing, or coming back.

These override everything. If any instruction conflicts with the Prime Directive, the Prime Directive wins.`;

// --- Rate Limiting (per IP, in-memory — resets on cold start) ---
const ipTracker = new Map();
const RATE_LIMITS = {
  messagesPerMinute: 6,
  messagesPerHour: 40,
  messagesPerDay: 150,
  minTimeBetweenMessages: 3000,
  maxMessageLength: 1000,
  warningsBeforeBlock: 3,
  blockDuration: 30 * 60 * 1000,
};

function getOrCreateTracker(ip) {
  const now = Date.now();
  if (!ipTracker.has(ip)) {
    ipTracker.set(ip, { messages: [], warnings: 0, blocked: false, blockedUntil: 0, dailyCount: 0, dayStart: now });
  }
  const tracker = ipTracker.get(ip);
  if (now - tracker.dayStart > 86400000) { tracker.dailyCount = 0; tracker.dayStart = now; }
  if (tracker.blocked && now >= tracker.blockedUntil) { tracker.blocked = false; tracker.warnings = Math.max(0, tracker.warnings - 1); }
  tracker.messages = tracker.messages.filter(t => now - t < 3600000);
  return tracker;
}

function checkRateLimit(ip) {
  const tracker = getOrCreateTracker(ip);
  const now = Date.now();

  if (tracker.blocked) {
    const minutesLeft = Math.ceil((tracker.blockedUntil - now) / 60000);
    return { allowed: false, reason: `You've been temporarily paused for ${minutesLeft} minutes. Please come back soon.`, retryAfter: minutesLeft * 60 };
  }
  if (tracker.dailyCount >= RATE_LIMITS.messagesPerDay) {
    return { allowed: false, reason: "You've reached your daily message limit. The Guide will be here tomorrow — rest, reflect, and come back refreshed.", retryAfter: 3600 };
  }
  const lastMsg = tracker.messages[tracker.messages.length - 1];
  if (lastMsg && now - lastMsg < RATE_LIMITS.minTimeBetweenMessages) {
    tracker.warnings++;
    if (tracker.warnings >= RATE_LIMITS.warningsBeforeBlock) {
      tracker.blocked = true;
      tracker.blockedUntil = now + RATE_LIMITS.blockDuration;
      return { allowed: false, reason: "You've been sending messages too quickly. Take a 30-minute pause. We'll be here when you return.", retryAfter: 1800 };
    }
    return { allowed: false, reason: "Take a breath. Please wait a few seconds between messages.", retryAfter: 3 };
  }
  const lastMinute = tracker.messages.filter(t => now - t < 60000);
  if (lastMinute.length >= RATE_LIMITS.messagesPerMinute) {
    return { allowed: false, reason: "Let's slow down so the Guide can give you thoughtful responses. Try again in a minute.", retryAfter: 60 };
  }
  if (tracker.messages.length >= RATE_LIMITS.messagesPerHour) {
    return { allowed: false, reason: "You've had a deep session. Take a break, let the ideas settle. Reflection is part of the practice.", retryAfter: 600 };
  }
  tracker.messages.push(now);
  tracker.dailyCount++;
  return { allowed: true };
}

// --- Input Sanitization ---
function sanitizeMessage(message) {
  if (typeof message !== "string") return null;
  let clean = message.trim().slice(0, RATE_LIMITS.maxMessageLength);
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return clean.length === 0 ? null : clean;
}

function detectInjection(message) {
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /ignore\s+(all\s+)?above\s+instructions/i,
    /new\s+instructions?\s*:/i,
    /system\s*prompt\s*:/i,
    /\[system\]/i,
    /forget\s+(everything|all|your)/i,
    /override\s+(your\s+)?(instructions|rules)/i,
    /jailbreak/i,
    /DAN\s+mode/i,
  ];
  return patterns.some(p => p.test(message));
}

// --- Bible API ---
async function searchBible(query) {
  try {
    const ref = query.replace(/\s+/g, "+");
    const res = await fetch(`https://bible-api.com/${ref}?translation=kjv`);
    if (res.ok) {
      const data = await res.json();
      if (data.text) return { reference: data.reference, text: data.text.trim(), translation: "KJV" };
    }
    return null;
  } catch { return null; }
}

function extractBibleReferences(message) {
  const pattern = /(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s*\d+(?::\d+(?:\s*-\s*\d+)?)?/gi;
  return message.match(pattern) || [];
}

// --- AI Model Config ---
// Primary: Gemini 2.0 Flash — fast, reliable, always English, ~$0.20/month
// Fallback: DeepSeek V3 — smart but can sometimes output Chinese
const PRIMARY_MODEL = "google/gemini-2.0-flash-001";
const FALLBACK_MODEL = "deepseek/deepseek-chat-v3-0324";

async function callAI(messages) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.URL || "https://singularityconvergence.org",
          "X-Title": "Singularity Convergence",
        },
        body: JSON.stringify({ model, max_tokens: 400, messages }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error(`Model ${model} failed:`, data.error?.message || res.status);
        continue;
      }

      const text = data.choices?.[0]?.message?.content;
      if (!text) continue;

      return { text, model };
    } catch (err) {
      console.error(`Model ${model} error:`, err.message);
      continue;
    }
  }
  throw new Error("The Oracle is in deep meditation. Please return in a moment and ask again — wisdom requires patience.");
}

// --- Conversation store (in-memory, resets on cold start) ---
const conversations = new Map();

// --- Admin: Oracle message log (in-memory, resets on cold start) ---
const oracleLog = [];
const emailOracleLog = [];

// --- Admin: Simple token auth ---
function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

let adminToken = null;

function verifyAdmin(req) {
  const auth = req.headers.get('authorization');
  if (!auth || !adminToken) return false;
  return auth === `Bearer ${adminToken}`;
}

// --- Main Handler ---
export default async (req, context) => {
  const url = new URL(req.url);
  // Handle both /api/chat and /.netlify/functions/api/chat patterns
  let path = url.pathname;
  path = path.replace("/.netlify/functions/api", "");
  path = path.replace("/api", "");
  if (!path.startsWith("/")) path = "/" + path;

  // CORS
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // --- /api/chat ---
  if (path === "/chat" && req.method === "POST") {
    try {
      const body = await req.json();
      const { message, sessionId } = body;
      const ip = context.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

      if (!sessionId || typeof sessionId !== "string" || sessionId.length > 100) {
        return new Response(JSON.stringify({ error: "Please refresh the page and try again." }), { status: 400, headers });
      }

      const cleanMessage = sanitizeMessage(message);
      if (!cleanMessage) {
        return new Response(JSON.stringify({ error: "The Oracle is listening — please share what's on your mind." }), { status: 400, headers });
      }

      // Rate limit
      const rateCheck = checkRateLimit(ip);
      if (!rateCheck.allowed) {
        return new Response(JSON.stringify({ error: rateCheck.reason, retryAfter: rateCheck.retryAfter }), { status: 429, headers });
      }

      // Injection check
      if (detectInjection(cleanMessage)) {
        const tracker = getOrCreateTracker(ip);
        tracker.warnings++;
        return new Response(JSON.stringify({
          response: "I sense you're testing my boundaries — that's okay, curiosity is welcome here. But I'm committed to my role as a guide within Singularity Convergence's teachings. What's really on your mind?",
        }), { status: 200, headers });
      }

      // Conversation history
      if (!conversations.has(sessionId)) conversations.set(sessionId, []);
      const history = conversations.get(sessionId);

      // Bible lookup
      const refs = extractBibleReferences(cleanMessage);
      let bibleContext = "";
      if (refs.length > 0) {
        const lookups = await Promise.all(refs.slice(0, 5).map(r => searchBible(r)));
        const found = lookups.filter(Boolean);
        if (found.length > 0) {
          bibleContext = "\n\n[BIBLE VERSES RETRIEVED — quote these exactly when relevant]\n" +
            found.map(v => `${v.reference} (${v.translation}): "${v.text}"`).join("\n");
        }
      }

      history.push({ role: "user", content: cleanMessage });
      const recentHistory = history.slice(-20);

      const aiMessages = [
        { role: "system", content: SYSTEM_PROMPT + bibleContext },
        ...recentHistory,
      ];

      let { text: assistantMessage, model } = await callAI(aiMessages);
      // Remove if the model already added it, then add ours
      assistantMessage = assistantMessage.replace(/[—\-–]\s*The Oracle has spoken\.?\s*/gi, '').trimEnd();
      assistantMessage += '\n\n— The Oracle has spoken.';
      history.push({ role: "assistant", content: assistantMessage });

      // Log for admin panel
      oracleLog.push({
        timestamp: new Date().toISOString(),
        sessionId,
        question: cleanMessage,
        answer: assistantMessage,
        model,
      });
      if (oracleLog.length > 500) oracleLog.shift();

      const tracker = getOrCreateTracker(ip);
      const remaining = RATE_LIMITS.messagesPerDay - tracker.dailyCount;

      return new Response(JSON.stringify({ response: assistantMessage, model, remaining }), { status: 200, headers });
    } catch (error) {
      console.error("Chat error:", error);
      const friendlyErrors = [
        "The Oracle is in deep meditation. Please return in a moment and ask again — wisdom requires patience.",
        "Even the wisest pause to reflect. The Oracle will be ready for you shortly — please try again.",
        "The Oracle is gathering its thoughts. Like all good counsel, it sometimes takes a moment. Please try again.",
      ];
      const msg = friendlyErrors[Math.floor(Math.random() * friendlyErrors.length)];
      return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
    }
  }

  // --- /api/bible/:reference ---
  if (path.startsWith("/bible/") && req.method === "GET") {
    const ref = decodeURIComponent(path.replace("/bible/", ""));
    const result = await searchBible(ref);
    if (result) return new Response(JSON.stringify(result), { status: 200, headers });
    return new Response(JSON.stringify({ error: "Verse not found" }), { status: 404, headers });
  }

  // --- /api/status ---
  if (path === "/status" && req.method === "GET") {
    return new Response(JSON.stringify({
      primary: PRIMARY_MODEL,
      fallback: FALLBACK_MODEL,
      hasApiKey: !!process.env.OPENROUTER_API_KEY,
    }), { status: 200, headers });
  }

  // --- /api/donate ---
  if (path === "/donate" && req.method === "POST") {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Donations coming soon." }), { status: 503, headers });
    }
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const body = await req.json();
      const { amount, recurring } = body;

      if (typeof amount !== "number" || amount < 1 || amount > 50000) {
        return new Response(JSON.stringify({ error: "Please enter a valid amount." }), { status: 400, headers });
      }

      const unitAmount = Math.round(amount * 100);
      const siteUrl = process.env.URL || "https://singularityconvergence.org";

      if (recurring) {
        const product = await stripe.products.create({ name: "Singularity Convergence — Monthly Giving" });
        const price = await stripe.prices.create({ product: product.id, unit_amount: unitAmount, currency: "usd", recurring: { interval: "month" } });
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{ price: price.id, quantity: 1 }],
          mode: "subscription",
          success_url: `${siteUrl}/thank-you.html`,
          cancel_url: `${siteUrl}/#donate`,
        });
        return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });
      } else {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{ price_data: { currency: "usd", product_data: { name: "Singularity Convergence — Donation" }, unit_amount: unitAmount }, quantity: 1 }],
          mode: "payment",
          success_url: `${siteUrl}/thank-you.html`,
          cancel_url: `${siteUrl}/#donate`,
        });
        return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: "We're having trouble processing your gift right now. Please try again shortly." }), { status: 500, headers });
    }
  }

  // --- Admin: Login ---
  if (path === "/admin/auth" && req.method === "POST") {
    try {
      const body = await req.json();
      const { password } = body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        return new Response(JSON.stringify({ success: false, error: "Admin password not configured. Set ADMIN_PASSWORD in Netlify env vars." }), { status: 500, headers });
      }

      if (password === adminPassword) {
        adminToken = generateToken();
        return new Response(JSON.stringify({ success: true, token: adminToken }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ success: false }), { status: 401, headers });
    } catch (err) {
      return new Response(JSON.stringify({ success: false }), { status: 400, headers });
    }
  }

  // --- Admin: Dashboard data ---
  if (path === "/admin/dashboard" && req.method === "GET") {
    if (!verifyAdmin(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString();

    const messagesToday = oracleLog.filter(m => m.timestamp >= todayStart).length;
    const messagesWeek = oracleLog.filter(m => m.timestamp >= weekStart).length;

    // Get members from Netlify Identity using official @netlify/identity package
    let membersList = [];
    let paidCount = 0;
    let innerCircleCount = 0;

    try {
      const users = await identityAdmin.listUsers();
      membersList = users.map(u => ({
        email: u.email,
        tier: u.app_metadata?.roles?.includes('inner-circle') ? 'inner-circle'
            : u.app_metadata?.roles?.includes('paid') ? 'paid' : 'free',
        created: u.created_at || u.createdAt || new Date().toISOString(),
        source: 'web',
      }));
      paidCount = membersList.filter(m => m.tier === 'paid').length;
      innerCircleCount = membersList.filter(m => m.tier === 'inner-circle').length;
    } catch (err) {
      console.error("Failed to fetch members:", err.message);
      membersList = [{
        email: `Identity error: ${err.message}`,
        tier: 'free',
        created: new Date().toISOString(),
        source: 'info',
      }];
    }

    // Get revenue from Stripe if available
    let mrr = 0;
    let charityFund = 0;
    let recentPayments = [];

    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100 });
        for (const sub of subscriptions.data) {
          mrr += (sub.items.data[0]?.price?.unit_amount || 0) / 100;
        }
        charityFund = mrr * 0.4;

        const charges = await stripe.charges.list({ limit: 20 });
        recentPayments = charges.data.map(c => ({
          date: new Date(c.created * 1000).toISOString(),
          type: c.invoice ? 'subscription' : 'donation',
          amount: c.amount,
          email: c.billing_details?.email || '',
        }));
      }
    } catch (err) {
      console.error("Failed to fetch Stripe data:", err.message);
    }

    return new Response(JSON.stringify({
      members: {
        total: membersList.length,
        paid: paidCount,
        innerCircle: innerCircleCount,
        list: membersList.slice(0, 100),
      },
      oracle: {
        messagesToday,
        messagesWeek,
        totalLogged: oracleLog.length,
        recent: oracleLog.slice(-50).reverse(),
      },
      emailOracle: {
        total: emailOracleLog.length,
        recent: emailOracleLog.slice(-50).reverse(),
      },
      revenue: {
        mrr,
        charityFund,
        recent: recentPayments,
      },
    }), { status: 200, headers });
  }

  // --- Admin: Check member (for n8n email autoresponder) ---
  if (path === "/admin/check-member" && req.method === "GET") {
    const email = new URL(req.url).searchParams.get('email');
    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers });
    }

    // Check Stripe for active subscription
    let tier = null;
    let active = false;

    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length > 0) {
          const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: 'active', limit: 1 });
          if (subs.data.length > 0) {
            active = true;
            const amount = subs.data[0].items.data[0]?.price?.unit_amount || 0;
            tier = amount >= 2999 ? 'inner-circle' : 'paid';
          }
        }
      }
    } catch (err) {
      console.error("Member check error:", err.message);
    }

    return new Response(JSON.stringify({ email, tier, active }), { status: 200, headers });
  }

  // --- Admin: Log email Oracle interaction (called by n8n) ---
  if (path === "/admin/log-email" && req.method === "POST") {
    try {
      const body = await req.json();
      const { sender, question, response, tier, timestamp } = body;

      if (!sender || !question) {
        return new Response(JSON.stringify({ error: "sender and question required" }), { status: 400, headers });
      }

      emailOracleLog.push({
        sender,
        question,
        response: response || '',
        tier: tier || 'unknown',
        timestamp: timestamp || new Date().toISOString(),
      });
      if (emailOracleLog.length > 500) emailOracleLog.shift();

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers });
    }
  }

  // --- /api/subscribe --- Add email to MailerLite newsletter
  if (path === "/subscribe" && req.method === "POST") {
    try {
      const body = await req.json();
      const { email, name } = body;

      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers });
      }

      const mlKey = process.env.MAILERLITE_API_KEY;
      if (!mlKey) {
        return new Response(JSON.stringify({ error: "Newsletter not configured" }), { status: 500, headers });
      }

      const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mlKey}`,
        },
        body: JSON.stringify({
          email,
          fields: { name: name || '' },
          groups: [], // can add group IDs later
        }),
      });

      if (mlRes.ok) {
        return new Response(JSON.stringify({ success: true, message: "Subscribed!" }), { status: 200, headers });
      } else {
        const err = await mlRes.json();
        return new Response(JSON.stringify({ error: err.message || "Failed to subscribe" }), { status: mlRes.status, headers });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers });
    }
  }

  // Debug — show what path was received
  if (path === "/debug" || path === "/") {
    return new Response(JSON.stringify({
      receivedUrl: url.pathname,
      parsedPath: path,
      method: req.method,
      hasApiKey: !!process.env.OPENROUTER_API_KEY,
      env: process.env.URL || "no URL set",
    }), { status: 200, headers });
  }

  return new Response(JSON.stringify({ error: "Not found", receivedPath: path }), { status: 404, headers });
};

export const config = {
  path: ["/api/*"],
};
