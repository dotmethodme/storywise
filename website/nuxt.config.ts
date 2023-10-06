// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  devtools: { enabled: true, vscode: {} },
  runtimeConfig: {
    MONGODB_URL: process.env.MONGODB_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
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
        // {
        //   defer: true,
        //   src: "https://app.lemonsqueezy.com/js/lemon.js",
        // },
      ],
    },
  },
  nitro: {
    plugins: [],
    // ["~/server/index.ts"],
  },
  auth: {
    isEnabled: true,
    origin: getOrigin(),
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"], "storeToRefs"],
  },
  routeRules: {
    "/admin/**": { ssr: false },
  },
});

function getOrigin() {
  if (process.env.NODE_ENV === "production") {
    return "https://joinstorywise.com";
  } else if (process.env.NODE_ENV === "dev") {
    return "https://dev.joinstorywise.com";
  } else {
    return undefined;
  }
}
