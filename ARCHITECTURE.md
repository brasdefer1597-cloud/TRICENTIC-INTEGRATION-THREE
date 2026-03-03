# SRAP ARCHITECTURE - TECHNICAL BLUEPRINT

## OVERVIEW

SRAP is a gamified existential self-assessment platform that combines brutal psychology, raw philosophy, and game mechanics to create a personal growth system without self-deception.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                    │
│  ├─ HeaderSection          (UI: Branding)                       │
│  ├─ GamificationDashboard  (UI: Stats, Levels, XP)              │
│  ├─ TruthsSection          (Content: SRAP Philosophy)           │
│  ├─ ExamSection            (Logic: Core Evaluation Flow)        │
│  └─ BreathingSection       (UI: Micro-interaction)              │
│                                                                 │
│  Hooks:                                                         │
│  ├─ useProfile             (Data: User state)                   │
│  ├─ useGamification        (Logic: XP, Levels, Achievements)     │
│  └─ useAnalysis            (API: Gemini AI communication)       │
│                                                                 │
│  Lib:                                                           │
│  ├─ supabase.ts            (Client initialization)              │
│  └─ gamification.ts        (XP calculations, level logic)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                             │
├─────────────────────────────────────────────────────────────────┤
│  Authentication:                                                │
│  └─ Email/Password (RLS-protected)                             │
│                                                                 │
│  Database (PostgreSQL):                                         │
│  ├─ user_profiles       (Gamification state)                   │
│  ├─ evaluations         (Historical record)                    │
│  ├─ achievements        (Unlockable rewards)                   │
│  └─ user_achievements   (User progress tracking)               │
│                                                                 │
│  Edge Functions:                                                │
│  └─ srap-analysis       (Gemini AI proxy - API key secured)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  Google Gemini API:                                             │
│  └─ gemini-2.0-flash-exp (Brutal AI analysis)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## CRITICAL DATA FLOW

### 1. USER COMPLETES EXAM

```
User Input (ExamSection)
   ↓
[bleeding, sacrifice, oxygen, synthesis]
   ↓
useAnalysis.analyze()
   ↓
Edge Function: srap-analysis
   ↓
Gemini API (brutal prompt engineering)
   ↓
AI Response → Modal Display
   ↓
User clicks SAVE
   ↓
Supabase:
  ├─ Insert evaluation record
  ├─ Update user_profiles (XP, streak, level)
  └─ Check & unlock achievements
   ↓
refreshProfile() → Update UI
```

### 2. GAMIFICATION ENGINE

```
Profile Data:
  ├─ experience_points: 1250
  ├─ current_level: 4
  ├─ streak_days: 12
  └─ total_evaluations: 15

Calculations (gamification.ts):
  ├─ calculateLevel(xp) → Determines current level
  ├─ getXPForNextLevel(level) → Required XP
  └─ shouldUnlockAchievement() → Achievement logic

Display:
  └─ GamificationDashboard → Full visualization
```

---

## DIRECTORY STRUCTURE

```
/
├── components/
│   ├── ui/
│   │   ├── Modal.tsx           # Reusable dialog component
│   │   ├── LoadingSpinner.tsx  # Unified loading state
│   │   ├── ProgressBar.tsx     # Gamified progress bar
│   │   └── LevelBadge.tsx      # Level badge with animation
│   ├── HeaderSection.tsx       # Header with SRAP branding
│   ├── TruthsSection.tsx       # 3 centers philosophy
│   ├── ExamSection.tsx         # Core: Evaluation form
│   ├── BreathingSection.tsx    # Micro-interaction: Oxygen
│   └── GamificationDashboard.tsx # Stats dashboard
│
├── hooks/
│   ├── useProfile.ts           # Fetch & manage user profile
│   ├── useGamification.ts      # Calculate XP, levels, achievements
│   └── useAnalysis.ts          # Communicate with AI Edge Function
│
├── lib/
│   ├── supabase.ts             # Supabase client singleton
│   └── gamification.ts         # XP curves, level logic
│
├── types/
│   ├── index.ts                # Core TypeScript types
│   └── database.ts             # Supabase auto-generated types
│
├── supabase/
│   └── functions/
│       └── srap-analysis/
│           └── index.ts        # Edge Function: Gemini API proxy
│
├── App.tsx                     # Main app component
├── index.tsx                   # React entry point
├── index.html                  # HTML shell
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind + safelist
└── tsconfig.json               # TypeScript config
```

