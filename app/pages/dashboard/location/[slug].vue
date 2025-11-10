<script setup lang="ts">
// Displays a single location by slug and syncs it to the map camera.
// Responsibilities:
// - Read slug from route params
// - Fetch location details from `/api/locations/:slug`
// - Update map store points so the map centers on this location
// - Render loading, success, error, and empty-log states

const route = useRoute();
const mapStore = useMapStore();
const { slug } = route.params as { slug: string };

// Lazy fetch to defer request until component is mounted/needed.
// Expects API shape with at least: { id, name, description, lat, long, locationLogs? }
const { data: location, status, error } = await useFetch(`/api/locations/${slug}`, {
  lazy: true,
});

// When the location is available, push it into the map store
// so the map can fit/fly to this single point.
effect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value];
  }
});
</script>

<template>
  <div class="flex flex-col gap-3 mt-4 px-2 min-h-56">
    <div v-if="status === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="location && status !== 'pending'">
      <div>
        <h2 class="text-2xl">
          {{ location.name }}
        </h2>
        <p class="text-sm">
          {{ location.description }}
        </p>
      </div>
    </div>
    <div v-if="error && status !== 'pending'">
      <h2>Ooops!, {{ error.statusMessage || 'Something went wrong' }}</h2>
    </div>

    <!-- Empty location logs hint
         Note: requires `location.locationLogs` to be an array from the API -->
    <div v-if="!location?.locationLogs?.length && status !== 'pending'" class="flex fle-colmt-4">
      <div>
        <p class="text-sm mb-2 italic">
          Add a location log to get started
        </p>
        <button type="button" class="btn btn-primary">
          <Icon name="tabler:map-pin-plus" size="24" />
          Add location log
        </button>
      </div>
    </div>
  </div>
</template>
