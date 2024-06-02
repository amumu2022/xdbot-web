<script setup lang="ts">
import { ListItem } from "./data";
import { ref, PropType } from "vue";
import { useNav } from "@/layout/hooks/useNav";
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
const messageRef = ref(null);
const messageTooltip = ref(false);
const { tooltipEffect } = useNav();

// 复制链接
const copyLinks = text => {
  clipboardValue.value = text;
  if (copied.value) {
    message(`消息内容已复制`, { type: "success" });
  } else {
    message(`消息内容复制失败`, { type: "error" });
  }
};

function hoverDescription(event, message) {
  // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
  const tempTag = document.createElement("span");
  tempTag.innerText = message;
  tempTag.className = "getDescriptionWidth";
  document.querySelector("body").appendChild(tempTag);
  const currentWidth = (
    document.querySelector(".getDescriptionWidth") as HTMLSpanElement
  ).offsetWidth;
  document.querySelector(".getDescriptionWidth").remove();

  // cellWidth为容器的宽度
  const cellWidth = event.target.offsetWidth;
  // 当文本宽度大于容器宽度两倍时，代表文本显示超过4行
  currentWidth > 2 * cellWidth
    ? (messageTooltip.value = true)
    : (messageTooltip.value = false);
}
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
          `${props.noticeItem.datetime}&emsp;&emsp;&emsp;&emsp;小墩插件(${props.noticeItem?.bot_id})`
        }}
      </div>
      <div class="notice-title-content">
        {{ props.noticeItem.title2 }}
      </div>
      <el-tooltip
        popper-class="notice-title-popper"
        :effect="tooltipEffect"
        :disabled="!messageTooltip"
        :content="props.noticeItem.message"
        placement="top-start"
      >
        <div
          ref="messageRef"
          class="notice-text-message"
          @mouseover="hoverDescription($event, props.noticeItem.message)"
        >
          {{ props.noticeItem.message }}
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<style>
.notice-title-popper {
  max-width: 238px;
}
</style>
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
      text-overflow: ellipsis;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }

    .notice-text-datetime {
      margin-top: 2px;
      margin-bottom: 4px;
    }
  }
}
</style>
