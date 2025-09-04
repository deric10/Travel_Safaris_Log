<script lang="ts" setup>
const { data: locations, status } = await useFetch("/api/locations", {
  lazy: true,
});
</script>

<template>
  <div class="container text-2xl gap-2">
    <h2>Locations</h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-bars loading-xl" />
    </div>
    <div v-else-if="locations && locations.length > 0" class="flex flex-wrap gap-3 mt-4 px-2">
      <div v-for="loc in locations" :key="loc.id" class="card bg-base-300 w-73 border-1 shadow-sm ">
        <div class="card-body">
          <h3 class="card-title">
            {{ loc.name }}
          </h3>
          <p class="text-sm">
            {{ loc.description }}
          </p>
          <p class="text-sm">
            Added on {{ new Date(loc.createdAt).toLocaleDateString() }}
          </p>
          <!-- :to="`/dashboard/location/${loc.id}`" -->
          <NuxtLink
            to="#"
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
        <Icon name="tabler:circle-plus-filled" size="24" class="inline-block mr-1" />
        Add Locations
      </NuxtLink>
    </div>
  </div>
</template>
