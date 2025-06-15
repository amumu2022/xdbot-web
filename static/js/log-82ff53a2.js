import{aN as s,d as b,k as d,t as x,S as _,aF as q,r as $,o as D,c as Y,e as S,aH as m,_ as A}from"./index-9cea40a6.js";const w=t=>s.request("post","/api/task/list",{data:t}),R=t=>s.request("post","/api/task/add",{data:t}),V=t=>{const e=`/api/task/del/${t}`;return s.request("delete",e)},j=t=>s.request("delete","/api/task/batch_remove",{data:t}),N=t=>{const e=`/api/task/${t}/status`;return s.request("put",e)},M=t=>{const e=`/api/task/get_log/${t}`;return s.request("get",e)},B=(t,e)=>s.request("put",`/api/task/${t}/info`,{data:e}),C=t=>s.request("put","/api/task/run",{data:t}),E=t=>s.request("put","/api/task/stop",{data:t}),H={style:{width:"100%"}},I=b({__name:"log",props:{id:Number},setup(t,{expose:e}){const f=t,k=d();let u;const o=d("日志为空");function g(){return k.value}async function c(){const a=await M(f.id);if(a.code!==200)return-1;{const{last_execution_time:n,content:l,last_run_time:r}=a.data,v=m(n*1e3).format("YYYY-MM-DD HH:mm:ss"),y=m((n+r)*1e3).format("YYYY-MM-DD HH:mm:ss"),p=`## 开始执行... ${v}`,i=`${l}`;if(a.data.status==0){const T=`## 执行结束... ${y}    耗时：${r}秒`;return o.value=p+`


`+i+`

`+T,0}else return o.value=p+`


`+i,1}}return e({getRef:g}),x(()=>{c(),u=setInterval(async()=>{const a=await c();a===-1?_("获取失败",{type:"error"}):a===0&&(_("任务执行完成",{type:"success"}),clearInterval(u))},2e3)}),q(()=>{clearInterval(u)}),(a,n)=>{const l=$("el-input");return D(),Y("div",H,[S(l,{type:"textarea",rows:"15",modelValue:o.value,"onUpdate:modelValue":n[0]||(n[0]=r=>o.value=r),readonly:"",class:"log-input"},null,8,["modelValue"])])}}});const U=A(I,[["__scopeId","data-v-ebb06e83"]]),F=Object.freeze(Object.defineProperty({__proto__:null,default:U},Symbol.toStringTag,{value:"Module"}));export{C as R,E as S,N as U,B as a,F as b,R as c,V as d,w as g,U as l,j as m};
