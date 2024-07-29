/*
 * @Author: xdteam
 * @Date: 2024-07-25 23:39:32
 * @LastEditTime: 2024-07-27 23:45:24
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\views\personal\features\customFunc\utils\hook.tsx
 * 版权声明
 */
import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getFuncData,
  UpdateFunc,
  createFuncApi,
  deleteFuncApi,
  manyDeleteFuncApi
} from "@/api/bot/features/customFunc";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "./types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { ExportExcel } from "@/utils/xdteam";
import { type Ref, h, ref, toRaw, reactive, onMounted } from "vue";

export function useRole(tableRef: Ref) {
  const form = reactive({
    name: "",
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
      label: "函数名称",
      prop: "name",
      minWidth: 120,
      cellRenderer: ({ row, props }) => (
        <div
          class="tag-container"
          style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
        >
          {
            <el-tag size={props.size} type="" effect="dark">
              {row.name}
            </el-tag>
          }
        </div>
      )
    },
    {
      label: "函数内容",
      prop: "code",
      minWidth: 380
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

  function handleDelete(row) {
    deleteFuncApi(row.id).then(async res => {
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
    manyDeleteFuncApi(getKeyList(curSelected, "id")).then(async res => {
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

    const { data } = await getFuncData(postData);
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
      title: `${title}函数`,
      props: {
        formInline: {
          title,
          name: row?.name ?? [],
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
          message(`您${title}了函数名为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createFuncApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateFunc(row?.id, curData).then(async res => {
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
