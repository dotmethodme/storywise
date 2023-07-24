import type { SiteConfig } from "@shared/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
  const selectedDays = ref(30);
  const siteConfig = ref<SiteConfig>();

  return { selectedDays, siteConfig };
});
