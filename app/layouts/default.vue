<script lang="ts" setup>
const authStore = useAuthStores();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col px-5 py-3">
    <AppNavigationBar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
