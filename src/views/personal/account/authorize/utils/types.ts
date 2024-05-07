// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  bot?: string;
  group_id?: string;
  group_admin?: any;
  data?: any;

  cluster?: cluster;
  Auth?: Auth;
}

export interface Auth {
  end_time?: string;
}
export interface cluster {
  managementList?: any;
}
interface FormProps {
  formInline?: FormItemProps;
}

export type { FormItemProps, FormProps };
