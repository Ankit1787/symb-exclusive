import useAuthStore from "~/stores/auth.store";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiUrl,

    async onRequest({ options }) {
      const authStore = useAuthStore();

      if (authStore.token) {
        options.headers = new Headers(options.headers);

        options.headers.set(
          "Authorization",
          `Bearer ${authStore.token}`
        );
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore();

        authStore.logout();
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});