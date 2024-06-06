<script setup lang="ts">
import { ref, onMounted } from "vue";
import { noticesData } from "./data";
import NoticeList from "./noticeList.vue";
import Bell from "@iconify-icons/ep/bell";
import { connectWs, ws_status } from "@/views/personal/features/im/utils/hooks";
const notices = ref(noticesData);
const activeKey = ref(noticesData[0].key);
import { useRouter } from "vue-router";
import { storageLocal } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
const router = useRouter();

interface StorageConfigs {
  ws_url: string;
}

//初始化ws连接
function get() {
  const ws_url = storageLocal().getItem<StorageConfigs>("SimulateSet")?.ws_url;
  if (ws_url) {
    if (!ws_status.value) {
      connectWs(ws_url);
    }
  } else
    ElMessageBox.confirm("ws地址尚未配置，是否跳转配置", "Warning", {
      confirmButtonText: "前往",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        router.push({ name: "FeaturesIM" });
        ElMessage({
          type: "info",
          message: "请点击设置按钮进行设置"
        });
      })
      .catch(() => {
        ElMessage({
          type: "warning",
          message: "配置ws后才能输出日志哦~"
        });
      });
}

onMounted(() => {
  get();
});
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="dropdown-badge navbar-bg-hover select-none">
      <el-badge value="new" class="item">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="Bell" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          :stretch="true"
          v-model="activeKey"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            description="暂无消息"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane
                :label="`${item.name}(${item.list.length})`"
                :name="`${item.key}`"
              >
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" />
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
