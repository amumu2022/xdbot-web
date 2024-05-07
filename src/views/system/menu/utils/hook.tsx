import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import {
  getRoutesData,
  createMenuApi,
  deleteMenuApi,
  UpdateMenu,
  UpdateMenu_status
} from "@/api/system/menu";
import { IconifyIconOnline } from "@/components/ReIcon";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import { type FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();

const switchLoadMap = ref({});

export function useDept() {
  const form = reactive({
    name: "",
    enable: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { switchStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "菜单编号",
      prop: "id",
      hide: true
    },
    {
      label: "菜单名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "图标",
      prop: "icon",
      minWidth: 60,
      cellRenderer: ({ row }) => (
        <div class="flex justify-center">
          <IconifyIconOnline icon={row.icon} />
        </div>
      )
    },
    {
      label: "状态",
      minWidth: 130,
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
      label: "打开类型",
      prop: "open_type",
      minWidth: 70,
      cellRenderer: ({ row }) => {
        const etagTypes = [
          { value: "按钮", text: "info" },
          { value: "签页内嵌", text: "warning" },
          { value: "外链跳转", text: "danger" },
          { value: "目录", text: "success" },
          { value: "菜单", text: null }
        ];
        const openType =
          row.open_type === "0"
            ? "目录"
            : row.open_type === "1"
            ? "菜单"
            : row.open_type === "2"
            ? "按钮"
            : row.open_type === "3"
            ? "签页内嵌"
            : "外链跳转";
        const etagType = etagTypes.find(item => item.value === openType)?.text;
        return (
          <el-tag type={etagType} effect="dark">
            {openType}
          </el-tag>
        );
      }
    },
    {
      label: "权限标识",
      prop: "code",
      minWidth: 120
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 60
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
        row.enable === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>菜单吗?`,
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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getRoutesData(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.name)) {
      // 前端搜索菜单名称
      newData = newData.filter(item => item.name.includes(form.name));
    }
    if (!isAllEmpty(form.enable)) {
      // 前端搜索状态
      newData = newData.filter(item => item.enable === form.enable);
    }
    dataList.value = handleTree(newData); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级菜单级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].enable === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value)),
          parent_id: row?.parent_id ?? "0",
          name: row?.name ?? "",
          url: row?.url ?? "",
          menu_name: row?.menu_name ?? "",
          code: row?.code ?? "",
          open_type: row?.open_type ?? 0,
          icon: row?.icon ?? "ep:add-location",
          sort: row?.sort ?? 1,
          enable: row?.enable ?? 1
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了菜单名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            delete curData.higherDeptOptions;

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

  function handleDelete(row) {
    deleteMenuApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了菜单名称为${row.name}的这条数据`, { type: "success" });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
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
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange
  };
}
