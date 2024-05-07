<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { FormProps } from "../../utils/types";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    card: {
      unblocking: 100, //解禁卡
      prohibition: 100, //禁言卡
      title: 100, //头衔卡
      upgrade: 100 //升管卡
    }
  })
});

const newFormInline = ref(props.formInline);

async function saveSign() {
  const post_data = { name: "card", data: newFormInline.value.card };
  const data = await UpdateDock("card", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadSign();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadSign() {
  const post_data = { name: "card" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.card = {
      unblocking: back?.unblocking,
      prohibition: back?.prohibition,
      title: back?.title,
      upgrade: back?.upgrade
    };
  }
}
onBeforeMount(() => {
  reloadSign();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <!-- <el-divider> 卡片兑换价格 </el-divider> -->
    <el-row :gutter="30">
      <el-col :value="12" :xl="12" :lg="12" :xs="24" :sm="24">
        <el-form-item label="解禁卡：" prop="unblocking">
          <el-input-number
            v-model="newFormInline.card.unblocking"
            :min="1"
            :max="1999999999"
          />
        </el-form-item>
      </el-col>

      <el-col :value="12" :xl="12" :lg="12" :xs="24" :sm="24">
        <el-form-item label="禁言卡：" prop="prohibition">
          <el-input-number
            v-model="newFormInline.card.prohibition"
            :min="1"
            :max="1999999999"
          />
        </el-form-item>
      </el-col>

      <el-col :value="12" :xl="12" :lg="12" :xs="24" :sm="24">
        <el-form-item label="头衔卡：" prop="title">
          <el-input-number
            v-model="newFormInline.card.title"
            :min="1"
            :max="1999999999"
          />
        </el-form-item>
      </el-col>

      <el-col :value="12" :xl="12" :lg="12" :xs="24" :sm="24">
        <el-form-item label="升官卡：" prop="upgrade">
          <el-input-number
            v-model="newFormInline.card.upgrade"
            :min="1"
            :max="1999999999"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="saveSign">保存</el-button>
    </el-form-item>
  </el-form>
</template>
