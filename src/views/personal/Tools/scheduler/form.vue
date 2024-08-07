<script setup lang="ts">
import { useRole } from "./utils/hook";
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import scCron from "@/components/ReCorn/corn.vue";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    work_file: "",
    schedule: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const tableRef = ref();

const { fileOptions } = useRole(tableRef);

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="任务名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入任务名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="任务文件" prop="work_file">
          <el-select
            v-model="newFormInline.work_file"
            placeholder="请选择任务文件"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in fileOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="cron" prop="schedule">
          <sc-cron
            v-model="newFormInline.schedule"
            placeholder="请输入Cron定时规则"
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
