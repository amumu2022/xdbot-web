<script setup lang="ts">
import { createPhotoApi } from "@/api/upload/upload";
import { ref } from "vue";
import { message } from "@/utils/message";
const ruleFormRef = ref();
const isUploaded = ref(false);
import type { UploadProps } from "element-plus";
function getRef() {
  return ruleFormRef.value;
}

const SelectNum = ref(5);
const validExtensions = ["png", "jpg", "jpeg", "ico", "gif", "bmp"];

const handleExceed = () => {
  message(`选择的文件不能超过 ${SelectNum.value} `, { type: "warning" });
};

const handleRemove: UploadProps["onRemove"] = uploadFile => {
  message(`已移除文件 ${uploadFile.name} `, { type: "warning" });
};

const handlePreview: UploadProps["onPreview"] = async file => {
  // 添加上传图片的操作
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const allowedSize = 5 * 1024 * 1024; // 5MB

  // 判断图片格式是否合法
  if (!validExtensions.includes(fileExtension)) {
    message(`操作失败，图片格式错误`, { type: "error" });
    return; // 中止操作
  }

  // 判断图片大小是否超过限制
  if (file.size > allowedSize) {
    message(`操作失败，图片尺寸超过限制`, { type: "error" });
    return; // 中止操作
  }

  const submitData = new FormData();
  // 添加文件数据
  submitData.append("file", file.raw);
  try {
    const response = await createPhotoApi(submitData);
    if (response.code === 200) {
      message(`文件上传成功`, { type: "success" });
      isUploaded.value = true;
    } else {
      message(response.message, { type: "error" });
    }
  } catch (error) {
    message(error, { type: "error" });
  }
};

defineExpose({ getRef });
</script>

<template>
  <el-upload
    class="upload-demo"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :limit="SelectNum"
    :auto-upload="false"
    drag
    list-type="picture"
    multiple
  >
    <el-button type="primary">拖拽文件或点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">
        仅支持大小不超过5Mb的
        <template v-for="(extension, index) in validExtensions" :key="index">
          <el-text class="mx-1" type="warning">
            {{ `${extension}` }}
            &nbsp;&nbsp;
          </el-text>
        </template>
        格式的图片
      </div>
    </template>
  </el-upload>
</template>
