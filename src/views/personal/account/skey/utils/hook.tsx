import dayjs from "dayjs";
import editForm from "../form.vue";
import Desc from "../description.vue";

import { message } from "@/utils/message";
import {
  getSkeyData,
  UpdateSkey,
  UpdateSkey_status,
  createSkeyApi,
  deleteSkeyApi,
  manyDeleteSkeyApi
} from "@/api/bot/group/skey";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { usePublicHooks } from "../../hooks";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { ExportExcel } from "@/utils/xdteam";

export function useRole(tableRef: Ref) {
  const form = reactive({
    parent: "",
    skey: "",
    user: "",
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
  const parentTypes = [
    { value: "群聊出租", text: "群聊出租" },
    { value: "宠物卡密", text: "宠物卡密" }
  ];

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
      label: "所属应用",
      prop: "parent",
      minWidth: 120
    },
    {
      label: "卡密",
      prop: "skey",
      minWidth: 140
    },
    {
      label: "秒数",
      sortable: true,
      prop: "seconds",
      minWidth: 80
    },
    {
      label: "点数",
      sortable: true,
      prop: "points",
      minWidth: 80
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
          active-text="可激活"
          inactive-text="已禁用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 120,
      sortable: true,
      prop: "create_time",
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "使用人",
      prop: "user",
      hide: true,
      minWidth: 100
    },
    {
      label: "卡密状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status ? "danger" : "success"}
          effect="dark"
        >
          {row.status ? "已使用" : "未使用"}
        </el-tag>
      )
    },
    {
      label: "使用时间",
      sortable: true,
      minWidth: 120,
      prop: "use_time",
      cellRenderer: ({ row }) => {
        let data = "";
        if (row.use_time) {
          data = dayjs(row.use_time).format("YYYY-MM-DD HH:mm:ss");
        } else {
          data = "";
        }
        return <div>{data}</div>;
      }
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
      }</strong>卡密编号为<strong style='color:var(--el-color-primary)'>${
        row.id
      }</strong>的卡密吗?`,
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
        UpdateSkey_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改卡密状态", {
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
    deleteSkeyApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了卡密ID为${row.id}的这条数据`, {
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
    manyDeleteSkeyApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除卡密编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getSkeyData(toRaw(form));
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
    if (title === "查看") {
      component = Desc;
    }
    addDialog({
      title: `${title}卡密`,
      props: {
        formInline: {
          title,
          parent: row?.parent ?? "",
          id: row?.id ?? null,
          points: row?.points ?? 0,
          seconds: row?.seconds ?? 1,
          status: row?.status ?? false,
          enable: row?.enable ?? false,
          heard: row?.heard ?? "XDTEAM",
          skey: row?.skey ?? "",
          user: row?.user ?? "",
          use_time: row?.use_time ?? undefined,
          num: row?.num ?? 1
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: isMobile.value ? true : false,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(component, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了卡密编号为${curData.id}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createSkeyApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              if (curData.user) {
                curData.use_time = dayjs().valueOf();
              }

              UpdateSkey(row?.id, curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else {
              done(); // 关闭弹框
              console.log(curData);
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
    parentTypes,
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
