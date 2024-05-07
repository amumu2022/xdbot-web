import TypeIt from "@/components/ReTypeit";
import Orange from "@iconify-icons/ep/orange";
import Tickets from "@iconify-icons/ep/tickets";
import Location from "@iconify-icons/ep/location";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";

export function useColumns() {
  const lists = [
    { type: "", label: "XD TEAM" },
    { type: "danger", label: "a木木" },
    { type: "warning", label: "机器人" },
    { type: "success", label: "汪星人" },
    { type: "danger", label: "MUMU" }
  ];

  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          用户名
        </div>
      ),
      value: "a木木"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Iphone} />
          </el-icon>
          QQ
        </div>
      ),
      value: (
        <a
          href="https://qm.qq.com/q/CHqJHMqYGk&personal_qrcode_source=4"
          target="_blank"
        >
          651380741
        </a>
      )
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Location} />
          </el-icon>
          交流群
        </div>
      ),
      value: (
        <a
          href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=uR9S8Lro_jX1lbAKOmUHU7A1WNloEtaT&authKey=LyzmCt2rXx9HeXYfgdwG8f3cHBQnt0mCv3Phly1c3jnlsPG%2FKgOPNHIhuZwVMr8v&noverify=0&group_code=195228903"
          target="_blank"
        >
          195228903
        </a>
      )
    }
  ];

  const columnsB = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Tickets} />
          </el-icon>
          标签
        </div>
      ),
      cellRenderer: () => {
        return lists.map(v => {
          return (
            <el-tag class="mr-[10px]" type={v.type} size="small" effect="dark">
              {v.label}
            </el-tag>
          );
        });
      }
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Orange} />
          </el-icon>
          博客
        </div>
      ),
      value: (
        <a href="https://www.cnblogs.com/xdteam/" target="_blank">
          https://www.cnblogs.com/xdteam/
        </a>
      )
    }
  ];

  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Notebook} />
          </el-icon>
          个性签名
        </div>
      ),
      cellRenderer: () => (
        <TypeIt
          className={"github"}
          values={[
            "任何一种凌驾于他人之上的举止背后，都有一种亟需隐藏的自卑感存在。"
          ]}
          cursor={false}
          speed={50}
        />
      )
    }
  ];

  return {
    columnsA,
    columnsB,
    columnsC
  };
}
