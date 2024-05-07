<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, watch, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { message } from "@/utils/message";
import { ElTree } from "element-plus";
import { getFenqunInfo, UpdateFenqun } from "@/api/bot/group/group";
import { Search } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    bot: "",
    group_id: "",
    cluster: {
      managementList: [],
      group_status: false,
      send_model: 1,
      anonymous: false
    },
    join: {
      join_audit: 1,
      join_ref_msg: "本群暂不接受新成员加入！",
      join_verify_status: false,

      join_verify_time: 5,
      join_verify_num: 5,
      join_check_msg: "",
      join_kick_msg: ""
    },
    ban: {
      ban_black_status: 1,
      ban_black_msg: "",
      ban_age_status: 1,
      ban_age_num: 1,
      ban_age_msg: "",
      ban_level_status: 1,
      ban_level_num: 1,
      ban_level_msg: "",
      ban_nick_status: 1,
      ban_nick_list: [],
      ban_nick_msg: ""
    },
    member: {
      member_join_status: false,
      member_join_msg: "",
      member_kick_status: false,
      member_kick_msg: "",
      member_promotion_status: false,
      member_promotion_msg: "",
      member_quit_status: false,
      member_quit_msg: ""
    },
    Enick: {
      nick_reminder_status: false,
      nick_reminder_msg: "",
      nick_auto_status: false,
      nick_auto_model: "",
      nick_prohibited_status: false,
      nick_prohibited_msg: []
    },
    Eother: {
      other_recall_status: false,
      other_recall_msg: "",
      other_file_status: false,
      other_file_msg: "",
      other_poke_status: false,
      other_poke_msg: ""
    }
  })
});

const AllData = ref([]);
const activeName = ref("tab1");
const switchOptions = [
  {
    value: 1,
    label: "同意"
  },
  {
    value: 2,
    label: "拒绝"
  },
  {
    value: 3,
    label: "忽略"
  }
];
const sendOptions = [
  {
    value: 1,
    label: "文字模式"
  },
  {
    value: 2,
    label: "图片模式"
  },
  {
    value: 3,
    label: "JSON卡片模式"
  },
  {
    value: 4,
    label: "XML卡片模式"
  },
  {
    value: 5,
    label: "回复模式"
  },
  {
    value: 6,
    label: "markdown模板"
  }
];
const newFormInline = ref(props.formInline);
const managementOptions = ref(props.formInline.cluster.managementList);
const nick_prohibited_msgOptions = ref(
  props.formInline.Enick.nick_prohibited_msg
);

const managementInputValue = ref("");
const managementInputVisible = ref(false);
const GroupTree = ref(null);

import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import Save from "@iconify-icons/ri/save-3-fill";

const formRef = ref();
const right_bot = ref("");
const right_group = ref("");

async function refreshbot() {
  const res = await getFenqunInfo();
  if (res.code === 200) {
    GroupTree.value = null;
    const data = res.data;
    AllData.value = data;
    const transformedData = data.map(item => {
      const key = Object.keys(item)[0];
      const children = item[key].map(childItem => {
        const group_id = Object.keys(childItem)[0];
        const group_name = childItem[group_id].group_name;
        const childKey = `${group_id}【${group_name}】`;
        return { label: childKey, group_name: group_name, icon: "ep:avatar" };
      });

      return { label: key, children };
    });
    GroupTree.value = transformedData;
    message(`载入成功`, { type: "success" });
  } else {
    message(`操作失败，${res.message}`, { type: "error" });
  }
}

