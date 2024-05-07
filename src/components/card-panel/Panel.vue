<script setup lang="ts">
import { ReNormalCountTo } from "@/components/ReCountTo";

const props = defineProps({
  imgUrl: {
    type: String,
    default: ""
  },
  bannerColor: {
    type: String,
    default: "bg-blue-300"
  },
  price: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div class="px-2 w-full">
    <div
      class="border border-white border-solid grid grid-cols-3 gap-4 h-[124px] rounded-xl shadow-lg shadow-base"
    >
      <div class="pl-6 col-span-2 flex flex-col justify-start items-start">
        <span class="pt-3 pb-2 text-gray-400 text-lg">
          <slot name="title" />
        </span>
        <div>
          <span class="text-lg font-bold">
            <ReNormalCountTo
              :duration="2000"
              :fontSize="'1em'"
              :startVal="1"
              :endVal="props.price"
            />
          </span>
          <span class="pl-2 font-bold text-gray-400">
            <slot name="badge" />
          </span>
        </div>
        <div class="pt-1">
          <span
            :class="props.bannerColor"
            class="p-1 rounded-md text-white text-sm"
          >
            <slot name="banner" />
          </span>
          <span class="pl-2 text-gray-400 text-sm">
            <slot name="description" />
          </span>
        </div>
      </div>
      <div class="flex mt-6 pr-2 justify-center">
        <img
          class="dark:border-light-50 border-light-50 border-solid w-[64px] h-[64px] rounded-md"
          :src="props.imgUrl"
          alt="avatar"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
