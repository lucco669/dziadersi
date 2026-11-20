/** Scheduled jobs (deploy/README.md) send `Authorization: Bearer $CRON_SECRET`. */
export function isCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}
