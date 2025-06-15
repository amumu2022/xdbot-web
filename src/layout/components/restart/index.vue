<!--
 * @Author: xdteam
 * @Date: 2024-08-09 20:33:38
 * @LastEditTime: 2024-08-09 20:34:26
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \vue-pure-admin\src\layout\components\restart\index.vue
 * 版权声明
-->
<script setup lang="ts">
import { useBoolean } from "../../hooks/useBoolean";
import PowerFill from "@iconify-icons/ri/shut-down-line";
import { restartCode } from "@/api/system/monitor";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

function handlePowerOff() {
  ElMessageBox.confirm(
    `请确定是否<strong><span style='color:red'>立即关闭系统</span></strong>`,
    "系统提示",
    {
      confirmButtonText: "确认关闭",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  ).then(() => {
    message(`系统正在关闭`, {
      type: "warning"
    });
    restartCode();
  });
}

const { bool: show } = useBoolean();
</script>

<template>
  <div
    class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
    @click="handlePowerOff"
  >
    <IconifyIconOffline :icon="PowerFill" />
  </div>
  <SearchModal v-model:value="show" />
</template>

<style scoped>
.search-container:hover {
  color: var(--el-color-danger); /* hover时显示红色，突出危险操作 */
}
</style>
