<script setup lang="ts">
import error from "./error.png";
import loading from "./loading.png";
import { ElLoading, ElMessageBox } from "element-plus";
import "vue-waterfall-plugin-next/dist/style.css";
import InfiniteLoading from "v3-infinite-loading";
import { onMounted, reactive, ref, nextTick, toRaw } from "vue";
import backTop from "@/assets/svg/back_top.svg?component";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import { usePublicHooks } from "../../hooks";
import { Check, Message } from "@element-plus/icons-vue";
import {
  getBottleData,
  deleteBottleApi,
  UpdateBottle_status
} from "@/api/bot/features/bottleApi";
import { message } from "@/utils/message";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";

const { isMobile } = useBasicLayout();
defineOptions({
  name: "FeaturesBottle"
});

const options = reactive({
  rowKey: "id",
  gutter: 10,
  hasAroundGutter: true,
  width: 320,
  breakpoints: {
    1200: { rowPerView: 4 },
    800: { rowPerView: 3 },
    500: { rowPerView: 1 }
  },
  animationEffect: "animate__zoomInUp",
  animationDuration: 1000,
  animationDelay: 300,
  imgSelector: "src.original",
  loadProps: {
    loading,
    error
  },
  lazyload: true
});

const { switchStyle } = usePublicHooks();

const page = ref(1);
const list = ref([]);
const pageSize = ref(20);
const loadingInstance = ref();
const dialogVisible = ref(false);
const selectedItem = ref();
const searchStatus = ref(false);
const form = reactive({
  user_id: "",
  enable: undefined,
  beLooked: undefined,
  currentPage: page.value,
  pageSize: pageSize.value
});
const _loading = ref(true);
const formRef = ref();

function transformData(old_data) {
  return old_data.map(item => {
    const newItem = {
      id: item.id,
      user_id: item.user_id,
      group_id: item.group_id,
      content: undefined,
      src: undefined,
      type: undefined,
      enable: item.enable,
      beLooked: item.beLooked
    };

    if (item.sendType === 2) {
      newItem.type = "image";

      const staticIndex = item.content.indexOf("static");
      const targetPath = item.content.substring(staticIndex);
      newItem.src = {
        original: targetPath
      };
    } else if (item.sendType === 1) {
      newItem.type = "text";
      newItem.content = item.content;
    }

    return newItem;
  });
}

async function handleLoadMore(type?: boolean) {
  loadingInstance.value = ElLoading.service({
    target: ".content",
    background: "transparent",
    text: "加载中"
  });
  form.currentPage = type ? 1 : page.value;
  getBottleData(toRaw(form)).then(res => {
    setTimeout(() => {
      const { data } = res;
      _loading.value = false;
      if (type) {
        list.value = transformData(data["results"]);
      } else {
        list.value.push(...transformData(data["results"]));
        page.value += 1;
      }
      nextTick(() => {
        loadingInstance.value.close();
      });
    }, 500);
  });
}

function handleDelete(item, index) {
  ElMessageBox.confirm(
    `确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>这个漂流瓶吗?`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      deleteBottleApi(item.id).then(res => {
        if (res.code === 200) {
          list.value.splice(index, 1);
          setTimeout(() => {
            message("已成功删除该漂流瓶", {
              type: "success"
            });
          }, 200);
        } else {
          message(`操作失败，${res.message}`, { type: "error" });
        }
      });
    })
    .catch(() => {});
}

function handleLooked(item) {
  message(`当前瓶子${item.beLooked ? "已被打捞" : "未被捞起"}`, {
    type: item.beLooked ? "success" : "warning"
  });
}

function handleClick(item) {
  selectedItem.value = item;
  dialogVisible.value = true;
}

function onChange(item) {
  const data = item.enable ? "1" : "0";
  UpdateBottle_status(item.id, data)
    .then(res => {
      if (res.code === 200) {
        setTimeout(() => {
          message(item.enable ? "已通过" : "已拒绝", {
            type: "success"
          });
        }, 200);
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    })
    .catch(() => {
      item.enable ? item.enable == false : item.enable == true;
    });
  dialogVisible.value = false;
}

function handlePass() {
  dialogVisible.value = false;
}

const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  handleLoadMore(true);
};

onMounted(() => {
  handleLoadMore();
  searchStatus.value = !isMobile.value;
});
</script>

<template>
  <div class="main1">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="用户ID：" prop="user_id">
        <el-input
          v-model="form.user_id"
          placeholder="用户ID"
          clearable
          class="!w-[120px]"
          @keyup.enter="handleLoadMore(true)"
        />
      </el-form-item>

      <el-form-item label="审核状态：" prop="enable">
        <el-select
          v-model="form.enable"
          placeholder="请选择"
          clearable
          class="!w-[120px]"
          @change="handleLoadMore(true)"
        >
          <el-option label="已过审" :value="true" />
          <el-option label="未审批" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item label="打捞状态：" prop="beLooked">
        <el-select
          v-model="form.beLooked"
          placeholder="请选择"
          clearable
          class="!w-[120px]"
          @change="handleLoadMore(true)"
        >
          <el-option label="被打捞" :value="true" />
          <el-option label="沉底中" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="_loading"
          @click="handleLoadMore()"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar height="87vh" class="content">
      <Waterfall :list="list" v-bind="options">
        <template #item="{ item, url, index }">
          <div
            class="bg-gray-600 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
          >
            <div
              v-if="item.type === 'text'"
              class="p-4 text-gray-50"
              @click="handleClick(item)"
            >
              <p class="line-clamp-6">{{ item.content }}</p>
            </div>

            <div v-else class="overflow-hidden">
              <LazyImg
                :url="url"
                @click="handleClick(item)"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
              />
            </div>

            <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
              <h5 class="pb-2 text-gray-50 group-hover:text-gray-300">
                {{ item.user_id }}
              </h5>
              <div
                class="pt-1 flex justify-between items-center border-t border-t-gray-600 border-opacity-50"
              >
                <h5 class="text-gray-50 group-hover:text-gray-300">
                  {{ item.group_id }}
                </h5>

                <div>
                  <!-- 指示灯组件 -->

                  <el-button
                    :type="item.beLooked ? 'success' : 'danger'"
                    class="mr-3"
                    :icon="item.beLooked ? Check : Message"
                    circle
                    size="small"
                    @click.stop="handleLooked(item)"
                  />

                  <el-switch
                    size="default"
                    class="mr-3"
                    v-model="item.enable"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="已过审"
                    inactive-text="未审批"
                    inline-prompt
                    :style="switchStyle"
                    @change="onChange(item)"
                  />

                  <el-button
                    type="danger"
                    size="small"
                    round
                    @click.stop="handleDelete(item, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <el-backtop
        title="回到顶部"
        :right="35"
        :visibility-height="400"
        target=".content .el-scrollbar__wrap"
      >
        <backTop />
      </el-backtop>

      <InfiniteLoading :firstload="false" @infinite="handleLoadMore" />

      <el-dialog
        v-model="dialogVisible"
        width="50%"
        title="漂流瓶详情"
        :fullscreen="isMobile ? true : false"
      >
        <template v-if="selectedItem && selectedItem.type === 'text'">
          <p
            :style="{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333',
              backgroundColor: '#f8f8f8',
              textAlign: 'justify',
              padding: '20px',
              borderRadius: '8px',
              margin: '20px 0',
              boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
            }"
          >
            {{ selectedItem.content }}
          </p>
        </template>
        <template v-else>
          <el-image
            class="w-1/2 h-1/2"
            :src="selectedItem.src.original"
            :preview-src-list="[selectedItem.src.original]"
          />
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handlePass">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>
