<script setup lang="ts">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { FormProps } from "./utils/types";
import {
  TrendCharts,
  Tickets,
  Platform,
  List,
  Tools,
  Avatar
} from "@element-plus/icons-vue";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "查看",
    points: 0,
    seconds: 0,
    parent: "",
    enable: false,
    status: false,
    skey: "",
    user: "",
    use_time: null,
    create_time: "",
    heard: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

onMounted(() => {});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-descriptions class="margin-top" direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Avatar />
          </el-icon>
          使用账号
        </div>
      </template>
      <el-tag type="warning" size="small" effect="dark">{{
        newFormInline.user
      }}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Platform />
          </el-icon>
          创建时间
        </div>
      </template>
      <el-tag size="small" effect="dark">{{
        dayjs(newFormInline.create_time).format("YYYY-MM-DD HH:mm:ss")
      }}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <TrendCharts />
          </el-icon>
          卡密状态
        </div>
      </template>
      <el-tag
        size="small"
        :type="newFormInline.enable ? 'success' : 'danger'"
        effect="dark"
      >
        {{ newFormInline.enable ? "可使用" : "已禁用" }}
      </el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <tickets />
          </el-icon>
          所属应用
        </div>
      </template>
      <el-tag size="small" effect="dark">{{ newFormInline.parent }}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Platform />
          </el-icon>
          使用时间
        </div>
      </template>
      <el-tag size="small" effect="dark">{{
        dayjs(newFormInline.use_time).format("YYYY-MM-DD HH:mm:ss")
      }}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <TrendCharts />
          </el-icon>
          使用状态
        </div>
      </template>

      <el-tag
        size="small"
        :type="newFormInline.status ? 'danger' : 'success'"
        effect="dark"
      >
        {{ newFormInline.status ? "已使用" : "未使用" }}
      </el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Tools />
          </el-icon>
          卡密编号
        </div>
      </template>

      <el-tag size="small" effect="dark"> {{ newFormInline.id }} </el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Tools />
          </el-icon>
          点数
        </div>
      </template>

      <el-tag size="small" effect="dark"> {{ newFormInline.points }} </el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Tools />
          </el-icon>
          秒数
        </div>
      </template>

      <el-tag size="small" effect="dark"> {{ newFormInline.seconds }} </el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <List />
          </el-icon>
          卡密详情
        </div>
      </template>

      <el-tag type="danger" size="small" effect="dark">
        {{ newFormInline.skey }}
      </el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>
<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.tag {
  margin: 10px 5px;
}

.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
