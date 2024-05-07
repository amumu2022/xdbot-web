/**
 * 选项
 */
export interface SelectOption<T> {
  label: string;
  value: T;
}
export interface SelectOptionMap<T> {
  [key: string | number]: T;
}
/**
 * 菜单类型
 */
export const MenuTypeOptions: SelectOption<number>[] = [
  { label: "目录", value: 0 },
  { label: "菜单", value: 1 },
  { label: "按钮", value: 2 },
  { label: "签页内嵌", value: 3 },
  { label: "外链跳转", value: 4 }
];
export const MenuTypeMap: SelectOptionMap<string> = {
  0: "目录",
  1: "菜单",
  2: "按钮",
  3: "签页内嵌",
  4: "外链跳转"
};

/**
 * 状态
 */
export const enableOptions: SelectOption<number>[] = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
];
export const enableMap: SelectOptionMap<string> = {
  1: "启用",
  0: "禁用"
};
export const enableBooleanMap: SelectOptionMap<boolean> = {
  1: true,
  0: false
};

export const ifEnableOptions: SelectOption<boolean>[] = [
  { label: "启用", value: true },
  { label: "禁用", value: false }
];

export const ifNumberOptions: SelectOption<number>[] = [
  { label: "是", value: 1 },
  { label: "否", value: 0 }
];

export const ifOptions: SelectOption<boolean>[] = [
  { label: "是", value: true },
  { label: "否", value: false }
];
