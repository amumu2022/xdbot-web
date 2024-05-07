import { getMusicData } from "@/api/bot/features/main";
import { ref, toRaw, reactive, onMounted } from "vue";
import { ExportExcel } from "@/utils/xdteam";

export function useRole() {
  const form = reactive({
    songname: "",
    type: "0",
    num: 5
  });
  const dataList = ref([]);
  const loading = ref(true);
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
      prop: "id",
      minWidth: 50
    },
    {
      label: "歌曲名称",
      prop: "songName",
      minWidth: 160
    },
    {
      label: "歌手",
      prop: "singer",
      minWidth: 100
    },
    {
      label: "歌曲图片",
      prop: "image",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.image}
          preview-src-list={Array.of(row.image)}
          class="w-[60px] h-[60px] align-middle"
        />
      ),
      width: 160
    },
    {
      label: "播放",
      prop: "songUrl",
      cellRenderer: ({ row }) => (
        <td>
          <audio controls ref="audio" class="aud" style="outline: none;">
            <source src={row.songUrl} />
          </audio>
        </td>
      ),
      width: 400
    },
    {
      label: "平台",
      prop: "platform",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        return <span style={{ color: "blue" }}>{row.platform}</span>;
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 100,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { result } = await getMusicData(toRaw(form));
    dataList.value = result.items;
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
    onSearch,
    resetForm
  };
}
