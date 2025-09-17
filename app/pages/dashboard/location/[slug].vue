<script setup lang="ts">
const route = useRoute();
const mapStore = useMapStore();
const { slug } = route.params;

const { data: location, status, error } = await useFetch(`/api/locations/${slug}`, {
  lazy: true,
});

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
    <div v-if="!location?.locationLogs.length && status !== 'pending'" class="flex fle-colmt-4">
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
