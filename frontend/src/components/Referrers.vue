<script lang="ts" setup>
import { getTopReferrers } from "@/service/data";
import type { Referrer } from "@/service/types";
import { onMounted, ref } from "vue";

const referrers = ref<Referrer[]>([]);

onMounted(async () => {
  referrers.value = await getTopReferrers();
});
</script>
<template>
  <div>
    <div class="card bg-base-100 shadow-xl card-compact card-bordered">
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
  </div>
</template>
