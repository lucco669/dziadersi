# Supabase: census, accounts and branded email

The project uses Supabase for these things:

- **Narodowy Spis Dziadersów** (`/spis`): every finished test is stored anonymously in `public.results`.
- **Profil Dziaderski** (`/konto`, `/profil`): email/password and Google accounts, with email-link sign-in retained, saved results, species collection, field observations, bookmarks and badges.
- **Komisja Orzekająca** (`/czy-to-juz-dziaderstwo`): votes on curated cases, and a moderation queue of cases proposed by signed-in judges.
- **Mały Rocznik Statystyczny** (`/statystyki`): anonymous daily tallies (Rozmówki lines, bingo squares, horn presses…) and the aggregates of everything above.
- **Branded auth emails**: Supabase's Send Email Hook calls `/api/auth/email`, which renders the Institute's letters and sends them through Brevo.

## 1. Run the migrations

Open the Supabase dashboard → **SQL Editor** and run the files in `migrations/` in order, each as a whole:

1. `20261002130000_results.sql`: the anonymous results table and the three statistics functions (server-only).
2. `20261002130100_accounts.sql`: profiles, saved results, row-level security and the signup trigger.
3. `20261002160000_community.sql`: sightings, bookmarks (`saved_items`), verdicts, case submissions, tallies and the server-only functions `community_summary()`, `case_tally()` and `tally()`.

4. `20261002190000_bulletin_calendar.sql`: the newsletter and honour-board opt-ins on `profiles`, `calendar_pages`, `bulletin_issues`, and `sightings_map()`, `honor_board()`, `weekly_summary()`, `newsletter_recipients()`.

Until a migration runs, the pages that depend on it show "·" (no information) instead of figures and nothing breaks.

5. `20261003100000_groups_and_write_limits.sql`: stable family invitations, atomic membership limits, submission idempotency and database-backed write budgets. **Apply this before deploying the new API handlers.** Their writes return 503 if the budget function is unavailable; result calculation remains independent of the database.

Family invitations are private by possession of an unguessable link, not by account membership. Members explicitly see that signatures and results are shared with link holders. Links expire after 90 days. `/api/cron/porzadki` removes expired groups (with their members) and stale budget rows daily, authorised by `CRON_SECRET`. Configure that secret even if the newsletter is disabled. Existing `/grupa/…` snapshot links still work.

Write budgets use a daily HMAC of Vercel's trusted `x-vercel-forwarded-for` header and retain no raw IP. The existing Supabase secret keys the HMAC. See [Vercel request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for). Local and non-Vercel deployments share a conservative fallback bucket; configure a trusted edge identity before moving production to another host. The database limiter is not a substitute for the deployment firewall: verify Vercel's managed DDoS protection and application firewall settings before promotion.

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
| `CRON_SECRET` | any long random string; Vercel Cron sends it to `/api/cron/biuletyn`, and it signs unsubscribe links | Sensitive |

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

From then on Supabase no longer sends its own emails: every login link, signup confirmation, password recovery and address change goes through the Institute's templates (`src/emails/`). In development, `http://localhost:3000/api/auth/email?podglad=magiclink` shows a letter in the browser (also `signup`, `recovery`, `email_change`, `reauthentication`, `password_changed_notification`, `email_changed_notification`); add `&jezyk=sl` for the Slovenian letter.

Letters go out in the reader's edition. New email flows use `/auth/callback?flow=email&jezyk=…&dalej=…`; the hook unwraps that callback and reads the destination's edition (`/sl/…` is Slovenian). Legacy direct destinations still work. Otherwise it uses account metadata, `jezyk`, which sign-in and subscribing to the bulletin keep up to date. Nothing stored means Polish. The redirect allow list below covers the callback and Slovenian addresses.

The built-in Supabase mailer also works with the callback, using PKCE: open its confirmation/recovery links in the browser that requested them. The branded hook uses `/auth/potwierdz` and token hashes, so its links work on another device too. Deploy the updated email hook together with the new account forms.

For local testing of the hook itself, Supabase must reach your machine (a tunnel such as `cloudflared` or `ngrok`); otherwise test the flow on a Vercel preview with the hook pointing there.

## 5. Auth settings

- **Authentication → URL Configuration**
  - Site URL: `https://dziader.si`
  - Redirect URLs: `http://localhost:3000/**` and `https://dziader.si/**`. No `vercel.app` wildcard: anyone can name a Vercel project so that its address matches a pattern such as `https://*-<team>.vercel.app/**`, and a password-reset link would then lead there. To test sign-in on a preview, add that preview's exact address and remove it afterwards. The application trusts only production, localhost and the deployment's own addresses (`VERCEL_URL`, `VERCEL_BRANCH_URL`), so letters sent by the production hook for a preview link to production; the code in them works on the preview.
- **Authentication → Sign In / Providers → Email**: enabled, "Confirm email" on. Set the minimum password length to **8** to match the forms (the application accepts 8–128 characters). Supabase stores and verifies passwords; the application never stores them in its own tables. Keep signup enabled. Enable the password-change notification email if desired.
- Email OTP length: 6 is the default and what the letters are designed for (6–10 digits work).
- Rate limits (Authentication → Rate Limits): the defaults are fine; with the hook in place, Supabase's built-in email limit no longer applies. Supabase also sees the application's servers rather than readers, so the application keeps its own budgets per network address (see write budgets below): 30 sign-in attempts (password or emailed code) and 10 letters (link, registration, recovery, resend) per ten minutes.

### Enable Google sign-in

