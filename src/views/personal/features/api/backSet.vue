<script lang="ts" setup name="Backset">
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ApiCourse } from "@/api/bot/features/customApi";
import { ref } from "vue";

const Article = ref("");
ApiCourse().then(async res => {
  Article.value = res.data;
});
</script>

<template>
  <el-card shadow="never">
    <el-form :inline="true" class="bg-bg_color w-[99/100]">
      <el-form-item style="width: 100%">
        <md-editor
          v-model="Article"
          preview-only
          :toc="true"
          showCodeRowNumber
          class="full-height-editor"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<style lang="scss" scoped>
.full-height-editor {
  /* 确保编辑器有足够的高度 */
  min-height: 700px;
}
</style>
