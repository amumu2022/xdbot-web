import dayjs from "dayjs";
import editForm from "../form.vue";
import scStatus from "@/components/NewStatusIndicator/scStatusIndicator.vue";
import { message } from "@/utils/message";
import {
  getAdvertData,
  UpdateAdvert,
  UpdateAdvert_status,
  createAdvertApi,
  deleteAdvertApi,
  manyDeleteAdvertApi
} from "@/api/system/advert";
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
import { useCopyToClipboard } from "@pureadmin/utils";
const { clipboardValue, copied } = useCopyToClipboard();

const copyString = string => {
  clipboardValue.value = string;
  if (copied.value) {
    message(`复制地址成功`, { type: "success" });
  }
};

export function useRole(tableRef: Ref) {
  const form = reactive({
    custom: "",
    alt: "",
    src: "",
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
      label: "客户名称",
      prop: "custom",
      sortable: true,
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const handleButtonClick = () => {
          copyString(row.alt);
        };

        const renderIcon = () => (
          <el-button type="primary" onClick={handleButtonClick} link>
            {row.custom}
          </el-button>
        );

        return renderIcon();
      }
    },
    {
      label: "跳转地址",
      prop: "alt",
      minWidth: 140
    },
    {
      label: "图片",
      prop: "src",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.src}
          style="border-radius: 5px"
          preview-src-list={Array.of(row.src)}
          class="w-[60px] h-[60px] align-middle"
        />
      ),
      width: 100
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
      label: "创建时间",
      minWidth: 130,
      sortable: true,
      prop: "create_time",
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "授权",
      prop: "auth",
      minWidth: 60,
      cellRenderer({ row }) {
        const end_time = row.end_time;
        const now = new Date();
        let color = "info";

        if (end_time) {
          const endTimeDate = new Date(end_time);
          color = now < endTimeDate ? "success" : "danger";
        }

        return h(scStatus, {
          type: color,
          pulse: true
        });
      }
    },
    {
      label: "到期时间",
      sortable: true,
      minWidth: 130,
      prop: "end_time",
      cellRenderer: ({ row }) => {
        let data = "";
        if (row.end_time) {
          data = dayjs(row.end_time).format("YYYY-MM-DD HH:mm:ss");
        } else {
          data = "";
        }
        return <div>{data}</div>;
      }
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
      }</strong>推广编号为<strong style='color:var(--el-color-primary)'>${
        row.id
      }</strong>的推广吗?`,
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
        UpdateAdvert_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改推广状态", {
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
    deleteAdvertApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了推广ID为${row.id}的这条数据`, {
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
    manyDeleteAdvertApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除推广编号为 ${getKeyList(curSelected, "id")} 的数据`, {
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
    const { data } = await getAdvertData(toRaw(form));
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
      title: `${title}推广`,
      props: {
        formInline: {
          title,
          custom: row?.custom ?? "",
          filelist: [],
          src: row?.src ?? "",
          end_time: dayjs(row?.end_time).format("YYYY-MM-DD HH:mm:ss") ?? "",
          alt: row?.alt ?? ""
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
          message(`您${title}了推广编号为${curData.custom}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            curData.filelist = curData.filelist.map(file => file.raw);
            curData.file = curData.filelist[0];
            if (title === "新增") {
              createAdvertApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateAdvert(row?.id, curData).then(async res => {
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
