<script setup lang="ts">
const route = useRoute();
const locationStore = useLocationStore();
const isSideBarOpen = ref(true);

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path === "/dashboard") {
    locationStore.refresh();
  }
});

function toggleSidebar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSidebarOpen", isSideBarOpen.value.toString());
}

const sidebarStore = useSidebarStore();
</script>

<template>
  <div class="flex-1 flex">
    <!-- SideBar -->
    <div class="bg-base-100 transition-all duration-300 " :class="{ 'w-64': isSideBarOpen, 'w-16': !isSideBarOpen }">
      <div class="flex p-2" :class="{ 'justify-center': !isSideBarOpen, 'justify-end': isSideBarOpen }">
        <Icon
          v-if="isSideBarOpen"
          name="tabler:chevron-left"
          size="32"
          @click="toggleSidebar()"
        />
        <Icon
          v-if="!isSideBarOpen"
          name="tabler:chevron-right"
          size="32"
          @click="isSideBarOpen = !isSideBarOpen"
        />
      </div>
      <SidebarButton
        :show-label="isSideBarOpen"
        label="Locations"
        icon="tabler:map"
        href="/dashboard"
      />
      <SidebarButton
        :show-label="isSideBarOpen"
        label="Add location"
        icon="tabler:circle-plus-filled"
        href="/dashboard/add"
      />
      <div v-if="sidebarStore.isLoading || sidebarStore.sidebarItems.length > 0" class="divider" />

      <div v-if="sidebarStore.isLoading" class="flex flex-col gap-2">
        <div class="skeleton h-10 w-full" />
      </div>
      <div v-if="!sidebarStore.isLoading && sidebarStore.sidebarItems.length > 0" class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarItems"
          :key="item.id"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :show-label="isSideBarOpen"
        />
      </div>
      <div class="divider" />
      <SidebarButton
        :show-label="isSideBarOpen"
        label="Sign Out"
        icon="tabler:logout-2"
        href=""
      />
    </div>
    <div class="flex flex-1 justify-center align-middle">
      <div class="flex-1 flex flex-col my-3 px-4 gap-4">
        <NuxtPage />
        <div class="divider" />
        <AppMap
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>
