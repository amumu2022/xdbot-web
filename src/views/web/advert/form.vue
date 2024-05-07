<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { message } from "@/utils/message";
import UploadIcon from "@iconify-icons/ri/upload-2-line";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import type { UploadProps } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    custom: "",
    alt: "",
    src: "",
    filelist: [],
    end_time: "",
    enable: true
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  const fileExtension = rawFile.name.split(".").pop().toLowerCase();
  const allowedSize = 5 * 1024 * 1024; // 5MB
  const validExtensions = ["png", "jpg", "jpeg", "ico", "gif", "bmp"];
  // 判断图片格式是否合法
  if (!validExtensions.includes(fileExtension)) {
    message(`操作失败，图片格式错误`, { type: "error" });
    return; // 中止操作
  } else if (rawFile.size > allowedSize) {
    message(`选择的文件不能超过 5MB `, { type: "warning" });
    return false;
  }
  return true;
};

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="客户名称：" prop="custom">
          <el-input v-model="newFormInline.custom" />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="跳转地址：" prop="alt">
          <el-input v-model="newFormInline.alt" />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="图片:" prop="filelist">
          <el-upload
            ref="uploadRef"
            v-model:file-list="newFormInline.filelist"
            drag
            list-type="picture"
            :limit="1"
            multiple
            :disabled="newFormInline.filelist.length >= 1"
            class="!w-[200px]"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
          >
            <div class="el-upload__text">
              <IconifyIconOffline
                :icon="UploadIcon"
                width="26"
                class="m-auto mb-2"
              />
              可点击或拖拽上传
            </div>
          </el-upload>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="到期时间" prop="end_time">
          <el-date-picker
            v-model="newFormInline.end_time"
            type="datetime"
            class="!w-[200px]"
            placeholder="请选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
