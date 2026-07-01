// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'swiper/modules',
        'swiper/vue',
        'vue-sonner',
      ]
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },
});
