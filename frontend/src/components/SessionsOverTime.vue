<script lang="ts" setup>
import { getSessions } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import * as echarts from "echarts";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref, watch } from "vue";

const chartEl = ref<HTMLElement>();
const chartObj = ref<echarts.ECharts>();
const store = useGlobalStore();
const { activeAppId, selectedDays } = storeToRefs(store);

async function render(activeAppId: string, selectedDays: number) {
  if (!chartEl.value) return;
  if (chartObj.value) {
    chartObj.value.dispose();
  }

  const data = await getSessions(activeAppId, selectedDays);

  if (data.length === 0) {
    return;
  }

  const option: echarts.EChartsOption = {
    xAxis: {
      type: "category",
      data: data.map((d) => `${d.year}-${d.month}-${d.day}`),
      axisLine: {
        show: false,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "2%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        data: data.map((d) => d.count),
        type: "line",
        smooth: true,
      },
    ],
  };

  const chart = echarts.init(chartEl.value);
  chart.setOption(option);

  chartObj.value = chart;
}

onMounted(async () => render(store.activeAppId, store.selectedDays));
onUnmounted(() => chartObj.value?.dispose());
watch([activeAppId, selectedDays], ([activeAppId, selectedDays]) => render(activeAppId, selectedDays));
</script>

<template>
  <div ref="chartEl" class="chart"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
