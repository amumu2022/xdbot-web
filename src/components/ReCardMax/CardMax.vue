<script setup lang="ts">
import { computed, PropType } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
defineOptions({
  name: "ReCardMax"
});

interface CardProductType {
  name: string;
  version: string;
  author: string;
  type: string;
  image: string;
  url: string;
  path: string;
  score: number;
  downloads: number;
  isSetup: boolean;
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>
  }
});

const emit = defineEmits([
  "product-detial",
  "product-update",
  "product-stop",
  "product-report",
  "product-delete",
  "product-download",
  "product-install"
]);

const handleClickDetial = (product: CardProductType) => {
  emit("product-detial", product);
};

const handleClickUpdate = (product: CardProductType) => {
  emit("product-update", product);
};

const handleClickStop = (product: CardProductType) => {
  emit("product-stop", product);
};
const handleClickReport = (product: CardProductType) => {
  emit("product-report", product);
};

const handleClickDelete = (product: CardProductType) => {
  emit("product-delete", product);
};

const handleClickDownloads = (product: CardProductType) => {
  emit("product-download", product);
};

const handleClickInstall = (product: CardProductType) => {
  emit("product-install", product);
};
const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.product.isSetup }
]);

const score_value = props.product.score;
</script>

<template>
  <div :class="cardClass" style="margin-left: 8px; margin-right: 8px">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <el-image
          style="width: 80px; height: 80px; border-radius: 10px"
          :src="product.image"
        />
        <div class="app-info">
          <h5>{{ product.name }}</h5>
          <p>版本：{{ product.version }}</p>
          <p>作者：{{ product.author }}</p>
          <p>
            类型：<el-tag size="small">{{ product.type }}</el-tag>
          </p>
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            :color="product.isSetup ? '#00a870' : '#eee'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ product.isSetup ? "已启用" : "已停用" }}
          </el-tag>
        </div>
        <el-dropdown trigger="click">
          <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleClickDetial(product)">
                简介
              </el-dropdown-item>
              <el-dropdown-item
                @click="handleClickUpdate(product)"
                style="color: green"
              >
                更新
              </el-dropdown-item>
              <el-dropdown-item @click="handleClickStop(product)">
                {{ product.isSetup ? "停用" : "启用" }}
              </el-dropdown-item>
              <el-dropdown-item @click="handleClickDelete(product)">
                卸载
              </el-dropdown-item>
              <el-dropdown-item
                @click="handleClickReport(product)"
                style="color: red"
              >
                举报
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-row>
      <el-divider />
      <div class="app-download">
        <el-row
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <el-rate
            v-model="score_value"
            disabled
            text-color="#409EFF"
            show-score
            color="#409EFF"
          />
          <el-divider direction="vertical" />
          <p>{{ product.downloads }}</p>
          <el-divider direction="vertical" />
          <el-link @click="handleClickDownloads(product)" target="_blank"
            >下载</el-link
          >
          <el-divider direction="vertical" />
          <el-link
            type="warning"
            target="_blank"
            @click="handleClickInstall(product)"
            >安装</el-link
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-divider {
  margin: 10px;
}

p {
  font-size: 12px;
}

.el-link {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 80px;
    padding: 12px 16px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      font-size: 24px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 20px;
      margin-bottom: 12px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
