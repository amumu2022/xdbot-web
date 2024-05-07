import { message } from "@/utils/message";
import {
  getOrdersData,
  deleteOrdersApi,
  manyDeleteOrdersApi
} from "@/api/bot/faka/main";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import descriptionForm from "@/views/personal/faka/orders/description.vue";
import { type Ref, ref, h, toRaw, reactive, onMounted } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { ExportExcel } from "@/utils/xdteam";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
export function useRole(tableRef: Ref) {
  const form = reactive({
    name: "",
    user: "",
    time: "",
    result: "",
    msg: "",
    method: "",
    border: "",
    currentPage: 1,
    pageSize: 10
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
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
      label: "商品ID",
      prop: "num",
      minWidth: 60
    },
    {
      label: "终端用户",
      prop: "user",
      minWidth: 100
    },
    {
      label: "商品信息",
      prop: "msg",
      minWidth: 200,
      align: "left"
    },

    {
      label: "支付方式",
      prop: "method",
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const operationTypes = [
          { value: "货币兑换", text: "货币兑换" },
          { value: "支付宝支付", text: "支付宝支付" },
          { value: "微信支付", text: "微信支付" },
          { value: "QQ支付", text: "QQ支付" },
          { value: "余额支付", text: "余额支付" }
          // 添加更多操作类型...
        ];
        const etagTypes = [
          { value: "货币兑换", text: "info" },
          { value: "支付宝支付", text: "warning" },
          { value: "微信支付", text: "danger" },
          { value: "QQ支付", text: "success" },
          { value: "余额支付", text: null }
          // 添加更多操作类型...
        ];
        const method = row.method;
        const etagType = etagTypes.find(item => item.value === method)?.text;
        const operationType = operationTypes.find(item => item.value === method)
          ?.text;
        return (
          <el-tag size={props.size} type={etagType} effect="dark">
            {operationType}
          </el-tag>
        );
      }
    },
    {
      label: "订单状态",
      prop: "result",
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const operationTypes = [
          { value: "已完成", text: "已完成" },
          { value: "待支付", text: "待支付" },
          { value: "已超时", text: "已超时" }
          // 添加更多操作类型...
        ];
        const etagTypes = [
          { value: "待支付", text: "warning" },
          { value: "已超时", text: "danger" },
          { value: "已完成", text: "success" }
          // 添加更多操作类型...
        ];
        const result = row.result;
        const etagType = etagTypes.find(item => item.value === result)?.text;
        const operationType = operationTypes.find(item => item.value === result)
          ?.text;
        return (
          <el-tag size={props.size} type={etagType} effect="dark">
            {operationType}
          </el-tag>
        );
      }
    },

    {
      label: "流水单号",
      prop: "border",
      minWidth: 110
    },

    {
      label: "操作",
      fixed: "right",
      width: 110,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    deleteOrdersApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了订单ID为${row.id}的这条数据`, {
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
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    manyDeleteOrdersApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除订单编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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

  function openDialog(row) {
    addDialog({
      title: "订单详情",
      width: "60%",
      draggable: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: true,
      contentRenderer: () => h(descriptionForm, toRaw(row)),
      footerButtons: [
        {
          label: "关闭",
          text: true,
          size: "large",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            closeDialog(options, index);
          }
        }
      ]
    });
  }
  async function onSearch() {
    loading.value = true;
    const { data } = await getOrdersData(toRaw(form));
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

  onMounted(() => {
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
    openDialog,
    onSearch,
    resetForm,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
