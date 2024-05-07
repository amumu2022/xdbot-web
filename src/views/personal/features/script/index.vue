<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, h, onMounted } from "vue";
import { getScriptLog, RunScript } from "@/api/system/dock";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import formPrimitive from "./formPrimitive.vue";
import fold_down from "@iconify-icons/ep/caret-bottom";
import fold_up from "@iconify-icons/ep/caret-top";
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
defineOptions({
  name: "FeaturesScript"
});

const formRef = ref();
const tableRef = ref();

function run(name: string) {
  RunScript(name).then(async res => {
    if (res.code !== 200) {
      message(`操作失败，${res.message}`, { type: "error" });
      return "";
    } else {
      message(`运行成功`, { type: "success" });
    }
  });
}
// 子组件 prop 为 primitive 类型的 demo
const formPrimitiveParam = ref("");
const resetFormPrimitiveParam = ref(formPrimitiveParam.value);

function log(name: string) {
  getScriptLog(name).then(res => {
    if (res.code !== 200) {
      message(`操作失败，${res.message}`, { type: "error" });
      return "";
    } else {
      const data = JSON.parse(res.data);
      const text1 = `## 开始执行... ${data.begin_time}`;
      const text2 = `${data.log}`;
      const text3 = `## 执行结束... ${data.end_time}  耗时：${data.use_time}秒`;
      addDialog({
        title: "日志详情",
        width: "46%",
        draggable: true,
        fullscreenIcon: true,
        fullscreen: isMobile.value ? true : false,
        contentRenderer: () =>
          h(formPrimitive, {
            data: `${text1}\n\n${text2}\n${text3}`,
            "onUpdate:data": val => (formPrimitiveParam.value = val)
          }),
        closeCallBack: () => {
          // 重置表单数据
          formPrimitiveParam.value = resetFormPrimitiveParam.value;
        }
      });
    }
  });
}

const {
  form,
  loading,
  columns,
  dataList,
  selectedNum,
  pagination,
  onSearch,
  exportExcel,
  resetForm,
  openDialog,
  handleDelete,
  onbatchDel,
  isMobile,
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
      :model="form"
      v-if="searchStatus"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="脚本名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入脚本名称"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch()"
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

    <PureTableBar title="脚本列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增脚本
        </el-button>

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
              circle
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('编辑', row)"
            />
            <el-popconfirm
              :title="`是否确认运行脚本：${row.name}`"
              @confirm="run(row.name)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  circle
                  type="success"
                  :size="size"
                  :icon="useRenderIcon(UbuntuFill)"
                />
              </template>
            </el-popconfirm>
            <el-button
              class="reset-margin"
              circle
              type="primary"
              :size="size"
              :icon="useRenderIcon(CheckboxCircleLine)"
              @click="log(row.name)"
            />
            <el-popconfirm
              :title="`是否确认删除脚本编号为${row.id}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  circle
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                />
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
