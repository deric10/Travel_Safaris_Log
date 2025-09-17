<script lang="ts" setup>
const locationStore = useLocationStore();
const { data: locations, status } = storeToRefs(locationStore);

const mapStore = useMapStore();

onMounted(() => {
  locationStore.refresh();
});
</script>

<template>
  <div class="container text-2xl gap-2">
    <h2>Locations</h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-bars loading-xl" />
    </div>
    <div v-else-if="locations && locations.length > 0" class="flex flex-nowrap gap-3 mt-4 px-2 overflow-auto min-h-56">
      <div
        v-for="location in locations"
        :key="location.id"
        :class="{
          'border-primary': location.id === mapStore.selectedPoint?.id,
          'border-transparent': location.id !== mapStore.selectedPoint?.id,
        }"
        class="card bg-base-300 w-62 border-2 shadow-sm shrink-0 cursor-pointer"
        @mouseenter="mapStore.selectedPoint = location"
        @mouseleave="mapStore.selectedPoint = location"
      >
        <div class="card-body">
          <h3 class="card-title">
            {{ location.name }}
          </h3>
          <p class="text-sm">
            {{ location.description }}
          </p>
          <p class="text-sm">
            Added on {{ new Date(location.createdAt).toLocaleDateString() }}
          </p>
          <NuxtLink
            :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
            class="btn btn-primary btn-sm mt-2 w-fit"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="my-4 flex flex-col gap-2 ">
      <p>Add location to getting started!</p>
      <NuxtLink
        to="/dashboard/add"
        class="btn btn-primary w-fit"
      >
        <Icon
          name="tabler:circle-plus-filled"
          size="24"
          class="inline-block mr-1"
        />
        Add Locations
      </NuxtLink>
    </div>
  </div>
</template>
