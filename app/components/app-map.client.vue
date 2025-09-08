<script setup lang="ts">
import { CENTER_TANZANIA, ZOOM_LEVEL } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

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
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.lat, point.long]"
    >
      <template #marker>
        <div
          class="tooltip"
          :class="{ 'tooltip-open': mapStore.selectedPoint?.id === point.id }"
          :data-tip="point.name"
          @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectPointWithoutFlyTo(null)
          "
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
