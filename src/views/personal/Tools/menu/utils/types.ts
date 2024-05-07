interface FormItemProps {
  id?: number;
  title: string;
  keyword: string;
  answer: string;
  power: number; //# 0全员，1管理，2群主，3超管，4主人
  enable: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
