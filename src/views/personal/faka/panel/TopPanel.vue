<script setup lang="ts">
import Panel from "@/components/card-panel/Panel.vue";

interface Animal {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  color: string;
  img: string;
  description: string;
}

const props = defineProps({
  DataList: {
    type: Array as PropType<Animal[]>,
    default: () => []
  }
});
</script>

<template>
  <el-col
    :sm="24"
    :md="8"
    :xl="8"
    v-for="animal in props.DataList"
    :key="animal.id"
  >
    <Panel
      :banner-color="animal.color"
      :img-url="animal.img"
      :price="animal.price"
    >
      <template #title>{{ animal.name }}</template>
      <template #badge>{{ animal.unit }}</template>
      <template #banner>{{ animal.category }}</template>
      <template #description>{{ animal.description }}</template>
    </Panel>
  </el-col>
</template>

<style lang="scss" scoped>
.el-col {
  margin: 8px 0;
}
</style>
