<script setup lang="ts">
import { createAudioApi } from "@/api/upload/upload";
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
const validExtensions = ["wav", "mp3", "mp4", "aac"];

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  message(`已移除文件 ${uploadFile.name} `, { type: "warning" });
};

const handlePreview: UploadProps["onPreview"] = async file => {
  // 添加上传音频的操作
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const allowedSize = 10 * 1024 * 1024; // 10MB

  // 判断音频格式是否合法
  if (!validExtensions.includes(fileExtension)) {
    message(`操作失败，音频格式错误`, { type: "error" });
    return; // 中止操作
  }

  // 判断音频大小是否超过限制
  if (file.size > allowedSize) {
    message(`操作失败，音频尺寸超过限制`, { type: "error" });
    return; // 中止操作
  }

  const submitData = new FormData();
  // 添加文件数据
  submitData.append("file", file.raw);
  try {
    // 提交到后台
    const response = await createAudioApi(submitData);
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
        仅支持大小不超过10Mb的
        <template v-for="(extension, index) in validExtensions" :key="index">
          <el-text class="mx-1" type="warning">
            {{ `${extension}` }}
            &nbsp;&nbsp;
          </el-text>
        </template>
        格式的音频
      </div>
    </template>
  </el-upload>
</template>
