import{R as d}from"./index-80faaafb.js";import{Y as q,d as B,k as y,ak as N,r as i,o as A,i as O,j as o,e as l,f as s,g as j,h as c,ay as f}from"./index-6f723797.js";import{u as _}from"./hooks-ea9aeb9a.js";import{d as M}from"./orange-3bd0a242.js";import{O as P}from"./star-f6146d52.js";import{R as T}from"./refresh-74425c09.js";import{A as Y}from"./add-circle-line-438b436c.js";import{b as w,U as $}from"./dock-ec7e72b8.js";const h=q({detail:[{required:!0,message:"详细内容为必填项",trigger:"blur"}],low:[{required:!0,message:"底部内容为必填项",trigger:"blur"}],notice:[{required:!0,message:"不足提示为必填项",trigger:"blur"}],top:[{required:!0,message:"顶部内容为必填项",trigger:"blur"}],success:[{required:!0,message:"成功提示为必填项",trigger:"blur"}]}),E={style:{"text-align":"center"}},m=`【商品ID】
【是否上架】【兑换价格】
【商品分类】【商品名称】
【商品价格】【商品库存】
【商品简介】【是否兑换】

【用户余额】【购买折扣】
【下单账号】【用户等级】

【下单时间】【卡密信息】
【理论金额】【实际支付】
【购买数量】【主人账号】

【货币余额】【支付方式】
`,G=`欢迎使用木木发卡系统
━━━━━━━━━━━━`,H=`商品分类：【商品分类】
商品名称：【商品名称】
商品ID：【商品ID】
商品价格：【商品价格】
商品库存：【商品库存】
商品简介：【商品简介】
是否兑换：【是否兑换】
兑换价格：【兑换价格】`,J=`━━━━━━━━━━━━
Ps：购买商品 商品ID 数量`,K=`商品库存不足!
请联系小主：【主人账号】 添加商品!`,L=`商品购买成功!
商品名称: 【商品名称】
商品售价: 【商品价格】元
商品折扣：【购买折扣】
实际支付: 【实际支付】元
卡密信息已发送到您的邮箱`,te=B({name:"FakaReply",__name:"index",props:{formInline:{default:()=>({detail:"",notice:"",low:"",success:"",top:"",variable:m})}},setup(V,{expose:R}){const b=V,g=y(),a=y(b.formInline),C=()=>{a.value={detail:"",notice:"",low:"",success:"",top:"",variable:m}},I=()=>{a.value={detail:H,notice:K,low:J,success:L,top:G,variable:m}};async function U(){const r={name:"reply"},{data:t}=await w(r);if(t.length===0)f("您还没有设置相关参数呢",{type:"error"});else{const e=t[0].data;a.value={detail:e==null?void 0:e.detail,notice:e==null?void 0:e.notice,low:e==null?void 0:e.low,success:e==null?void 0:e.success,top:e==null?void 0:e.top,variable:m},f("重载完成",{type:"success"})}}async function v(){const r={name:"reply"},{data:t}=await w(r),e=t[0].data;a.value={detail:e==null?void 0:e.detail,notice:e==null?void 0:e.notice,low:e==null?void 0:e.low,success:e==null?void 0:e.success,top:e==null?void 0:e.top,variable:m}}N(()=>{v()});async function D(){const r={name:"reply",data:a.value},t=await $("reply",r);t.success?(f(t.message,{type:"success"}),v()):f(`操作失败，${t.message}`,{type:"warning"})}function z(){return g.value}return R({getRef:z}),(r,t)=>{const e=i("el-input"),u=i("el-form-item"),x=i("el-row"),p=i("el-button"),F=i("el-form");return A(),O(F,{ref_key:"ruleFormRef",ref:g,model:a.value,rules:s(h),"label-position":"top","label-width":"82px"},{default:o(()=>[l(x,{gutter:30},{default:o(()=>[l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"顶部内容",prop:"top"},{default:o(()=>[l(e,{modelValue:a.value.top,"onUpdate:modelValue":t[0]||(t[0]=n=>a.value.top=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入顶部内容"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"详细内容",prop:"detail"},{default:o(()=>[l(e,{modelValue:a.value.detail,"onUpdate:modelValue":t[1]||(t[1]=n=>a.value.detail=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入详细内容"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"底部内容",prop:"low"},{default:o(()=>[l(e,{modelValue:a.value.low,"onUpdate:modelValue":t[2]||(t[2]=n=>a.value.low=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入底部内容"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),l(x,{gutter:30},{default:o(()=>[l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"变量列表",prop:"variable"},{default:o(()=>[l(e,{modelValue:a.value.variable,"onUpdate:modelValue":t[3]||(t[3]=n=>a.value.variable=n),rows:"10",resize:"none",clearable:"",readonly:"",type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"不足提醒",prop:"notice"},{default:o(()=>[l(e,{modelValue:a.value.notice,"onUpdate:modelValue":t[4]||(t[4]=n=>a.value.notice=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入不足提醒"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"成功提醒",prop:"success"},{default:o(()=>[l(e,{modelValue:a.value.success,"onUpdate:modelValue":t[5]||(t[5]=n=>a.value.success=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入成功提醒"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),j("div",E,[l(p,{type:"success",icon:s(_)(s(Y)),onClick:D},{default:o(()=>[c(" 保存 ")]),_:1},8,["icon"]),l(p,{type:"warning",icon:s(_)(s(P)),onClick:I},{default:o(()=>[c(" 恢复默认")]),_:1},8,["icon"]),l(p,{type:"info",icon:s(_)(s(T)),onClick:C},{default:o(()=>[c(" 重置")]),_:1},8,["icon"]),l(p,{type:"danger",icon:s(_)(s(M)),onClick:U},{default:o(()=>[c(" 重新载入")]),_:1},8,["icon"])])]),_:1},8,["model","rules"])}}});export{te as default};
