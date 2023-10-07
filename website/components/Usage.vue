<script setup lang="ts">
import { useAdminStore } from "~/stores/admin";
import { formatBytes } from "~/utils/bytes";
import * as echarts from "echarts";
import { render } from "nuxt/dist/app/compat/capi";

const chartDom = ref<HTMLDivElement | null>(null);
const myChart = ref<echarts.ECharts>();

const { getPlanById } = usePlans();
const adminStore = useAdminStore();
const { subscription } = storeToRefs(adminStore);
const { data: dbSize } = await useFetch("/api/admin/database/size");

const usage = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  return currentSize;
});

const usageSpace = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  return currentSize;
});

const totalSpace = computed(() => {
  const variantId = subscription.value?.attributes.variant_id;
  if (!variantId) return 0;
  const plan = getPlanById(variantId.toString());
  if (!plan?.sizeBytes) return 0;
  const maxSize = plan.sizeBytes;
  return maxSize;
});

const freeSpace = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  const variantId = subscription.value?.attributes.variant_id;
  if (!variantId) return 0;
  const plan = getPlanById(variantId.toString());
  if (!plan?.sizeBytes) return 0;
  const maxSize = plan.sizeBytes;
  return maxSize - currentSize;
});

function renderChart() {
  if (!subscription.value || !dbSize.value) return;
  myChart.value = echarts.init(chartDom.value);
  myChart.value.setOption({
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Storage",
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 7,
          borderColor: "#fff",
          borderWidth: 2,
        },
        tooltip: {
          confine: true,
          trigger: "item",
          formatter: (data: any) => {
            return `${data.marker} ${data.name}: ${formatBytes(data.value)} (${data.percent}%)`;
          },
        },

        data: [
          { value: usage.value, name: "Used" },
          { value: freeSpace.value, name: "Free" },
        ],
      },
    ],
  });
}

onUpdated(renderChart);

onMounted(renderChart);
</script>
<template>
  <div class="card lg:card-side bg-base-100 border h-full" v-if="subscription && dbSize">
    <div class="card-body px-6 py-6">
      <h2 class="card-title text-2xl">Capacity</h2>
      <div class="flex flex-col justify-center h-full">
        <div class="text-xl">Free: {{ formatBytes(freeSpace) }}</div>
        <div class="text-xl mt-1">Used: {{ formatBytes(usageSpace) }}</div>
        <div class="text-xl mt-1">Available: {{ formatBytes(totalSpace) }}</div>
        <div class="text-xl mt-1" v-if="subscription?.attributes.status !== 'active'">
          Subscription: {{ subscription?.attributes.status_formatted }}
        </div>
      </div>
    </div>
    <figure>
      <div class="chart" ref="chartDom"></div>
    </figure>
  </div>
</template>

<style scoped>
.chart {
  width: 400px;
  height: 300px;
}
</style>
