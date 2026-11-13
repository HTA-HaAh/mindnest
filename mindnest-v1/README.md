# MINDNEST V1.0 — MVP

MINDNEST is a personal growth web app for emotional check-ins, structured reflection, journaling and AI-assisted conversation.

## Included
- MoodMap Pro: 10 emotion labels, intensity and energy scales, context tags, notes, history and 7-day chart.
- Untangle Flow: 7-step structured reflection saved as sessions.
- Mindy AI: server-side OpenAI-compatible chat endpoint; safe demo fallback when no API key is configured.
- My Growth: milestones and personal progress counters.
- Personal Insights: transparent, rule-based summaries from the user's last 7 days of mood entries.
- Daily Reflection: gratitude, challenge and tomorrow prompts.
- Profile: local display name, JSON export and local data deletion.
- Responsive premium UI.

## Requirements
- Node.js 20.9+
- npm

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

The app works in local mode without Supabase or AI credentials. Local mode stores data in the current browser's localStorage. It is suitable for prototyping and personal testing, **not multi-device sync or production storage**.

## Enable real AI
Add to `.env.local`:
```env
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```
Restart the dev server. The key is only read by the server route `/api/chat`; never prefix it with `NEXT_PUBLIC_`. The app sends the current conversation messages to the configured provider when the user sends a message. Do not enter sensitive identifying information. Review provider retention and data-processing terms before enabling this for real users.

## Enable Supabase (production integration setup)
1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy Project URL and anon key to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Configure authentication providers and redirect URLs in Supabase.
5. Implement and test the authenticated data repository before migrating real user data.

**Important implementation status:** This starter includes the Supabase browser client helper and a production-oriented SQL schema with Row Level Security policies. The current UI deliberately runs in local mode and does not yet switch its CRUD operations to Supabase or provide a complete sign-in/sign-up flow. Do not treat adding the environment variables alone as enabling production authentication or cloud sync. Those need a dedicated integration and security test pass.

## Before public launch
- Implement Supabase Auth screens, session middleware and server-side authorization.
- Replace localStorage repository with user-scoped Supabase CRUD.
- Add rate limiting, abuse controls, request logging without sensitive content, and AI usage budgets.
- Add consent controls for AI processing, retention and account deletion workflows.
- Perform privacy, security, accessibility and crisis-response reviews.
- Test RLS with at least two separate user accounts.
- Add a vetted local crisis-support directory for each launch market.

## Project structure
```
src/
  app/
    api/chat/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/MindnestApp.tsx
  lib/
    insights.ts
    storage.ts
    supabase.ts
    types.ts
supabase/schema.sql
```

## Product safety
MINDNEST is a self-reflection and wellbeing tool, not a medical device, therapist or emergency service. Insights are descriptive patterns from user-entered data and must not be presented as diagnoses.

## Enable account login and cloud sync (Supabase Free)

The app now includes an email/password account panel and a user-scoped cloud sync adapter.

1. Create a Supabase project on the Free plan at https://supabase.com/dashboard.
2. Open **SQL Editor → New query**, paste and run the complete contents of `supabase/cloud-storage.sql`.
3. Open **Project Settings → API** and copy the Project URL and `anon` / publishable key.
4. In Vercel, open this project → **Settings → Environment Variables**. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon/publishable key
5. Apply the variables to Production (and Preview if desired), save, then redeploy.
6. In Supabase **Authentication → URL Configuration**, set the Site URL to your deployed Vercel URL and add that URL to Redirect URLs.
7. Open MINDNEST, choose **Account → Đăng ký**, confirm the email if confirmation is enabled, then sign in.

Only the public anon/publishable key belongs in the browser. Never put a Supabase service-role key or an AI provider secret in a `NEXT_PUBLIC_*` variable.

Cloud data is stored as a per-user JSONB record in `public.user_data`. Row Level Security policies restrict read/write access to the authenticated owner. The SQL migration is in `supabase/cloud-storage.sql`.

**Important:** The Supabase browser account and cloud sync implementation is an MVP integration. It has not yet been built or tested in a live Supabase/Vercel environment. Before inviting the public, test registration, email confirmation, login, logout, data sync across two browsers, account isolation with two separate users, and account deletion. Do not store crisis notes or highly sensitive identifying information until a privacy/security review is complete.

Supabase Free currently includes a small database and file-storage allowance; free projects may pause after a period of inactivity. Vercel Hobby is limited to personal/non-commercial use. Review the current provider terms and quotas before operating a public service at scale.
