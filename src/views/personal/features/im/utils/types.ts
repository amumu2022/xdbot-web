// webscoket 相关设置
export interface ws_set {
  websocket_url: string;
}

// post_type 枚举类型，表示上报类型
export enum post_type {
  message = "message", // 消息，例如群聊消息
  message_sent = "message_sent", // 消息发送，例如bot发送在群里的消息
  request = "request", // 请求，例如好友申请
  notice = "notice", // 通知，例如群成员增加
  meta_event = "meta_event" // 元事件，例如go-cqhttp心跳包
}

// post_message_message_sender 接口，表示消息发送者的基础信息
export interface post_message_message_sender {
  user_id: number; // 发送者 QQ 号
  nickname: string; // 昵称
  sex: string; // 性别，male 或 female 或 unknown
  age: number; // 年龄
}

// post_message_message_sender_group 接口，表示群聊中消息发送者的信息
export interface post_message_message_sender_group
  extends post_message_message_sender {
  group_id: number; // 群聊中发送者QQ号对应的群号
  card: string; // 群名片/备注
  area: string; // 地区
  level: string; // 成员等级
  role: string; // 角色，owner 或 admin 或 member
  title?: string; // 专属头衔，此字段可能不存在
}

// post_message_type 枚举类型，表示消息类型
export enum post_message_type {
  private = "private", // 私聊消息
  group = "group" // 群消息
}

// post_message_subtype 枚举类型，表示消息子类型
export enum post_message_subtype {
  friend = "friend", // 好友
  normal = "normal", // 群聊
  anonymous = "anonymous", // 匿名
  group_self = "group_self", // 群中自身发送
  group_temp = "group", // 群临时会话
  notice = "notice" // 系统提示
}

// post_message_tempsource 枚举类型，传输使用int32，表示消息临时会话的来源
export enum post_message_tempsource {
  group_chat = 0, // 群聊
  q_q_consultation = 1, // QQ咨询
  search = 2, // 查找
  q_q_movie = 3, // QQ电影
  hot_chat = 4, // 热聊
  verification_msg = 6, // 验证消息
  multi_person_chat = 7, // 多人聊天
  date = 8, // 约会
  address_book = 9 // 通讯录
}

// post_request_type 枚举类型，表示请求类型
export enum post_request_type {
  friend = "friend", // 好友请求
  group = "group" // 群请求
}

// post_notice_type 枚举类型，表示通知类型
export enum post_notice_type {
  group_upload = "group_upload", // 群文件上传
  group_admin = "group_admin", // 群管理员变更
  group_decrease = "group_decrease", // 群成员减少
  group_increase = "group_increase", // 群成员增加
  group_ban = "group_ban", // 群成员禁言
  friend_add = "friend_add", // 好友添加
  group_recall = "group_recall", // 群消息撤回
  friend_recall = "friend_recall", // 好友消息撤回
  group_card = "group_card", // 群名片变更
  offline_file = "offline_file", // 离线文件上传
  client_status = "client_status", // 客户端状态变更
  essence = "essence", // 精华消息
  notify = "notify" // 系统通知
}

// post_notice_notify_subtype 枚举类型，表示系统通知的子类型
export enum post_notice_notify_subtype {
  honor = "honor", // 群荣誉变更
  poke = "poke", // 戳一戳
  lucky_king = "lucky_king", // 群红包幸运王
  title = "title" // 群成员头衔变更
}

// post_metaevent_type 枚举类型，表示元事件类型
export enum post_metaevent_type {
  lifecycle = "lifecycle", // 生命周期
  heartbeat = "heartbeat" // 心跳包
}

// status 接口，在心跳包上报中作为成员使用
export interface status {
  app_initialized: boolean; // 程序是否初始化完毕
  app_enabled: boolean; // 程序是否可用
  plugins_good: boolean | null; // 插件正常（可能为null）
  app_good: boolean; // 程序正常
  online: boolean; // 是否在线
  stat: status_statistics; // 统计信息
}

// status_statistics 接口，是心跳包的status字段的stat字段
export interface status_statistics {
  packet_received: number; // 收包数
  packet_sent: number; // 发包数
  packet_lost: number; // 丢包数
  message_received: number; // 消息接收数
  message_sent: number; // 消息发送数
  disconnect_times: number; // 连接断开次数
  lost_times: number; // 连接丢失次数
  last_message_time: number; // 最后一次消息时间
}

// post_metaevent_lifecycletype 枚举类型，表示生命周期上报的子类型
export enum post_metaevent_lifecycletype {
  enable = "enable", // 启用
  disable = "disable", // 禁用
  connect = "connect" // 连接
}
