<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, onMounted } from "vue";
import Upload from "@iconify-icons/ri/upload-line";
import Role from "@iconify-icons/ri/admin-line";
import More from "@iconify-icons/ep/more-filled";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { getBotList } from "@/api/bot/group/group";
import { message } from "@/utils/message";
import fold_down from "@iconify-icons/ep/caret-bottom";
import fold_up from "@iconify-icons/ep/caret-top";
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);
defineOptions({
  name: "AccountAuthorize"
});
const formRef = ref();
const tableRef = ref();

interface BotOption {
  label: string;
  value: string;
}

const Bot_list = ref<BotOption[]>([]); // 明确BotOptions的类型是BotOption的数组

onMounted(async () => {
  const res = await getBotList();
  if (res.code === 200) {
    const data = res.data;
    const transformedArray = data.map(item => ({
      value: item,
      label: item
    }));

    Bot_list.value = transformedArray;

    if (data.length > 0) {
      message(`刷新成功`, { type: "success" });
    } else {
      message(`未获取到机器人信息`, { type: "warning" });
    }
  } else {
    message(`操作失败，${res.message}`, { type: "error" });
  }
});

function SearchTable() {
  const oldData = dataList.value;
  const NewData = filterGroups(oldData, form.group_id, form.group_name);
  dataList.value = NewData;
}

// 筛选列表信息
function filterGroups(groups, groupId, groupName) {
  return groups.filter(group => {
    const idMatch = groupId
      ? group.group_id.toString().includes(groupId)
      : true;
    const nameMatch = groupName ? group.group_name.includes(groupName) : true;
    return idMatch && nameMatch;
  });
}

const {
  form,
  loading,
  columns,
  isMobile,
  dataList,
  pagination,
  selectedNum,
  buttonClass,
  onbatchQuit,
  onbatchSign,
  onSelectionCancel,
  handleSelectionChange,
  exportExcel,
  onSearch,
  resetForm,
  QuitGroup,
  SignGroup,
  handleSizeChange,
  handleCurrentChange,
  handleAuth,
  handleBlack,
  handleMegBox,
  handleMember
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
      <el-form-item label="机器人账号：" prop="enable">
        <el-select
          v-model="form.bot_id"
          placeholder="请选择"
          clearable
          class="!w-[160px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in Bot_list"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="群号：" prop="group_id">
        <el-input
          v-model="form.group_id"
          placeholder="请输入群号"
          clearable
          class="!w-[160px]"
          @keyup.enter="SearchTable()"
        />
      </el-form-item>

      <el-form-item label="群名：" prop="group_name">
        <el-input
          v-model="form.group_name"
          placeholder="请输入群名"
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
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="群聊列表" :columns="columns" @refresh="onSearch">
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
          <el-popconfirm title="是否确认退群?" @confirm="onbatchQuit">
            <template #reference>
              <el-button type="danger" text class="mr-1"> 批量退群 </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="是否确认批量签到?" @confirm="onbatchSign">
            <template #reference>
              <el-button type="primary" text class="mr-1"> 批量签到 </el-button>
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
                      :icon="useRenderIcon(Upload)"
                      @click="handleMember(row)"
                    >
                      查看群成员
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="handleAuth(row)"
                    >
                      授权本群
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-popconfirm
                      :title="`是否确认退出群【${row.group_id}】`"
                      @confirm="QuitGroup(row)"
                    >
                      <template #reference>
                        <el-button
                          :class="buttonClass"
                          link
                          type="primary"
                          :size="size"
                          :icon="useRenderIcon(Role)"
                        >
                          退出此群
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Role)"
                      @click="handleBlack(row)"
                    >
                      加黑此群
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Role)"
                      @click="handleMegBox(row)"
                    >
                      发送信息
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Role)"
                      @click="SignGroup(row)"
                    >
                      群打卡
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
