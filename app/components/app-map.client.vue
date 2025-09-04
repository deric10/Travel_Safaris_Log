<script setup lang="ts">
import { CENTER_TANZANIA } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const center = [CENTER_TANZANIA.lat, CENTER_TANZANIA.lng];
const zoom = 3;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
