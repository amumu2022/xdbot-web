interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;

  name: string;
  enable?: boolean;
  schedule?: string;
  work_file?: string;
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
