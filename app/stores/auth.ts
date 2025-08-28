import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const useAuthStores = defineStore("authStore", () => {
  const loading = ref(false);

  async function signIn() {
    loading.value = true;
    authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
    loading.value = false;
  }

  return {
    signIn,
    loading,
  };
});
