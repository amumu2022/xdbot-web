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
    id_code: undefined,
    task_code: undefined,
    name: "",
    interval: "",
    taskCommand: "",
    cronExpression: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const tableRef = ref();

const { fileOptions, taskTypeOptions } = useRole(tableRef);

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
        <el-form-item label="任务类型">
          <el-select
            v-model="newFormInline.id_code"
            placeholder="请选择任务类型"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in taskTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

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
        <el-form-item label="任务标识" prop="task_code">
          <el-input
            v-model="newFormInline.task_code"
            clearable
            placeholder="请输入任务标识"
          />
        </el-form-item>
      </re-col>

      <!-- <re-col :value="12" :xs="24" :sm="24"> -->
      <!-- <el-form-item
          label="执行时间"
          prop="interval"
          v-if="newFormInline.id_code == 1 || newFormInline.id_code == 2"
        >
          <div class="demo-datetime-picker">
            <div class="block">
              <el-date-picker
                v-model="newFormInline.interval"
                type="datetime"
                class="w-full"
                placeholder="请选择日期"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="执行间隔"
          prop="interval"
          v-if="newFormInline.id_code == 3 || newFormInline.id_code == 4"
        >
          <el-input
            v-model="newFormInline.interval"
            clearable
            placeholder="请输入执行间隔，单位为秒"
          />
        </el-form-item>
      </re-col> -->

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item
          label="任务文件"
          prop="taskCommand"
          v-if="newFormInline.id_code == 5"
        >
          <el-select
            v-model="newFormInline.taskCommand"
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
        <el-form-item
          label="cron"
          prop="cronExpression"
          v-if="newFormInline.id_code == 5"
        >
          <sc-cron
            v-model="newFormInline.cronExpression"
            placeholder="请输入Cron定时规则"
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
