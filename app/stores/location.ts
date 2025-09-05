export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value && data.value.length > 0) {
      sidebarStore.sidebarItems = data.value.map(loc => ({
        id: `location-${loc.id}`,
        label: loc.name,
        icon: "tabler:map-pin-pin",
        href: `/dashboard/location/${loc.id}`,
      }));
      mapStore.mapPoints = data.value.map(loc => ({
        id: loc.id,
        label: loc.name,
        lat: loc.lat,
        long: loc.long,
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
