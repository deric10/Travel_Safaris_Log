<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { RouteLocationRaw } from "vue-router";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";

import type { NominatimResults } from "~/lib/types";

import { locationInsertSchema } from "@/lib/db/schema/location";
import { CENTER_TANZANIA } from "~/lib/constants";
import getFetchErrorMessage from "~/shared/utils/get-fetch-error-messages";

const router = useRouter();
const mapStore = useMapStore();
const { $csrfFetch } = useNuxtApp();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(locationInsertSchema),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_TANZANIA as [number, number])[0],
    lat: (CENTER_TANZANIA as [number, number])[1],
  },
});

const showConfirmModal = ref(false);
const loading = ref(false);
const submittedForm = ref(false);
const submitError = ref("");
const pendingTo = ref<RouteLocationRaw | null>(null);
const forceLeave = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "POST",
      body: values,
    });
    submittedForm.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

onBeforeRouteLeave((to) => {
  if (forceLeave.value)
    return true;

  if (!submittedForm.value && meta.value.dirty) {
    pendingTo.value = to;
    showConfirmModal.value = true;
    return false;
  }
  return true;
});

function confirmLeave() {
  const target = pendingTo.value;
  showConfirmModal.value = false;
  forceLeave.value = true;
  if (target)
    router.push(target);
  else router.back();
}

function cancelLeave() {
  showConfirmModal.value = false;
}

function formatNumber(value: number | undefined) {
  if (!value)
    return;
  return value.toFixed(6);
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("lat", mapStore.addedPoint.lat);
    setFieldValue("long", mapStore.addedPoint.long);
  }
});

function searchResultSelected(result: NominatimResults) {
  setFieldValue("name", result.name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: (CENTER_TANZANIA as [number, number])[0],
    lat: (CENTER_TANZANIA as [number, number])[1],
  };
});
</script>

<template>
  <div class="container max-w-md mx-auto">
    <div class="my-4">
      <h1>Add location</h1>
      <p class="text-sm">
        A location is a place you have traveled to or want to travel to. You can add details about the location, such as
        the name, description, and images.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormField
        name="name"
        label="Name"
        placeholder="Enter name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        placeholder="Description ..."
        :error="errors.description"
        :disabled="loading"
      />
      <!-- <AppFormField
        id="latitude"
        name="lat"
        label="Latitude"
        type="number"
        placeholder="Enter latitude"
        :error="errors.lat"
        :disabled="loading"
      />
      <AppFormField
        id="longitude"
        name="long"
        label="Longitude"
        type="number"
        placeholder="Enter longitude"
        :error="errors.long"
        :disabled="loading"
      /> -->

      <p>
        To set the coordinates
      </p>
      <ul class="list-disc ml-4 text-sm">
        <li>
          Drag the Marker <Icon
            name="mdi-map-marker"
            size="24"
            class="text-warning"
          />.
        </li>
        <li>Double click the map.</li>
        <li>Search for a location.</li>
      </ul>
      <p v-if="controlledValues.long && controlledValues.lat">
        Long : {{ formatNumber(controlledValues.lat) }}, Lat : {{ formatNumber(controlledValues.long) }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon
            name="tabler:arrow-left"
            size="24"
            class="inline-block mr-1"
          />
          Cancel
        </button>
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary"
        >
          <span v-if="loading" class="loading loading-spinner" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
            class="inline-block mr-1"
          />
          Add
        </button>
      </div>
      <div class="divider" />
      <AppPlaceSearch @selecte-results="searchResultSelected" />
    </form>

    <!-- daisyUI Modal -->
    <dialog class="modal" :open="showConfirmModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          Unsaved changes
        </h3>
        <p class="py-4">
          You have unsaved changes. Are you sure you want to leave?
        </p>
        <div class="modal-action">
          <button class="btn btn-outline" @click="cancelLeave">
            Stay
          </button>
          <button class="btn btn-error" @click="confirmLeave">
            Leave
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click.prevent="cancelLeave">
          close
        </button>
      </form>
    </dialog>
  </div>
</template>
