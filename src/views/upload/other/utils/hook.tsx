import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getOtherData,
  deleteOtherApi,
  manyDeleteOtherApi
} from "@/api/upload/upload";
import { ExportExcel } from "@/utils/xdteam";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
export function useRole(tableRef: Ref) {
  const form = reactive({
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
  const exportExcel = () => {
    ExportExcel(dataList, columns);
  };
  const columns: TableColumnList = [
    {
      label: "列表", // 如果需要表格多选，此处label必须设置
      type: "selection",
      minWidth: 40
    },
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 40
    },
    {
      label: "文件编号",
      hide: true,
      prop: "id"
    },
    {
      label: "文件名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "文件",
      prop: "href",
      cellRenderer: ({ row }) => (
        <el-button type="success" onClick={() => handleDownload(row)}>
          点击下载
        </el-button>
      )
    },
    {
      label: "mime类型",
      prop: "mime",
      minWidth: 120
    },
    {
      label: "文件大小",
      prop: "size",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        const sizeInKb = (row.size / 1024).toFixed(2) + " MB";
        return <span style={{ color: "blue" }}>{sizeInKb}</span>;
      }
    },
    {
      label: "上传时间",
      minWidth: 180,
      prop: "create_time",
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 60,
      slot: "operation"
    }
  ];

  function handleDownload(row) {
    // 创建一个隐藏的<a>元素
    const link = document.createElement("a");
    link.href = row.href;
    link.target = "_blank";
    link.download = "";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  function handleDelete(row) {
    deleteOtherApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了文件ID为${row.id}的这条数据`, {
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
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    manyDeleteOtherApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除文件编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getOtherData(toRaw(form));
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

  function openDialog(title = "新增") {
    addDialog({
      title: `${title}文件`,
      width: "40%",
      draggable: true,
      showClose: false,
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: done => {
        done(); // 关闭弹框
        onSearch(); // 刷新表格数据
      },
      beforeCancel: done => {
        done(); // 关闭弹框
        onSearch();
        message(`上传成功`, { type: "success" });
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
    onSearch,
    exportExcel,
    resetForm,
    openDialog,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleDownload,
    handleCurrentChange,
    handleSelectionChange
  };
}
