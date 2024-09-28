// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  bot?: string;
  BotList?: any;
  group_id?: string;
  group?: GroupSet;
  sendmsg?: Send;
  other?: Other;
  dynamic?: Dynamic;
  cluster?: Cluster;
  ban?: Event_Ban;
  join?: Event_Join;
  member?: Event_Member;
  Enick?: Event_Nick;
  Eother?: Event_Other;
}

/**
 * 全局-全局管理
 */
export interface GroupSet {
  bot_id?: string;
  host?: string;
  email?: string;
  adjutantList?: any;
  update_switch?: boolean;
}
/**
 * 全局-发信设置
 */
export interface Send {
  private?: boolean;
  private_pic?: boolean;
  dialogue?: boolean;
}
/**
 * 全局-其他设置
 */
export interface Other {
  friend_req?: number;
  friend_ref_msg?: string;
  friend_msg?: string;

  invite_req?: number;
  invite_ref_msg?: string;
  invite_msg?: string;
}
/**
 * 全局-动态推送设置
 */
export interface Dynamic {
  be_ban?: boolean;
  be_kicked?: boolean;
  be_promoted?: boolean;
  be_reduce?: boolean;
  accept_msg?: boolean;
  other?: boolean;
}

/**
 * 分群-动态推送设置
 */
export interface Cluster {
  managementList?: any;
  group_status?: boolean;
  send_model?: number;
  anonymous?: boolean;
}
/**
 * 分群-事件管理-入群验证
 */
export interface Event_Join {
  join_audit?: number;
  join_ref_msg?: string;
  join_verify_status?: boolean;
  join_verify_time?: number;
  join_verify_num?: number;
  join_check_msg?: string;
  join_kick_msg?: string;
}
/**
 * 分群-事件管理-入群审核
 */
export interface Event_Ban {
  ban_black_status?: number;
  ban_black_msg?: string;
  ban_age_status?: number;
  ban_age_num?: number;
  ban_age_msg?: string;
  ban_level_status?: number;
  ban_level_num?: number;
  ban_level_msg?: string;
  ban_nick_status?: number;
  ban_nick_list?: any;
  ban_nick_msg?: string;
}
/**
 * 分群-事件管理-成员事件
 */
export interface Event_Member {
  member_kick_status?: boolean;
  member_kick_msg?: string;
  member_quit_status?: boolean;
  member_quit_msg?: string;
  member_join_status?: boolean;
  member_join_msg?: string;
  member_promotion_status?: boolean;
  member_promotion_msg?: string;
}
/**
 * 分群-事件管理-名片管理
 */
export interface Event_Nick {
  nick_reminder_status?: boolean;
  nick_reminder_msg?: string;
  nick_auto_status?: boolean;
  nick_auto_model?: string;
  nick_prohibited_status?: boolean;
  nick_prohibited_msg?: any;
} /**
 * 分群-事件管理-其他事件
 */
export interface Event_Other {
  other_recall_status?: boolean;
  other_recall_msg?: string;
  other_file_status?: boolean;
  other_file_msg?: string;
  other_poke_status?: boolean;
  other_poke_msg?: string;
}
interface FormProps {
  formInline?: FormItemProps;
}

export type { FormItemProps, FormProps };
