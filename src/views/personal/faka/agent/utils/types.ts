// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  user_id: string;
  user_level: string;
  balance: string;
  discount: string;
  data?: any;
  enable?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
