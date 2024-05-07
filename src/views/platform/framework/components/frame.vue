<script setup lang="ts">
import Card from "@/components/ReCard/Card.vue";
import { addDialog } from "@/components/ReDialog";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { h } from "vue";
import ExchangeCard from "./FrameChildren/ExchangeCard.vue";
import Sign from "./FrameChildren/Sign.vue";
import Text2Pic from "./FrameChildren/TextToPic.vue";
import Empty from "./FrameChildren/Empty.vue";
const { isMobile } = useBasicLayout();
const productList = [
  {
    index: 1,
    isSetup: true,
    type: 1,
    name: "签到设置",
    description: "机器人签到游戏的相关设置"
  },
  {
    index: 2,
    isSetup: true,
    type: 2,
    name: "文转图设置",
    description: "文字转图片的设置专区"
  },
  {
    index: 3,
    isSetup: true,
    type: 3,
    name: "卡片兑换",
    description: "在这里你可以对卡片兑换进行一些设置"
  },
  {
    index: 4,
    isSetup: true,
    type: 4,
    name: "存储设置",
    description: "网站上传的文件储存到哪呢？"
  }
];

const handleManageProduct = product => {
  let component = Empty;
  if (product.index == 1) {
    component = Sign;
  } else if (product.index == 2) {
    component = Text2Pic;
  } else if (product.index == 3) {
    component = ExchangeCard;
  } else if (product.index == 4) {
    component = ExchangeCard;
  }
  openDialog(product.name, component);
};

function openDialog(name: string, component) {
  addDialog({
    title: `${name}`,
    width: "46%",
    draggable: true,
    fullscreenIcon: true,
    fullscreen: isMobile.value ? true : false,
    contentRenderer: () => h(component)
  });
}
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-for="(product, index) in productList"
      :key="index"
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
      :xl="4"
    >
      <Card :product="product" @manage-product="handleManageProduct" />
    </el-col>
  </el-row>
</template>
