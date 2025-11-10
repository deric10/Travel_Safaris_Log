/**
 * Location store
 *
 * Fetches and exposes the authenticated user's locations, synchronizes them
 * to the sidebar and the map.
 *
 * Responsibilities:
 * - Fetch locations from `/api/locations`
 * - Populate sidebar items for navigation
 * - Sync map points to show all locations
 * - Expose loading state via the sidebar store
 *
 * Note:
 * - Requires `useSidebarStore` with `sidebarItems` and `isLoading`.
 * - Expects API items to include: id, name, slug, lat, long, and optionally more.
 */
export const useLocationStore = defineStore("useLocationStore", () => {
  // Lazy fetch to avoid SSR timing issues; call refresh() to revalidate
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  // Reflect updates to the sidebar and map when data loads
  effect(() => {
    if (data.value && data.value.length > 0) {
      sidebarStore.sidebarItems = data.value.map(loc => ({
        id: `location-${loc.id}`,
        label: loc.name,
        icon: "tabler:map-pin-pin",
        href: `/dashboard/location/${loc.id}`,
        to: { name: "dashboard-location-slug", params: { slug: loc.slug } },
        location: loc,
      }));
      mapStore.mapPoints = data.value;
    }
    sidebarStore.isLoading = status.value === "pending";
  });

  return {
    data,
    status,
    refresh,
  };
});
