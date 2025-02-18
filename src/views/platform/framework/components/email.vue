<script setup lang="ts">
import { InfoFilled } from "@element-plus/icons-vue";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { message } from "@/utils/message";
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { ApiSendEmail } from "@/api/api";
import orange from "@iconify-icons/ep/orange";
import Save from "@iconify-icons/ri/save-3-fill";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const activeName = ref("1");
const EmailOptions = [
  {
    value: "smtp.qq.com",
    label: "smtp.qq.com"
  },
  {
    value: "smtp.126.com",
    label: "smtp.126.com"
  },
  {
    value: "smtp.163.com",
    label: "smtp.163.com"
  },
  {
    value: "smtp.mail.yahoo.com.cn",
    label: "smtp.mail.yahoo.com.cn"
  },
  {
    value: "smtp.sohu.com",
    label: "smtp.sohu.com"
  },
  {
    value: "smtp.gmail.com",
    label: "smtp.gmail.com"
  },
  {
    value: "smtp.sina.com.cn",
    label: "smtp.sina.com.cn"
  }
];

const SendOptions = [
  {
    value: 0,
    label: "HTML文本"
  },
  {
    value: 1,
    label: "纯文本"
  }
];

const formRef = ref();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    email: {
      email: "",
      code: "",
      observer: ""
    },
    emailSend: {
      plain: 1,
      receiving: "",
      title: "",
      text: ""
    }
  })
});

async function reloadEmail() {
  const post_data = { name: "email" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.email = {
      code: back?.code,
      email: back?.email,
      observer: back?.observer
    };
  }
}

async function reloadSendEmail() {
  const post_data = { name: "emailSend" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.emailSend = {
      plain: back?.plain,
      receiving: back?.receiving,
      text: back?.text,
      title: back?.title
    };
  }
}

async function saveEmail() {
  const post_data = { name: "email", data: newFormInline.value.email };
  const data = await UpdateDock("email", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadEmail();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function sendEmail() {
  newFormInline.value.emailSend.code = newFormInline.value.email.code;
  newFormInline.value.emailSend.observer = newFormInline.value.email.observer;
  newFormInline.value.emailSend.email = newFormInline.value.email.email;
  const send_data = newFormInline.value.emailSend;

  const post_data = { name: "emailSend", data: send_data };
  const data = await UpdateDock("emailSend", post_data);
  if (data.success) {
    const req = await ApiSendEmail(send_data);
    if (req.success) {
      message(req.message, { type: "success" });
    } else {
      message(`操作失败，${req.message}`, { type: "warning" });
    }
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

const newFormInline = ref(props.formInline);

onBeforeMount(() => {
  reloadEmail();
  reloadSendEmail();
});
</script>

<template>
  <el-card>
    <el-collapse accordion v-model="activeName">
      <el-collapse-item name="1">
        <template #title>
          邮箱配置
          <el-icon class="header-icon">
            <info-filled />
          </el-icon>
        </template>

        <el-form
          :model="newFormInline"
          ref="formRef"
          :rules="formRules"
          label-position="left"
          label-width="80px"
          size="default"
          @submit.prevent
        >
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮箱账号" prop="email">
                <el-input
                  v-model="newFormInline.email.email"
                  type="text"
                  clearable
                  placeholder="请输入邮箱账号"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="授权码" prop="code">
                <el-input
                  v-model="newFormInline.email.code"
                  type="password"
                  clearable
                  placeholder="请输入授权码"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="服务地址" prop="observer">
                <el-select v-model="newFormInline.email.observer" clearable>
                  <el-option
                    v-for="(item, index) in EmailOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-button
              type="success"
              :icon="useRenderIcon(Save)"
              @click="saveEmail"
              >保存设置</el-button
            >

            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadEmail"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="邮箱发信" name="2">
        <el-form
          :model="newFormInline"
          ref="formRef"
          :rules="formRules"
          label-position="left"
          label-width="80px"
          size="default"
          @submit.prevent
        >
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="发信类型" prop="plain">
                <el-select v-model="newFormInline.emailSend.plain" clearable>
                  <el-option
                    v-for="(item, index) in SendOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="收信账户" prop="receiving">
                <el-input
                  v-model="newFormInline.emailSend.receiving"
                  type="text"
                  clearable
                  placeholder="请输入收信账户"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮件主题" prop="title">
                <el-input
                  v-model="newFormInline.emailSend.title"
                  type="text"
                  clearable
                  placeholder="请输入邮件主题"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮件内容" prop="text">
                <el-input
                  v-model="newFormInline.emailSend.text"
                  rows="10"
                  resize="none"
                  clearable
                  type="textarea"
                  placeholder="请输入邮件内容"
                />
              </el-form-item>
            </el-col>

            <el-button
              type="success"
              :icon="useRenderIcon(Save)"
              @click="sendEmail"
              >测试一下</el-button
            >
            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadSendEmail"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
