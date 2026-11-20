"use client";

import { lazy, Suspense, type ComponentProps } from "react";

/*
 * The map with its species filter and pictograms, fetched only where it is rendered: a page
 * without sightings shows the empty tiles from the server and never asks for this script.
 */
const ObservationMap = lazy(() => import("./observation-map").then((module) => ({ default: module.ObservationMap })));

export function LazyObservationMap(props: ComponentProps<typeof ObservationMap>) {
  return (
    <Suspense fallback={null}>
      <ObservationMap {...props} />
    </Suspense>
  );
}
