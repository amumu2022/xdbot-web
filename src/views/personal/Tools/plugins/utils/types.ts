interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  name: string;
  version?: string;
  author?: string;
  type?: string;
  folder: string;
  image: string;
  url?: string;
  path?: string;
  score?: number;
  desc?: number;
  downloads?: number;
  code: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
