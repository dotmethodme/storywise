<script lang="ts" setup>
import { getTopReferrers } from "@/service/data";
import { useGlobalStore } from "@/stores/counter";
import type { Referrer } from "@shared/types";
import { onMounted, ref } from "vue";

const referrers = ref<Referrer[]>([]);
const store = useGlobalStore();

store.$subscribe(async (_, { selectedDays }) => {
  referrers.value = await getTopReferrers(selectedDays);
});

onMounted(async () => {
  referrers.value = await getTopReferrers();
});
</script>
<template>
  <div class="card bg-base-100 shadow-lg card-compact">
    <div class="card-body">
      <table class="table table-compact">
        <tbody>
          <tr>
            <th class="font-bold">Top referrers</th>
            <th class="font-bold text-right"></th>
          </tr>
          <tr v-for="session in referrers" :key="session.referrer">
            <td>{{ session.referrer || "-" }}</td>
            <td class="text-right">{{ session.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
