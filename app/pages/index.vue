<script setup lang="ts">
import AppAuthButton from "~/components/app-auth-button.vue";
</script>

<template>
  <div>
    <div class="container mx-auto">
      <div
        class="hero min-h-[40vh] "
        style="background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);"
      >
        <div class="hero-overlay" />
        <div class="hero-content text-neutral-content text-center">
          <div class=" bg-cyan-950 py-4 px-7 rounded-lg">
            <h1 class="text-2xl font-bold text-amber-700">
              ZANZI-TOUR
            </h1>
            <p class="mb-5 mt-3">
              Explore Zanzibar your way with ZANZI-TOUR — discover, mark, and share every place you visit. Create your personal Zanzibar map and relive your adventures anytime. Start your journey today!
            </p>
            <AppAuthButton />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
