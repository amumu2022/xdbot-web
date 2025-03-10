<template>
  <div
    ref="editorRef"
    class="monaco-editor-container"
    :style="{ height: editorHeight }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

// 导入语言模块
import "monaco-editor/esm/vs/basic-languages/python/python.contribution.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution.js";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution.js";
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js";
import "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js";
import "monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js";
import "monaco-editor/esm/vs/basic-languages/php/php.contribution.js";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution.js";
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js";

const props = defineProps({
  code: String,
  language: String,
  theme: String,
  readOnly: Boolean,
  height: String
});

const emits = defineEmits(["update:code"]);

const editorRef = ref<HTMLElement>();
let monacoEditor: monaco.editor.IStandaloneCodeEditor;

const editorHeight = computed(() => props.height || "550px");

const initializeEditor = () => {
  if (editorRef.value) {
    monacoEditor = monaco.editor.create(editorRef.value, {
      value: props.code,
      cursorStyle: "line",
      language: props.language,
      theme: props.theme || "vs", // 使用默认主题
      readOnly: props.readOnly,
      glyphMargin: true,
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      quickSuggestionsDelay: 100
    });

    monacoEditor.onDidChangeModelContent(() => {
      emits("update:code", monacoEditor.getValue());
    });
  }
};

onMounted(() => {
  initializeEditor();
});

watch(
  () => props.language,
  newLanguage => {
    if (monacoEditor) {
      monaco.editor.setModelLanguage(monacoEditor.getModel(), newLanguage);
    }
  }
);

watch(
  () => props.theme,
  newTheme => {
    if (monacoEditor) {
      monaco.editor.setTheme(newTheme);
    }
  }
);
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  border: 1px solid #dcdfe6;
}
</style>
