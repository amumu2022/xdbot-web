<script setup lang="ts">
import { createOtherApi } from "@/api/upload/upload";
import { ref } from "vue";
import { message } from "@/utils/message";
const ruleFormRef = ref();
import type { UploadProps } from "element-plus";
function getRef() {
  return ruleFormRef.value;
}
const SelectNum = ref(5);
const fileList = ref([]);

const handleExceed = () => {
  message(`选择的文件不能超过 ${SelectNum.value} `, { type: "warning" });
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  message(`已移除文件 ${uploadFile.name} `, { type: "warning" });
};
const validExtensions = [
  "txt",
  "apk",
  "exe",
  "docx",
  "doc",
  "csv",
  "zip",
  "7z",
  "rar",
  "xlsx",
  "xls",
  "py",
  "json",
  "db",
  "sql",
  "ttf",
  "pdf"
];

const handlePreview: UploadProps["onPreview"] = async file => {
  // 添加上传文件的操作

  const fileExtension = file.name.split(".").pop().toLowerCase();
  const allowedSize = 300 * 1024 * 1024; // 3MB

  // 判断文件格式是否合法
  if (!validExtensions.includes(fileExtension)) {
    message(`操作失败，文件格式错误`, { type: "error" });
    return; // 中止操作
  }

  // 判断文件大小是否超过限制
  if (file.size > allowedSize) {
    message(`操作失败，文件尺寸超过限制`, { type: "error" });
    return; // 中止操作
  }

  const submitData = new FormData();
  // 添加文件数据
  submitData.append("file", file.raw);
  try {
    // 提交到后台
    const response = await createOtherApi(submitData);
    if (response.code === 200) {
      // 上传成功
      message(`文件上传成功`, { type: "success" });
    } else {
      // 上传失败
      message(response.message, { type: "error" });
    }
  } catch (error) {
    // 处理上传失败的错误信息
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
    list-type="text"
    multiple
  >
    <el-button type="primary">拖拽文件或点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">
        仅支持大小不超过300Mb的文件格式：
        <template v-for="(extension, index) in validExtensions" :key="index">
          <el-text class="mx-1" type="warning">
            {{ `${extension}` }}
            &nbsp;&nbsp;
          </el-text>
        </template>
      </div>
    </template>
  </el-upload>
</template>
