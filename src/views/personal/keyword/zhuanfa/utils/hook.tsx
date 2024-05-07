import dayjs from "dayjs";
import detail from "../detail.vue";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getZhuanfaData,
  UpdateZhuanfa,
  UpdateZhuanfa_status,
  createZhuanfaApi,
  deleteZhuanfaApi,
  manyDeleteZhuanfaApi
} from "@/api/bot/keyword/keyword";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../../hooks";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { ExportExcel } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";

export function useRole(tableRef: Ref) {
  const form = reactive({
    keyword: "",
    enable: "",
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
      label: "关键词",
      prop: "keyword",
      minWidth: 80
    },
    {
      label: "回复语句",
      prop: "answer",
      minWidth: 160,
      align: "left"
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
      label: "转发个人",
      prop: "user",
      minWidth: 180,
      cellRenderer: ({ row, props }) => {
        const showMore = row.data.user_id.length > 5;
        const handleButtonClick = () => {
          console.log("打开", row);
        };
        return (
          <div
            class="tag-container"
            style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
          >
            {row.data?.user_id.slice(0, 5).map(userId => (
              <el-tag size={props.size} type="" effect="dark">
                {userId}
              </el-tag>
            ))}
            {showMore && (
              <el-button
                type="primary"
                size={props.size}
                link
                onClick={handleButtonClick}
              >
                查看更多
              </el-button>
            )}
          </div>
        );
      }
    },
    {
      label: "转发群聊",
      prop: "group",
      minWidth: 180,
      cellRenderer: ({ row, props }) => {
        const showMore = row.data.group_id.length > 5;
        const handleButtonClick = () => {
          openDialog("详情", row);
        };
        return (
          <div
            class="tag-container"
            style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
          >
            {row.data?.group_id.slice(0, 5).map(userId => (
              <el-tag size={props.size} type="warning" effect="dark">
                {userId}
              </el-tag>
            ))}
            {showMore && (
              <el-button
                type="primary"
                size={props.size}
                link
                onClick={handleButtonClick}
              >
                查看更多
              </el-button>
            )}
          </div>
        );
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
      width: 110,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enable === false ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.keyword
      }</strong>关键词吗?`,
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
        UpdateZhuanfa_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改关键词状态", {
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
    deleteZhuanfaApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了关键词ID为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    tableRef.value.setAdaptive();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    manyDeleteZhuanfaApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除关键词编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getZhuanfaData(toRaw(form));
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
    let component = editForm;
    if (title === "详情") {
      component = detail;
    }
    addDialog({
      title: `${title}关键词`,
      props: {
        formInline: {
          title,
          keyword: row?.keyword ?? "",
          answer: row?.answer ?? "",
          user: row?.data?.user_id || [],
          group: row?.data?.group_id || []
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(component, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了关键词为${curData.keyword}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        if (title === "详情") {
          done(); // 关闭弹框
          return null;
        }

        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createZhuanfaApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateZhuanfa(row?.id, curData).then(async res => {
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
    isMobile,
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    onbatchDel,
    onSearch,
    resetForm,
    exportExcel,
    openDialog,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
