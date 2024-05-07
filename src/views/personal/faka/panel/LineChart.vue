<template>
  <div ref="lineChartRef" style="width: 100%; height: 35vh" />
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";

const { isDark } = useDark();

const props = defineProps({
  OrderList: {
    type: Array,
    default: () => []
  },
  MoneyList: {
    type: Array,
    default: () => []
  },
  month: {
    type: Boolean,
    default: () => true
  }
});

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "default";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});
const xData = props.MoneyList.map(item => item[0]);
const yData = props.MoneyList.map(item => item[1]);
const yData2 = props.OrderList.map(item => item[1]);
setOptions({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    bottom: "20px",
    right: "10px"
  },
  legend: {
    //@ts-expect-error
    right: true,
    data: ["交易额", "订单数量"]
  },
  calculable: true,
  xAxis: [
    {
      triggerEvent: true,
      type: "category",
      splitLine: {
        show: true
      },
      axisTick: {
        show: false
      },
      data: xData
    }
  ],
  yAxis: [
    {
      triggerEvent: true,
      type: "value",
      splitLine: {
        show: true
      },
      axisLine: {
        show: false
      }
    }
  ],
  dataZoom: [
    {
      type: "slider",
      show: false,
      realtime: true,
      startValue: 0,
      endValue: props.month ? 31 : 7
    }
  ],
  series: [
    {
      name: "交易额",
      type: "line",
      symbolSize: 10,
      symbol: "circle",
      color: "#f56c6c",
      markPoint: {
        label: {
          color: "#fff"
        },
        data: [
          {
            type: "max",
            name: "最大值"
          },
          {
            type: "min",
            name: "最小值"
          }
        ]
      },
      data: yData
    },
    {
      name: "订单数量",
      type: "line",
      symbolSize: 10,
      symbol: "circle",
      color: "#67c23a",
      markPoint: {
        label: {
          color: "#fff"
        },
        data: [
          {
            type: "max",
            name: "最大值"
          },
          {
            type: "min",
            name: "最小值"
          }
        ]
      },
      data: yData2
    }
  ],
  addTooltip: true
});
</script>
