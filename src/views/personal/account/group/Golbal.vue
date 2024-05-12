<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, watch } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { message } from "@/utils/message";
import { getBotList, getQuanjuInfo, UpdateQuanju } from "@/api/bot/group/group";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    group: {
      bot_id: "",
      host: "",
      email: "",
      adjutantList: [],
      update_switch: false
    },
    sendmsg: {
      private: false,
      private_pic: false,
      dialogue: false
    },
    other: {
      friend_req: 1,
      friend_ref_msg: "",
      friend_msg: "你好啊！我是小木同学，很高兴认识你",
      invate_req: 1,
      invate_ref_msg: "",
      invate_msg: "大家好！我是小木同学，很高兴认识大家"
    },
    dynamic: {
      be_ban: false,
      be_kicked: false,
      be_promoted: false,
      be_reduce: false,
      accept_msg: false,
      other: false
    }
  })
});
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

const newFormInline = ref(props.formInline);

interface BotOption {
  label: string;
  value: string;
}

const BotOptions = ref<BotOption[]>([]); // 明确BotOptions的类型是BotOption的数组

import Refresh from "@iconify-icons/ep/refresh";
import Save from "@iconify-icons/ri/save-3-fill";

const formRef = ref();

async function getGlobal(bot_id: string) {
  if (bot_id !== "") {
    const res = await getQuanjuInfo(bot_id);

    if (res.code === 200) {
      const data = res.data;
      const reqData = data || newFormInline.value;

      // 检查并初始化可能缺失的属性
      reqData.group = reqData.group || newFormInline.value.group;
      reqData.sendmsg = reqData.sendmsg || newFormInline.value.sendmsg;
      reqData.other = reqData.other || newFormInline.value.other;
      reqData.dynamic = reqData.dynamic || newFormInline.value.dynamic;

      newFormInline.value = reqData;
      newFormInline.value.group.bot_id = bot_id;
      adjutantOptions.value = newFormInline.value.group?.adjutantList;
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
  }
}

async function refreshbot() {
  const res = await getBotList();
  if (res.code === 200) {
    const data = res.data;

    newFormInline.value.BotList = data;
    const transformedArray = data.map(item => ({
      value: item,
      label: item
    }));

    BotOptions.value = transformedArray;
    if (data.length > 0) {
      newFormInline.value.group.bot_id = data[0];
      await getGlobal(data[0]);
      message(`刷新成功`, { type: "success" });
    } else {
      message(`未获取到机器人信息`, { type: "warning" });
    }
  } else {
    message(`操作失败，${res.message}`, { type: "error" });
  }
}

async function savedata() {
  const bot_id = newFormInline.value.group.bot_id;
  newFormInline.value.group.adjutantList = adjutantOptions.value;

  if (bot_id == "") {
    message(`操作失败，请先选中机器人`, { type: "error" });
    return "";
  }
  const res = await UpdateQuanju(bot_id, newFormInline.value);

  if (res.code === 200) {
    message(`保存成功`, { type: "success" });
  } else {
    message(`操作失败，${res.message}`, { type: "error" });
  }
}

const adjutantOptions = ref([]);

const adjutantInputValue = ref("");
const adjutantInputVisible = ref(false);

const handleadjutantClose = (tag: string) => {
  adjutantOptions.value.splice(adjutantOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.group.adjutantList = adjutantOptions.value;
};

const showadjutantInput = () => {
  adjutantInputVisible.value = true;
};

const handleadjutantInputConfirm = () => {
  if (adjutantInputValue.value) {
    const tag = adjutantInputValue.value;
    adjutantOptions.value = Array.from(
      new Set([...adjutantOptions.value, tag])
    );
  }

  adjutantInputVisible.value = false;
  adjutantInputValue.value = "";
};

async function onSearch() {
  await getGlobal(newFormInline.value.group.bot_id);
}

watch(adjutantOptions, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  newFormInline.value.group.adjutantList = newValue;
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
      <el-card shadow="hover" class="grid-spacing">
        <template #header>
          <div class="card-header">
            <span class="font-medium">全局管理设置</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="机器账号" prop="bot_id">
              <el-select
                v-model="newFormInline.group.bot_id"
                class="full-width-input"
                clearable
                placeholder="请选择机器人账号"
                @change="onSearch()"
              >
                <el-option
                  v-for="(item, index) in BotOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="static-content-item">
              <el-button
                type="primary"
                :icon="useRenderIcon(Refresh)"
                @click="refreshbot"
                >刷新</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-form-item label="副级管理" prop="adjutantList">
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            "
          >
            <el-tag
              v-for="tag in adjutantOptions"
              :key="tag"
              class="mx-1"
              :effect="'dark'"
              closable
              :disable-transitions="false"
              @close="handleadjutantClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <el-input
            v-if="adjutantInputVisible"
            v-model="adjutantInputValue"
            class="ml-1 w-20"
            placeholder="请输入副级管理账号"
            size="small"
            @keyup.enter="handleadjutantInputConfirm"
            @blur="handleadjutantInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showadjutantInput"
          >
            + 新增
          </el-button>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主人账号" prop="host">
              <el-input
                v-model="newFormInline.group.host"
                type="text"
                clearable
                placeholder="请输入主人账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="email">
              <el-input
                v-model="newFormInline.group.email"
                placeholder="请输入用户邮箱"
                type="text"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="更新提醒" prop="update_switch">
              <el-switch
                v-model="newFormInline.group.update_switch"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="grid-spacing">
        <template #header>
          <div class="card-header">
            <span class="font-medium">发信设置</span>
          </div>
        </template>
        <el-row>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="私聊开关" prop="private">
              <el-switch
                v-model="newFormInline.sendmsg.private"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="临时对话" prop="dialogue">
              <el-switch
                v-model="newFormInline.sendmsg.dialogue"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="私聊图片" prop="private_pic">
              <el-switch
                v-model="newFormInline.sendmsg.private_pic"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="grid-spacing">
        <template #header>
          <div class="card-header">
            <span class="font-medium">其他设置</span>
          </div>
        </template>
        <el-row>
          <el-col :md="12" :sm="12" :xs="24">
            <el-form-item label="好友请求" prop="friend_req">
              <el-select v-model="newFormInline.other.friend_req" clearable>
                <el-option
                  v-for="(item, index) in switchOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24">
            <el-form-item
              label="拒绝理由"
              prop="friend_ref_msg"
              style="color: #ff4949"
            >
              <el-input
                v-model="newFormInline.other.friend_ref_msg"
                type="text"
                placeholder="请输入拒绝理由"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发送信息" prop="friend_msg">
          <el-input
            v-model="newFormInline.other.friend_msg"
            type="text"
            clearable
          />
        </el-form-item>
        <el-row>
          <el-col :md="12" :sm="12" :xs="24">
            <el-form-item label="邀群请求" prop="invate_req">
              <el-select v-model="newFormInline.other.invate_req" clearable>
                <el-option
                  v-for="(item, index) in switchOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24">
            <el-form-item label="拒绝理由" prop="invate_ref_msg">
              <el-input
                v-model="newFormInline.other.invate_ref_msg"
                type="text"
                placeholder="请输入拒绝理由"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发送信息" prop="invate_msg">
          <el-input
            v-model="newFormInline.other.invate_msg"
            type="text"
            clearable
          />
        </el-form-item>
      </el-card>

      <el-card shadow="hover" class="grid-spacing">
        <template #header>
          <div class="card-header">
            <span class="font-medium"
              >动态推送设置 【将会推送给主人账号】
            </span>
          </div>
        </template>
        <el-row>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="我被禁言" prop="be_ban">
              <el-switch
                v-model="newFormInline.dynamic.be_ban"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="我被踢出" prop="be_kicked">
              <el-switch
                v-model="newFormInline.dynamic.be_kicked"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="我被升官" prop="be_promoted">
              <el-switch
                v-model="newFormInline.dynamic.be_promoted"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="我被降管" prop="be_reduce">
              <el-switch
                v-model="newFormInline.dynamic.be_reduce"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="收到私信" prop="accept_msg">
              <el-switch
                v-model="newFormInline.dynamic.accept_msg"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="8" :xs="12">
            <el-form-item label="等待添加" prop="other">
              <el-switch
                v-model="newFormInline.dynamic.other"
                inline-prompt
                class="switch"
                active-text="已开启"
                inactive-text="已关闭"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <div class="static-content-item">
        <el-button type="success" :icon="useRenderIcon(Save)" @click="savedata"
          >保存全局设置</el-button
        >
      </div>
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
.switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}
</style>
