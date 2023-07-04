<script lang="ts" setup>
import {
  getHitsPerPage,
  getStats,
  getUniqueSessionsPerPage,
} from "@/service/data";
import type { HitsPerPage, Stats } from "@/service/types";
import { useGlobalStore } from "@/stores/counter";
import { onMounted, ref } from "vue";

const stats = ref<Stats>();

const store = useGlobalStore();

async function fetchData() {
  stats.value = await getStats();
}

onMounted(fetchData);
store.$subscribe(fetchData);
</script>
<template>
  <div class="flex justify-center">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title">Total page views</div>
        <div class="stat-value">{{ stats?.totalPageviews }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Total unique visitors</div>
        <div class="stat-value">{{ stats?.uniqueVisitors }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Average page views <br />
          per visitor
        </div>
        <div class="stat-value">{{ stats?.viewsPerVisitor }}</div>
      </div>
    </div>
  </div>
</template>
