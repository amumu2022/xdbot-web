<script setup lang="ts">
// import dayjs from "dayjs";
import TypeIt from "@/components/ReTypeit";
import { ref, computed } from "vue";
import Github from "./components/Github.vue";
import Dashboard from "./components/dashboard.vue";
import BotInfo from "./components/BotOnline.vue";
// import { randomColor } from "@pureadmin/utils";
// import { useRenderFlicker } from "@/components/ReFlicker";
// import { getVersionData } from "@/api/system/version";
import MdEditor from "md-editor-v3";
import ReCol from "@/components/ReCol";

defineOptions({
  name: "Welcome"
});

const latestNewsData = ref([]);
const loading = ref<boolean>(true);
const { version } = __APP_INFO__.pkg;
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

// function RenderingLog() {
//   const post_data = {
//     version: "",
//     content: "",
//     enable: "",
//     currentPage: 1,
//     pageSize: 100
//   };
//   getVersionData(post_data).then(({ data }) => {
//     latestNewsData.value = data.results.map(v => {
//       return {
//         content: v.content,
//         timestamp: dayjs(v.update_time).format("YYYY/MM/DD hh:mm:ss A"),
//         icon: markRaw(
//           useRenderFlicker({
//             background: randomColor({ type: "hex" }) as string
//           })
//         )
//       };
//     });
//   });
// }

// onMounted(() => {
//   RenderingLog();
// });
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col class="mb-[18px]" :value="18" :xs="24">
        <el-card shadow="hover" class="equal-height-card">
          <template #header>
            <a
              :class="titleClass"
              href="https://www.cnblogs.com/xdteam/"
              target="_black"
            >
              <TypeIt
                :className="'type-it3'"
                :values="[`状态面板`]"
                :cursor="false"
                :speed="60"
              />
            </a>
          </template>
          <el-scrollbar max-height="280">
            <Dashboard />
          </el-scrollbar>
        </el-card>
      </re-col>

      <re-col v-motion class="mb-[18px]" :value="6" :xs="24">
        <el-card shadow="hover" class="equal-height-card">
          <template #header>
            <a
              :class="titleClass"
              href="https://www.cnblogs.com/xdteam/"
              target="_black"
            >
              <TypeIt
                :className="'type-it4'"
                :values="[`bot连接信息`]"
                :cursor="false"
                :speed="60"
              />
            </a>
          </template>
          <el-scrollbar max-height="280">
            <BotInfo />
          </el-scrollbar>
        </el-card>
      </re-col>

      <re-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card shadow="hover">
          <template #header>
            <a
              :class="titleClass"
              href="https://www.cnblogs.com/xdteam/"
              target="_black"
            >
              <TypeIt
                :className="'type-it2'"
                :values="[`BotAdmin 版本日志（当前版本 v${version}）`]"
                :cursor="false"
                :speed="60"
              />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar max-height="250">
                <el-timeline v-show="latestNewsData?.length > 0">
                  <el-timeline-item
                    v-for="(item, index) in latestNewsData"
                    :key="index"
                    :icon="item.icon"
                    :timestamp="item.timestamp"
                  >
                    <md-editor v-model="item.content" preview-only />
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-show="latestNewsData?.length === 0" />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </re-col>

      <re-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card shadow="hover" style="height: 350px">
          <template #header>
            <a
              :class="titleClass"
              href="https://www.cnblogs.com/xdteam/"
              target="_black"
            >
              <TypeIt
                :className="'type-it1'"
                :values="['作者信息']"
                :cursor="false"
                :speed="120"
              />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar max-height="250">
                <Github />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}

.align-self-end img {
  border-radius: 50%; /* 边框半径，设置为50%将形成圆形 */
  max-width: 100%; /* 最大宽度为容器宽度 */
  height: 64px; /* 高度自动，保持图片比例 */
  width: 64px; /* 高度自动，保持图片比例 */
  display: block; /* 为了避免边距问题，可以设置为块级元素 */
}

.el-image {
  max-width: 100%;
  max-height: 100%;
  display: block; /* 防止图片下方有间隙 */
}

.equal-height-card {
  height: 350px; // 设置固定高度
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    overflow: hidden;

    .el-scrollbar {
      height: 100%;
    }
  }
}
</style>
