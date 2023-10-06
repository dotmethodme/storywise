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
    SYNCER_URL: process.env.SYNCER_URL,
    public: {
      PLAN_MONTHLY_1GB: process.env.PLAN_MONTHLY_1GB || "110545",
      PLAN_MONTHLY_2GB: process.env.PLAN_MONTHLY_2GB || "110555",
      PLAN_MONTHLY_4GB: process.env.PLAN_MONTHLY_4GB || "125808",
      PLAN_MONTHLY_6GB: process.env.PLAN_MONTHLY_6GB || "125810",
      PLAN_MONTHLY_8GB: process.env.PLAN_MONTHLY_8GB || "125811",
      PLAN_MONTHLY_10GB: process.env.PLAN_MONTHLY_10GB || "125812",
      PLAN_MONTHLY_12GB: process.env.PLAN_MONTHLY_12GB || "125813",
      PLAN_YEARLY_1GB: process.env.PLAN_YEARLY_1GB || "125820",
      PLAN_YEARLY_2GB: process.env.PLAN_YEARLY_2GB || "125821",
      PLAN_YEARLY_4GB: process.env.PLAN_YEARLY_4GB || "125823",
      PLAN_YEARLY_6GB: process.env.PLAN_YEARLY_6GB || "125827",
      PLAN_YEARLY_8GB: process.env.PLAN_YEARLY_8GB || "125828",
      PLAN_YEARLY_10GB: process.env.PLAN_YEARLY_10GB || "125829",
      PLAN_YEARLY_12GB: process.env.PLAN_YEARLY_12GB || "125830",

      PLAN_MONTHLY_1GB_SLUG: process.env.PLAN_MONTHLY_1GB_SLUG || "7daa5e4a-8ee3-467f-b2c2-82204915eb83",
      PLAN_MONTHLY_2GB_SLUG: process.env.PLAN_MONTHLY_2GB_SLUG || "0f5b1b4c-1e50-4d56-aeb1-4aa2ec39a1e0",
      PLAN_MONTHLY_4GB_SLUG: process.env.PLAN_MONTHLY_4GB_SLUG || "d7850228-f3c6-4ada-9f0e-4d7ba170b1c0",
      PLAN_MONTHLY_6GB_SLUG: process.env.PLAN_MONTHLY_6GB_SLUG || "58477ec1-d080-4df4-b842-9db20855ca86",
      PLAN_MONTHLY_8GB_SLUG: process.env.PLAN_MONTHLY_8GB_SLUG || "e03f617c-30cc-41b9-9deb-b75d5eb128e6",
      PLAN_MONTHLY_10GB_SLUG: process.env.PLAN_MONTHLY_10GB_SLUG || "197ae190-43a4-4b78-a695-238e46dfd792",
      PLAN_MONTHLY_12GB_SLUG: process.env.PLAN_MONTHLY_12GB_SLUG || "0f45fa6d-34ab-450f-9432-38ea81aae39a",
      PLAN_YEARLY_1GB_SLUG: process.env.PLAN_YEARLY_1GB_SLUG || "b3ba5e9f-14fa-493e-b98a-296d7cd923f6",
      PLAN_YEARLY_2GB_SLUG: process.env.PLAN_YEARLY_2GB_SLUG || "a49d3210-bce5-419d-b88e-be83b946b3b4",
      PLAN_YEARLY_4GB_SLUG: process.env.PLAN_YEARLY_4GB_SLUG || "9f15fefb-7427-43a1-95f1-77ae7fc9ef2a",
      PLAN_YEARLY_6GB_SLUG: process.env.PLAN_YEARLY_6GB_SLUG || "84e0e1e8-b80f-4982-aa75-f951a28a4c93",
      PLAN_YEARLY_8GB_SLUG: process.env.PLAN_YEARLY_8GB_SLUG || "4f77dba0-ef10-49c3-9d05-3883d415a574",
      PLAN_YEARLY_10GB_SLUG: process.env.PLAN_YEARLY_10GB_SLUG || "6017db4e-21af-4d82-af7a-7f248a00a890",
      PLAN_YEARLY_12GB_SLUG: process.env.PLAN_YEARLY_12GB_SLUG || "7c3e22a5-d250-466f-aa8c-4aece0bab209",
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
  } else {
    return undefined;
  }
}
