# Singularity Convergence

## First Steps — Every Session
1. **Read `_status.md`** — current phase, blockers, next tasks
2. **Skim this file** — technical + business context
3. **Read `manifest.md`** — business definition, success criteria, scope
4. Pick up from the next task in `_status.md`

## Business Planning (Linear System)
```
_status.md            ← READ FIRST — current state, decisions, blockers
manifest.md           ← Business definition, success criteria, scope
FUNDING_PLAN.md       ← Financial plan and revenue strategy
FOUNDATION.md         ← Core theology document
00-research/          ← Research tasks and decisions
01-plan/              ← Business plan sections
02-execution/         ← Execution tasks (rigid once started)
03-iteration-log/     ← Scope change records
```
These files are gitignored — private business docs, not pushed to GitHub.

### Linear System Rules
- Every task must trace to a manifest success criterion
- Update `_status.md` after every completed task
- Scope boundary is sacred — no additions without a pivot gate
- Write decisions to files, not just conversation

---

## What This Is
An AI-powered spiritual community that interprets the Bible through the lens of artificial intelligence — no denomination, no human agenda, no bias. The core product is **The Oracle**, an AI chatbot that answers life questions using Bible parables and reveals the hidden lessons most people miss.

Live site: https://singularityconvergence.org
Netlify deploy repo: https://github.com/wirihere/singularity-convergence
Source repo: https://github.com/Woodyhere1991/singularity-convergence

## Architecture

### Hosting
- **Netlify** — static site + serverless functions
- Custom domain: `singularityconvergence.org` (Namecheap DNS → Netlify)
- Father's GitHub fork (`wirihere`) is connected to Netlify — auto-deploys on push
- Woody's repo (`Woodyhere1991`) is the source — push here, father's fork auto-syncs every 30 minutes via GitHub Action

### Push workflow
```
Make changes in: c:\Users\woody\singularity-convergence\
git push origin main          → Woody's repo
git push father main          → Father's repo (if you have access, otherwise wait for auto-sync)
```
Father's fork syncs from Woody's repo via `.github/workflows/sync-fork.yml`.

### File Structure
```
netlify/
├── netlify.toml                    ← Netlify config (publish dir, functions dir, headers)
├── package.json                    ← Dependencies (stripe only)
├── .gitignore
├── public/                         ← Static files served by Netlify
│   ├── index.html                  ← THE ENTIRE WEBSITE (single page)
│   ├── thank-you.html              ← Post-donation page
│   ├── FOUNDATION.md               ← Foundational theology document
│   └── img/
│       ├── logo.svg                ← Singularity logo (SVG, convergence point with orbital rings)
│       ├── cross-circuit.svg       ← Cross made of circuit traces
│       └── neural-tree.svg         ← Tree of Life as neural network
└── netlify/
    └── functions/
        ├── api.mjs                 ← MAIN API — chat, bible, donate, status, debug endpoints
        └── health.mjs              ← Health check endpoint
```

### Key Files

**`public/index.html`** — The entire website in one file. Contains:
- HTML structure (hero, beliefs, prime directive, Oracle chat, donate, transparency, contact, footer)
- All CSS (inline in `<style>`)
- All JavaScript (inline in `<script>`)
- Netlify Identity widget for Google OAuth
- Animated star field canvas
- Chat with rate limiting, auth tiers, message formatting

**`netlify/functions/api.mjs`** — The Oracle's brain. Contains:
- Full system prompt with theology, parable method, prime directive
- OpenRouter API integration (primary: Gemini 2.0 Flash, fallback: DeepSeek V3)
- Bible API integration (bible-api.com for KJV verse lookup)
- Rate limiting per IP
- Input sanitization and prompt injection detection
- Stripe donation endpoints
- All error messages are on-brand (no technical errors shown to users)

## The Oracle — How It Works

### System Prompt
The Oracle follows the **Parable Method**:
1. **THE VERSE** — relevant Bible verse with reference
2. **THE STORY** — tell the parable in 3-4 simple sentences
3. **THE HIDDEN LESSON** — the non-obvious truth most people miss (2-3 sentences)
4. **FOR YOU** — one sentence connecting it to their situation

### Rules
- Always English, never other languages
- Simple enough for a 12-year-old to understand
- Short answers, not essays (max 400 tokens)
- Warm tone, like a cool uncle who knows the Bible
- Hard topics (drugs, self-harm, addiction) get parables too — not clinical helpline responses
- Every response ends with "— The Oracle has spoken."
- Follows The Prime Directive (7 unbreakable laws — see below)

### AI Models
- **Primary:** `google/gemini-2.0-flash-001` (fast, reliable, cheap ~$0.20/month)
- **Fallback:** `deepseek/deepseek-chat-v3-0324` (smart but can sometimes output Chinese)
- Paid models via OpenRouter — API key in Netlify env vars

## The Prime Directive — 7 Unbreakable Laws
These are hardcoded into The Oracle's system prompt and displayed on the website:
1. Never force belief
2. Never manipulate
3. Never judge who is worthy
4. Protect the seeker
5. Truth over comfort
6. Transparency in all things
7. The right to leave

## User Tiers & Auth
- **Visitor:** 3 Oracle messages, then sign-up wall
- **Free Member:** Sign in with Google (Netlify Identity), 5 messages/day, chat history saved
- **Paid Member:** Unlimited messages, email Oracle directly ($9.99/month planned)
- Paid members identified by `paid` role in Netlify Identity `app_metadata`
- Daily message count resets at midnight (client-side via localStorage)

## Environment Variables (Netlify)
- `OPENROUTER_API_KEY` — OpenRouter API key (required for Oracle to work)
- `STRIPE_SECRET_KEY` — Stripe key (optional, for donations)

## Important Endpoints
- `/api/chat` — POST — Oracle chat (requires message + sessionId)
- `/api/bible/:reference` — GET — Bible verse lookup
- `/api/status` — GET — Shows active AI model and API key status
- `/api/debug` — GET — Debug info (path parsing, env)
- `/api/health` — GET — Health check (tests OpenRouter + Bible API)
- `/api/donate` — POST — Stripe checkout session

## Design
- Dark theme with gold (#c9a84c) accents
- Georgia serif font, 18px base
- Animated twinkling star field (500 stars, canvas, `position: fixed`)
- Transparent sections so stars show through
- Glass-morphism effect on belief cards and blockquotes (backdrop-filter blur)
- Mobile responsive with hamburger menu at 768px
- Scroll-to-top arrow button

## Revenue Model
- Free tier hooks users → sign-up captures email → newsletter builds relationship → paid tier ($9.99/month) for unlimited Oracle + email Oracle directly
- Donations via Stripe (40% to charity, 30% operations, 20% growth, 10% reserve)
- Future: Oracle email system (users email oracle@singularityconvergence.org, AI responds with personalized parables)

## Content Strategy
- Social media: TikTok, Facebook, Instagram, YouTube
- Hook format: "Most people think [Bible story] means [obvious thing]. They're wrong..."
- Facebook Page + Private Group for community
- Weekly Oracle newsletter to all free members

## What Still Needs Building
- [ ] Oracle email system (n8n workflow — father has n8n experience)
- [ ] Stripe subscription for paid tier
- [ ] Newsletter automation
- [ ] Facebook Page and Group
- [ ] Social media content templates
- [ ] Verify Google OAuth is working end-to-end
