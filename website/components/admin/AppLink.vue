<script lang="ts" setup>
import { StorywiseAppWithId } from "@/types/types";

const props = defineProps<{
  item: {
    _id: string;
    name: string;
  };
}>();

const firstLoad = ref(false);

const baseUrl = `https://${props.item.name}.joinstorywise.com`;

const { pending, error, refresh } = await useFetch(`${baseUrl}/api/event`, {
  method: "OPTIONS",
  onResponse() {
    firstLoad.value = true;
  },
});

let interval: NodeJS.Timer;

onMounted(() => {
  interval = setInterval(() => {
    refresh();
  }, 5000);
});

onUnmounted(() => {
  firstLoad.value = false;
  clearInterval(interval);
});
</script>

<template>
  <div class="card bg-base-100 border cursor-pointer hover:shadow-lg h-full">
    <div class="card-body px-6 py-6">
      <h2 class="card-title">
        <Icon size="30px" name="system-uicons:box" />
        {{ item.name }}
      </h2>
      <div class="flex justify-between">
        <div>
          Status
          <span v-if="pending && !firstLoad">
            <span class="loading loading-spinner loading-xs"></span>
          </span>

          <span v-else-if="error" class="relative inline-flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-600"></span>
          </span>
          <span v-else class="relative inline-flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
          </span>
        </div>

        <div
          @click="
            (e) => {
              e.stopPropagation();
            }
          "
        >
          <a class="btn btn-xs p-4" :href="baseUrl" target="_blank"> <span>Open</span> </a>
        </div>
      </div>
    </div>
  </div>
</template>
