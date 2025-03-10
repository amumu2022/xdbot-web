/*
 * @Author: xdteam
 * @Date: 2024-07-25 23:39:32
 * @LastEditTime: 2025-03-07 19:48:19
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\views\personal\Tools\plugins\utils\hook.tsx
 * 版权声明
 */

import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getPluginsList,
  UpdatePluginsApi,
  getPluginsAllList,
  createPluginsApi,
  deletePluginsApi,
  UpdatePlugins_status,
  GetPluginCode,
  UpdatePluginCodeApi,
  createPluginLocalApi
} from "@/api/Tools/plugins";
import { restartCode } from "@/api/system/monitor";
import { downloadByUrl } from "@pureadmin/utils";
import { generateRandomLetters } from "@/utils/xdteam";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "./types";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { h, ref, toRaw, reactive, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
export function useRole() {
  const form = reactive({
    name: "",
    installed: "1",
    enable: undefined
  });

  const loading = ref(true);
  const formRef = ref();
  const searchStatus = ref(false);
  const productList = ref([]);

  const pagination = ref({ current: 1, pageSize: 12, total: 0 });
  const { isMobile } = useBasicLayout();

  // 筛选已经安装的插件
  function completeInstalledPlugins(
    allPlugins: any[],
    installedPlugins: any[]
  ): Array<{ [key: string]: any }> {
    const pluginMap = new Map(allPlugins.map(plugin => [plugin.name, plugin]));

    return installedPlugins.map(installedPlugin => {
      const fullPlugin = pluginMap.get(installedPlugin.name);

      if (fullPlugin) {
        return { ...fullPlugin, ...installedPlugin };
      }

      return installedPlugin;
    });
  }

  async function onSearch() {
    try {
      const post_data = toRaw(form);
      const name = post_data.name;
      const enable = post_data.enable;
      if (enable == "") {
        post_data.enable = undefined;
      }
      const installedPluginsData = await getPluginsList(toRaw(form));
      const installedPlugins = installedPluginsData.data.results;

      const installed = post_data.installed;
      const { data } = await getPluginsAllList();
      productList.value = data.results.filter(product =>
        product.name.includes(name)
      );

      if (installed === "1") {
        productList.value = completeInstalledPlugins(
          productList.value,
          installedPlugins
        );
      }

      pagination.value = {
        ...pagination.value,
        total: productList.value.length
      };
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {}, 500);
    }
  }

  const onPageSizeChange = (size: number) => {
    pagination.value.pageSize = size;
    pagination.value.current = 1;
  };

  const onCurrentChange = (current: number) => {
    pagination.value.current = current;
  };

  const handleClickDetial = product => {
    ElMessageBox.alert(
      product?.desc ? product?.desc : "作者好懒...还没写简介呢",
      product.name,
      {
        confirmButtonText: "好的"
      }
    );
  };

  const handleClickUpdate = product => {
    UpdatePluginsApi(product).then(async res => {
      if (res.code === 200) {
        onSearch();
        message(`插件 ${product.name} 更新成功，需要手动重启系统重载插件`, {
          type: "success"
        });
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  };

  const handleClickStop = product => {
    const enable = product.enable;
    UpdatePlugins_status(product).then(async res => {
      if (res.code === 200) {
        onSearch();
        message(`插件 ${product.name} ${enable ? "已停用" : "已启用"}`, {
          type: "success"
        });
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  };

  const handleClickReport = product => {
    message(`插件 ${product.name} 举报失败`, { type: "error" });
  };

  const handleClickDelete = product => {
    deletePluginsApi(product).then(async res => {
      if (res.code === 200) {
        onSearch();
        message(`插件 ${product.name} 卸载成功，需要手动重启系统重载插件`, {
          type: "warning"
        });
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  };

  const handleClickDownloads = product => {
    downloadByUrl(product.url, `${product.name}.py`);
  };

  const handleClickInstall = async (product: any) => {
    try {
      const res = await createPluginsApi(product);

      if (res.code === 200) {
        onSearch();
        message(`插件 ${product.name} 安装成功，需要手动重启系统重载插件`, {
          type: "success"
        });
      } else if (res.code === 201) {
        // 弹出确认框，询问是否强制安装
        const confirmResult = await ElMessageBox.confirm(
          `已存在该插件，是否<strong><span style='color:red'>强制安装/更新</span></strong>`,
          "系统提示",
          {
            confirmButtonText: "立即安装",
            cancelButtonText: "取消",
            type: "warning",
            dangerouslyUseHTMLString: true,
            draggable: true
          }
        );

        if (confirmResult === "confirm") {
          // 强制安装，传递 enforce 参数
          const enforceRes = await createPluginsApi({
            ...product,
            enforce: true
          });

          if (enforceRes.code === 200) {
            onSearch();
            message(
              `插件 ${product.name} 强制安装成功，需要手动重启系统重载插件`,
              { type: "success" }
            );
          } else {
            message(`强制安装失败，${enforceRes.message}`, { type: "error" });
          }
        }
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    } catch (error) {
      message(`安装失败，请稍后再试`, { type: "error" });
    }
  };

  function funcRestart() {
    ElMessageBox.confirm(
      `请确定是否<strong><span style='color:red'>立即重启系统</span></strong>`,
      "系统提示",
      {
        confirmButtonText: "立即重启",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    ).then(() => {
      message(`系统重启中`, {
        type: "warning"
      });
      restartCode();
    });
  }

  async function handleClickEdit(product) {
    if (product.enable) {
      const { data } = await GetPluginCode(product.folder);
      product.code = data;
      openDialog("编辑", product);
    } else {
      message(`只有已启用的插件才可编辑`, { type: "error" });
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(async () => {
    onSearch();
    searchStatus.value = !isMobile.value;
    loading.value = false;
  });

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}插件`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          code: row?.code ?? "",
          version: row?.version ?? "1.0.0",
          author: row?.author ?? "",
          type: row?.type ?? "日常",
          folder:
            row?.folder ??
            `${generateRandomLetters(1, 1)}${generateRandomLetters(
              2,
              2
            )}_${generateRandomLetters(2, 4)}`,
          image:
            row?.image ??
            "https://ts3.cn.mm.bing.net/th?id=OIP-C.JA4-FcgT71zBprqSv3c4AQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
          url: row?.url ?? "",
          path: row?.path ?? "string",
          score: row?.score ?? 3.0,
          downloads: row?.downloads ?? 1000
        }
      },
      draggable: true,
      fullscreenIcon: true,
      width: "70%",
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(
            `您${title}了插件名为${curData.name}的这条数据，需要手动重启系统重载插件`,
            {
              type: "success"
            }
          );
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createPluginLocalApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdatePluginCodeApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  return {
    onPageSizeChange,
    funcRestart,
    onSearch,
    searchStatus,
    productList,
    pagination,
    isMobile,
    form,
    loading,
    resetForm,
    openDialog,
    onCurrentChange,
    handleClickDetial,
    handleClickUpdate,
    handleClickStop,
    handleClickReport,
    handleClickDelete,
    handleClickDownloads,
    handleClickInstall,
    handleClickEdit
  };
}
