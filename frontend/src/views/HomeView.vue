<script setup lang="ts">
import GettingStarted from "@/components/GettingStarted.vue";
import SessionsOverTime from "@/components/SessionsOverTimeChart.vue";
import Stats from "@/components/Stats.vue";
import Sessions from "@/components/UniqueSessions.vue";
import PeriodSelector from "@/components/PeriodSelector.vue";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { generatedApi } from "@/service/data";

const store = useGlobalStore();
const { activeAppId } = storeToRefs(store);

const hasEventsLoading = ref(false);
const doesAppHaveEvents = ref(false);

async function fetchHasEvents() {
  if (!activeAppId.value) return;
  hasEventsLoading.value = true;
  const result = await generatedApi.getHasEvents({
    app_id: activeAppId.value,
  });
  doesAppHaveEvents.value = result.data.hasEvents;
  hasEventsLoading.value = false;
}

watch(activeAppId, fetchHasEvents, { immediate: true });
</script>

<template>
  <main class="w-full">
    <template v-if="doesAppHaveEvents">
      <div class="flex mb-4 mt-4 justify-between lg:flex-row flex-col gap-4">
        <div></div>
        <PeriodSelector />
      </div>

      <SessionsOverTime />

      <div class="mt-4"></div>
      <Stats />

      <div class="mt-4"></div>
      <Sessions />
    </template>
    <div v-else>
      <GettingStarted />
    </div>
  </main>
</template>
