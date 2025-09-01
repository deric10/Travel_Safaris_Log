<script lang="ts" setup>
const authStore = useAuthStores();
await authStore.init();
</script>

<template>
  <div class="flext min-h-screen flex-col px-5 py-3">
    <AppNavigationBar />
    <div>
      <slot />
    </div>
  </div>
</template>
