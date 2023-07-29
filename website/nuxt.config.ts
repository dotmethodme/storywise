// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    MONGODB_URL: process.env.MONGODB_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    public: {
      // todo
    },
  },
  modules: [
    "nuxt-icon",
    "@pinia/nuxt",
    "@nuxt/content",
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    [
      "@nuxtjs/google-fonts",
      {
        download: true,
        families: {
          Inter: [300, 400, 500, 600, 700, 800, 900],
          Lora: [300, 400, 500, 600, 700, 800, 900],
        },
        inject: true,
      },
    ],
  ],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Storywise | simple analytics",
      script: [
        {
          async: true,
          defer: true,
          "data-skip-localhost": true,
          src: "https://self.joinstorywise.com/js/script.js",
        },
      ],
    },
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  auth: {
    isEnabled: true,
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"], "storeToRefs"],
  },
  routeRules: {
    "/admin/**": { ssr: false },
  },
});
