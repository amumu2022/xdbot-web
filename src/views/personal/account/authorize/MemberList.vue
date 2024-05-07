<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, onMounted, reactive, toRaw } from "vue";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import { type PaginationProps } from "@pureadmin/table";
import { getGroupMemberList } from "@/api/bot/group/group";

// 使用defineProps声明接收的props
const props = defineProps({
  bot: {
    type: String,
    required: true
  },
  group_id: {
    type: String,
    required: true
  }
});

const formRef = ref();
const tableRef = ref();
const dataList = ref([]);
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 20,
  currentPage: 1,
  pageSizes: [20, 50, 100, 150],
  background: true
});

async function onSearch() {
  loading.value = true;
  const res = await getGroupMemberList(props.bot, props.group_id, toRaw(form));
  dataList.value = res.data.results;
  pagination.total = res.data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

function handleSizeChange(val: number) {
  form.currentPage = 1;
  form.pageSize = val;
  onSearch();
}

function handleCurrentChange(val: number) {
  form.currentPage = val;
  onSearch();
}
const form = reactive({
  user_id: "",
  nickname: "",
  currentPage: 1,
  pageSize: 20
});

onMounted(() => {
  onSearch();
});

function SearchTable() {
  const oldData = dataList.value;
  const NewData = filterGroups(oldData, form.user_id, form.nickname);
  dataList.value = NewData;
}

// 筛选列表信息
function filterGroups(groups, user_id, nickname) {
  return groups.filter(group => {
    const nameMatch = nickname ? group.nickname.includes(nickname) : true;
    const idMatch = user_id ? group.user_id.toString().includes(user_id) : true;
    return idMatch && nameMatch;
  });
}

const {
  loading,
  columnMember,
  buttonClass,
  exportExcel,
  handleKick,
  handleMemberBlack
} = useRole(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="用户账号：" prop="user_id">
        <el-input
          v-model="form.user_id"
          placeholder="请输入用户账号"
          clearable
          class="!w-[160px]"
          @keyup.enter="SearchTable()"
        />
      </el-form-item>

      <el-form-item label="昵称：" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入用户账号"
          clearable
          class="!w-[160px]"
          @keyup.enter="SearchTable()"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="SearchTable"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="群成员列表"
      :columns="columnMember"
      @refresh="onSearch"
    >
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
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                      @click="handleKick(row)"
                    >
                      踢出成员
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Password)"
                      @click="handleMemberBlack(row)"
                    >
                      加黑成员
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
