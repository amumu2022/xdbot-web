<!--
 * @Author: xdteam
 * @Date: 2024-04-18 21:36:31
 * @LastEditTime: 2024-08-09 23:44:22
 * @LastEditors: YourName
 * @Description: 
 * 版权声明
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { GetTaskLog } from "@/api/Tools/scheduler";
import dayjs from "dayjs";
import { message } from "@/utils/message";

const ruleFormRef = ref();
let intervalId: ReturnType<typeof setInterval>; // 定义定时器变量类型

const props = defineProps({
  id: Number
});

const data = ref("日志为空");
function getRef() {
  return ruleFormRef.value;
}

async function fetchDataAndSetData() {
  const res = await GetTaskLog(props.id);
  if (res.code !== 200) {
    return -1;
  } else {
    const { last_execution_time, content, last_run_time } = res.data;
    const formattedStartTime = dayjs(last_execution_time * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndTime = dayjs(
      (last_execution_time + last_run_time) * 1000
    ).format("YYYY-MM-DD HH:mm:ss");
    const text1 = `## 开始执行... ${formattedStartTime}`;
    const text2 = `${content}`;
    if (res.data.status == 0) {
      const text3 = `## 执行结束... ${formattedEndTime}    耗时：${last_run_time}秒`;
      data.value = text1 + "\n\n\n" + text2 + "\n\n" + text3;
      return 0;
    } else {
      data.value = text1 + "\n\n\n" + text2;
      return 1;
    }
  }
}

defineExpose({ getRef });

onMounted(() => {
  fetchDataAndSetData();
  intervalId = setInterval(async () => {
    const status = await fetchDataAndSetData(); // 使用await等待Promise完成
    if (status === -1) {
      message(`获取失败`, { type: "error" });
    } else if (status === 0) {
      message(`任务执行完成`, { type: "success" });
      clearInterval(intervalId);
    }
  }, 2000); // 每2秒执行一次
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div style="width: 100%">
    <el-input
      type="textarea"
      rows="15"
      v-model="data"
      readonly
      class="log-input"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
}

:deep(.log-input .el-textarea__inner) {
  background-color: #393d49 !important;
  color: #ffffff !important;
  border-radius: 5px;
}

.sc-code-editor {
  width: 100%;
}
</style>
