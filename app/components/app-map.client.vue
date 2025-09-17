<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat, MapMouseEvent } from "maplibre-gl";

import { CENTER_TANZANIA, ZOOM_LEVEL } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();
const route = useRoute();

function updateAddedPoint(event: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = event.lat;
    mapStore.addedPoint.long = event.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});

onMounted(() => {
  mapStore.initMap();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_TANZANIA"
    :zoom="ZOOM_LEVEL"
    @map:dblclick="onDoubleClick($event)"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="mapStore.addedPoint && route.path === '/dashboard/add'"
      draggable
      class-name="z-50"
      :coordinates="[mapStore.addedPoint?.long, mapStore.addedPoint?.lat]"
      @update:coordinates="updateAddedPoint($event)"
    >
      <template #marker>
        <div
          class="tooltip tooltip-open"
          data-tip="Drag to your desired location"
        >
          <Icon
            name="mdi-map-marker"
            size="30"
            class="text-warning"
          />
        </div>
      </template>
    </MglMarker>
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip"
          :class="{ 'tooltip-open': mapStore.selectedPoint?.id === point.id }"
          :data-tip="point.name"
          @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
        >
          <Icon
            name="mdi-map-marker"
            size="30"
            :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <div class="p-2">
          <h3 class="font-bold">
            {{ point.name }}
          </h3>
          <p class="text-sm">
            {{ point.description }}
          </p>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
