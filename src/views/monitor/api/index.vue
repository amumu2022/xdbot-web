<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import fold_down from "@iconify-icons/ep/caret-bottom";
import fold_up from "@iconify-icons/ep/caret-top";
import { ref, onMounted } from "vue";
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import View from "@iconify-icons/ep/view";

const operationTypes = [
  { value: 0, text: "其他" },
  { value: 1, text: "修改" },
  { value: 2, text: "添加" },
  { value: 3, text: "删除" },
  { value: 4, text: "登录" },
  { value: 5, text: "上传" }
  // 添加更多操作类型...
];
const statusTypes = [
  { value: 0, text: "失败" },
  { value: 1, text: "成功" }
  // 添加更多操作类型...
];
defineOptions({
  name: "ApiMonitor"
});

const formRef = ref();
const tableRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  exportExcel,
  selectedNum,
  pagination,
  openDialog,
  isMobile,
  onSearch,
  resetForm,
  handleDelete,
  onbatchDel,
  onSelectionCancel,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      v-if="searchStatus"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="用户账号：" prop="uid">
        <el-input
          v-model="form.uid"
          placeholder="请输入用户账号"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>
      <el-form-item label="操作模块：" prop="module">
        <el-input
          v-model="form.module"
          placeholder="请输入操作模块"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>
      <el-form-item label="操作类型：" prop="operation">
        <el-select
          v-model="form.operation"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in operationTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="响应状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in statusTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
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

    <PureTableBar title="Api日志列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button type="success" @click="exportExcel">导出</el-button>
        <el-button
          @click="changeStatus"
          :icon="
            searchStatus ? useRenderIcon(fold_up) : useRenderIcon(fold_down)
          "
        />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div
          v-if="selectedNum > 0"
          v-motion-fade
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedNum }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
            <template #reference>
              <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
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
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="openDialog(row)"
            >
              详情
            </el-button>
            <el-popconfirm
              :title="`是否确认删除日志编号为${row.id}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
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
