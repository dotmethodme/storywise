<script lang="ts" setup>
import { generatedApi } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { getPreferredColorScheme } from "@/utils/theme";
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

  const { data } = await generatedApi.getSessionsPerDay({
    app_id: activeAppId,
    days: selectedDays,
  });

  if (data.items.length === 0) {
    return;
  }

  const xAxisData = data.items.map((d) => `${d.year}-${d.month}-${d.day}`);
  const seriesData = data.items.map((d) => d.count);

  const option: echarts.EChartsOption = {
    xAxis: {
      type: "category",
      data: xAxisData,
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
      borderColor: "#0f0",
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        data: seriesData,
        type: "line",
        smooth: true,
      },
    ],
  };

  const chart = echarts.init(chartEl.value, getPreferredColorScheme() === "dark" ? "dark" : undefined);
  chart.setOption(option);

  chartObj.value = chart;
}

onMounted(async () => {
  setTimeout(() => {
    render(store.activeAppId, store.selectedDays);
  }, 100);
});
onUnmounted(() => chartObj.value?.dispose());
watch([activeAppId, selectedDays], ([activeAppId, selectedDays]) => render(activeAppId, selectedDays));
</script>

<template>
  <div ref="chartEl" class="chart" style="height: 300px"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
  min-height: 300px;
}
</style>
