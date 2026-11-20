# Scheduled jobs

The site runs on our own server (Coolify, behind a Cloudflare tunnel) since 25 October 2026. Vercel Cron no longer exists for it, so two endpoints need an outside clock. Both answer only to `Authorization: Bearer $CRON_SECRET`, the same `CRON_SECRET` the app has in its environment.

| Job | When (Europe/Warsaw) | What it does |
| --- | --- | --- |
| `GET /api/cron/biuletyn` | Mondays 06:00 | Sends the weekly bulletin to subscribed accounts and confirmed guest addresses. Claims the week in `bulletin_issues` first, so a second call that week sends nothing. |
| `GET /api/cron/porzadki` | daily 03:00 | Deletes family rankings after their 90 days (the site promises this), write budgets older than a day and guest bulletin addresses unconfirmed after 7 days. Logs and returns the write health (below). |

Pick **one** scheduler. Two schedulers for the bulletin are harmless (the week is claimed once), but two places to look are not.

> As of 20 November 2026 the bulletin is already being called every Monday at 06:00 Warsaw time (rows in `bulletin_issues` at 05:00 UTC since 26 October), most likely by a Coolify scheduled task, as the route's comment says. Nothing was calling `porzadki`. Check **Coolify → the application → Scheduled Tasks** before adding anything.

## Option A: Coolify scheduled tasks (no files on the host)

In Coolify → the dziader.si application → **Scheduled Tasks**, add one task per job. The command runs inside the app container, where Node and `CRON_SECRET` already are; no secret leaves the container.

| Name | Frequency | Command |
| --- | --- | --- |
| `porzadki` | `0 3 * * *` | `node -e "fetch('http://localhost:3000/api/cron/porzadki',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{console.log(r.status,await r.text());process.exit(r.ok?0:1)})"` |
| `biuletyn` (if not there yet) | `0 6 * * 1` | the same with `biuletyn` |

Coolify uses the server's time zone setting for the schedule (Settings → the server → Timezone); set it to `Europe/Warsaw`, or write the hours in UTC. Use the container's own port if it isn't 3000. The output shows up in the task's execution log.

## Option B: systemd timers on the host

Files: [`systemd/`](systemd/). Needs systemd 248 or newer (`systemctl --version`) and `curl` 7.76 or newer. Run as root on the server, from a checkout of this repository:

```sh
install -d -m 700 /etc/dziadersi
# The app's CRON_SECRET, exactly as in Coolify's environment variables:
printf 'Authorization: Bearer %s\n' 'PASTE_CRON_SECRET_HERE' > /etc/dziadersi/cron-header
chmod 600 /etc/dziadersi/cron-header
install -m 644 deploy/systemd/dziadersi-cron@.service deploy/systemd/dziadersi-biuletyn.timer deploy/systemd/dziadersi-porzadki.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now dziadersi-porzadki.timer
# Only if Coolify doesn't already send the bulletin:
systemctl enable --now dziadersi-biuletyn.timer
```

Check it:

```sh
systemctl list-timers 'dziadersi-*'
systemctl start dziadersi-cron@porzadki.service   # one run now; safe to repeat
journalctl -u dziadersi-cron@porzadki.service -n 20
```

The journal shows the JSON answer. A failed call (4xx/5xx) marks the unit failed: `systemctl --failed`.

## Option C: crontab

Without systemd, [`crontab`](crontab) has the same two calls for root's crontab, with the header file from Option B. Output goes to syslog under `dziadersi-cron`.

## Option D: Cloudflare Cron Trigger

The domain is on Cloudflare already, so a Worker can be the clock: [`cloudflare/`](cloudflare/). From that folder, `npx wrangler deploy`, then `npx wrangler secret put CRON_SECRET`. Cron Triggers run in UTC; the Worker is triggered at both possible UTC hours and calls only in the one that is 06:00 (03:00) in Warsaw, so daylight saving needs no edits. Logs: Workers → `dziadersi-cron` → Logs. The calls come from Cloudflare's network, so a WAF rule that challenges non-browsers on `/api/*` would block them; the host options don't have that problem.

## Is the census still filling up?

`GET /api/cron/zdrowie` (same header) compares the last 24 hours of write attempts with what was stored:

- **attempts**: write budgets taken per scope. Every write that passes the origin check takes one, so these are requests that reached the app.
- **results** / **tallies**: rows that landed.
- **status**: `ok`; `quiet` when nobody tried (not an error, but a week of `quiet` with visitors in Umami means the browser never reaches the API); `broken` when attempts reached the app and nothing was stored. `broken` answers 503.

The daily `porzadki` run includes the same report in its answer, so the timer's journal (or Coolify's task log) has one line per day. To be told rather than to look, point an uptime monitor (Uptime Kuma, Better Stack) at `https://dziader.si/api/cron/zdrowie` with the `Authorization` header and alert on a non-200.

In the browser, a census write the API refuses is reported to Umami as the event **Spis: zapis odrzucony** with the HTTP status (0 = no answer). Visitors never see this failure, so that event is the other early warning.

## Smoke test after a deploy

1. On a phone, take the test on https://dziader.si/test to the end (about four minutes).
2. In Supabase → Table Editor → `results`, the newest row has `created_at` from the last minutes.
3. `/spis` refreshes within a few minutes and says "Dotąd 1 badanie" (nothing else is published below 30 results). Open it in a private window: Cloudflare currently tells browsers to keep the page for four hours (`max-age=14400`).
4. `/statystyki`: horn presses and certificate downloads count from the same visit, once the page regenerates.