Google was disabled in this project's public auth settings when this feature was added. The application is wired up; the following provider configuration is still required. No Google client secret belongs in `.env.local` or a `NEXT_PUBLIC_…` variable.

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project. Open **Google Auth Platform** and configure the app's branding, support email, audience and contact details. Use `dziader.si` as the authorized domain; the home page is `https://dziader.si`, privacy policy `https://dziader.si/prywatnosc`, and terms `https://dziader.si/regulamin`.
2. Create an OAuth client of type **Web application**. Add this **Authorized redirect URI** for the current Supabase project:

   ```text
   https://edmxfswgqrgawoojszev.supabase.co/auth/v1/callback
   ```

   For another Supabase project, use the callback shown in its Google provider settings. Google returns to Supabase; Supabase then returns to the application's `/auth/callback`.
3. In **Supabase → Authentication → Sign In / Providers → Google**, enable Google, paste the client ID and client secret, and save. Leave nonce verification enabled. This app uses the ordinary OAuth redirect flow, without Google One Tap or extra Google API scopes.
4. In **Supabase → Authentication → URL Configuration**, verify the existing redirect allow list includes `https://dziader.si/**` and `http://localhost:3000/**` (and, while testing there, a preview's exact address, never a `vercel.app` wildcard). These must allow `/auth/callback` with its query parameters.
5. While Google's app is in testing, add your Google account as a test user. Set its audience/publishing status for public use when ready, and complete any verification Google requires.

Provider reference: [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google). Password reference: [Supabase password authentication](https://supabase.com/docs/guides/auth/passwords).

### Verify the account flows

Use a test address you control. Both `/konto` and `/sl/racun` offer password login, registration, recovery, Google and the existing email-link option.

- Register with a password, confirm the email, sign out, and sign in with the password. Before confirmation, the form offers to resend the confirmation.
- Choose **Nie pamiętasz hasła? / Si pozabil geslo?**, open the recovery letter, and set a new password. Sign out and verify the new password works. Existing email-link and Google accounts can use recovery to add a password.
- Expired or reused recovery links must return to the recovery request form; opening `/konto?tryb=haslo` without a session must not expose a working password-update form.
- After enabling Google, sign in from both editions, check that the profile is created, then sign out and sign in again. Cancel the Google flow and verify the translated retry message.
- Start sign-in from a save-to-profile link and confirm that password, Google, and email confirmation return to that destination. No new database migration is required: the existing Auth signup trigger creates profiles for every provider.

`pnpm test` covers password validation and server flows, authorization of password updates, safe return paths, translated errors and recovery emails. Live email delivery and the Google consent flow require the provider setup above.

## What is stored

- `public.results`: result code **without** the name, version, family-interview flag, score, diagnosed species, answers, optional voivodeship, retake flag with the previous score, time, and a random per-examination submission key for retry deduplication. No names, raw IPs or account/device IDs. Only the server (secret key) can read or write it.
- `public.family_groups` / `public.family_members`: private invitation IDs, expiry, result codes including optional signatures, per-examination join keys and join times. The API permits access to anyone possessing the invitation link; expired groups are hidden and removed by daily cleanup.
- `public.write_budgets`: daily-rotating keyed network hashes and per-scope ten-minute counters; raw IPs are never stored here. Rows older than one day are removed on writes and by daily cleanup.
- `public.profiles`: nickname per account.
- `public.saved_results`: result codes saved to a profile (with the name part, which is the owner's own data). Readable and deletable only by the owner.
- `public.sightings`: field observations per account: species, optional voivodeship, day. One per species per day. Owner-only through row-level security; published only as totals.
- `public.saved_items`: bookmarks per account (`rozmowki`, `bingo`, `egzamin`) with the item's code.
- `public.verdicts`: votes in the Komisja: case, verdict, and the account for signed-in judges (set to null when the account is deleted). Written by the server only.
- `public.case_submissions`: cases proposed by signed-in judges, with a status (`nowe`, `przyjete`, `odrzucone`). Nothing is published automatically: review them in the Table Editor, and change the status when you accept or reject one. The profile shows the status to the author.
- `public.tallies`: daily counters by kind, no identifiers. Server only.
- `public.profiles.newsletter` / `honor`: the two opt-ins, off by default; `newsletter_at` records when the bulletin was ordered.
- `public.calendar_pages`: one row per account per day a calendar page was torn. Owner-only.
- `public.bulletin_issues`: one row per Monday, with how many letters went out. Server only.

## The weekly bulletin

Vercel Cron calls `/api/cron/biuletyn` on Mondays at 06:00 UTC (`vercel.json`) with `Authorization: Bearer $CRON_SECRET`. The handler claims the week in `bulletin_issues` (a retry finds it taken and stops), reads `newsletter_recipients()`, and sends through Brevo in batches of five, with `List-Unsubscribe` and one-click unsubscribe. To send an issue again, delete that week's row. In development, `http://localhost:3000/api/cron/biuletyn?podglad` shows the letter (`&jezyk=sl` for the Slovenian one). Each subscriber gets the issue in their edition, read from the account's `jezyk` user metadata through the Auth admin API (one call per letter; nothing stored means Polish). `GET /api/biuletyn/wypisz` only redirects to the confirmation page, so mail clients that open the unsubscribe link instead of posting to it land on the button.

Deleting an account (button in the profile) removes the auth user, which cascades to the profile, saved results, sightings, bookmarks and case submissions. Anonymous census rows and tallies stay, and verdicts stay without their owner.