async function savedata() {
  const post_data = newFormInline.value;

  if (right_bot.value == "" || right_group.value == "") {
    message(`操作失败，请先选中群聊`, { type: "error" });
    return "";
  }

  const index = right_group.value.indexOf("【");
  const group_id = right_group.value.substring(0, index);
  post_data.bot = right_bot.value;
  post_data.group_id = group_id;

  UpdateFenqun(post_data).then(async res => {
    if (res.code === 200) {
      message(`刷新成功`, { type: "success" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  });
}

const handleCheckChange = (data: Tree) => {
  if (!data.children) {
    const currentNode = treeRef.value.getNode(data);

    const parentNode = currentNode.parent.data;

    const bot = parentNode.label;
    const CurrentLabel = data.label;
    const GroupNode = data.group_name;
    for (const item of AllData.value) {
      const bot_id = Object.keys(item);

      if (bot_id[0] == bot) {
        for (const _item of item[bot]) {
          const group_name = Object.keys(_item);
          const oldData = _item[group_name[0]];

          const { Enick, Eother, ban, join, member, cluster } =
            newFormInline.value;

          const newData = {
            Enick: !oldData.Enick ? Enick : oldData.Enick,
            Eother: !oldData.Eother ? Eother : oldData.Eother,
            ban: !oldData.ban ? ban : oldData.ban,
            join: !oldData.join ? join : oldData.join,
            member: !oldData.member ? member : oldData.member,
            cluster: !oldData.cluster ? cluster : oldData.cluster
          };

          if (`${group_name[0]}【${GroupNode}】` == CurrentLabel) {
            right_bot.value = bot;
            right_group.value = CurrentLabel;

            newFormInline.value = {
              ...newFormInline.value,
              ...newData
            };

            break;
          }
        }
      }
    }
  }

  managementOptions.value = newFormInline.value.cluster.managementList;
  nick_prohibited_msgOptions.value =
    newFormInline.value.Enick.nick_prohibited_msg;
};

const handlemanagementClose = (tag: string) => {
  managementOptions.value.splice(managementOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.cluster.managementList = managementOptions.value;
};

const showmanagementInput = () => {
  managementInputVisible.value = true;
};

const handlemanagementInputConfirm = () => {
  if (managementInputValue.value) {
    const tag = managementInputValue.value;
    managementOptions.value = Array.from(
      new Set([...managementOptions.value, tag])
    );
  }
  managementInputVisible.value = false;
  managementInputValue.value = "";
};

watch(managementOptions, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.cluster.managementList = newValue;
});

const nickOptions = ref(props.formInline.ban.ban_nick_list);

const nickInputValue = ref("");
const nickInputVisible = ref(false);

const handlenickClose = (tag: string) => {
  nickOptions.value.splice(nickOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.ban.ban_nick_list = nickOptions.value;
};

const shownickInput = () => {
  nickInputVisible.value = true;
};

const handlenickInputConfirm = () => {
  if (nickInputValue.value) {
    const tag = nickInputValue.value;
    nickOptions.value = Array.from(new Set([...nickOptions.value, tag]));
  }
  nickInputVisible.value = false;
  nickInputValue.value = "";
};

watch(nickOptions, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.ban.ban_nick_list = newValue;
});

const nick_prohibited_msgInputValue = ref("");
const nick_prohibited_msgInputVisible = ref(false);

const handlenick_prohibited_msgClose = (tag: string) => {
  nick_prohibited_msgOptions.value.splice(
    nick_prohibited_msgOptions.value.indexOf(tag),
    1
  );
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.Enick.nick_prohibited_msg = nick_prohibited_msgOptions.value;
};

const shownick_prohibited_msgInput = () => {
  nick_prohibited_msgInputVisible.value = true;
};

const handlenick_prohibited_msgInputConfirm = () => {
  if (nick_prohibited_msgInputValue.value) {
    const tag = nick_prohibited_msgInputValue.value;
    nick_prohibited_msgOptions.value = Array.from(
      new Set([...nick_prohibited_msgOptions.value, tag])
    );
  }
  nick_prohibited_msgInputVisible.value = false;
  nick_prohibited_msgInputValue.value = "";
};

watch(nick_prohibited_msgOptions, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.Enick.nick_prohibited_msg = newValue;
});

interface Tree {
  [key: string]: any;
}

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
watch(filterText, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const defaultProps = {
  children: "children",
  icon: "icon",
  label: "label"
};
onMounted(async () => {
  refreshbot();
});
</script>
<template>
  <el-form
    :model="newFormInline"
    ref="formRef"
    :rules="formRules"
    label-position="top"
    label-width="80px"
    size="default"
    @submit.prevent
  >
    <div class="tab-container">
      <el-row :gutter="20">
        <el-col :md="12" :sm="12" :xs="24">
          <el-card shadow="hover" class="grid-spacing">
            <template #header> 发信设置 </template>

            <el-container>
              <el-header>
                <div class="mt-4">
                  <el-input
                    v-model="filterText"
                    placeholder="输入账号进行过滤"
                    class="w-50 m-2"
                    ><template #prefix>
                      <el-icon class="el-input__icon"><search /></el-icon>
                    </template>
                    <template #append>
                      <el-button
                        :icon="useRenderIcon(Refresh)"
                        @click="refreshbot"
                      />
                    </template>
                  </el-input>
                </div>
              </el-header>
              <el-main>
                <el-tree
                  ref="treeRef"
                  class="filter-tree"
                  :data="GroupTree"
                  :highlight-current="true"
                  accordion
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  @node-click="handleCheckChange"
                  :icon="useRenderIcon(Menu)"
                />
              </el-main>
            </el-container>
          </el-card>
        </el-col>
        <el-col :md="12" :sm="12" :xs="24">
          <el-card shadow="hover" class="grid-spacing">
            <template #header> 分群管理 </template>

            <el-form-item label="分群管理" prop="management">
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                  justify-content: center;
                "
              >
                <el-tag
                  v-for="tag in managementOptions"
                  :key="tag"
                  class="mx-1"
                  :effect="'dark'"
                  closable
                  :disable-transitions="false"
                  @close="handlemanagementClose(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <el-input
                v-if="managementInputVisible"
                v-model="managementInputValue"
                class="ml-1 w-20"
                placeholder="请输入分群管理账号"
                size="small"
                @keyup.enter="handlemanagementInputConfirm"
                @blur="handlemanagementInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click="showmanagementInput"
              >
                + 新增
              </el-button>
            </el-form-item>

            <el-row>
              <el-col :md="12" :sm="12" :xs="12">
                <el-form-item label="本群开关" prop="group_status">
                  <el-switch
                    v-model="newFormInline.cluster.group_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="12" :xs="12">
                <el-form-item label="匿名聊天" prop="anonymous">
                  <el-switch
                    v-model="newFormInline.cluster.anonymous"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="消息模式" prop="send_model">
              <el-select
                v-model="newFormInline.cluster.send_model"
                class="full-width-input"
              >
                <el-option
                  v-for="(item, index) in sendOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div class="static-content-item">
              <el-button
                type="success"
                :icon="useRenderIcon(Save)"
                @click="savedata"
                >保存表单数据</el-button
              >
            </div>
          </el-card>
          <el-card shadow="hover" class="grid-spacing">
            <template #header> 更多管理 </template>
            <el-tabs v-model="activeName" class="demo-tabs">
              <el-tab-pane label="入群验证" name="tab1">
                <el-form-item label="审核动作" prop="join_audit">
                  <el-select
                    v-model="newFormInline.join.join_audit"
                    class="full-width-input"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in switchOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="拒绝理由" prop="join_ref_msg">
                  <el-input
                    v-model="newFormInline.join.join_ref_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :md="8" :sm="24" :xs="24">
                    <el-form-item label="入群验证" prop="join_verify_status">
                      <el-switch
                        v-model="newFormInline.join.join_verify_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" :sm="24" :xs="24">
                    <el-form-item label="验证时间" prop="join_verify_time">
                      <el-input-number
                        v-model="newFormInline.join.join_verify_time"
                        controls-position="right"
                        :min="0"
                        :max="100000000000"
                        :precision="0"
                        :step="1"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" :sm="24" :xs="24">
                    <el-form-item label="失误次数" prop="join_verify_num">
                      <el-input-number
                        v-model="newFormInline.join.join_verify_num"
                        controls-position="right"
                        :min="0"
                        :max="100000000000"
                        :precision="0"
                        :step="1"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="验证提示" prop="join_check_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.join.join_check_msg"
                    placeholder="验证时发送的提示语句"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="失败提示" prop="textarea50894">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.join.join_kick_msg"
                    placeholder="验证失败时发送的提示语句"
                    rows="3"
                  />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="入群审核" name="tab2">
                <el-form-item label="黑名禁入" prop="ban_black_status">
                  <el-switch
                    v-model="newFormInline.ban.ban_black_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
                <el-form-item label="拒绝理由" prop="ban_black_msg">
                  <el-input
                    v-model="newFormInline.ban.ban_black_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="等级限制" prop="ban_level_status">
                      <el-switch
                        v-model="newFormInline.ban.ban_age_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="不得低于" prop="ban_level_num">
                      <el-input-number
                        v-model="newFormInline.ban.ban_level_num"
                        controls-position="right"
                        :min="0"
                        :max="100000000000"
                        :precision="0"
                        :step="1"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="拒绝理由" prop="ban_level_msg">
                  <el-input
                    v-model="newFormInline.ban.ban_level_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="年龄限制" prop="ban_age_status">
                      <el-switch
                        v-model="newFormInline.ban.ban_age_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="不得低于" prop="ban_age_num">
                      <el-input-number
                        v-model="newFormInline.ban.ban_age_num"
                        controls-position="right"
                        :min="0"
                        :max="100000000000"
                        :precision="0"
                        :step="1"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="拒绝理由" prop="ban_age_msg">
                  <el-input
                    v-model="newFormInline.ban.ban_age_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="昵称限制" prop="ban_nick_status">
                  <el-switch
                    v-model="newFormInline.ban.ban_nick_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
                <el-form-item label="不得含有" prop="nick">
                  <div
                    style="
                      display: flex;
                      flex-wrap: wrap;
                      gap: 10px;
                      justify-content: center;
                    "
                  >
                    <el-tag
                      v-for="tag in nickOptions"
                      :key="tag"
                      class="mx-1"
                      :effect="'dark'"
                      closable
                      :disable-transitions="false"
                      @close="handlenickClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                  <el-input
                    v-if="nickInputVisible"
                    v-model="nickInputValue"
                    class="ml-1 w-20"
                    placeholder="请输入昵称关键词"
                    size="small"
                    @keyup.enter="handlenickInputConfirm"
                    @blur="handlenickInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag ml-1"
                    size="small"
                    @click="shownickInput"
                  >
                    + 新增
                  </el-button>
                </el-form-item>
                <el-form-item label="拒绝理由" prop="ban_nick_msg">
                  <el-input
                    v-model="newFormInline.ban.ban_nick_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="成员事件" name="tab3">
                <el-row>
                  <el-col :md="12" :sm="12" :xs="12">
                    <el-form-item label="成员被踢" prop="member_kick_status">
                      <el-switch
                        v-model="newFormInline.member.member_kick_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :sm="12" :xs="12">
                    <el-form-item label="成员退出" prop="member_quit_status">
                      <el-switch
                        v-model="newFormInline.member.member_quit_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :sm="12" :xs="12">
                    <el-form-item label="成员加入" prop="member_join_status">
                      <el-switch
                        v-model="newFormInline.member.member_join_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :sm="12" :xs="12">
                    <el-form-item
                      label="增加管理"
                      prop="member_promotion_status"
                    >
                      <el-switch
                        v-model="newFormInline.member.member_promotion_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="被踢提示" prop="member_kick_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.member.member_kick_msg"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="退群提示" prop="member_quit_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.member.member_quit_msg"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="入群提示" prop="member_join_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.member.member_join_msg"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="管理提示" prop="member_promotion_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.member.member_promotion_msg"
                    rows="3"
                  />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="名片管理" name="tab4">
                <el-form-item label="改名提醒" prop="member_kick_status">
                  <el-switch
                    v-model="newFormInline.Enick.nick_reminder_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
                <el-form-item label="提醒内容" prop="nick_reminder_msg">
                  <el-input
                    v-model="newFormInline.Enick.nick_reminder_msg"
                    type="text"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="违禁改名" prop="nick_prohibited_status">
                  <el-switch
                    v-model="newFormInline.Enick.nick_prohibited_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
                <el-form-item label="违禁词" prop="nick_prohibited_msg">
                  <div
                    style="
                      display: flex;
                      flex-wrap: wrap;
                      gap: 10px;
                      justify-content: center;
                    "
                  >
                    <el-tag
                      v-for="tag in nick_prohibited_msgOptions"
                      :key="tag"
                      class="mx-1"
                      :effect="'light'"
                      closable
                      :disable-transitions="false"
                      @close="handlenick_prohibited_msgClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                  <el-input
                    v-if="nick_prohibited_msgInputVisible"
                    v-model="nick_prohibited_msgInputValue"
                    class="ml-1 w-20"
                    placeholder="请输入违禁昵称关键词"
                    size="small"
                    @keyup.enter="handlenick_prohibited_msgInputConfirm"
                    @blur="handlenick_prohibited_msgInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag ml-1"
                    size="small"
                    @click="shownick_prohibited_msgInput"
                  >
                    + 新增
                  </el-button>
                </el-form-item>

                <el-form-item label="进群改名" prop="nick_auto_status">
                  <el-switch
                    v-model="newFormInline.Enick.nick_auto_status"
                    inline-prompt
                    class="switch"
                    active-text="已开启"
                    inactive-text="已关闭"
                  />
                </el-form-item>
                <el-form-item label="名片格式" prop="nick_auto_model">
                  <el-input
                    v-model="newFormInline.Enick.nick_auto_model"
                    type="text"
                    clearable
                  />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="其他事件" name="tab5">
                <el-row>
                  <el-col :md="8" :sm="8" :xs="24">
                    <el-form-item label="群防撤回" prop="other_recall_status">
                      <el-switch
                        v-model="newFormInline.Eother.other_recall_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" :sm="8" :xs="24">
                    <el-form-item label="文件上传" prop="other_file_status">
                      <el-switch
                        v-model="newFormInline.Eother.other_file_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" :sm="8" :xs="24">
                    <el-form-item label="戳戳提醒" prop="other_poke_status">
                      <el-switch
                        v-model="newFormInline.Eother.other_poke_status"
                        inline-prompt
                        class="switch"
                        active-text="已开启"
                        inactive-text="已关闭"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="上传提醒" prop="other_file_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.Eother.other_file_msg"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="撤回提醒" prop="other_recall_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.Eother.other_recall_msg"
                    rows="3"
                  />
                </el-form-item>
                <el-form-item label="戳戳提醒" prop="other_poke_msg">
                  <el-input
                    type="textarea"
                    v-model="newFormInline.Eother.other_poke_msg"
                    rows="3"
                  />
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div class="static-content-item">
              <el-button
                type="success"
                :icon="useRenderIcon(Save)"
                @click="savedata"
                >保存</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<style scoped>
.el-input-number.full-width-input,
.el-cascader.full-width-input {
  width: 100% !important;
  margin-top: 50px;
}
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
.grid-spacing {
  margin-bottom: 20px;
}
.filter-tree {
  margin-bottom: 30px; /* 在树节点之间增加10px的底部外间距 */
  font-size: 16px; /* 设置你想要的字体大小 */
}

.switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}
</style>
