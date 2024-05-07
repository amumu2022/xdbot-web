<script lang="ts" setup>
import { ref, onBeforeMount, watch } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { ApiText2Pic } from "@/api/api";
import { message } from "@/utils/message";
import { FormProps } from "../../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import Save from "@iconify-icons/ri/save-3-fill";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    text2pic: {
      font: {
        model: 1,
        font_type: "1",
        font_color: "#000000",
        line_color: "#000000",
        bg_color: "#FFFFFF"
      },
      text: {
        center: 1,
        convert_link: 1,
        word_limit: 54
      }
    }
  })
});

const newFormInline = ref(props.formInline);

const ModelOptions = [
  {
    value: 1,
    label: "动漫居左"
  },
  {
    value: 2,
    label: "黑白简约"
  },
  {
    value: 3,
    label: "紫色韵味"
  },
  {
    value: 4,
    label: "浅黄回忆"
  },
  {
    value: 5,
    label: "随机变幻"
  },
  {
    value: 6,
    label: "自在彩虹"
  },
  {
    value: 7,
    label: "花开四季"
  },
  {
    value: 8,
    label: "白色商务"
  },
  {
    value: 9,
    label: "自由配色"
  },
  {
    value: 10,
    label: "MC相随"
  }
];

const FontOptions = [
  {
    value: "1",
    label: "微软雅黑"
  },
  {
    value: "2",
    label: "楷体"
  },
  {
    value: "simhei",
    label: "宋体"
  },
  {
    value: "4",
    label: "黑体"
  }
];

const StatusOption = [
  {
    value: 1,
    label: "已开启"
  },
  {
    value: 0,
    label: "已关闭"
  }
];

const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94)",
  "hsla(209, 100%, 56%)",
  "#c7158577"
]);

const srcList = ref([]);
const url = ref(
  "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg"
);
const text = ref(
  "测试文本测试文本\n测试文本测试文本\n测试文本测试文本\n测试文本测试文本\n测试文本测试文本"
);

watch(url, newValue => {
  srcList.value = [newValue];
});

async function saveText() {
  const post_data = { name: "text2pic", data: newFormInline.value.text2pic };
  const data = await UpdateDock("text2pic", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadText();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function GetPic() {
  const post_data = {
    model: newFormInline.value.text2pic.font.model,
    font_type: newFormInline.value.text2pic.font.font_type,
    font_color: newFormInline.value.text2pic.font.font_color,
    line_color: newFormInline.value.text2pic.font.line_color,
    bg_color: newFormInline.value.text2pic.font.bg_color,
    center: newFormInline.value.text2pic.text.center,
    convert_link: newFormInline.value.text2pic.text.convert_link,
    word_limit: newFormInline.value.text2pic.text.word_limit,
    text: text.value
  };

  const data = await ApiText2Pic(post_data);
  if (data.success) {
    url.value = data.data;
    message(data.message, { type: "success" });
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadText() {
  const post_data = { name: "text2pic" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.text2pic = {
      font: {
        model: back?.font.model,
        font_type: back?.font.font_type,
        font_color: back?.font.font_color,
        line_color: back?.font.line_color,
        bg_color: back?.font.bg_color
      },
      text: {
        center: back?.text.center,
        convert_link: back?.text.convert_link,
        word_limit: back?.text.word_limit
      }
    };
  }
}

async function reload() {
  newFormInline.value.text2pic = {
    font: {
      model: 1,
      font_type: "1",
      font_color: "#000000",
      line_color: "#000000",
      bg_color: "#FFFFFF"
    },
    text: {
      center: 1,
      convert_link: 1,
      word_limit: 54
    }
  };
}

onBeforeMount(() => {
  reloadText();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-row :gutter="20">
      <el-col :md="12" :sm="12" :xs="24">
        <el-card shadow="hover" class="grid-spacing">
          <template #header> 参数设置 </template>
          <el-form-item label="模板选择：" prop="model">
            <el-select
              v-model="newFormInline.text2pic.font.model"
              class="full-width-input"
              clearable
              placeholder="请选择模板"
            >
              <el-option
                v-for="(item, index) in ModelOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="字体选择：" prop="font_type">
            <el-select
              v-model="newFormInline.text2pic.font.font_type"
              class="full-width-input"
              clearable
              placeholder="请选择字体"
            >
              <el-option
                v-for="(item, index) in FontOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="是否居中：" prop="center">
            <el-select
              v-model="newFormInline.text2pic.text.center"
              class="full-width-input"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in StatusOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="转换链接：" prop="convert_link">
            <el-select
              v-model="newFormInline.text2pic.text.convert_link"
              class="full-width-input"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in StatusOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="每行字数：" prop="word_limit">
            <el-input-number
              v-model="newFormInline.text2pic.text.word_limit"
              :min="1"
              :max="1999999999"
            />
          </el-form-item>

          <el-form-item label="字体颜色：" prop="font_color">
            <div style="display: flex; align-items: center">
              <el-color-picker
                v-model="newFormInline.text2pic.font.font_color"
                :predefine="predefineColors"
              />
              <span style="margin-left: 20px" class="text-base text-gray-800">
                {{ newFormInline.text2pic.font.font_color }}</span
              >
            </div>
          </el-form-item>

          <el-form-item label="背景颜色：" prop="bg_color">
            <div style="display: flex; align-items: center">
              <el-color-picker
                v-model="newFormInline.text2pic.font.bg_color"
                :predefine="predefineColors"
              />
              <span style="margin-left: 20px" class="text-base text-gray-800">
                {{ newFormInline.text2pic.font.bg_color }}</span
              >
            </div>
          </el-form-item>

          <el-form-item label="线条颜色：" prop="line_color">
            <div style="display: flex; align-items: center">
              <el-color-picker
                v-model="newFormInline.text2pic.font.line_color"
                :predefine="predefineColors"
              />
              <span style="margin-left: 20px" class="text-base text-gray-800">
                {{ newFormInline.text2pic.font.line_color }}</span
              >
            </div>
          </el-form-item>

          <el-button
            type="success"
            :icon="useRenderIcon(Save)"
            @click="saveText"
          >
            保存配置
          </el-button>
          <el-button
            type="warning"
            :icon="useRenderIcon(Refresh)"
            @click="reload"
          >
            恢复默认
          </el-button>
        </el-card>
      </el-col>

      <el-col :md="12" :sm="12" :xs="24">
        <el-card shadow="hover" class="grid-spacing">
          <template #header> 颜色工具 </template>

          <el-form-item label="测试文本：" prop="text">
            <el-input
              v-model="text"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="请输入测试文本"
            />
          </el-form-item>

          <el-button type="success" @click="GetPic"> 生成预览图</el-button>

          <div class="demo-image__lazy">
            <el-image :src="url" lazy :preview-src-list="srcList" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>
<style scoped>
.grid-spacing {
  margin-bottom: 20px;
  background-color: rgb(211, 230, 225);
}

.demo-image__lazy {
  margin-top: 20px;
  height: 400px;
  overflow-y: auto;
}
.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
</style>
