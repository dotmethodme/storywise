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
  method: "GET",
  onResponse() {
    firstLoad.value = true;
  },
});

let interval: NodeJS.Timer;

onMounted(() => {
  interval = setInterval(() => {
    refresh();
  }, 10000);
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
          <template v-if="pending && !firstLoad">
            Loading
            <span>
              <span class="loading loading-spinner loading-xs ml-1"></span>
            </span>
          </template>

          <template v-else-if="error">
            Pending
            <span class="relative inline-flex h-3 w-3 ml-1">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-600"></span>
            </span>
          </template>

          <template v-else>
            Live
            <span class="relative inline-flex h-3 w-3 ml-1">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
          </template>
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
