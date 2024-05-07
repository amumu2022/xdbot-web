<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formInline: {
    bubble1: string;
    bubble2: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    bubble1: "",
    bubble2: ""
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
  </el-form>
</template>
