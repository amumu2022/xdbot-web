<script setup lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration); // 启用 duration 插件
import { reactive, onDeactivated, onActivated, onMounted } from "vue";
let date = null;
let timer: number | undefined;
let payTimer: number | undefined;
const workTime = dayjs()
  .startOf("day")
  .add(17, "hour")
  .add(30, "minute")
  .format("YYYY-MM-DD HH:mm:ss");
const countObj = reactive<{ showTime: string }>({
  showTime: ""
});

function handRotation(target: HTMLDivElement, deg: number) {
  if (target && target.style) {
    target.style.transform = `rotate(${deg}deg)`;
  }
}

function countDown() {
  const duration = dayjs.duration(dayjs(workTime).diff(dayjs()));
  const hours = duration.hours();
  const minutes = duration.minutes() % 60;
  const seconds = duration.seconds() % 60;
  const dayInWeek = dayjs().day();
  const isOutOfWork = hours <= 0 && minutes <= 0 && seconds <= 0;
  const isWeekend = dayInWeek === 0 || dayInWeek === 6;
  if (isOutOfWork || isWeekend) {
    countObj.showTime = "下班了！";
  } else {
    countObj.showTime = `${"当前时间："} ${hours} ${"时"} : ${minutes} ${"分"} : ${seconds} ${"秒"}`;
    payTimer = window.setTimeout(countDown, 100);
  }
}

function clock() {
  const secondHand = document.querySelector(".second-hand") as HTMLDivElement;
  const minuteHand = document.querySelector(".minute-hand") as HTMLDivElement;
  const hourHand = document.querySelector(".hour-hand") as HTMLDivElement;

  date = new Date();
  const hour = (date.getHours() % 12) + date.getMinutes() / 59;
  const minute = date.getMinutes();
  const second = date.getSeconds();

  handRotation(hourHand, hour * 30);
  handRotation(minuteHand, minute * 6);
  handRotation(secondHand, second * 6);

  timer = window.setTimeout(clock, 500);
}

onDeactivated(() => {
  window.clearTimeout(timer);
  window.clearTimeout(payTimer);
});

onActivated(() => {
  clock();
  countDown();
});

onMounted(() => {
  clock();
  countDown();
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col items-center flex-auto justify-center align-center"
  >
    <div class="clock self-center">
      <div class="inner-circle">
        <div class="hands">
          <div class="dots" />
          <div class="hand hour-hand" />
          <div class="hand minute-hand" />
          <div class="hand second-hand" />
        </div>
      </div>
    </div>
    <p class="leading-10 text-gray-500 mt-8 font-bold">
      {{ countObj.showTime }}
    </p>
  </div>
</template>

<style scoped></style>
