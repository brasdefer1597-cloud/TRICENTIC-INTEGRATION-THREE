# 🔪 SRAP - UNFILTERED REALITIES

**"Your heart wants to change the world, your body asks for rest, and your head knows that tomorrow it's time to pay the rent."**

---

SRAP is a gamified existential self-assessment platform. It combines brutal psychology, raw philosophy, and RPG game mechanics to create a personal growth system without self-deception.

Powered by **Google Gemini AI**, **Supabase**, and **React**, SRAP doesn't pat you on the back. It shows you the map of your internal battlefield and forces you to choose which center you are going to sacrifice today.

---

## TECH STACK

**Frontend:**
- React 19 + TypeScript
- TailwindCSS (dark, brutal, responsive design)
- Vite (ultra-fast build)

**Backend:**
- Supabase (Auth, Database, Edge Functions)
- PostgreSQL with RLS (Row Level Security)
- Supabase Edge Functions (Deno runtime)

**AI:**
- Google Gemini 2.0 Flash (cynical analysis in <2s)
- API key protected in the backend

**Gamification:**
- XP and levels system (1-10)
- Unlockable achievements
- Daily streak (streak tracking)
- Real-time progress dashboard

---

## INSTALLATION AND CONFIGURATION

### 1. Clone Repository
```bash
git clone https://github.com/your-user/srap-unfiltered-realities.git
cd srap-unfiltered-realities
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

The `GEMINI_API_KEY` must be configured in the **Supabase Edge Function Secrets**, not in `.env`.

### 4. Supabase Setup

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `Project URL` and `anon/public key` to your `.env`

#### B. Run Database Migration
Execute the SQL in the Supabase SQL Editor:
```sql
-- See full content in the migration file
-- (available in the project as supabase/migrations/...)
```

Or use the Supabase CLI:
```bash
supabase db push
```

#### C. Deploy Edge Function
The Edge Function `srap-analysis` is already created. To deploy it:
```bash
# (This is done automatically via MCP tools in development)
```

#### D. Configure Gemini API Key
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Configure it as a secret in Supabase:
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

### 5. Run in Development
```bash
# npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Build for Production
```bash
npm run build
npm run preview  # Build preview
```

---

## ARCHITECTURE

See `ARCHITECTURE.md` for the full technical blueprint.

**Simplified Flow:**
```
User completes exam
  ↓
Frontend sends request to Edge Function
  ↓
Edge Function calls Gemini API (secure key)
  ↓
AI analyzes with brutal prompt
  ↓
Response is saved in Supabase
  ↓
XP, levels, and achievements are updated
  ↓
Dashboard refreshes with new progress
```

---

## SRAP PHILOSOPHY

### The 3 Centers

1. **HEAD** (Mind/Control)
   - Promises: Total control
   - Demands: Accept chaos and act anyway

2. **HEART** (Emotion/Meaning)
   - Promises: Purpose and sense
   - Demands: Tolerate emptiness and build sense

3. **BODY** (Physical/Pleasure)
   - Promises: Constant pleasure
   - Demands: Endure pain and move anyway

### The Principle of Sacrifice

There is no "perfect balance". Every day you must consciously choose which center to sacrifice so that the other two survive. SRAP forces you to admit that choice without self-deception.

### Existential Gamification

- **Base XP:** 50 per assessment
- **Streak Bonus:** +10 XP per consecutive day
- **Levels:** 1 to 10 (from "Lost Novice" to "Supreme Decoder")
- **Achievements:** From "First Blood" to "Master of Reality"

Progress is measurable. Reality is quantifiable. Self-deception, impossible.

---

## FEATURES

- Daily assessments of the 3 centers
- Brutal and direct AI analysis
- Gamified progress system
- Full assessment history
- Statistics dashboard
- Daily streak with bonuses
- Unlockable achievements
- Micro-interactions and visual feedback
- Responsive design (mobile-first)
- Default dark mode (reality is not bright)

---

## SECURITY

- **Row Level Security (RLS)** in all tables
- Gemini API key never exposed in the frontend
- Authentication via Supabase Auth
- Data validation in frontend and backend
- CORS correctly configured in Edge Functions

---

## DEPLOYMENT

### Vercel (Recommended for Frontend)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Supabase Edge Functions
Already deployed automatically via MCP tools.

---

## CONTRIBUTING

This project is born from the **SRAP Chalamandra Master methodology**. If you want to contribute:

1. Fork the repository
2. Create a branch with your feature
3. Make sure the build passes
4. Submit a PR with a brutal description of changes

Contribution principles:
- Clean and modular code
- No technical self-deception
- No unnecessary features
- Reality > Illusion

---

## LICENSE

MIT License. Use, modify, destroy. Reality has no copyright.

---

## CONTACT AND CREDITS

**Created by:** Senior SRAP Team (Master Chalamandra Decoder)

**Technologies:**
- React Team
- Supabase Team
- Google Gemini Team
- Tailwind Labs

**Philosophy:**
- Gurdjieff (The 3 Centers)
- Nietzsche (Raw realities)
- Estoicismo (Active acceptance)
- RPG Mechanics (Measurable gamification)

---

**REMEMBER:** This is not a "high vibe" app. It is a triage simulator for the soul. If you are looking for comfort, go somewhere else. If you seek measurable truth, welcome to SRAP.


## PROJECT STRUCTURE (OPTIMIZED)

```bash
src/
  pages/
    HomePage.tsx
  components/
    sections/
    features/
      exam/
      gamification/
      tricentric/
    ui/
  hooks/
  lib/
  styles/
  types/
```

## VERCEL NOTES

- `vercel.json` is included for Vite-compatible output (`dist`).
- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables.
- Build command: `npm run build`.
- (Optional but recommended) define `VITE_SITE_URL` in Vercel for canonical/social absolute URLs.


## UX + SEO IMPLEMENTATION

- Accessibility and UX:
  - Skip-link to main content.
  - Keyboard-visible focus states.
  - Reduced-motion support (`prefers-reduced-motion`).
  - Accessible modal behavior (`role=dialog`, ESC key, overlay close).
  - `aria-live` loading states.
- SEO:
  - Dynamic SEO tags in app runtime (`title`, `description`, OpenGraph, Twitter, canonical).
  - Static SEO baseline in `index.html`.
  - `robots.txt`, `sitemap.xml`, `site.webmanifest`.
  - Share image at `public/og-image.svg`.

