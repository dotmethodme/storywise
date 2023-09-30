<script setup lang="ts">
import GettingStarted from "@/components/GettingStarted.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Stats from "@/components/Stats.vue";
import Sessions from "@/components/UniqueSessions.vue";
import PeriodSelector from "@/components/PeriodSelector.vue";
import { hasEvents } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const store = useGlobalStore();
const { activeAppId } = storeToRefs(store);

const hasEventsLoading = ref(false);
const doesAppHaveEvents = ref(false);

async function fetchHasEvents() {
  hasEventsLoading.value = true;
  const result = await hasEvents(activeAppId.value);
  doesAppHaveEvents.value = result.hasEvents;
  hasEventsLoading.value = false;
}

watch(activeAppId, fetchHasEvents, { immediate: true });
</script>

<template>
  <main class="w-full">
    <template v-if="doesAppHaveEvents">
      <div class="flex mb-4 mt-4 justify-between lg:flex-row flex-col gap-4">
        <h2 class="text-xl font-normal tracking-tight text-left">Unique visitors</h2>
        <PeriodSelector />
      </div>

      <SessionsOverTime />
      <div class="mt-8"></div>
      <Stats />
      <div class="mt-4"></div>

      <Sessions />
    </template>
    <div v-else>
      <GettingStarted />
    </div>
  </main>
</template>
