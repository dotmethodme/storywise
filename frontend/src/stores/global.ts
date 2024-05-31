import { App, Config } from "@/generated/data-contracts";
import { generatedApi } from "@/service/data";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useGlobalStore = defineStore("global", () => {
  const route = useRoute();
  const router = useRouter();
  const selectedDays = ref(30);
  const siteConfig = ref<Config>();
  const apps = ref<App[]>();
  const activeAppId = computed(() => route.params.appId as string);
  const activeApp = computed(() => apps.value?.find((app) => app.id === activeAppId.value));

  watch([activeAppId, apps], ([appId, apps]) => {
    if (apps && !appId) {
      router.replace({ path: `/${apps[0].id}` });
    }
  });

  async function fetchApps() {
    const result = await generatedApi.getApps();
    apps.value = result.data.items;
  }

  return { selectedDays, siteConfig, apps, fetchApps, activeApp, activeAppId };
});
