import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { SiteConfig } from "@/service/types";

export const useGlobalStore = defineStore("global", () => {
  const selectedDays = ref(30);
  const siteConfig = ref<SiteConfig>();

  return { selectedDays, siteConfig };
});
