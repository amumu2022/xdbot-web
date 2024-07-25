import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getApiData,
  UpdateAPI,
  UpdateAPI_status,
  createAPI,
  deleteAPI,
  manyDeleteAPI
} from "@/api/bot/features/customApi";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../../hooks";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { ExportExcel } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { useCopyToClipboard } from "@pureadmin/utils";
const { clipboardValue, copied } = useCopyToClipboard();
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();

export function useRole(tableRef: Ref) {
  const form = reactive({
    keyword: "",
    enable: "",
    method: "",
    url: "",
    currentPage: 1,
    pageSize: 10
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const switchLoadMap = ref({});
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
      label: "编号",
      hide: true,
      prop: "id"
    },
    {
      label: "接口",
      prop: "keyword",
      minWidth: 100
    },
    {
      label: "接口地址",
      prop: "url",
      minWidth: 220
    },
    {
      label: "请求方式",
      prop: "method",
      minWidth: 100
    },
    {
      label: "状态",
      prop: "enable",
      minWidth: 80,
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
      label: "请求类型",
      prop: "cookie",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (row.cookie === "" || row.cookie === null) {
          return <span style={{ color: "red" }}>不携带CK</span>;
        } else {
          return <span style={{ color: "green" }}>携带CK</span>;
        }
      }
    },
    {
      label: "修改时间",
      minWidth: 180,
      prop: "update_time",
      formatter: ({ update_time }) =>
        dayjs(update_time).format("YYYY-MM-DD HH:mm:ss")
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
        row.keyword
      }</strong>接口吗?`,
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
        UpdateAPI_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改接口状态", {
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
    deleteAPI(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了接口ID为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  function OutputFuc(row) {
    const encodeIfPresent = value =>
      value ? btoa(encodeURIComponent(value)) : "";
    row.headers = encodeIfPresent(row.headers);
    row.cookie = encodeIfPresent(row.cookie);
    row.body = encodeIfPresent(row.body);
    row.rule = encodeIfPresent(row.rule);
    row.back_set = encodeIfPresent(row.back_set);
    clipboardValue.value = JSON.stringify(row);
    if (copied.value) {
      message(`导出成功`, { type: "success" });
    } else {
      message(`导出失败`, { type: "warning" });
    }
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    tableRef.value.setAdaptive();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    manyDeleteAPI(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除接口编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getApiData(toRaw(form));
    dataList.value = data.results;
    pagination.total = data.total;

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
    addDialog({
      title: `${title}接口`,
      props: {
        formInline: {
          title,
          keyword: row?.keyword ?? "",
          url: row?.url ?? "",
          method: row?.method ?? "GET",
          rule: row?.rule ?? "",
          back_set: row?.back_set ?? "",
          test: row?.test ?? "",
          encode: row?.encode ?? "utf-8",
          headers: row?.headers ?? null,
          body: row?.body ?? null,
          cookie: row?.cookie ?? null,

          judge: row?.judge ?? "no_judge", // 请求失败判断类型
          judgeValue: row?.judgeValue ?? "200", // 请求失败判断值
          judgeKey: row?.judgeKey ?? "", // 请求判断键值
          time: row?.time ?? 10 // 请求超时时间
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
          message(`您${title}了接口为${curData.keyword}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createAPI(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateAPI(row?.id, curData).then(async res => {
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
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    isMobile,
    OutputFuc,
    exportExcel,
    onbatchDel,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
