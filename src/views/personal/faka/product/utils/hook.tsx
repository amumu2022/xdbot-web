import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getProductData,
  UpdateProduct,
  UpdateProduct_status,
  createProductApi,
  deleteProductApi,
  manyDeleteProductApi,
  getCategoryData
} from "@/api/bot/faka/main";
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
    name: "",
    category: "",
    exchange: null,
    enable: "",
    currentPage: 1,
    pageSize: 10
  });
  const CategoryOptions = ref([]);
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
      label: "商品名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "分类",
      prop: "category",
      minWidth: 100
    },
    {
      label: "价格",
      sortable: true,
      prop: "price",
      minWidth: 60
    },
    {
      label: "库存",
      sortable: true,
      prop: "inventory",
      minWidth: 60,
      cellRenderer: ({ row }) => {
        if (row.inventory === "0") {
          return <span style={{ color: "red" }}>{row.inventory}</span>;
        }
        return <span>{row.inventory}</span>;
      }
    },
    {
      label: "已售",
      prop: "sold",
      sortable: true,
      minWidth: 60,
      cellRenderer: ({ row }) => {
        return <span>{row.sold ? row.sold : 0}</span>;
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
      label: "兑换状态",
      prop: "exchange",
      minWidth: 120,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.data?.exchange === 1 ? "success" : "danger"}
          effect="dark"
        >
          {row.data?.exchange === 1 ? "可以兑换" : "不可兑换"}
        </el-tag>
      )
    },
    {
      label: "兑换价格",
      sortable: true,
      prop: "own_price",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        return (
          <span style={{ color: "blue" }}>
            {row.data?.own_price ? row.data?.own_price : "0"}
          </span>
        );
      }
    },
    {
      label: "修改时间",
      minWidth: 180,
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
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>商品吗?`,
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
        UpdateProduct_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改商品状态", {
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
    deleteProductApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了商品ID为${row.id}的这条数据`, {
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
    tableRef.value.getTableRef().clearSelection();
  }

  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    manyDeleteProductApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除商品编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getProductData(toRaw(form));
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
  const inventory_num = ref(0);

  function openDialog(title = "新增", row?: FormItemProps) {
    if (row?.data?.skeys) {
      const lineCount = row?.data?.skeys.split("\n").length;
      inventory_num.value = lineCount; // 至少显示一行
    }

    addDialog({
      title: `${title}商品`,
      props: {
        formInline: {
          title,
          name: row?.name ?? "",
          category: row?.category ?? "",
          price: Number(row?.price) ?? 0,
          inventory: inventory_num.value,
          description: row?.description ?? "",
          exchange: row?.data?.exchange,
          own_price: Number(row?.data?.own_price) ?? 0,
          sold: row?.sold ?? "0",
          skeys: row?.data?.skeys ?? "",
          CategoryOptions: CategoryOptions
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
          message(`您${title}了商品为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            const data = {
              exchange: curData.exchange,
              own_price: curData.own_price,
              skeys: curData.skeys
            };
            curData.data = data;
            curData.inventory = curData.skeys.split("\n").length;
            if (title === "新增") {
              createProductApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateProduct(row?.id, curData).then(async res => {
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
    const post_data = toRaw(form);
    post_data.pageSize = 10000000;

    const Category = (await getCategoryData(post_data)).data.results;
    const transformedArray = Category.map(item => ({
      value: item.name,
      label: item.name
    }));

    CategoryOptions.value = transformedArray;
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
