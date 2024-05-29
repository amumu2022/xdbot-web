<script setup lang="ts">
import { ref, onMounted, reactive, toRaw } from "vue";
import CardMax from "@/components/ReCardMax/CardMax.vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { message } from "@/utils/message";
import { downloadByUrl } from "@pureadmin/utils";

import {
  getPluginsList,
  getPluginsAllList,
  createPluginsApi,
  deletePluginsApi,
  UpdatePlugins_status
} from "@/api/Tools/plugins";
const { isMobile } = useBasicLayout();
const loading = ref(true);
const formRef = ref();

const form = reactive({
  name: "",
  enable: ""
});

const searchStatus = ref(false);
const productList = ref([]);

const pagination = ref({ current: 1, pageSize: 12, total: 0 });

async function onSearch() {
  try {
    loading.value = true;
    const post_data = toRaw(form);
    const name = post_data.name;
    // const enable = post_data.enable;
    const { data } = await getPluginsAllList();
    productList.value = data.list.filter(product =>
      product.name.includes(name)
    );
    pagination.value = {
      ...pagination.value,
      total: data.list.length
    };
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
}

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
};
const onCurrentChange = (current: number) => {
  pagination.value.current = current;

  const aa = productList.value
    .slice(
      pagination.value.pageSize * (pagination.value.current - 1),
      pagination.value.pageSize * pagination.value.current
    )
    .filter(v => v.name.toLowerCase().includes(form.name.toLowerCase()));

  console.log(aa);
};

const handleClickDetial = product => {
  console.log(product);
};
const handleClickUpdate = product => {
  console.log(product);
};

const handleClickStop = product => {
  UpdatePlugins_status(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 已停用`, { type: "success" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
};

const handleClickReport = product => {
  console.log(product);
};

const handleClickDelete = product => {
  deletePluginsApi(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 卸载成功`, { type: "warning" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
};

const handleClickDownloads = product => {
  const link = document.createElement("a");
  link.href = product.url;
  link.target = "_blank";
  link.download = "";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  // downloadByUrl(product.url, "x.py");
  console.log(product.url);
};

const handleClickInstall = product => {
  createPluginsApi(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 安装成功`, { type: "success" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
};
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

onMounted(async () => {
  onSearch();
  searchStatus.value = !isMobile.value;
});

defineOptions({
  name: "PluginsCenter"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
</script>

<template>
  <div class="main">
    <div>
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        v-if="searchStatus"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
        style="
          margin-left: 10px;
          margin-right: 10px;
          margin-top: 20px;
          margin-bottom: 20px;
        "
      >
        <el-form-item label="插件名称：" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入插件名称"
            clearable
            class="!w-[160px]"
            @keyup.enter="onSearch()"
          />
        </el-form-item>

        <el-form-item label="状态：" prop="enable">
          <el-select
            v-model="form.enable"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
            @change="onSearch()"
          >
            <el-option label="已启用" value="1" />
            <el-option label="已停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div
      v-loading="loading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-empty
        description="暂无数据"
        v-show="
          productList
            .slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current
            )
            .filter(v => v.name.toLowerCase().includes(form.name.toLowerCase()))
            .length === 0
        "
      />
      <template v-if="pagination.total > 0">
        <el-row>
          <el-col
            v-for="(product, index) in productList
              .slice(
                pagination.pageSize * (pagination.current - 1),
                pagination.pageSize * pagination.current
              )
              .filter(v =>
                v.name.toLowerCase().includes(form.name.toLowerCase())
              )"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <CardMax
              :product="product"
              @product-detial="handleClickDetial"
              @product-update="handleClickUpdate"
              @product-stop="handleClickStop"
              @product-report="handleClickReport"
              @product-delete="handleClickDelete"
              @product-download="handleClickDownloads"
              @product-install="handleClickInstall"
            />
          </el-col>
        </el-row>
        <el-pagination
          class="float-right"
          style="margin: 30px"
          v-model:currentPage="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </div>
  </div>
</template>
