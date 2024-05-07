// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  /** 关键词名称 */
  songname: string;
  /** 回复内容 */
  num: number;
  /** 关键词匹配类型 */
  type: string | number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
