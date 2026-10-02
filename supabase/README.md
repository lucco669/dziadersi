# Supabase: census, accounts and branded email

The project uses Supabase for these things:

- **Narodowy Spis Dziadersów** (`/spis`): every finished test is stored anonymously in `public.results`.
- **Profil Dziaderski** (`/konto`, `/profil`): magic-link accounts with saved results, species collection, field observations, bookmarks and badges.
- **Komisja Orzekająca** (`/czy-to-juz-dziaderstwo`): votes on curated cases, and a moderation queue of cases proposed by signed-in judges.
- **Mały Rocznik Statystyczny** (`/statystyki`): anonymous daily tallies (Rozmówki lines, bingo squares, horn presses…) and the aggregates of everything above.
- **Branded auth emails**: Supabase's Send Email Hook calls `/api/auth/email`, which renders the Institute's letters and sends them through Brevo.

## 1. Run the migrations

Open the Supabase dashboard → **SQL Editor** and run the files in `migrations/` in order, each as a whole:

1. `20261002130000_results.sql`: the anonymous results table and the three statistics functions (server-only).
2. `20261002130100_accounts.sql`: profiles, saved results, row-level security and the signup trigger.
3. `20261002160000_community.sql`: sightings, bookmarks (`saved_items`), verdicts, case submissions, tallies and the server-only functions `community_summary()`, `case_tally()` and `tally()`.

Until the third migration runs, the Atlas, the Komisja and the Rocznik show "·" (no information) instead of figures and nothing breaks.

Never edit a migration that has already run. Changes go into a new file with a later timestamp.

## 2. Environment variables

| Variable | Where | Type in Vercel |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API Keys | Config |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys (`sb_publishable_…`) | Config |
| `SUPABASE_SECRET_KEY` | Project Settings → API Keys (`sb_secret_…`) | Sensitive |
| `SEND_EMAIL_HOOK_SECRET` | Authentication → Hooks → Send Email (`v1,whsec_…`) | Sensitive |
| `BREVO_API_KEY` | Brevo → SMTP & API → API Keys (`xkeysib-…`) | Sensitive |
| `EMAIL_FROM` | optional, default `Instytut Badań nad Dziaderstwem <instytut@dziader.si>`; must be a verified Brevo sender | Config |
| `EMAIL_REPLY_TO` | optional: where replies to the letters go | Config |

Put the same values in `.env.local` for local development.

## 3. Brevo (the mailer)

1. In Brevo → Senders, Domains & Dedicated IPs → Domains, add `dziader.si` and add the DNS records Brevo shows (Brevo code, DKIM, and a DMARC record). Wait until the domain is authenticated.
2. Add `instytut@dziader.si` (or the address in `EMAIL_FROM`) as a sender.
3. Create an API key under SMTP & API → API Keys and put it in `BREVO_API_KEY`. If Brevo's IP restriction is on, allow Vercel's outbound IPs or turn the restriction off for this key.

## 4. The Send Email Hook

Authentication → **Hooks** → **Send Email hook** → Add:

- Type: **HTTPS**
- URL: `https://dziader.si/api/auth/email`
- Generate the secret, copy it into `SEND_EMAIL_HOOK_SECRET` (Vercel and `.env.local`), redeploy, then enable the hook.

From then on Supabase no longer sends its own emails: every login link, signup confirmation and address change goes through the Institute's templates (`src/emails/`). In development, `http://localhost:3000/api/auth/email?podglad=magiclink` shows a letter in the browser (also `signup`, `email_change`, `reauthentication`, `email_changed_notification`).

For local testing of the hook itself, Supabase must reach your machine (a tunnel such as `cloudflared` or `ngrok`); otherwise test the flow on a Vercel preview with the hook pointing there.

## 5. Auth settings

- **Authentication → URL Configuration**
  - Site URL: `https://dziader.si`
  - Redirect URLs: `http://localhost:3000/**`, `https://dziader.si/**`, and the preview pattern, e.g. `https://*-<team>.vercel.app/**`
- **Authentication → Sign In / Providers → Email**: enabled, "Confirm email" on. Passwords are not used anywhere.
- Email OTP length: 6 is the default and what the letters are designed for (6–10 digits work).
- Rate limits (Authentication → Rate Limits): the defaults are fine; with the hook in place, Supabase's built-in email limit no longer applies.

## What is stored

- `public.results`: result code **without** the name, version, family-interview flag, score, diagnosed species, answers, optional voivodeship, retake flag with the previous score, time. No names, IPs or identifiers. Only the server (secret key) can read or write it.
- `public.profiles`: nickname per account.
- `public.saved_results`: result codes saved to a profile (with the name part, which is the owner's own data). Readable and deletable only by the owner.
- `public.sightings`: field observations per account: species, optional voivodeship, day. One per species per day. Owner-only through row-level security; published only as totals.
- `public.saved_items`: bookmarks per account (`rozmowki`, `bingo`, `egzamin`) with the item's code.
- `public.verdicts`: votes in the Komisja: case, verdict, and the account for signed-in judges (set to null when the account is deleted). Written by the server only.
- `public.case_submissions`: cases proposed by signed-in judges, with a status (`nowe`, `przyjete`, `odrzucone`). Nothing is published automatically: review them in the Table Editor, and change the status when you accept or reject one. The profile shows the status to the author.
- `public.tallies`: daily counters by kind, no identifiers. Server only.

Deleting an account (button in the profile) removes the auth user, which cascades to the profile, saved results, sightings, bookmarks and case submissions. Anonymous census rows and tallies stay, and verdicts stay without their owner.
