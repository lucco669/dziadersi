import { site } from "@/lib/site";

/** Review the contact details before this RFC 9116 record expires. */
export function GET() {
  return new Response([
    `Contact: mailto:${site.controller.email}`,
    "Expires: 2027-10-05T00:00:00Z",
    "Preferred-Languages: pl, sl, en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    "",
  ].join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
