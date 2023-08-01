<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { getSiteConfig } from "@/service/data";
import { useGlobalStore } from "@/stores/global";

const store = useGlobalStore();

onMounted(async () => {
  store.siteConfig = await getSiteConfig();
});
</script>

<template>
  <div class="bg-base-100 dark:bg-base-300 px-4 py-8 text-accent-content">
    <div class="max-w-5xl m-auto">
      <div class="flex flex-row w-full bg-base-100 dark:bg-base-300 justify-between">
        <div class="flex flex-col md:flex-row justify-center md:items-center">
          <div class="text-2xl font-extrabold tracking-tight text-accent-content mb-0">
            Storywise <span class="md:mr-2 font-extrabold">/ </span>
          </div>
          <div class="text-gray-400 text-2xl tracking-tight">simple analytics</div>
        </div>
        <Menu></Menu>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
