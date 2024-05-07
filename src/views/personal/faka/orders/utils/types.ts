// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  name: string;
  num: string;
  user: string;
  time?: string;
  result: string;
  msg: string;
  method: string;
  border: string;
  create_time: string;
  update_time: string;
  data: any;
}
interface FormProps {
  formInline: FormItemProps;
}

interface ProductProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  name: string;
  category: string;
  price: number;
  inventory: string | number;
  sold?: string | number;
  description: string;
  data?: any;
  skeys?: string;
  exchange?: number | string;
  own_price?: any;
  enable: string;
  CategoryOptions?: any[];
}
export type { FormItemProps, FormProps, ProductProps };
