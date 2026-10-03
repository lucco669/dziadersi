import { notFound } from "next/navigation";

// Any address the editions don't know ends here, so the 404 renders inside the edition's layout.
export default function Missing() {
  notFound();
}
