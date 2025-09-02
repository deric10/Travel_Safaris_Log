<script setup lang="ts">
const isSideBarOpen = ref(true);

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSidebarOpen", isSideBarOpen.value.toString());
}
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
      <div class="divider" />
      <SidebarButton
        :show-label="isSideBarOpen"
        label="Sign Out"
        icon="tabler:logout-2"
        href=""
      />
    </div>
    <div class="flex flex-1 justify-center align-middle">
      <NuxtPage />
    </div>
  </div>
</template>
