// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  title: string;
  keyword: string;
  url: string;
  method: string | number;
  rule?: string;
  value_num?: string;
  back_set?: string;
  test?: string;
  encode?: string | number;
  headers?: string;
  body?: string;
  cookie?: string;
  enable: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
