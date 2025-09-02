<script setup lang="ts">
import AppAuthButton from "./app-auth-button.vue";

const authStore = useAuthStores();
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          > <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          /> </svg>
        </div>

        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li><a>About Page</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">
        ZANZI-TOUR
      </a>
    </div>

    <div class="navbar-end">
      <ThemeToggle />
      <ul class="menu menu-horizontal px-1 hidden lg:flex">
        <li><a>About Page</a></li>
      </ul>

      <div v-if="!authStore.loading && authStore.user" class="dropdown  dropdown-end">
        <div tabindex="0" role="button" class="btn m-1">
          <div v-if="authStore.user.image" class="avatar mr-1.5">
            <div class="ring-cyan-950 ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
              <img :src="authStore.user.image">
            </div>
          </div>
          {{ authStore.user.name }}
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <button @click="authStore.signOut()">
              <Icon name="tabler:logout-2" size="24" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
      <AppAuthButton v-else />
    </div>
  </div>
</template>
