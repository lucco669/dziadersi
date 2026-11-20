/**
 * Alternative to the systemd timers: a Cloudflare Worker with Cron Triggers calls the same
 * endpoints. Cloudflare runs triggers in UTC, so wrangler.toml lists both offsets of Warsaw time
 * and the Worker calls the endpoint only in the hour that is 06:00 (or 03:00) in Warsaw.
 * The secret lives in the Worker: `npx wrangler secret put CRON_SECRET`.
 */

/** The Warsaw hour each job runs at. */
const HOURS = { biuletyn: 6, porzadki: 3 };

function warsawHour(time) {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Warsaw" }).format(time));
}

const worker = {
  async scheduled(event, env, ctx) {
    // "0 4,5 * * 1" → biuletyn, "0 1,2 * * *" → porzadki (see wrangler.toml).
    const job = event.cron.endsWith("* * 1") ? "biuletyn" : "porzadki";
    if (warsawHour(new Date(event.scheduledTime)) !== HOURS[job]) return;
    ctx.waitUntil(
      fetch(`${env.SITE}/api/cron/${job}`, { headers: { authorization: `Bearer ${env.CRON_SECRET}` } }).then(async (response) => {
        const body = await response.text();
        console.log(job, response.status, body.slice(0, 2000));
        if (!response.ok) throw new Error(`${job}: ${response.status}`);
      }),
    );
  },
};

export default worker;
