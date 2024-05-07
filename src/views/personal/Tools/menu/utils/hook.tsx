/*
 * @Author: xdteam
 * @Date: 2024-04-24 21:22:49
 * @LastEditTime: 2024-04-24 22:51:18
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\views\personal\Tools\menu\utils\hook.tsx
 * 版权声明
 */
import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getMenuData,
  UpdateMenu,
  UpdateMenu_status,
  createMenuApi,
  deleteMenuApi,
  manyDeleteMenuApi
} from "@/api/bot/keyword/keyword";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { usePublicHooks } from "../../../hooks";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { ExportExcel } from "@/utils/xdteam";

export function useRole(tableRef: Ref) {
  const form = reactive({
    keyword: "",
    answer: "",
    power: undefined,
    enable: undefined,
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
      label: "菜单名称",
      prop: "keyword",
      minWidth: 100
    },
    {
      label: "回复语句",
      prop: "answer",
      minWidth: 200,
      align: "left"
    },
    {
      label: "菜单权限",
      prop: "power",
      minWidth: 70,
      cellRenderer: ({ row }) => {
        const etagTypes = [
          { value: "群员", text: "info" },
          { value: "管理", text: "warning" },
          { value: "群主", text: "danger" },
          { value: "超管", text: "success" },
          { value: "主人", text: null }
        ];
        const power =
          row.power === 1
            ? "群员"
            : row.power === 2
            ? "管理"
            : row.power === 3
            ? "群主"
            : row.power === 4
            ? "超管"
            : "主人";
        const etagType = etagTypes.find(item => item.value === power)?.text;
        return (
          <el-tag type={etagType} effect="dark">
            {power}
          </el-tag>
        );
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
          inactive-text="已禁用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "更新时间",
      minWidth: 130,
      sortable: true,
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
      }</strong>菜单编号为<strong style='color:var(--el-color-primary)'>${
        row.id
      }</strong>的菜单吗?`,
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
        UpdateMenu_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改菜单状态", {
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
    deleteMenuApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了菜单ID为${row.id}的这条数据`, {
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
    manyDeleteMenuApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除菜单编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getMenuData(toRaw(form));
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
      title: `${title}菜单`,
      props: {
        formInline: {
          title,
          keyword: row?.keyword ?? "",
          answer: row?.answer ?? "",
          power: row?.power ?? 1
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: isMobile.value ? true : false,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了菜单编号为${curData.id}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createMenuApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateMenu(row?.id, curData).then(async res => {
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

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    exportExcel,
    selectedNum,
    pagination,
    isMobile,
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
