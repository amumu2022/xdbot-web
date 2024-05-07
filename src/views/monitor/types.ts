// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  uid: string;
  url: string;
  user_agent: string;
  status: number;
  operation: number;
  system: string;
  request_params?: any;
  ip: string;
  module: string;
  exception?: string;
  create_time: any;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
