<script setup lang="ts">
const authStore = useAuthStores();
</script>

<template>
  <button class="btn" :disabled="authStore.loading" @click="authStore.signIn">
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="20"
      class="mr-1"
    />
    Sign In
  </button>
</template>
