<script setup lang="ts">
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { message } from "@/utils/message";
import { ref, onBeforeMount } from "vue";
import Save from "@iconify-icons/ri/save-3-fill";
import orange from "@iconify-icons/ep/orange";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getDockData, UpdateDock } from "@/api/system/dock";

const activeName = ref("1");
const ModelOptions = [
  {
    value: "gpt-3.5-turbo",
    label: "gpt-3.5-turbo"
  },
  {
    value: 1,
    label: "纯文本"
  }
];
const ZhiPuModelOptions = [
  {
    value: "glm-4",
    label: "glm-4"
  },
  {
    value: "glm-3-turbo",
    label: "glm-3-turbo"
  },
  {
    value: "characterglm",
    label: "characterglm"
  }
];

const AiModelOptions = [
  {
    value: 1,
    label: "ChatGPT"
  },
  {
    value: 2,
    label: "智谱AI大模型"
  },
  {
    value: 3,
    label: "讯飞星火"
  },
  {
    value: 4,
    label: "文心一言"
  }
];

const formRef = ref();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    chatgpt: {
      chat_key: "",
      proxy: "",
      model: "gpt-3.5-turbo",
      max_tokens: "3000",
      continuousConversation: true
    },
    ai: {
      type: 1
    },
    zhipu: {
      chat_key: "",
      model: "glm-3-turbo",
      max_tokens: "3000",
      continuousConversation: true
    }
  })
});

async function saveGPT() {
  const post_data = { name: "chatgpt", data: newFormInline.value.chatgpt };
  const data = await UpdateDock("chatgpt", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadGPT();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadGPT() {
  const post_data = { name: "chatgpt" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.chatgpt = {
      chat_key: back?.chat_key,
      proxy: back?.proxy,
      model: back?.model,
      max_tokens: back?.max_tokens,
      continuousConversation: back?.continuousConversation
    };
  }
}

async function saveAI() {
  const post_data = { name: "ai", data: newFormInline.value.ai };
  const data = await UpdateDock("ai", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadGPT();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadAI() {
  const post_data = { name: "ai" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.ai = {
      type: back?.type
    };
  }
}

async function saveZHIPU() {
  const post_data = { name: "zhipu", data: newFormInline.value.zhipu };
  const data = await UpdateDock("zhipu", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadGPT();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadZHIPU() {
  const post_data = { name: "zhipu" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.zhipu = {
      chat_key: back?.chat_key,
      model: back?.model,
      max_tokens: back?.max_tokens,
      continuousConversation: back?.continuousConversation
    };
  }
}

const newFormInline = ref(props.formInline);

onBeforeMount(() => {
  reloadGPT();
  reloadZHIPU();
  reloadAI();
});
</script>

<template>
  <el-card>
    <el-collapse accordion v-model="activeName">
      <el-collapse-item title="AI 设置" name="1">
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
              <el-form-item label="Ai 模型" prop="type">
                <el-select v-model="newFormInline.ai.type" clearable>
                  <el-option
                    v-for="(item, index) in AiModelOptions"
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
              @click="saveAI"
              >保存设置</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="ChatGPT" name="2">
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
              <el-form-item label="Ai Key" prop="chat_key">
                <el-input
                  v-model="newFormInline.chatgpt.chat_key"
                  type="password"
                  clearable
                  placeholder="请输入OpenAi Key"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="代理地址" prop="proxy">
                <el-input
                  v-model="newFormInline.chatgpt.proxy"
                  type="text"
                  clearable
                  placeholder="请输入代理地址"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="单次回复" prop="max_tokens">
                <el-input
                  v-model="newFormInline.chatgpt.max_tokens"
                  type="text"
                  clearable
                  placeholder="单次交互所用的最大 Token 数"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="连续对话" prop="continuousConversation">
                <el-switch
                  v-model="newFormInline.chatgpt.continuousConversation"
                  inline-prompt
                  class="switch"
                  active-text="ON"
                  inactive-text="OFF"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="Ai 模型" prop="model">
                <el-select v-model="newFormInline.chatgpt.model" clearable>
                  <el-option
                    v-for="(item, index) in ModelOptions"
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
              @click="saveGPT"
              >保存设置</el-button
            >
            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadGPT"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="智谱AI大模型" name="3">
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
              <el-form-item label="Ai Key" prop="chat_key">
                <el-input
                  v-model="newFormInline.zhipu.chat_key"
                  type="password"
                  clearable
                  placeholder="请输入OpenAi Key"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="单次回复" prop="max_tokens">
                <el-input
                  v-model="newFormInline.zhipu.max_tokens"
                  type="text"
                  clearable
                  placeholder="单次交互所用的最大 Token 数"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="连续对话" prop="continuousConversation">
                <el-switch
                  v-model="newFormInline.zhipu.continuousConversation"
                  inline-prompt
                  class="switch"
                  active-text="ON"
                  inactive-text="OFF"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="Ai 模型" prop="model">
                <el-select v-model="newFormInline.zhipu.model" clearable>
                  <el-option
                    v-for="(item, index) in ZhiPuModelOptions"
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
              @click="saveZHIPU"
              >保存设置</el-button
            >
            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadZHIPU"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="讯飞星火" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<style>
.edit-title {
  position: relative;
  padding-left: 10px;
  color: var(--el-text-color-regular);
  &::after {
    content: "";
    width: 2px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: var(--el-color-primary);
  }
}
</style>
