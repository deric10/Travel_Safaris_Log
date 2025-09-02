<script lang="ts" setup>
import { Field } from "vee-validate";

const props = defineProps<{
  name: string;
  label: string;
  disabled?: boolean;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
  error?: string;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :name="props.name"
      :type="props.type || 'text'"
      class="w-full"
      :as="props.type === 'textarea' ? 'textarea' : 'input'"
      :class="{ 'input-error': props.error, 'textarea': props.type === 'textarea', 'input': !type || props.type !== 'textarea' }"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
    />
    <p v-if="props.error" class="label text-error">
      * {{ props.error }}
    </p>
  </fieldset>
</template>
