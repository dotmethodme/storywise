<script lang="ts" setup>
import { getSessions } from "@/service/data";
import { useGlobalStore } from "@/stores/counter";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const chartEl = ref<HTMLElement>();
const chartObj = ref<echarts.ECharts>();
const store = useGlobalStore();

async function init(days: number | undefined) {
  if (!chartEl.value) return;
  if (chartObj.value) {
    chartObj.value.dispose();
  }

  const data = await getSessions(days);

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

onMounted(async () => init(store.selectedDays));
store.$subscribe(async (_, { selectedDays }) => {
  init(selectedDays);
});
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
