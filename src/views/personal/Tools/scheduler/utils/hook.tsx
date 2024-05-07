import dayjs from "dayjs";
import editForm from "../form.vue";
import CodeForm from "../fileDetial.vue";
import { message } from "@/utils/message";
import {
  getTaskData,
  UpdateTask_status,
  createTaskApi,
  deleteTaskApi,
  manyDeleteTaskApi
} from "@/api/Tools/scheduler";
import { getScript, getScriptData } from "@/api/system/dock";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../../hooks";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { ExportExcel } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";

const { isMobile } = useBasicLayout();

export function useRole(tableRef: Ref) {
  const form = reactive({
    id_code: 5,
    enable: "",
    work_timestamp: undefined,
    currentPage: 1,
    pageSize: 10
  });

  const taskTypeOptions = [
    // {
    //   value: 1,
    //   label: "全局本地任务"
    // },
    // {
    //   value: 2,
    //   label: "全局功能任务"
    // },
    // {
    //   value: 3,
    //   label: "间隔任务"
    // },
    // {
    //   value: 4,
    //   label: "rss订阅"
    // },
    {
      value: 5,
      label: "脚本任务"
    }
  ];

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
  const indexMethod = (index: number) => {
    return (form.currentPage - 1) * form.pageSize + index + 1;
  };
  const exportExcel = () => {
    ExportExcel(dataList, columns);
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
      minWidth: 50
    },
    {
      label: "任务类型",
      hide: true,
      prop: "id_code"
    },
    // {
    //   label: "data",
    //   hide: true,
    //   prop: "data"
    // },
    {
      label: "任务ID",
      prop: "task_code",
      sortable: true,
      minWidth: 100
    },
    {
      label: "任务名称",
      prop: "name",
      minWidth: 100
    },
    // {
    //   label: "执行间隔",
    //   prop: "interval",
    //   minWidth: 80,
    //   cellRenderer: ({ row }) => {
    //     if (row.id_code == 3 || row.id_code == 4) {
    //       return row.interval;
    //     }
    //     return "-*-";
    //   }
    // },
    {
      label: "任务文件",
      prop: "work_file",
      minWidth: 180,
      cellRenderer: ({ row }) => {
        const handleButtonClick = () => {
          openDialog("查看", row);
        };

        const renderIcon = () => (
          <el-button type={"primary"} onClick={handleButtonClick} link>
            {row?.data?.taskCommand}
          </el-button>
        );

        return renderIcon();
      }
    },
    {
      label: "corn表达式",
      minWidth: 180,
      prop: "corn",
      cellRenderer: ({ row }) => {
        if (row.id_code == 5) {
          return row?.data?.cronExpression;
        }
        if (row.id_code == 3 || row.id_code == 4 || row.id_code == 5) {
          return dayjs(row.next_timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
        return "-*-";
      }
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
      label: "操作",
      fixed: "right",
      width: 110,
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
        UpdateTask_status(row.id_code, row.task_code).then(res => {
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
    deleteTaskApi(row.id_code, row.task_code).then(async res => {
      if (res.code === 200) {
        message(`您删除了任务编号为${row.id_code}的这条数据`, {
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
    manyDeleteTaskApi(
      getKeyList(curSelected, "id_code")[0],
      getKeyList(curSelected, "task_code")
    ).then(async res => {
      if (res.code === 200) {
        message(
          `已删除任务编号为 ${getKeyList(curSelected, "task_code")} 的数据`,
          {
            type: "success"
          }
        );
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
      getScript(row?.data?.taskCommand).then(async res => {
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
          id_code: row?.id_code ?? 5,
          task_code: row?.task_code ?? undefined,
          name: row?.name ?? "",
          interval: row?.interval ?? "",
          enable: row?.enable ?? false,
          cronExpression: row?.data?.cronExpression ?? "",
          taskCommand: row?.data?.taskCommand ?? "",
          data: row?.data ?? []
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
            if (curData.id_code == 1 || curData.id_code == 2) {
              curData.interval = dayjs(curData.interval).format(
                "YYYY年M月D日H时m分s秒"
              );
            }
            if (curData.id_code == 5) {
              curData.data = {
                taskCommand: curData.taskCommand,
                cronExpression: curData.cronExpression
              };
            }

            createTaskApi(curData).then(async res => {
              if (res.code === 200) {
                await chores();
              } else {
                message(`操作失败，${res.message}`, { type: "error" });
              }
            });
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
    taskTypeOptions,
    fileOptions,
    onbatchDel,
    getScript,
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
