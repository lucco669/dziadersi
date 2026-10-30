/**
 * The origin the visitor actually used. Behind the Coolify proxy Next builds
 * request.url and nextUrl.origin from the container's own address
 * (https://localhost:3000), so redirects and absolute links take the host
 * from the Host header instead.
 */
export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("host");
  return host ? `${url.protocol}//${host}` : url.origin;
}
