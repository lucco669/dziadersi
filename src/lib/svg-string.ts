import { Fragment, isValidElement, type ReactNode } from "react";

/*
 * Serialises the pictogram components to an SVG string, so generated images can embed
 * them as <img> data URIs. Handles host elements, fragments and plain function components only.
 */

const KEEP_CAMEL = new Set(["viewBox", "pathLength", "preserveAspectRatio"]);
const SKIP = new Set(["children", "className", "style", "key", "ref"]);

const attribute = (name: string) => (KEEP_CAMEL.has(name) ? name : name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return escape(String(node));
  if (Array.isArray(node)) return node.map(render).join("");
  if (!isValidElement(node)) return "";

  const { type } = node;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  if (type === Fragment) return render(props.children);
  if (typeof type === "function") return render((type as (p: unknown) => ReactNode)(props));
  if (typeof type !== "string") return "";

  const attrs = Object.entries(props)
    .filter(([name, value]) => !SKIP.has(name) && value !== undefined && value !== null && value !== false)
    .map(([name, value]) => ` ${attribute(name)}="${escape(String(value))}"`)
    .join("");
  return `<${type}${attrs}>${render(props.children)}</${type}>`;
}

export function svgDataUri(viewBox: string, drawing: ReactNode) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${render(drawing)}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
