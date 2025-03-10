// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  name: string;
  code: string;
  language?: string; // 默认语言
  theme?: string; // 默认主题
  height?: string; // 默认高度
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
