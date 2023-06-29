<script lang="ts" setup>
import { getHitsPerPage, getUniqueSessionsPerPage } from "@/service/data";
import type { HitsPerPage } from "@/service/types";
import { onMounted, ref } from "vue";

const sessions = ref<HitsPerPage[]>([]);
const hits = ref<HitsPerPage[]>([]);

onMounted(async () => {
  const [sessionData, hitData] = await Promise.all([
    getUniqueSessionsPerPage(),
    getHitsPerPage(),
  ]);
  sessions.value = sessionData;
  hits.value = hitData;
});
</script>
<template>
  <div class="columns-2 justify-between justify-items-center">
    <div class="card bg-base-100 shadow-xl card-compact card-bordered">
      <div class="card-body">
        <table class="table table-compact">
          <tbody>
            <tr>
              <th class="font-bold">Session count</th>
              <th class="font-bold text-right"></th>
            </tr>
            <!-- row 1 -->
            <tr v-for="session in sessions" :key="session.path">
              <td>{{ session.path || "-" }}</td>
              <td class="text-right">{{ session.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl card-compact card-bordered">
      <div class="card-body">
        <table class="table table-compact">
          <tbody>
            <tr>
              <th class="font-bold">Hit count</th>
              <th class="font-bold text-right"></th>
            </tr>
            <!-- row 1 -->
            <tr v-for="hit in hits" :key="hit.path">
              <td>{{ hit.path || "-" }}</td>
              <td class="text-right">{{ hit.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
