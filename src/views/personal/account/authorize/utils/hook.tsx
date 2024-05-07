import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getGroupList,
  UpdateFenqunTable,
  UpdateFenqun,
  setGroupLeave,
  getBotList,
  setGroupSign
} from "@/api/bot/group/group";
import MemberTable from "../MemberList.vue";
import TimeForm from "../TimeForm.vue";
import scStatus from "@/components/NewStatusIndicator/scStatusIndicator.vue";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../../hooks";
import { addDialog } from "@/components/ReDialog";
import { type FormItemProps } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import { type Ref, h, ref, toRaw, reactive, onMounted, computed } from "vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
import { isNumeric, ExportExcel } from "@/utils/xdteam";
export function useRole(tableRef: Ref) {
  const form = reactive({
    bot_id: "",
    group_name: "",
    group_id: "",
    currentPage: 1,
    pageSize: 10
  });
  const selectedNum = ref(0);
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [5, 10, 20, 50, 100],
    background: true
  });

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
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
      label: "群聊名称",
      prop: "group_name"
    },
    {
      label: "群聊号码",
      prop: "group_id",
      minWidth: 100
    },
    {
      label: "群头像",
      prop: "image",
      cellRenderer: ({ row }) => {
        if (isNumeric(row.group_id)) {
          const image = `https://p.qlogo.cn/gh/${row.group_id}/${row.group_id}/100`;
          return (
            <span>
              <el-image
                style="border-radius: 5px"
                fit="cover"
                preview-teleported={true}
                src={image}
                lazy
                preview-src-list={Array.of(image)}
                class="w-[60px] h-[60px] align-middle"
              />
            </span>
          );
        }
        return (
          <span>
            <el-avatar style="background-color: #77BBAA; color: #FFFFFF;">
              {row.group_name[0]}
            </el-avatar>
          </span>
        );
      },
      width: 160
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
      label: "小管家",
      width: 180,
      prop: "group_admin",
      cellRenderer: ({ row, props }) => (
        <div
          class="tag-container"
          style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
        >
          {row.group_admin.map(userId => (
            <el-tag size={props.size} type="" effect="dark">
              {userId}
            </el-tag>
          ))}
        </div>
      )
    },
    {
      label: "成员数",
      prop: "member",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        return (
          <span
            style={{ color: "blue" }}
          >{`${row.Ydata.member_count}/${row.Ydata.max_member_count}`}</span>
        );
      }
    },
    {
      label: "授权",
      prop: "end_time",
      hide: true,
      cellRenderer: ({ row }) => {
        return row.Auth?.end_time;
      }
    },
    {
      label: "授权",
      prop: "auth",
      minWidth: 60,
      cellRenderer({ row }) {
        const end_time = row.data?.Auth?.end_time;
        const now = new Date();
        let color = "info"; // 默认颜色

        if (end_time) {
          const endTimeDate = new Date(end_time);
          color = now < endTimeDate ? "success" : "danger";
        }

        // 使用 h 函数创建 VNode
        return h(scStatus, {
          type: color,
          pulse: true
        });
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 60,
      slot: "operation"
    }
  ];

  const columnMember: TableColumnList = [
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 50
    },
    {
      label: "账号",
      prop: "user_id"
    },
    {
      label: "群名片",
      prop: "card",
      minWidth: 100
    },
    {
      label: "昵称",
      prop: "nickname",
      minWidth: 100
    },
    {
      label: "身份",
      prop: "role",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        if (row.role === "member") {
          return (
            <el-tag class="ml-2" type="info" dark>
              成员
            </el-tag>
          );
        } else if (row.role === "admin") {
          return (
            <el-tag
              class="ml-2"
              type="info"
              style="background-color: #70CA57; color: white;"
              dark
            >
              管理员
            </el-tag>
          );
        } else if (row.role === "owner") {
          return (
            <el-tag
              class="ml-2"
              type="info"
              style="background-color: #E5C416; color: white;"
              dark
            >
              群主
            </el-tag>
          );
        }
      }
    },
    {
      label: "头像",
      prop: "image",
      cellRenderer: ({ row }) => {
        if (isNumeric(row.user_id)) {
          const image = `https://q1.qlogo.cn/g?b=qq&nk=${row.user_id}&s=640`;
          return (
            <span>
              <el-image
                style="border-radius: 5px"
                fit="cover"
                preview-teleported={true}
                src={image}
                lazy
                preview-src-list={Array.of(image)}
                class="w-[60px] h-[60px] align-middle"
              />
            </span>
          );
        }
        return (
          <span>
            <el-avatar style="background-color: #77BBAA; color: #FFFFFF;">
              {row.nickname[0]}
            </el-avatar>
          </span>
        );
      },
      width: 160
    },
    {
      label: "入群时间",
      prop: "join_time",
      minWidth: 120,
      formatter: ({ join_time }) =>
        dayjs(join_time * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "最近发言",
      prop: "last_sent_time",
      minWidth: 120,
      formatter: ({ last_sent_time }) =>
        dayjs(last_sent_time * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "禁言",
      prop: "shut_up_timestamp",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (row.shut_up_timestamp === 0 || row.shut_up_timestamp < 33159420) {
          return <span>未禁言</span>;
        } else {
          return (
            <span style={{ color: "red" }}>
              {dayjs(row.shut_up_timestamp * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </span>
          );
        }
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 60,
      slot: "operation"
    }
  ];

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空关键词的选择
    tableRef.value.getTableRef().clearSelection();
  }

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enable === false ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.group_name
      }</strong>?`,
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

        const post_data = {
          bot: form.bot_id,
          group_id: row.group_id,
          group_status: row.enable
        };
        UpdateFenqunTable(post_data).then(async res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改群状态", {
                type: "success"
              });
            }, 200);
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
            loading.value = false;
          }
        });
      })
      .catch(() => {
        row.enable === 0 ? (row.enable = 1) : (row.enable = 0);
      });
  }

  /** 查看群成员 */
  function handleMember(row) {
    addDialog({
      title: "群成员列表",
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(MemberTable, { bot: form.bot_id, group_id: row.group_id })
    });
  }

  /** 授权本群 */
  function handleAuth(row?: FormItemProps) {
    addDialog({
      title: `群聊授权`,
      props: {
        formInline: {
          cluster: {
            managementList: row.group_admin
          },
          Auth: {
            end_time: row.data?.Auth?.end_time
          }
        }
      },
      draggable: true,
      fullscreen: isMobile.value ? true : false,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(TimeForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您编辑了群号为${row.group_id}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            curData.bot = form.bot_id;
            curData.group_id = row.group_id;

            UpdateFenqun(curData).then(async res => {
              if (res.code === 200) {
                await chores();
              } else {
                message(`操作失败，${res.message}`, { type: "error" });
              }
            });
          }
        });
      }
    });
  }

  /** 退群 */
  async function QuitGroup(row) {
    const res = await setGroupLeave(form.bot_id, row.group_id);
    if (res.success) {
      message(`退出成功`, { type: "success" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
    onSearch();
  }

  /** 群打卡 */
  async function SignGroup(row) {
    const res = await setGroupSign(form.bot_id, row.group_id);
    if (res.success) {
      message(`群打卡成功`, { type: "success" });
    } else {
      message(`操作失败，${res.message}`, { type: "error" });
    }
    onSearch();
  }

  /** 发送信息 */
  function handleMegBox(_row) {
    message(`界面设计中`, { type: "error" });
  }

  /** 加入黑名单 */
  function handleBlack(_row) {
    message(`界面设计中`, { type: "error" });
  }

  /** 成员加入黑名单 */
  function handleMemberBlack(_row) {
    message(`界面设计中`, { type: "error" });
  }

  /** 踢出成员 */
  function handleKick(_row) {
    message(`界面设计中`, { type: "error" });
  }

  /** 批量退群 */
  async function onbatchQuit() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    const group_list = getKeyList(curSelected, "group_id");

    if (group_list.length > 10) {
      message(`操作失败，不能进行超过10组数据的操作`, { type: "error" });
      return;
    }
    message(`批量退群操作进行中`, { type: "warning" });
    for (let i = 0; i < group_list.length; i++) {
      try {
        const res = await setGroupSign(form.bot_id, group_list[i]);

        if (!res.success) {
          message(`操作失败，群号【${group_list[i]}】退出失败`, {
            type: "error"
          });
          break;
        }

        if (i < group_list.length - 1) {
          const delay = 50 + Math.random() * 450; // 计算50-500毫秒的随机延时
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        message(`操作失败，群号【${group_list[i]}】退出时发生错误`, {
          type: "error"
        });
        break;
      }
    }
    message("批量退群操作完成", { type: "success" });
  }

  /** 批量签到 */
  async function onbatchSign() {
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    const group_list = getKeyList(curSelected, "group_id");

    if (group_list.length > 10) {
      message(`操作失败，不能进行超过10组数据的操作`, { type: "error" });
      return;
    }
    message(`批量签到操作进行中`, { type: "warning" });
    for (let i = 0; i < group_list.length; i++) {
      try {
        const res = await setGroupSign(form.bot_id, group_list[i]);

        if (!res.success) {
          message(`操作失败，群号${group_list[i]}签到失败`, { type: "error" });
          break;
        }

        if (i < group_list.length - 1) {
          const delay = 50 + Math.random() * 450; // 计算50-500毫秒的随机延时
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        message(`操作失败，群号${group_list[i]}签到时发生错误`, {
          type: "error"
        });
        break;
      }
    }
    message("批量签到操作完成", { type: "success" });
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
    const { data } = await getGroupList(form.bot_id, toRaw(form));

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
    getBotList().then(res => {
      if (res.success && res.data.length > 0) {
        form.bot_id = res.data[0];
        onSearch();
      } else {
        message(`当前没有机器人在线`, { type: "warning" });
      }
    });
  });

  return {
    form,
    loading,
    columns,
    columnMember,
    dataList,
    pagination,
    buttonClass,
    selectedNum,
    isMobile,
    onSelectionCancel,
    handleSelectionChange,
    handleAuth,
    handleMegBox,
    handleMember,
    handleBlack,
    handleMemberBlack,
    handleKick,
    onSearch,
    QuitGroup,
    SignGroup,
    onbatchQuit,
    onbatchSign,
    resetForm,
    exportExcel,
    handleSizeChange,
    handleCurrentChange
  };
}
