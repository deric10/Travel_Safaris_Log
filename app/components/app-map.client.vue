<script setup lang="ts">
import { CENTER_TANZANIA } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 3;

onMounted(() => {
  mapStore.initMap();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_TANZANIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.lat, point.long]"
    >
      <template #marker>
        <div class="tooltip" :data-tip="point.label">
          <Icon name="mdi-map-marker" class="text-3xl text-secondary" />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
