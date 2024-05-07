interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  custom: string;
  alt: string;
  src: string;
  filelist?: any;
  file?: any;
  end_time: string;
  enable: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
