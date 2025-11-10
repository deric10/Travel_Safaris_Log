import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

import { ZOOM_LEVEL } from "~/lib/constants";

/**
 * Pinia store: useMapStore
 *
 * Purpose:
 * - Centralize all map-related reactive state and behaviors for MapLibre.
 * - Provide a single place to update points, selection, and control camera movement.
 *
 * Exposed state:
 * - mapPoints: list of points to render on the map and to compute bounds from.
 * - selectedPoint: the point currently focused/selected by the user (drives flyTo).
 * - addedPoint: a newly created point; when set, triggers a flyTo (optionally forced via `centerMap`).
 * - shouldFlyTo: internal flag used to temporarily suppress auto flyTo.
 *
 * Key behaviors:
 * - initMap(): sets up reactive effects that:
 *   - Fit bounds whenever `mapPoints` changes.
 *   - Fly to `addedPoint` when it appears (or when `centerMap` is true).
 *   - Fly to `selectedPoint` when it changes, unless `shouldFlyTo` was disabled.
 * - selectPointWithoutFlyTo(): updates selection while suppressing camera movement for that interaction.
 *
 * Usage guidelines:
 * - Call `initMap()` once after the MapLibre map is mounted (client-only).
 * - Assign `mapPoints` to update visible markers and auto-fit the camera to include them.
 * - To select a point without moving the camera (e.g., hover), use `selectPointWithoutFlyTo(point)`.
 * - To intentionally move the camera to a point (e.g., click), set `selectedPoint` directly.
 */
export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);
  const shouldFlyTo = ref(true);

  /**
   * Select a point while preventing the next automatic camera flyTo.
   * Useful for transient UI interactions (e.g., hover) where the camera shouldn't move.
   */
  function selectPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  }

  /**
   * Initialize reactive map bindings.
   * - Lazily imports map helpers to remain SSR-friendly.
   * - Sets up effects that fit bounds and fly the camera based on state changes.
   *
   * Call this once from a client-only component after the map is mounted.
   */
  async function initMap() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();
    let bounds: LngLatBounds | null = null;

    // Compute and fit bounds whenever the set of points changes.
    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint)
        return;

      bounds = mapPoints.value.reduce((bound, point) => {
        return bound.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, { padding: 10, speed: 0.5, maxZoom: 10 });
    });

    // When a new point is added (or explicitly requests centering), fly the camera to it.
    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          zoom: 6,
          speed: 0.7,
        });
      }
    });

    // Fly to the selected point unless the last interaction suppressed it.
    effect(() => {
      if (addedPoint)
        return;

      if (selectedPoint.value && shouldFlyTo.value) {
        map.map?.flyTo({
          center: [selectedPoint.value.long, selectedPoint.value.lat],
          zoom: ZOOM_LEVEL,
          padding: 100,
          speed: 0.7,
        });
      }
      // Reset suppression so subsequent selections can fly again by default.
      shouldFlyTo.value = true;
    });
  }
  return {
    initMap,
    addedPoint,
    mapPoints,
    selectedPoint,
    selectPointWithoutFlyTo,
  };
});
