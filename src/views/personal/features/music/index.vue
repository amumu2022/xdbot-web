<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";
import { useCopyToClipboard } from "@pureadmin/utils";
import { message } from "@/utils/message";

import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import copy from "@iconify-icons/ep/copy-document";
defineOptions({
  name: "FeaturesMusic"
});

const { clipboardValue, copied } = useCopyToClipboard();

const copyString = string => {
  clipboardValue.value = string;
  if (copied.value) {
    message(`复制成功`, { type: "success" });
  }
};

const formRef = ref();
const tableRef = ref();
const musicOptions = [
  { label: "网易云音乐", value: "0" },
  { label: "腾讯音乐", value: "1" },
  { label: "酷我音乐", value: "2" },
  { label: "酷狗音乐", value: "3" },
  { label: "Bilibili音乐", value: "4" },
  { label: "咪咕音乐", value: "5" },
  { label: "节点一", value: "6" },
  { label: "节点二", value: "7" }
];
const { form, loading, columns, dataList, onSearch, resetForm, exportExcel } =
  useRole();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="歌曲名称：" prop="songname">
        <el-input
          v-model="form.songname"
          placeholder="请输入歌曲名称"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>

      <el-form-item label="音乐平台：" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择音乐平台"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="(item, index) in musicOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="搜索数量：" prop="num">
        <el-input
          v-model="form.num"
          placeholder="请输入搜索数量"
          clearable
          class="!w-[160px]"
        />
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

    <PureTableBar title="歌曲列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button type="success" @click="exportExcel">导出</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="id"
          ref="tableRef"
          adaptive
          stripe
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(copy)"
              @click="copyString(row.songUrl)"
            >
              复制
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
