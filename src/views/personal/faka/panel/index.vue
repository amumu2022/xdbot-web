<script setup lang="ts">
import profile from "@/assets/img/profile-img.png";
import ReCol from "@/components/ReCol";
import LineChart from "./LineChart.vue";
import TopLine from "./TopPanel.vue";
import { ref, onMounted } from "vue";
import { getPanelData, getOrdersData } from "@/api/bot/faka/main";
import { getYiyan } from "@/api/bot/faka/main";

import { groupOrdersByDate, calculateTotalPriceByDate } from "./main";
import userAdd from "@/assets/img/useradd.png";
import user from "@/assets/img/user.png";
import order1 from "@/assets/img/order1.png";
import order2 from "@/assets/img/order2.png";
import money1 from "@/assets/img/money1.png";
import money2 from "@/assets/img/money2.png";
import Pie from "@/components/RePie/Pie.vue";

const loading = ref<boolean>(true);
setTimeout(() => {
  loading.value = !loading.value;
}, 800);

const Fromdata = ref({
  agent_all: 0,
  agent_today: 0,
  product_all: 0,
  category_all: 0,
  orders_all: 0,
  orders_today: 0,
  money_all: 0,
  money_today: 0
});

const animalList = ref([]);

const MoneyData = ref([]);
const OrderData = ref([]);

const progressMethod = ref([]);
const progressColor = ref([
  "#67C23A",
  "#F56C6C",
  "#409EFF",
  "#E6A23C",
  "#909399"
]);

function get_data(data) {
  const paymentMethods = {
    QQ支付: "",
    微信支付: "",
    余额支付: "",
    支付宝支付: "",
    货币兑换: ""
  };
  const results = data.data.results;
  for (let i = 0; i < results.length; i++) {
    const method = results[i].method;
    paymentMethods[method] = paymentMethods[method]
      ? paymentMethods[method] + 1
      : 1;
  }

  progressMethod.value = [
    { value: paymentMethods.QQ支付, name: "QQ" },
    { value: paymentMethods.微信支付, name: "微信" },
    { value: paymentMethods.余额支付, name: "余额" },
    { value: paymentMethods.支付宝支付, name: "支付宝" },
    { value: paymentMethods.货币兑换, name: "货币" }
  ];
}

function getCurrentTimePeriod(): string {
  const currentTime: Date = new Date();
  const currentHour: number = currentTime.getHours();

  if (currentHour >= 0 && currentHour < 5) {
    return "凌晨";
  } else if (currentHour >= 5 && currentHour < 12) {
    return "上午";
  } else if (currentHour >= 12 && currentHour < 15) {
    return "中午";
  } else if (currentHour >= 15 && currentHour < 18) {
    return "下午";
  } else {
    return "晚上";
  }
}

const showMonthly = ref(true);
const AllOrderData = ref();

const showMonthlyChart = () => {
  showMonthly.value = true;
  MakeData();
};

const showWeeklyChart = () => {
  showMonthly.value = false;
  MakeData();
};

const MakeData = () => {
  const jsonData = JSON.parse(JSON.stringify(AllOrderData.value));
  const groupedData = groupOrdersByDate(
    jsonData.data.results,
    showMonthly.value
  );
  const totalPriceData = calculateTotalPriceByDate(
    jsonData.data.results,
    showMonthly.value
  );
  MoneyData.value = totalPriceData;
  OrderData.value = groupedData;
};

const yiyan = ref([]);
async function getRandomQuote() {
  let yiyan_list = [];

  getYiyan().then(async res => {
    yiyan_list = res.data.list;
    const randomIndex = Math.floor(Math.random() * yiyan_list.length);
    yiyan.value = yiyan_list[randomIndex];
  });

  const { data } = await getPanelData();
  Fromdata.value = data;

  animalList.value = [
    {
      id: 1,
      name: "今日订单",
      price: data.orders_today,
      unit: "个",
      category: "订单",
      color: "bg-yellow-300",
      img: order1
    },
    {
      id: 2,
      name: "今日收入",
      price: data.money_today,
      unit: "RMB",
      category: "收入",
      color: "bg-green-300",
      img: money1
    },
    {
      id: 3,
      name: "新增用户",
      price: data.agent_today,
      unit: "",
      category: "用户",
      color: "bg-blue-300",
      img: userAdd
    },
    {
      id: 4,
      name: "订单总数",
      price: data.orders_all,
      unit: "个",
      category: "订单",
      color: "bg-yellow-300",
      img: order2
    },
    {
      id: 5,
      name: "成交金额",
      price: data.money_all,
      unit: "RMB",
      category: "收入",
      color: "bg-green-300",
      img: money2
    },
    {
      id: 6,
      name: "用户总数",
      price: data.agent_all,
      unit: "",
      category: "用户",
      color: "bg-blue-300",
      img: user
    }
  ];

  const post_data = {
    name: "",
    user: "",
    time: "",
    result: "",
    msg: "",
    method: "",
    border: "",
    currentPage: 1,
    pageSize: 10000000
  };
  const order_data = await getOrdersData(post_data);
  AllOrderData.value = order_data;
  showWeeklyChart();
  get_data(AllOrderData.value);
}

