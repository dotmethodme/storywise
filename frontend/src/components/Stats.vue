<script lang="ts" setup>
import { Stats } from "@/generated/data-contracts";
import { generatedApi } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

const stats = ref<Stats>();
const store = useGlobalStore();
const { activeAppId, selectedDays } = storeToRefs(store);

async function fetchData(activeAppId: string, days: number) {
  const result = await generatedApi.getStats({
    app_id: activeAppId,
    days,
  });

  stats.value = result.data.item;
}

function formatNumber(value: string | null) {
  return value ? new Intl.NumberFormat().format(parseFloat(value)) : "";
}

onMounted(() => fetchData(store.activeAppId, store.selectedDays));
watch([activeAppId, selectedDays], ([activeAppId, selectedDays]) => fetchData(activeAppId, selectedDays));
</script>
<template>
  <div class="flex justify-center" v-if="stats">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title">Total page views</div>
        <div class="stat-value">{{ formatNumber(stats.totalPageviews) }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Unique visitors</div>
        <div class="stat-value">{{ formatNumber(stats.uniqueVisitors) }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Views per visitor</div>
        <div class="stat-value">{{ formatNumber(stats.viewsPerVisitor) }}</div>
      </div>
    </div>
  </div>
</template>
