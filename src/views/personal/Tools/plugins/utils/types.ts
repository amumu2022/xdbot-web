// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

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
  downloads?: number;
  code: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
