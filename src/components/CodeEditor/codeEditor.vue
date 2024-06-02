<!--
 * @Descripttion: 代码编辑器
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2022年5月20日21:46:29
 * @LastEditors: YourName
 * @LastEditTime: 2024-06-01 22:11:14
-->

<template>
  <div class="sc-code-editor" :style="{ height: _height }">
    <textarea ref="textarea" v-model="contentValue" />
  </div>
</template>

<script>
import { markRaw } from "vue";

//框架
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";

//主题
import "codemirror/theme/darcula.css";
import "codemirror/theme/ayu-mirage.css";

//功能
import "codemirror/addon/selection/active-line";

//语言
import "codemirror/mode/javascript/javascript"; // javascript
import "codemirror/mode/python/python"; // python
import "codemirror/mode/xml/xml"; // xml
import "codemirror/mode/php/php"; // php
import "codemirror/mode/go/go"; // go
import "codemirror/mode/css/css"; // css
import "codemirror/mode/htmlmixed/htmlmixed"; // html
import "codemirror/mode/yaml/yaml"; // yaml
import "codemirror/mode/markdown/markdown"; // markdown
import "codemirror/mode/lua/lua"; // lua
import "codemirror/mode/shell/shell"; // shell

export default {
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "clike"
    },
    height: {
      type: [String, Number],
      default: 400
    },
    options: {
      type: Object,
      default: () => {}
    },
    theme: {
      type: String,
      default: "darcula"
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentValue: this.modelValue,
      coder: null,
      opt: {
        theme: this.theme, //主题
        styleActiveLine: true, //高亮当前行
        lineNumbers: true, //行号
        lineWrapping: false, //自动换行
        tabSize: 4, //Tab缩进
        indentUnit: 4, //缩进单位
        indentWithTabs: true, //自动缩进
        mode: this.mode, //语言
        readOnly: this.readOnly, //只读

        ...this.options
      }
    };
  },
  computed: {
    _height() {
      return Number(this.height) ? Number(this.height) + "px" : this.height;
    }
  },
  watch: {
    modelValue(val) {
      this.contentValue = val;
      if (val !== this.coder.getValue()) {
        this.coder.setValue(val);
      }
    }
  },
  mounted() {
    this.init();
    //获取挂载的所有modes
    //console.log(CodeMirror.modes)
  },
  methods: {
    init() {
      this.coder = markRaw(
        CodeMirror.fromTextArea(this.$refs.textarea, this.opt)
      );
      this.coder.on("change", coder => {
        this.contentValue = coder.getValue();
        this.$emit("update:modelValue", this.contentValue);
      });
    },
    formatStrInJson(strValue) {
      return JSON.stringify(JSON.parse(strValue), null, 4);
    }
  }
};
</script>

<style scoped>
.sc-code-editor {
  font-size: 14px;
  border: 1px solid #ddd;
  line-height: 150%;
}
.sc-code-editor:deep(.CodeMirror) {
  height: 100%;
}
</style>
