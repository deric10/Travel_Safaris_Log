export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value && data.value.length > 0) {
      sidebarStore.sidebarItems = data.value.map(loc => ({
        id: `location-${loc.id}`,
        label: loc.name,
        icon: "tabler:map-pin-pin",
        href: `/dashboard/location/${loc.id}`,
      }));
    }
    sidebarStore.isLoading = status.value === "pending";
  });

  return {
    data,
    status,
    refresh,
  };
});
