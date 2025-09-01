import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStores = defineStore("authStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession> | null>>(null);

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signIn() {
    authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
  }

  async function signOut() {
    authClient.signOut();
    navigateTo("/");
  }

  return {
    init,
    signIn,
    signOut,
    user,
    loading,
  };
});
