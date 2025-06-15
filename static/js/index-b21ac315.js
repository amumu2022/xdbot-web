import{R as d}from"./index-17695056.js";import{$ as F,d as q,k as w,am as h,r as i,o as B,i as A,j as o,e as l,f as s,g as N,h as c,S as f}from"./index-9cea40a6.js";import{u as _}from"./hooks-678b71c4.js";import{d as $}from"./orange-3bd0a242.js";import{R as M}from"./refresh-74425c09.js";import{A as S}from"./add-circle-line-438b436c.js";import{b as y,U as j}from"./dock-9ddcdacf.js";const P=F({detail:[{required:!0,message:"详细内容为必填项",trigger:"blur"}],low:[{required:!0,message:"底部内容为必填项",trigger:"blur"}],notice:[{required:!0,message:"不足提示为必填项",trigger:"blur"}],top:[{required:!0,message:"顶部内容为必填项",trigger:"blur"}],success:[{required:!0,message:"成功提示为必填项",trigger:"blur"}]}),T={width:1024,height:1024,body:'<path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72L512 747.84zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"/>'},E=T,G={style:{"text-align":"center"}},m=`【商品ID】
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
`,H=`欢迎使用木木发卡系统
━━━━━━━━━━━━`,J=`商品分类：【商品分类】
商品名称：【商品名称】
商品ID：【商品ID】
商品价格：【商品价格】
商品库存：【商品库存】
商品简介：【商品简介】
是否兑换：【是否兑换】
兑换价格：【兑换价格】`,K=`━━━━━━━━━━━━
Ps：购买商品 商品ID 数量`,O=`商品库存不足!
请联系小主：【主人账号】 添加商品!`,Q=`商品购买成功!
商品名称: 【商品名称】
商品售价: 【商品价格】元
商品折扣：【购买折扣】
实际支付: 【实际支付】元
卡密信息已发送到您的邮箱`,te=q({name:"FakaReply",__name:"index",props:{formInline:{default:()=>({detail:"",notice:"",low:"",success:"",top:"",variable:m})}},setup(V,{expose:R}){const b=V,g=w(),a=w(b.formInline),C=()=>{a.value={detail:"",notice:"",low:"",success:"",top:"",variable:m}},z=()=>{a.value={detail:J,notice:O,low:K,success:Q,top:H,variable:m}};async function I(){const r={name:"reply"},{data:t}=await y(r);if(t.length===0)f("您还没有设置相关参数呢",{type:"error"});else{const e=t[0].data;a.value={detail:e==null?void 0:e.detail,notice:e==null?void 0:e.notice,low:e==null?void 0:e.low,success:e==null?void 0:e.success,top:e==null?void 0:e.top,variable:m},f("重载完成",{type:"success"})}}async function v(){const r={name:"reply"},{data:t}=await y(r),e=t[0].data;a.value={detail:e==null?void 0:e.detail,notice:e==null?void 0:e.notice,low:e==null?void 0:e.low,success:e==null?void 0:e.success,top:e==null?void 0:e.top,variable:m}}h(()=>{v()});async function U(){const r={name:"reply",data:a.value},t=await j("reply",r);t.success?(f(t.message,{type:"success"}),v()):f(`操作失败，${t.message}`,{type:"warning"})}function D(){return g.value}return R({getRef:D}),(r,t)=>{const e=i("el-input"),u=i("el-form-item"),x=i("el-row"),p=i("el-button"),L=i("el-form");return B(),A(L,{ref_key:"ruleFormRef",ref:g,model:a.value,rules:s(P),"label-position":"top","label-width":"82px"},{default:o(()=>[l(x,{gutter:30},{default:o(()=>[l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"顶部内容",prop:"top"},{default:o(()=>[l(e,{modelValue:a.value.top,"onUpdate:modelValue":t[0]||(t[0]=n=>a.value.top=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入顶部内容"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"详细内容",prop:"detail"},{default:o(()=>[l(e,{modelValue:a.value.detail,"onUpdate:modelValue":t[1]||(t[1]=n=>a.value.detail=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入详细内容"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"底部内容",prop:"low"},{default:o(()=>[l(e,{modelValue:a.value.low,"onUpdate:modelValue":t[2]||(t[2]=n=>a.value.low=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入底部内容"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),l(x,{gutter:30},{default:o(()=>[l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"变量列表",prop:"variable"},{default:o(()=>[l(e,{modelValue:a.value.variable,"onUpdate:modelValue":t[3]||(t[3]=n=>a.value.variable=n),rows:"10",resize:"none",clearable:"",readonly:"",type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"不足提醒",prop:"notice"},{default:o(()=>[l(e,{modelValue:a.value.notice,"onUpdate:modelValue":t[4]||(t[4]=n=>a.value.notice=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入不足提醒"},null,8,["modelValue"])]),_:1})]),_:1}),l(s(d),{class:"mt-1",sm:24,xs:24,md:12,lg:8,xl:8},{default:o(()=>[l(u,{label:"成功提醒",prop:"success"},{default:o(()=>[l(e,{modelValue:a.value.success,"onUpdate:modelValue":t[5]||(t[5]=n=>a.value.success=n),rows:"10",resize:"none",clearable:"",type:"textarea",placeholder:"请输入成功提醒"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),N("div",G,[l(p,{type:"success",icon:s(_)(s(S)),onClick:U},{default:o(()=>[c(" 保存 ")]),_:1},8,["icon"]),l(p,{type:"warning",icon:s(_)(s(E)),onClick:z},{default:o(()=>[c(" 恢复默认")]),_:1},8,["icon"]),l(p,{type:"info",icon:s(_)(s(M)),onClick:C},{default:o(()=>[c(" 重置")]),_:1},8,["icon"]),l(p,{type:"danger",icon:s(_)(s($)),onClick:I},{default:o(()=>[c(" 重新载入")]),_:1},8,["icon"])])]),_:1},8,["model","rules"])}}});export{te as default};
