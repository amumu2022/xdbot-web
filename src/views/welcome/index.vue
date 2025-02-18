<script setup lang="ts">
import dayjs from "dayjs";
import { openLink } from "@pureadmin/utils";
import { getAdvertData } from "@/api/system/advert";
import TypeIt from "@/components/ReTypeit";
import { ref, computed, markRaw, onMounted } from "vue";
import Github from "./components/Github.vue";
import { randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";
import { getVersionData } from "@/api/system/version";
import MdEditor from "md-editor-v3";
import { isExpired } from "@/utils/xdteam";

defineOptions({
  name: "Welcome"
});

const latestNewsData = ref([]);
const loading = ref<boolean>(true);
const pic_list = ref([]);
const { version } = __APP_INFO__.pkg;
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

function RenderingLog() {
  const post_data = {
    version: "",
    content: "",
    enable: "",
    currentPage: 1,
    pageSize: 100
  };
  getVersionData(post_data).then(({ data }) => {
    latestNewsData.value = data.results.map(v => {
      return {
        content: v.content,
        timestamp: dayjs(v.update_time).format("YYYY/MM/DD hh:mm:ss A"),
        icon: markRaw(
          useRenderFlicker({
            background: randomColor({ type: "hex" }) as string
          })
        )
      };
    });
  });
}

function RenderingSwip() {
  const post_data = { custom: "", alt: "", src: "" };

  getAdvertData(post_data).then(({ data }) => {
    const updatedPicList = [];
    data.results.forEach(item => {
      if (!isExpired(item.end_time)) {
        updatedPicList.push(item);
      }
    });
    pic_list.value = updatedPicList;
  });
}

onMounted(() => {
  RenderingLog();
  RenderingSwip();
});
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
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
              <TypeIt :values="[`每日一赏`]" :cursor="false" :speed="60" />
            </a>
          </template>

          <el-skeleton animated :rows="7" :loading="loading">
            <el-carousel :interval="4000" type="card">
              <el-carousel-item
                v-for="item in pic_list"
                :key="item"
                style="display: flex; align-items: center"
              >
                <el-image
                  :src="item.src"
                  fit="contain"
                  @click="openLink(item.alt)"
                />
              </el-carousel-item>
            </el-carousel>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
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
      </el-col>

      <el-col
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
      </el-col>
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
</style>
