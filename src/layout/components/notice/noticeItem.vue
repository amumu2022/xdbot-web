<script setup lang="ts">
import { ListItem } from "./data";
import { PropType } from "vue";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Copy from "@iconify-icons/ep/copy-document";
const props = defineProps({
  noticeItem: {
    type: Object as PropType<ListItem>,
    default: () => {}
  }
});
import { useCopyToClipboard } from "@pureadmin/utils";
const { clipboardValue, copied } = useCopyToClipboard();

// 复制链接
const copyLinks = text => {
  clipboardValue.value = text;
  if (copied.value) {
    message(`消息内容已复制`, { type: "success" });
  } else {
    message(`消息内容复制失败`, { type: "error" });
  }
};
</script>

<template>
  <div
    class="notice-container border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
  >
    <div class="notice-container-text">
      <div class="notice-text-title text-[#000000d9] dark:text-white">
        <el-button
          type="warning"
          :icon="useRenderIcon(Copy)"
          circle
          size="small"
          @click="copyLinks(props.noticeItem.message)"
          style="margin-right: 10px"
        />

        <el-tag
          :type="props.noticeItem?.status"
          size="small"
          class="notice-title-extra"
          style="margin-right: 10px"
        >
          {{ props.noticeItem.extra }}
        </el-tag>
        <div class="notice-title-content">
          {{ props.noticeItem.title }}
        </div>
      </div>
      <div class="notice-text-datetime text-[#00000073] dark:text-white">
        {{
          `${props.noticeItem.datetime}&emsp;&emsp;&emsp;&emsp;${props.noticeItem?.nickname}(${props.noticeItem?.bot_id})`
        }}
      </div>
      <div class="notice-title-content">
        {{ props.noticeItem.title2 }}
      </div>
      <div class="notice-text-message">
        {{ props.noticeItem.message }}
      </div>
    </div>
  </div>
</template>

<style></style>
<style scoped lang="scss">
.notice-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;

  // border-bottom: 1px solid #f0f0f0;

  .notice-container-avatar {
    margin-right: 16px;
    background: #fff;
  }

  .notice-container-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .notice-text-title {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5715;
      cursor: pointer;
      flex-wrap: wrap;
      justify-content: flex-start;

      .notice-title-content {
        flex: 1;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice-title-extra {
        float: right;
        font-weight: 400;
      }
    }

    .notice-text-message,
    .notice-text-datetime {
      font-size: 12px;
      margin-bottom: 20px;
      line-height: 1.5715;
    }

    .notice-text-message {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
      max-width: 100%;
    }

    .notice-text-datetime {
      margin-top: 2px;
      margin-bottom: 4px;
    }
  }
}
</style>
