import dayjs from "dayjs";
import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";

/**
 * 根据现在时间返回文本
 * @param str
 * @returns 返回
 */
export function getCurrentTimePeriod(): string {
  const currentTime: Date = new Date();
  const currentHour: number = currentTime.getHours();

  if (currentHour >= 0 && currentHour < 5) {
    return "凌晨";
  } else if (currentHour >= 5 && currentHour < 12) {
    return "上午";
  } else if (currentHour >= 12 && currentHour < 15) {
    return "中午";
  } else if (currentHour >= 15 && currentHour < 18) {
    return "下午";
  } else {
    return "晚上";
  }
}

/**
 * 导出Excel
 * @param str
 * @returns 返回
 */
export function ExportExcel(dataList, columns: TableColumnList) {
  const currentDateString = dayjs().format("YYYYMMDDHHmmss");
  const fileName = `xdteam-${currentDateString}.xlsx`;
  const res = dataList.value.map(item => {
    const arr = [];
    columns.forEach(column => {
      arr.push(item[column.prop as string]);
    });
    return arr;
  });
  const titleList = [];
  columns.forEach(column => {
    titleList.push(column.label);
  });
  res.unshift(titleList);
  const workSheet = utils.aoa_to_sheet(res);

  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "数据报表");
  writeFile(workBook, fileName);
  message("数据导出成功", {
    type: "success"
  });
}

/**
 * 检查一个字符串是否只包含数字，不含小数点
 * @param str
 * @returns 返回
 */
export function isNumeric(str) {
  return /^\d+$/.test(str);
}

/**
 * 根据后缀名返回vscode的主题
 * @param type
 * @returns
 */
export function get_CodeType(type: string) {
  switch (type) {
    case ".json":
      return "json";
    case ".lua":
      return "lua";
    case ".md":
    case ".markdown":
      return "markdown";
    case ".yaml":
    case ".yml":
      return "yaml";
    case ".xml":
      return "xml";
    case ".php":
      return "php";
    case ".sql":
      return "sql";
    case ".go":
      return "go";
    case ".html":
    case ".htm":
      return "html";
    case ".js":
      return "javascript";
    case ".java":
      return "java";
    case ".kt":
    case ".kotlin":
      return "kotlin";
    case ".py":
      return "python";
    case ".css":
      return "css";
    case ".sh":
      return "shell";
    default:
      return "plaintext";
  }
}

/**
 * 生成a到b之间的随机整数（包括a和b）
 * @param a
 * @param b
 * @returns
 */
export function getRandomIntInclusive(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * 生成特定数量密匙：
 * @param numStrings 生成数量
 * @param length 长度
 * @returns
 */
export function GetSkeys(numStrings: number = 1, length: number = 12): string {
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-*/,.|";
  let result: string = "";

  for (let j = 0; j < numStrings; j++) {
    let randomString: string = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    result += randomString + "\n";
  }

  return result;
}

/**
 * 判断时间是否过期的函数
 * @param old_time
 * @returns
 */
export function isExpired(old_time) {
  // 设置过期时间，比如一天
  const expirationTime = 1 * 1000; // 1秒的时间（以毫秒为单位）
  // 获取当前时间
  const currentTime = new Date().getTime();

  // 计算过期时间点
  const expirationDate = new Date(old_time).getTime() + expirationTime;
  // 判断是否过期
  return currentTime > expirationDate;
}

/**
 * 判断字符串是否可以被json格式化
 * @param str
 * @returns
 */
export function isValidJson(str) {
  try {
    JSON.parse(str);
    return true; // 字符串是有效的 JSON
  } catch (error) {
    return false; // 字符串不是有效的 JSON
  }
}

/**
 * CQ码转义
 * @param str
 * @returns
 */
export function escapeCQCodeParameters(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;")
    .replace(/,/g, "&#44;");
}

/**
 * CQ码反转义
 * @param str
 * @returns
 */
export function unescapeCQCodeParameters(value) {
  return value
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]")
    .replace(/&#44;/g, ",")
    .replace(/&amp;/g, "&");
}
