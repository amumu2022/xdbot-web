interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;

  id_code: number;
  task_code: number;
  name: string;
  enable?: boolean;
  work_timestamp?: number;
  interval?: string | number;
  taskCommand?: string;
  cronExpression?: string;
  data?: any;
}
interface FormProps {
  formInline: FormItemProps;
}

interface FileItemProps {
  title: string;
  name: string;
  content: string;
}

export type { FormItemProps, FormProps, FileItemProps };
