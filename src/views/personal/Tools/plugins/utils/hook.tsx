import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getctmData,
  Updatectm,
  Updatectm_status,
  createctmApi,
  deletectmApi,
  manyDeletectmApi
} from "@/api/bot/keyword/keyword";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { ExportExcel } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { usePublicHooks } from "../../../hooks";
import { ElMessageBox } from "element-plus";

export function useRole(tableRef: Ref) {
  const form = reactive({
    keyword: undefined,
    enable: "",
    currentPage: 1,
    pageSize: 10
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
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
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const exportExcel = () => {
    ExportExcel(dataList, columns);
  };

  const columns: TableColumnList = [
    {
      label: "列表", // 如果需要表格多选，此处label必须设置
      type: "selection",
      width: 20
    },
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      width: 80
    },
    {
      label: "编号",
      hide: true,
      prop: "id"
    },
    {
      label: "函数关键词",
      prop: "keyword",
      minWidth: 380,
      cellRenderer: ({ row, props }) => (
        <div
          class="tag-container"
          style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
        >
          {row.keyword.map(userId => (
            <el-tag size={props.size} type="" effect="dark">
              {userId}
            </el-tag>
          ))}
        </div>
      )
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
      label: "修改时间",
      minWidth: 160,
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
        Updatectm_status(row.id).then(res => {
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
    deletectmApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了ID为${row.id}的这条数据`, {
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
    // 用于多选表格，清空脚本的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    manyDeletectmApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const postData = toRaw(form);
    postData.keyword = postData.keyword || [];

    if (!Array.isArray(postData.keyword)) {
      postData.keyword = [postData.keyword];
    }
    const { data } = await getctmData(postData);
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
      title: `${title}关键词`,
      props: {
        formInline: {
          title,
          keyword: row?.keyword ?? [],
          code: row?.code ?? ""
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
          message(`您${title}了关键词为${curData.keyword}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createctmApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              Updatectm(row?.id, curData).then(async res => {
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
    onbatchDel,
    exportExcel,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    isMobile
  };
}