onMounted(() => {
  getRandomQuote();
});
</script>

<template>
  <el-row :gutter="20" class="card-padding">
    <el-col :sm="24" :md="8" :xl="8">
      <!-- 第一个卡片，包含欢迎面板 -->
      <el-card shadow="hover" class="card-spacing">
        <el-row :gutter="20">
          <el-col :sm="24" :md="24" :xl="24">
            <div class="bg-soft-primary">
              <el-row>
                <el-col :span="12">
                  <div class="text-primary p-3">
                    <h4 class="text-primary">
                      {{ getCurrentTimePeriod() + `好！欢迎回来` }}
                    </h4>
                    <p style="font-size: 13px">
                      {{ yiyan }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="12">
                  <img
                    :src="profile"
                    alt=""
                    style="height: auto; max-width: 100%"
                  />
                </el-col>
              </el-row>
            </div>

            <el-card shadow="never" class="card-body pt-0">
              <el-row>
                <el-col :span="24">
                  <div class="pt-2">
                    <el-row>
                      <el-col :span="6">
                        <h5 class="font-size-15">
                          {{ Fromdata.product_all }}个
                        </h5>
                        <p class="text-muted mb-0">商品总数</p>
                      </el-col>
                      <el-col :span="6">
                        <h5 class="font-size-15">{{ Fromdata.agent_all }}</h5>
                        <p class="text-muted mb-0">用户总数</p>
                      </el-col>
                      <el-col :span="6">
                        <h5 class="font-size-15">{{ Fromdata.orders_all }}</h5>
                        <p class="text-muted mb-0">成功订单</p>
                      </el-col>
                      <el-col :span="6">
                        <h5 class="font-size-15">
                          {{ Fromdata.money_all.toFixed(2) }}
                        </h5>
                        <p class="text-muted mb-0">成交金额</p>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <!-- 第二个卡片，包含生意罗盘 -->
      <el-card shadow="hover" class="card-spacing">
        <re-col>
          <div class="flex justify-between">
            <span class="text-md font-medium">支付方式</span>
          </div>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Pie :colorList="progressColor" :dataList="progressMethod" />
            </template>
          </el-skeleton>
        </re-col>
      </el-card>
    </el-col>

    <el-col :sm="24" :md="16" :xl="16">
      <el-card shadow="hover" class="card-spacing">
        <el-row> <TopLine :DataList="animalList" /></el-row>
      </el-card>

      <el-row>
        <el-card shadow="hover" class="card-spacing" style="width: 100%">
          <el-row>
            <el-col :sm="24" :md="24" :xl="24">
              <el-button type="success" @click="showWeeklyChart"
                >七日统计</el-button
              >
              <el-button type="primary" @click="showMonthlyChart"
                >月度统计</el-button
              >
              <LineChart
                v-if="showMonthly"
                :OrderList="OrderData"
                :MoneyList="MoneyData"
                :month="showMonthly"
              />
              <LineChart
                v-else
                :OrderList="OrderData"
                :MoneyList="MoneyData"
                :month="showMonthly"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-col {
  margin: 8px 0;
}
.mb-4 {
  margin-bottom: 1rem; /* 这里1rem是一个例子，你可以根据需要调整 */
}
.card-spacing {
  margin-bottom: 20px; /* 这里20px是一个例子，根据实际需要调整 */
}
.card-padding {
  padding: 0 20px; /* 左右各添加10px内边距 */
}

.bg-soft-primary {
  background-color: #ccddff; /* 设置背景颜色 */
  border-top-left-radius: 5px; /* 左上角圆角 */
  border-top-right-radius: 5px; /* 右上角圆角 */
}
.card-body {
  border-top-left-radius: 0; /* 左上角无圆角 */
  border-top-right-radius: 0; /* 右上角无圆角 */
  border-bottom-left-radius: 5px; /* 左下角圆角 */
  border-bottom-right-radius: 5px; /* 右下角圆角 */
}

.text-muted {
  color: #74788d !important;
}

/* 解决概率进度条宽度 */
.el-progress--line {
  width: 85%;
}

/* 解决概率进度条字体大小 */
.el-progress-bar__innerText {
  font-size: 15px;
}
</style>
