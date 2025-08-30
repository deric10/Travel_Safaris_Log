import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStores = defineStore("authStore", () => {
  const session = authClient.useSession();
  const user = computed(() => session.value.data?.user);
  const loading = computed(() => session.value.isPending || session.value.isRefetching);

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
    signIn,
    signOut,
    user,
    loading,
  };
});
