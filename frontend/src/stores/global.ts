import { getApps } from "@/service/data";
import type { App } from "@shared/app";
import type { SiteConfig } from "@shared/types";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useGlobalStore = defineStore("global", () => {
  const route = useRoute();
  const router = useRouter();
  const selectedDays = ref(30);
  const siteConfig = ref<SiteConfig>();
  const apps = ref<App[]>();
  const activeAppId = computed(() => route.params.appId as string);
  const activeApp = computed(() => apps.value?.find((app) => app.id === activeAppId.value));

  watch([activeAppId, apps], ([appId, apps]) => {
    if (apps && !appId) {
      router.replace({ path: `/${apps[0].id}` });
    }
  });

  async function fetchApps() {
    apps.value = await getApps();
  }

  return { selectedDays, siteConfig, apps, fetchApps, activeApp, activeAppId };
});
