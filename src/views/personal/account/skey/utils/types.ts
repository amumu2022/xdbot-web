interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  seconds: number;
  parent: string;
  num?: number;
  heard?: string;
  points?: number;
  skey?: string;
  status?: boolean;
  enable: boolean;
  user?: string;
  use_time?: number;
  create_time?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
