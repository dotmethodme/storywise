<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import AppsDropdown from "./components/AppsDropdown.vue";
import { generatedApi } from "./service/data";

const store = useGlobalStore();
const { apps } = storeToRefs(store);
const loadingSiteConfig = ref(false);

onMounted(async () => {
  const result = await generatedApi.getConfig();
  store.siteConfig = result.data.config;
  store.fetchApps();
  loadingSiteConfig.value = true;
});
</script>

<template>
  <div class="bg-gray-50 dark:bg-base-300 px-4 py-8 text-accent-content">
    <div class="max-w-5xl m-auto">
      <div class="flex flex-row w-full dark:bg-base-300 justify-between">
        <a class="flex flex-col md:flex-row justify-center md:items-center" href="#/">
          <div class="text-2xl font-extrabold tracking-tight text-accent-content mb-0">
            Storywise <span class="md:mr-2 font-extrabold">/ </span>
          </div>
          <div class="text-gray-400 text-2xl tracking-tight">simple analytics</div>
        </a>

        <div class="flex gap-2" v-if="apps">
          <AppsDropdown />
          <Menu></Menu>
        </div>
      </div>

      <template v-if="store.siteConfig">
        <RouterView />
      </template>
      <template v-else-if="loadingSiteConfig">
        <span class="loading loading-spinner loading-md"></span>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
