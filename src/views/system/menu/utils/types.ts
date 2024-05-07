interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  parent_id: number;
  name: string;
  type: string;
  code: string;
  icon: string;
  url: string;
  menu_name: string;
  open_type: string | number;
  sort: number;
  enable: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
