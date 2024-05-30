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
  UpdatePluginsApi,
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
  installed: "1",
  enable: undefined
});

const searchStatus = ref(false);
const productList = ref([]);

const pagination = ref({ current: 1, pageSize: 12, total: 0 });

// 筛选已经安装的插件
function completeInstalledPlugins(
  allPlugins: any[],
  installedPlugins: any[]
): Array<{ [key: string]: any }> {
  const pluginMap = new Map(allPlugins.map(plugin => [plugin.name, plugin]));

  return installedPlugins.map(installedPlugin => {
    const fullPlugin = pluginMap.get(installedPlugin.name);

    if (fullPlugin) {
      return { ...fullPlugin, ...installedPlugin };
    }

    return installedPlugin;
  });
}

async function onSearch() {
  try {
    const post_data = toRaw(form);
    const name = post_data.name;
    const enable = post_data.enable;
    if (enable == "") {
      post_data.enable = undefined;
    }
    const installedPluginsData = await getPluginsList(toRaw(form));
    const installedPlugins = installedPluginsData.data.results;

    const installed = post_data.installed;
    const { data } = await getPluginsAllList();

    productList.value = data.list.filter(product =>
      product.name.includes(name)
    );

    if (installed === "1") {
      productList.value = completeInstalledPlugins(
        productList.value,
        installedPlugins
      );
    }

    pagination.value = {
      ...pagination.value,
      total: productList.value.length
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
};

const handleClickDetial = product => {
  message(`还在开发进程中`, { type: "error" });
};
const handleClickUpdate = product => {
  UpdatePluginsApi(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 更新成功`, { type: "success" });
      onSearch();
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
};

const handleClickStop = product => {
  const enable = product.enable;
  UpdatePlugins_status(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} ${enable ? "已停用" : "已启用"}`, {
        type: "success"
      });
      onSearch();
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
};

const handleClickReport = product => {
  message(`插件 ${product.name} 举报失败`, { type: "error" });
};

const handleClickDelete = product => {
  deletePluginsApi(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 卸载成功`, { type: "warning" });
      onSearch();
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
};

const handleClickInstall = product => {
  createPluginsApi(product).then(async res => {
    if (res.code === 200) {
      message(`插件 ${product.name} 安装成功`, { type: "success" });
      onSearch();
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });

  onSearch();
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

        <el-form-item label="安装情况：" prop="installed">
          <el-select
            v-model="form.installed"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
            @change="onSearch()"
          >
            <el-option label="已安装" value="1" />
            <el-option label="全部插件" value="0" />
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
