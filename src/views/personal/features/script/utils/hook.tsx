/*
 * @Author: xdteam
 * @Date: 2023-11-16 23:30:18
 * @LastEditTime: 2024-04-18 20:50:53
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\views\personal\features\script\utils\hook.tsx
 * 版权声明
 */
import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getScriptData,
  createScriptApi,
  deleteScriptApi,
  manyDeleteScriptApi,
  UpdateScript,
  getScript
} from "@/api/system/dock";
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
      label: "脚本名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "脚本路径",
      prop: "path",
      minWidth: 80
    },
    {
      label: "脚本大小",
      prop: "size",
      minWidth: 80
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
      width: 190,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    deleteScriptApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了脚本ID为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }
  const content_data = ref();

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
    manyDeleteScriptApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除脚本编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getScriptData(toRaw(form));
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
    const currentDate = dayjs().format("YYYY/MM/DD HH:mm:ss");
    const fileHeaderComment = `# -*- coding:utf-8 -*-
"""
@Created on : ${currentDate}
@Author: XDTEAM
@Des: 
"""

`;
    if (title === "编辑") {
      // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
      getScript(row?.name).then(async res => {
        if (res.code !== 200) {
          message(`操作失败，${res.message}`, { type: "error" });
          return "";
        } else {
          content_data.value = res.data;
        }
        addDialog({
          title: `${title}脚本`,
          props: {
            formInline: {
              title,
              name: row?.name ?? "",
              content: content_data.value ?? fileHeaderComment
            }
          },
          draggable: true,
          fullscreen: true,
          closeOnClickModal: false,
          contentRenderer: () => h(editForm, { ref: formRef }),
          beforeSure: (done, { options }) => {
            const FormRef = formRef.value.getRef();
            const curData = options.props.formInline as FormItemProps;

            FormRef.validate(valid => {
              if (valid) {
                const code = curData.content;

                const size = code.length / 1024;
                if (curData.name.slice(-3) !== ".py") {
                  curData.name = curData.name + ".py";
                }

                const post_data = {
                  content: code,
                  size: `${size.toFixed(2)}KB`,
                  name: curData.name,
                  path: `/scripts/${curData.name}`
                };

                UpdateScript(row?.id, post_data).then(async res => {
                  if (res.code === 200) {
                    message(`操作成功，请稍后手动刷新`, {
                      type: "success"
                    });
                    done(); // 关闭弹框
                  } else {
                    message(`操作失败，${res.message}`, { type: "error" });
                  }
                });
              }
            });
          }
        });
      });
    } else {
      addDialog({
        title: `${title}脚本`,
        props: {
          formInline: {
            title,
            name: row?.name ?? "",
            content: content_data.value ?? fileHeaderComment
          }
        },
        draggable: true,
        width: "70%",
        fullscreenIcon: true,
        fullscreen: isMobile.value ? true : false,
        closeOnClickModal: false,
        contentRenderer: () => h(editForm, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline as FormItemProps;

          FormRef.validate(valid => {
            if (valid) {
              const code = curData.content;
              if (code === "") {
                message(`操作失败，脚本内容不符合要求`, { type: "error" });
              } else {
                const size = code.length / 1024;
                if (curData.name.slice(-3) !== ".py") {
                  curData.name = curData.name + ".py";
                }

                const post_data = {
                  content: code,
                  size: `${size.toFixed(2)}KB`,
                  name: curData.name,
                  path: `/scripts/${curData.name}`
                };

                createScriptApi(post_data).then(async res => {
                  if (res.code === 200) {
                    message(`操作成功，请稍后手动刷新`, { type: "success" });
                    done(); // 关闭弹框
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
    onbatchDel,
    exportExcel,
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
