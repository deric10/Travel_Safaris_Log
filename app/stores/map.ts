import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

import { ZOOM_LEVEL } from "~/lib/constants";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const shouldFlyTo = ref(true);

  function selectPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  }

  async function initMap() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();
    let bounds: LngLatBounds | null = null;

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

      map.map?.fitBounds(bounds, { padding: 10, speed: 0.5 });
    });

    effect(() => {
      if (selectedPoint.value && shouldFlyTo.value) {
        map.map?.flyTo({
          center: [selectedPoint.value.long, selectedPoint.value.lat],
          zoom: ZOOM_LEVEL,
          speed: 0.7,
        });
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, { padding: 10, speed: 0.7 });
      }
      shouldFlyTo.value = true;
    });
  }
  return {
    initMap,
    mapPoints,
    selectedPoint,
    selectPointWithoutFlyTo,
  };
});
