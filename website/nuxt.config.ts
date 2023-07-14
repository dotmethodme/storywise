// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    MONGODB_URL: process.env.MONGODB_URL,
    public: {
      // todo
    },
  },
  modules: [
    "@nuxt/content",
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
          src: "https://self.joinstorywise.com/js/script.js",
        },
      ],
    },
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
});
