<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { getSiteConfig } from "./service/data";
import { useGlobalStore } from "./stores/counter";

const store = useGlobalStore();

onMounted(async () => {
  store.siteConfig = await getSiteConfig();
});
</script>

<template>
  <div class="columns-2 w-full">
    <div>
      <h1 class="mb-10 text-2xl font-extrabold tracking-tight text-gray-900">
        Storywise / <span class="text-gray-500">analytics made simple</span>
      </h1>
    </div>
    <Menu></Menu>
  </div>

  <RouterView />
</template>

<style scoped></style>
