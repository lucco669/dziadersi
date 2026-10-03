/** Reject cross-site writes before touching the database. Same-origin beacons omit Content-Type. */
export function checkWriteRequest(request: Request): Response | null {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  // Next may normalize the internal URL to localhost. Host is the browser's actual target;
  // do not trust caller-supplied X-Forwarded-Host for this comparison.
  let matchingOrigin = !origin;
  if (origin) {
    try {
      const source = new URL(origin);
      matchingOrigin = source.host === (request.headers.get("host") || url.host) && source.protocol === url.protocol;
    } catch { matchingOrigin = false; }
  }
  if (request.headers.get("sec-fetch-site") === "cross-site" || !matchingOrigin) {
    return new Response(null, { status: 403 });
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > 8192) return new Response(null, { status: 413 });
  return null;
}

export async function readWriteBody(request: Request): Promise<Record<string, unknown> | null> {
  // Read a bounded stream: Content-Length alone isn't trustworthy.
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const buffer = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder().decode(buffer));
    return body !== null && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export const isAttemptId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export const isFamilyId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{32}$/.test(value);
