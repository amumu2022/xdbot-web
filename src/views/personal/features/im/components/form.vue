<script setup lang="ts">
import { ref } from "vue";
import { connectWsEnhanced, CloseWsFunc } from "../utils/hooks";
const sexOptions = [
  { label: "男生", value: "male" },
  { label: "女生", value: "female" },
  { label: "未知", value: "unknow" }
];

const subTypeOptions = [
  { label: "群聊消息", value: "group" },
  { label: "私聊消息", value: "private" },
  { label: "事件消息", value: "other" }
];

const roleOptions = [
  { label: "群员", value: "member" },
  { label: "管理员", value: "admin" },
  { label: "群主", value: "owner" }
];

export interface FormProps {
  formInline: {
    ws_url: string;
    nickname: string;
    message_type: string;
    sex: string;
    age: number;
    user_id: string;
    group_id: string;
    card: string;
    level: string;
    role: string;
    bubble1: string;
    bubble2: string;
  };
}

// 连接ws
function ws_init() {
  connectWsEnhanced(newFormInline.value.ws_url);
}

// 断开ws
function ws_close() {
  CloseWsFunc(newFormInline.value.ws_url);
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ws_url: "ws://127.0.0.1:31400/onebot/v11/ws",
    nickname: "木木",
    message_type: "group",
    sex: "male",
    age: 18,
    user_id: "654321",
    group_id: "123456",
    card: "我才不是小呆瓜",
    level: "16",
    role: "member",
    bubble1: "#a3c3f6" /* “我的”气泡 */,
    bubble2: "#fff" /* “ta的”气泡 */
  })
});

function ChangeBubble2(value) {
  newFormInline.value.bubble2 = value;
}
function ChangeBubble1(value) {
  newFormInline.value.bubble1 = value;
}
const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="我的气泡：">
          <el-color-picker
            v-model="newFormInline.bubble1"
            @change="ChangeBubble1"
            @active-change="ChangeBubble1"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="他的气泡：">
          <el-color-picker
            v-model="newFormInline.bubble2"
            @change="ChangeBubble2"
            @active-change="ChangeBubble2"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-form-item label="WS地址：" prop="ws_url">
          <el-input
            v-model="newFormInline.ws_url"
            clearable
            placeholder="请输入webscoket地址"
          />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-button type="success" @click="ws_init">尝试连接</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-form-item label="事件类型：" prop="message_type">
          <el-select
            placeholder="请选择事件类型"
            clearable
            class="!w-[1000px]"
            v-model="newFormInline.message_type"
          >
            <el-option
              v-for="(item, index) in subTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-button type="danger" @click="ws_close">断开连接</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户账号：" prop="user_id">
          <el-input
            v-model="newFormInline.user_id"
            clearable
            placeholder="请输入用户账号"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户性别：" prop="sex">
          <el-select
            placeholder="请选择性别"
            clearable
            class="!w-[1000px]"
            v-model="newFormInline.sex"
          >
            <el-option
              v-for="(item, index) in sexOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="用户年龄：" prop="age">
          <el-input-number
            class="!w-[1000px]"
            v-model="newFormInline.age"
            :min="1"
            :max="200"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="群聊号码：" prop="group_id">
          <el-input
            v-model="newFormInline.group_id"
            clearable
            placeholder="请输入群聊号码"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="用户名片：" prop="card">
          <el-input
            v-model="newFormInline.card"
            clearable
            placeholder="请输入用户名片"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="成员等级：" prop="level">
          <el-input
            v-model="newFormInline.level"
            clearable
            placeholder="请输入成员等级"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="用户角色：" prop="role">
          <el-select
            placeholder="请选择角色"
            clearable
            class="!w-[1000px]"
            v-model="newFormInline.role"
          >
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
