// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  /** 关键词名称 */
  keyword: string;
  /** 回复内容 */
  answer: string;
  /** 关键词匹配类型 */
  sendType: string;
  /** 关键词匹配群聊 */
  group: string | number;
  /** 关键词状态 */
  enable: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
