<script setup lang="ts">
const { loading, signIn } = useAuthStores();
</script>

<template>
  <button class="btn" :disabled="loading" @click="signIn">
    <span v-if="loading" class="loading loading-spinner loading-md" />
    <Icon v-else name="tabler:brand-github" size="20" class="mr-1" />
    Sign In
  </button>
</template>