---

## IMPLEMENTED DESIGN PATTERNS

### 1. SEPARATION OF CONCERNS (SoC)
- **UI Components**: Rendering only, delegating logic to hooks
- **Hooks**: Encapsulate state and side effects
- **Lib**: Pure utilities, no side effects

### 2. SINGLE SOURCE OF TRUTH
- `supabase.auth` → Authentication state
- `user_profiles` → Gamification state
- `evaluations` → Immutable history

### 3. COMPOSITION OVER INHERITANCE
- Reusable atomic UI components
- Explicit props, no props drilling
- Custom hooks for shared logic

### 4. PROGRESSIVE ENHANCEMENT
- App works without auth (read-only mode)
- Gamification appears only if logged in
- Fallbacks on API errors

---

## SECURITY

### RLS (Row Level Security)
All tables have RLS enabled with restrictive policies:
- **SELECT**: Own data only (`auth.uid() = user_id`)
- **INSERT**: Create own records only
- **UPDATE**: Modify own data only
- **DELETE**: Blocked (data integrity)

### API Key Protection
- Gemini API key **never** exposed on frontend
- Managed via Edge Function on server
- User authenticated via JWT in requests

### Data Validation
- Strict TypeScript types
- Database constraints (CHECK, UNIQUE, FK)
- Input validation on frontend and backend

---

## GAMIFICATION: MECHANICS

### XP System
```typescript
Base XP: 50 per assessment
Streak Bonus: +10 XP per consecutive day
Achievement Bonus: Variable (50-1000 XP)

Level Curve:
Level 1: 0 XP
Level 2: 100 XP
Level 3: 250 XP
Level 4: 500 XP
Level 5: 850 XP
Level 6: 1300 XP
Level 7: 1900 XP
Level 8: 2700 XP
Level 9: 3750 XP
Level 10: 5000 XP (MAX)
```

### Available Achievements
1. **First Blood** (100 XP): Complete first exam
2. **Weekly Warrior** (200 XP): 7-day streak
3. **Monthly Survivor** (500 XP): 30-day streak
4. **SRAP Veteran** (300 XP): Reach level 5
5. **Master of Reality** (1000 XP): Reach level 10
6. **Decade of Decisions** (250 XP): 10 total assessments
7. **Brutal Honesty** (150 XP): Synthesis validated by AI

### Engagement Loops
- **Daily Streak**: Encourages daily use
- **Progress Bars**: Visual progress feedback
- **Achievement Unlocks**: Micro-rewards
- **Level Titles**: Social status (e.g., "Supreme Decoder")

---

## MICRO-INTERACTIONS

### Visual Feedback
- **Breathing Animation**: Indicates life, presence
- **Pulse Effect**: Critical buttons (ACCEPT REALITY)
- **Shimmer**: Moving progress bars
- **Scale In**: Modals with smooth entry
- **Fade In**: Section transitions

### Haptic Feedback (Conceptual)
- Click on center (bleeding/sacrifice) → Subtle vibration
- Achievement unlock → Sharp pulse
- Level up → Extended celebration

---

## DEPLOYMENT CHECKLIST

### Required Environment Variables
```bash
# Frontend (.env)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Backend (Supabase Secrets)
GEMINI_API_KEY=AIzaSy...
```

### Deployment Steps
1. Configure Supabase project
2. Run migration `create_srap_core_schema`
3. Deploy Edge Function `srap-analysis`
4. Configure Gemini API key in secrets
5. Build frontend: `npm run build`
6. Deploy to Vercel/Netlify

### Health Checks
- [ ] Database migrations applied
- [ ] Edge Function deployed
- [ ] API keys configured
- [ ] Successful build
- [ ] Auth working
- [ ] RLS policies active

---

## FUTURE IMPROVEMENTS (ROADMAP)

### Phase 2: Social
- Share anonymous assessments
- Compare stats with other users
- Leaderboard

### Phase 3: Analytics
- Trends dashboard (which center bleeds most?)
- Temporal progress charts
- AI predictions about patterns

### Phase 4: Expansion
- Export history to PDF
- Calendar integration
- Intelligent reminders

---

**CONCLUSION**: This architecture prioritizes **security**, **scalability**, and **engagement**. Every technical decision reinforces the SRAP philosophy: raw realities, no self-deception, with measurable progress.
