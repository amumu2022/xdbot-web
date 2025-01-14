<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { FormProps } from "../../utils/types";
import { storageLocal } from "@pureadmin/utils";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    frame: {
      ws_url: "ws://127.0.0.1:31400/ws/bot/log"
    }
  })
});

const newFormInline = ref(props.formInline);

// 设置其他参数
function set() {
  storageLocal().setItem("FrameSet", {
    ws_url: newFormInline.value.frame.ws_url
  });
}

async function saveFrame() {
  const post_data = { name: "frame", data: newFormInline.value.frame };
  const data = await UpdateDock("frame", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    set();
    reloadSign();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function Connect() {
  const post_data = { name: "frame", data: newFormInline.value.frame };
  const data = await UpdateDock("frame", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    set();
    reloadSign();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadSign() {
  const post_data = { name: "frame" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.frame = {
      ws_url: back?.ws_url
    };
  }
}

onBeforeMount(() => {
  reloadSign();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-form-item label="ws地址：" prop="ws_url">
      <el-input
        v-model="newFormInline.frame.ws_url"
        clearable
        placeholder="请输入ws链接地址"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveFrame">保存</el-button>
      <el-button type="success" @click="Connect">连接</el-button>
    </el-form-item>
  </el-form>
</template>
