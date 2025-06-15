<!--
 * @Author: XDTEAM
 * @Date: 2024-05-05 22:54:11
 * @LastEditTime: 2025-06-14 23:32:54
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { ref, watch } from "vue";
import { ElInput } from "element-plus";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    group_id: "",
    bot: "",
    cluster: {
      managementList: []
    },
    Auth: {
      end_time: ""
    }
  })
});
const newFormInline = ref(props.formInline);
const ruleFormRef = ref();

const ManagerOptions = ref(props.formInline.cluster.managementList);
const ManagerInputValue = ref("");
const ManagerInputVisible = ref(false);
const handleManagerClose = (tag: string) => {
  ManagerOptions.value.splice(ManagerOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.cluster.managementList = ManagerOptions.value;
};
const showManagerInput = () => {
  ManagerInputVisible.value = true;
};
const handleManagerInputConfirm = () => {
  if (ManagerInputValue.value) {
    const tag = ManagerInputValue.value;
    ManagerOptions.value = Array.from(new Set([...ManagerOptions.value, tag]));
  }

  ManagerInputVisible.value = false;
  ManagerInputValue.value = "";
};
watch(ManagerOptions, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.cluster.managementList = newValue;
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="小管家" prop="managementList">
          <div
            class="tag-container"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            "
          >
            <el-tag
              v-for="tag in ManagerOptions"
              :key="tag"
              class="mx-1"
              closable
              :effect="'light'"
              :disable-transitions="true"
              @close="handleManagerClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <el-input
            v-if="ManagerInputVisible"
            v-model="ManagerInputValue"
            placeholder="请输入小管家账号"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleManagerInputConfirm"
            @blur="handleManagerInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showManagerInput"
          >
            +
          </el-button>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="到期时间" prop="end_time">
          <div class="demo-datetime-picker">
            <div class="block">
              <el-date-picker
                v-model="newFormInline.Auth.end_time"
                type="datetime"
                placeholder="请选择日期"
                format="YYYY-MM-DD HH:mm:ss"
                :value-format="'YYYY-MM-DD HH:mm:ss'"
              />
            </div>
          </div>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
