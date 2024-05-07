<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});
import { ElNotification } from "element-plus";
const pieChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(pieChartRef as Ref<HTMLDivElement>, {
  theme
});

const props = defineProps({
  colorList: {
    type: Array,
    default: () => []
  },
  dataList: {
    type: Array,
    default: () => []
  }
});
setOptions(
  {
    tooltip: {
      trigger: "item"
    },
    legend: {
      icon: "circle",
      //@ts-expect-error
      right: true
    },
    series: [
      {
        name: "饼图",
        type: "pie",
        top: "20%",
        radius: "80%",
        center: ["40%", "50%"],
        color: props.colorList,
        data: props.dataList
      }
    ]
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
      ElNotification({
        title: "Error",
        message: "This is an error message",
        duration: 10000,
        type: "error"
      });
    }
  },
  // 点击空白处
  {
    type: "zrender",
    name: "click",
    callback: params => {
      console.log("点击空白处", params);
    }
  }
);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="pieChartRef" style="width: 100%; height: 35vh" />
</template>
