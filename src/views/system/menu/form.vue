<script setup lang="ts">
import { ref, watch } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "./utils/types";
import IconSelect from "@/components/ReIcon/src/Select.vue";
import FromQuestion from "@/components/FromQuestion/index.vue";
import { MenuTypeOptions } from "@/components/constants/constants";
import { dirFormRules, menuFormRules, permissionFormRules } from "./utils/rule";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    title: "",
    parent_id: 0,
    name: "",
    type: "",
    code: "",
    url: "",
    icon: "",
    menu_name: "",
    open_type: undefined,
    sort: 0,
    enable: 0
  })
});
const icon = ref("ep:add-location");
icon.value = props.formInline.icon ?? "ep:add-location";

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
function getRef() {
  return ruleFormRef.value;
}
watch(icon, newValue => {
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.icon = newValue;
});
const formRules = ref(dirFormRules);
const handleChangeMenuType = (val: number) => {
  setTimeout(function () {
    ruleFormRef.value!.clearValidate([
      "open_type",
      "name",
      "sort",
      "code",
      "url",
      "menu_name"
    ]);
  }, 30);

  if (val === 0) {
    formRules.value = dirFormRules;
  } else if (val === 1) {
    formRules.value = menuFormRules;
  } else {
    formRules.value = permissionFormRules;
  }
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="父级菜单" v-if="newFormInline.open_type !== 0">
          <template #label>
            <from-question
              label="父级"
              description="父级菜单，操作的菜单在该菜单路径下"
            />
          </template>
          <el-cascader
            class="w-full"
            v-model="newFormInline.parent_id"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              // emiturl: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择父级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="30">
      <re-col>
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="30">
      <re-col>
        <el-form-item label="权限标识" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入权限标识"
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="30">
      <template
        v-if="newFormInline.open_type == 0 || newFormInline.open_type == 1"
      >
        <re-col>
          <el-form-item label="页面路径" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入前端项目views文件内的页面路径"
            />
          </el-form-item>
        </re-col>
      </template>

      <template v-if="newFormInline.open_type == 1">
        <re-col>
          <el-form-item label="菜单组件" prop="menu_name">
            <el-input
              v-model="newFormInline.menu_name"
              clearable
              placeholder="请输入组件定义的name，defineOptions中的name"
            />
          </el-form-item>
        </re-col>
      </template>

      <template v-if="newFormInline.open_type == 3">
        <re-col>
          <el-form-item label="网站地址" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入外部网站地址或者内部网站相对地址"
            />
          </el-form-item>
        </re-col>
      </template>

      <template v-if="newFormInline.open_type == 4">
        <re-col>
          <el-form-item label="网站地址" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入外部网站地址，必须以https://或者http://开头"
            />
          </el-form-item>
        </re-col>
      </template>
    </el-row>

    <el-row :gutter="30">
      <re-col>
        <el-form-item label="打开方式" prop="open_type">
          <el-radio-group
            v-model="newFormInline.open_type"
            @change="handleChangeMenuType"
          >
            <el-radio-button
              v-for="(item, index) in MenuTypeOptions"
              :label="item.value"
              :key="index"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="30">
      <re-col :gutter="30">
        <el-form-item label="菜单图标" prop="icon">
          <IconSelect v-model="icon" style="width: 100%" />
        </el-form-item>
      </re-col>
    </el-row>

    <re-col :gutter="30">
      <el-form-item label="排序">
        <el-input-number
          v-model="newFormInline.sort"
          :min="0"
          :max="9999"
          controls-position="right"
        />
      </el-form-item>
    </re-col>
  </el-form>
</template>
