<script lang="ts" setup>
import { useRoute } from "#imports";
import { computed } from "vue";

const props = withDefaults(defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel?: boolean;
}>(), {
  showLabel: true,
});

const route = useRoute();
const isActive = computed(() => route.path === props.href);
</script>

<template>
  <div class="flex flex-col">
    <div
      class="bg-base-200"
      :class="[{ 'tooltip': !props.showLabel, 'tooltip-right': !props.showLabel }]"
      :data-tip="!props.showLabel ? props.label : null"
    >
      <NuxtLink
        :to="props.href"
        :aria-current="isActive ? 'page' : undefined"
        class="group flex gap-2 p-3 hover:bg-base-300 hover:cursor-pointer"
        :class="[
          isActive ? 'bg-base-300' : '',
          props.showLabel ? 'justify-start' : 'justify-center',
        ]"
      >
        <Icon
          :name="props.icon"
          size="24"
          class="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />

        <Transition
          enter-active-class="transition-all duration-100 ease-out"
          enter-from-class="opacity-0 scale-95 max-w-0"
          enter-to-class="opacity-100 scale-100 max-w-64"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 max-w-64"
          leave-to-class="opacity-0 scale-95 max-w-0"
        >
          <span v-if="props.showLabel" class="inline-block whitespace-nowrap">
            {{ props.label }}
          </span>
        </Transition>
      </NuxtLink>
    </div>
  </div>
</template>
