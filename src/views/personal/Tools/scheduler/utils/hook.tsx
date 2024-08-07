import dayjs from "dayjs";
import editForm from "../form.vue";
import CodeForm from "../fileDetial.vue";
import formPrimitive from "../formPrimitive.vue";

import { message } from "@/utils/message";
import {
  getTaskData,
  UpdateTask_status,
  createTaskApi,
  deleteTaskApi,
  manyDeleteTaskApi,
  GetTaskLog,
  RunTaskApi,
  StopTaskApi,
  UpdateTask
} from "@/api/Tools/scheduler";
import { getScript, getScriptData } from "@/api/system/dock";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../../hooks";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { ExportExcel, parser_cron } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, computed, reactive, onMounted } from "vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";

const { isMobile } = useBasicLayout();

export function useRole(tableRef: Ref) {
  const form = reactive({
    name: "",
    enable: undefined,
    status: undefined,
    currentPage: 1,
    pageSize: 10
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const switchLoadMap = ref({});
  const fileOptions = ref([]);
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [5, 10, 20, 50, 100],
    background: true
  });

  // 子组件 prop 为 primitive 类型的 demo
  const formPrimitiveParam = ref("");
  const resetFormPrimitiveParam = ref(formPrimitiveParam.value);

  
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  const indexMethod = (index: number) => {
    return (form.currentPage - 1) * form.pageSize + index + 1;
  };
  const exportExcel = () => {
    ExportExcel(dataList, columns);
  };

  const manyHandleRun = () => {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    RunTaskApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`正在批量运行任务`, {
          type: "success"
        });
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
      tableRef.value.getTableRef().clearSelection();
    });
  };

  const manyHandleStop = () => {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    StopTaskApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已批量停止任务`, {
          type: "success"
        });
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
      tableRef.value.getTableRef().clearSelection();
    });
  };

  const handleRun = id => {
    RunTaskApi([id]).then(async res => {
      if (res.code === 200) {
        message(res.message, { type: "success" });
        onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  };

  const handleStop = id => {
    StopTaskApi([id]).then(async res => {
      if (res.code === 200) {
        console.log(res);
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  };

  
  const handleLog = id => {
    
    GetTaskLog(id).then(async res => {
    if (res.code !== 200) {
        message(`操作失败，${res.message}`, { type: "error" });
      } else {
      const data = res.data;
          const text1 = `## 开始执行... ${ dayjs(data?.last_execution_time * 1000).format("YYYY-MM-DD HH:mm:ss")}`;
          const text2 = `${data.content}`;
          const text3 = `## 执行结束... ${dayjs((data?.last_execution_time + data?.last_run_time) * 1000).format("YYYY-MM-DD HH:mm:ss")}  耗时：${data?.last_run_time}秒`;
          addDialog({
            title: "日志详情",
            width: "46%",
            draggable: true,
            fullscreenIcon: true,
            fullscreen: isMobile.value ? true : false,
            contentRenderer: () =>
              h(formPrimitive, {
                data: `${text1}\n\n${text2}\n${text3}`,
                "onUpdate:data": val => (formPrimitiveParam.value = val)
              }),
            closeCallBack: () => {
              // 重置表单数据
              formPrimitiveParam.value = resetFormPrimitiveParam.value;
              onSearch()
            }
          });
        }
    });
  };
  const columns: TableColumnList = [
    {
      label: "列表", // 如果需要表格多选，此处label必须设置
      type: "selection"
    },
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 50,
      sortable: true
    },
    {
      label: "任务名称",
      prop: "name",
      minWidth: 100,
      sortable: true
    },
    {
      label: "任务文件",
      prop: "work_file",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const handleButtonClick = () => {
          openDialog("查看", row);
        };

        const renderIcon = () => (
          <el-button type={"primary"} onClick={handleButtonClick} link>
            {row?.work_file}
          </el-button>
        );

        return renderIcon();
      }
    },
    {
      label: "运行状态",
      prop: "status",
      minWidth: 80,
      sortable: true,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 0 ? "danger" : "success"}
        >
          {row.status === 0 ? "空闲中" : "运行中"}
        </el-tag>
      )
    },
    {
      label: "状态",
      prop: "enable",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enable}
          active-value={true}
          inactive-value={false}
          active-text="已激活"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "corn表达式",
      minWidth: 100,
      prop: "schedule"
    },
    {
      label: "运行时长",
      minWidth: 80,
      sortable: true,
      prop: "last_run_time"
    },
    {
      label: "最后运行时间",
      minWidth: 120,
      sortable: true,
      prop: "last_execution_time",
      formatter: ({ last_execution_time }) =>
        dayjs(last_execution_time * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "下次运行时间",
      minWidth: 120,
      sortable: true,
      prop: "corn",
      formatter: ({ schedule }) =>
        dayjs(parser_cron(schedule)[0]).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enable === false ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>任务吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        UpdateTask_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改任务状态", {
                type: "success"
              });
            }, 200);
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
        });
      })
      .catch(() => {
        row.enable === 0 ? (row.enable = 1) : (row.enable = 0);
      });
  }

  function handleDelete(row) {
    deleteTaskApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了任务编号为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空任务的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    manyDeleteTaskApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除任务ID为 ${getKeyList(curSelected, "id")} 的数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
      tableRef.value.getTableRef().clearSelection();
    });
  }
  function handleSizeChange(val: number) {
    form.currentPage = 1;
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.currentPage = val;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getTaskData(toRaw(form));
    dataList.value = data.results;
    pagination.total = data.total;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  // 更新文件选择框
  async function updateSelector() {
    loading.value = true;
    const { data } = await getScriptData({ name: "" });
    const dataList = data.results;
    fileOptions.value = dataList.map(item => {
      return {
        value: item.name,
        label: item.name
      };
    });
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    const content_data = ref();
    if (title == "查看") {
      getScript(row?.work_file).then(async res => {
        if (res.code !== 200) {
          message(`操作失败，${res.message}`, { type: "error" });
          return "";
        } else {
          content_data.value = res.data;
        }
        addDialog({
          title: `${title}脚本`,
          props: {
            title,
            name: row?.name ?? "",
            content: content_data.value
          },
          draggable: true,
          fullscreen: true,
          closeOnClickModal: false,
          contentRenderer: () => h(CodeForm, { ref: formRef })
        });
      });

      return;
    }

    addDialog({
      title: `${title}任务`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          work_file: row?.work_file ?? "",
          enable: row?.enable ?? true,
          schedule: row?.schedule ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了任务为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createTaskApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateTask(row.id, curData).then(async res => {
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

  onMounted(() => {
    onSearch();
    updateSelector();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    fileOptions,
    buttonClass,
    onbatchDel,
    getScript,
    manyHandleRun,
    handleLog,
    manyHandleStop,
    handleRun,
    handleStop,
    onSearch,
    resetForm,
    openDialog,
    exportExcel,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
