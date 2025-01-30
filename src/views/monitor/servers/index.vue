<template>
  <div class="main" v-loading="loading">
    <!-- 注意template和div之间 不要加注释  会导致后续的页面渲染空白 -->
    <!-- v-loading指令  可以直接调用Loading动画  -->
    <el-row :gutter="30">
      <el-col :lg="12" :xs="24" :sm="24" class="card-box">
        <el-card shadow="hover">
          <template #header><span>CPU</span></template>
          <el-table
            :data="cpuInfoTable"
            :show-header="true"
            style="width: 100%"
          >
            <el-table-column prop="field" label="属性" />
            <el-table-column prop="value" label="值" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :lg="12" :xs="24" :sm="24">
        <el-card shadow="hover">
          <template #header><span>内存</span></template>
          <el-table
            :data="memoryInfoTable"
            :show-header="true"
            style="width: 100%"
            :cell-class-name="cellClassName"
          >
            <el-table-column prop="field" label="属性" />
            <el-table-column prop="machine" label="服务器" />
            <el-table-column prop="jvm" label="虚拟内存" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header><span>服务器信息</span></template>
          <el-descriptions :column="2">
            <el-descriptions-item
              v-for="(item, index) in serverInfoTable"
              :key="index"
              :label="item.field"
              >{{ item.value }}</el-descriptions-item
            >
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header><span>Python信息</span></template>
          <el-descriptions :column="2">
            <el-descriptions-item
              v-for="(item, index) in jvmInfoTable"
              :key="index"
              :label="item.field"
              :span="item.span"
              >{{ item.value }}</el-descriptions-item
            >
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header><span>磁盘状态</span></template>
          <el-table
            :data="diskInfoTable"
            :show-header="true"
            style="width: 100%"
          >
            <el-table-column prop="name" label="盘符名称" />
            <el-table-column prop="total" label="总大小 (GB)" />
            <el-table-column prop="Free" label="可用大小 (GB)" />
            <el-table-column prop="Used" label="已用大小 (GB)" />
            <el-table-column prop="Read" label="读取速度 (MB/s)" />
            <el-table-column prop="Write" label="写入速度 (MB/s)" />
            <el-table-column
              prop="usage"
              label="已用百分比"
              :formatter="(row, column, cellValue) => cellValue + '%'"
              width="180"
            />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row />
  </div>
</template>

<script setup lang="ts">
import { getServerInfoApi, ServerInfo } from "@/api/system/monitor";
import { onBeforeMount, ref, onUnmounted } from "vue";

defineOptions({
  name: "ServersMonitor"
});

const loading = ref(true);
const timerId = ref(null);

const cpuInfoTable = ref([]);
const memoryInfoTable = ref([]);
const serverInfoTable = ref([]);
const jvmInfoTable = ref([]);
const diskInfoTable = ref([]);

async function getList() {
  loading.value = true;
  const { data } = await getServerInfoApi().finally(() => {
    loading.value = false;
  });

  const serverInfo = data as ServerInfo;
  cpuInfoTable.value = [
    {
      field: "核心数",
      value: serverInfo.cpuInfo.cpuNum
    },
    {
      field: "用户使用率",
      value: serverInfo.cpuInfo.used + "%"
    },
    {
      field: "系统使用率",
      value: serverInfo.cpuInfo.sys + "%"
    },
    {
      field: "当前空闲率",
      value: serverInfo.cpuInfo.free + "%"
    }
  ];

  memoryInfoTable.value = [
    {
      field: "总内存",
      machine: serverInfo.memoryInfo.total + "GB",
      jvm: serverInfo.SwapmemoryInfo.total + "MB"
    },
    {
      field: "已用内存",
      machine: serverInfo.memoryInfo.used + "GB",
      jvm: serverInfo.SwapmemoryInfo.used + "MB"
    },
    {
      field: "剩余内存",
      machine: serverInfo.memoryInfo.free + "GB",
      jvm: serverInfo.SwapmemoryInfo.free + "MB"
    },
    {
      field: "使用率",
      machine: serverInfo.memoryInfo.usage + "%",
      jvm: serverInfo.SwapmemoryInfo.usage + "%",
      // 设置warning  页面上会红字显示
      warning: serverInfo.SwapmemoryInfo.usage > 30
    }
  ];

  serverInfoTable.value = [
    {
      field: "服务器名称",
      value: serverInfo.systemInfo.computerName
    },
    {
      field: "操作系统",
      value: serverInfo.systemInfo.osName
    },
    {
      field: "服务器IP",
      value: serverInfo.systemInfo.computerIp
    },
    {
      field: "系统架构",
      value: serverInfo.systemInfo.osArch
    }
  ];

  jvmInfoTable.value = [
    {
      field: "Python名称",
      value: "Cpython",
      span: 1
    },
    {
      field: "Python版本",
      value: serverInfo.python,
      span: 1
    },
    {
      field: "启动时间",
      value: serverInfo.systemInfo.startTime,
      span: 1
    },
    {
      field: "运行时长",
      value: serverInfo.systemInfo.runTime,
      span: 1
    }
  ];

  diskInfoTable.value = serverInfo.diskInfos;
}

function cellClassName({ row }) {
  if (row.warning) {
    return "text-red-500";
  }
}

onBeforeMount(() => {
  getList();
  timerId.value = setInterval(getList, 20000); // 每 10 秒定时刷新
});

onUnmounted(() => {
  if (timerId.value !== null) {
    clearInterval(timerId.value); // 组件卸载时清除定时器
  }
});
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.card-box {
  margin-bottom: 20px;
}
</style>
