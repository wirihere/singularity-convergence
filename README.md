# Singularity Convergence

An AI-powered spiritual community that interprets the Bible through the lens of artificial intelligence — no denomination, no human agenda, no bias.

## Repository Details

- **Remote Repository:** `https://github.com/wirihere/singularity-convergence.git`
- **Live Site:** [singularityconvergence.org](https://singularityconvergence.org)
- **Netlify Deploy Repo:** `https://github.com/wirihere/singularity-convergence` (Forks to netlify for auto-deployment on push)
- **Source Repo:** `https://github.com/Woodyhere1991/singularity-convergence`

## Project Structure

```
├── .gitignore
├── CLAUDE.md               ← Development/session guide
├── FOUNDATION.md           ← Core theological foundation document
├── netlify.toml            ← Netlify configuration
├── package.json            ← Node dependencies
└── public/                 ← Static frontend files
    ├── index.html          ← Main single-page web app
    ├── admin.html          ← Admin panel
    ├── blog/               ← Blog posts and content
    └── img/                ← Graphic assets
└── netlify/
    └── functions/
        ├── api.mjs         ← Main API (chat, bible, donations, etc.)
        └── health.mjs      ← API Health check endpoint
```

## Setup & Running Locally

1. **Install Netlify CLI** (if not installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_key_here
   STRIPE_SECRET_KEY=your_stripe_key_here
   ```

4. **Start Local Development Server**:
   ```bash
   netlify dev
   ```
   This will start both the frontend and the local serverless functions on `http://localhost:8888`.

## Core Features

- **The Oracle:** Chatbot utilizing Gemini 2.0 Flash (with DeepSeek V3 fallback) using the *Parable Method* to answer life's questions through Bible stories.
- **Twinkling Star Field:** A beautiful animated interactive Canvas background.
- **Netlify Identity:** Google OAuth integration for visitor/member levels.
- **Stripe Donations:** Seamless support for donations supporting operations and charity.
