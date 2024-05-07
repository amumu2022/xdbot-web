<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import View from "@iconify-icons/ep/view";
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
const resultTypes = [
  { value: "已完成", text: "已完成" },
  { value: "待支付", text: "待支付" },
  { value: "已超时", text: "已超时" }
  // 添加更多操作类型...
];
const methodTypes = [
  { value: "货币兑换", text: "货币兑换" },
  { value: "支付宝支付", text: "支付宝支付" },
  { value: "微信支付", text: "微信支付" },
  { value: "QQ支付", text: "QQ支付" },
  { value: "余额支付", text: "余额支付" }
  // 添加更多操作类型...
];

defineOptions({
  name: "FakaOrders"
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
  isMobile,
  pagination,
  openDialog,
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
      :model="form"
      v-if="searchStatus"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="商品名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入商品名称"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>
      <el-form-item label="下单用户：" prop="user">
        <el-input
          v-model="form.user"
          placeholder="请输入下单用户"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>

      <el-form-item label="售出商品：" prop="msg">
        <el-input
          v-model="form.msg"
          placeholder="请输入售出商品内容"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>

      <el-form-item label="流水单号：" prop="border">
        <el-input
          v-model="form.border"
          placeholder="请输入流水单号"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>
      <el-form-item label="订单状态：" prop="result">
        <el-select
          v-model="form.result"
          placeholder="请选择"
          clearable
          class="!w-[120px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in resultTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式：" prop="method">
        <el-select
          v-model="form.method"
          placeholder="请选择"
          clearable
          class="!w-[120px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in methodTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <label class="el-form-item__label is-required font-bold"
          >操作时间：</label
        >
        <el-date-picker
          class="!w-[380px]"
          v-model="form.time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
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

    <PureTableBar title="订单列表" :columns="columns" @refresh="onSearch">
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
              circle
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="openDialog(row)"
            />
            <el-popconfirm
              :title="`是否确认删除日志编号为${row.id}的这条数据`"
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
