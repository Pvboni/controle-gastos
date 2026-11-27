(function(g){
'use strict';
const defaults={privacy:false,motion:true,toasts:true,large:false};
function normalize(x){return Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,typeof x?.[k]==='boolean'?x[k]:v]))}
const mask=s=>String(s).replace(/(?:[-−]\s*)?R\$\s*[-−]?\s*[\d.,]+/gi,'R$ •••••');
let prefs=defaults;try{prefs=normalize(JSON.parse(g.localStorage.getItem('controle-gastos.preferences.v1')))}catch{}
const api={normalize,mask,get:()=>({...prefs}),set(k,v){if(!(k in defaults)||typeof v!=='boolean')return;prefs={...prefs,[k]:v};try{g.localStorage.setItem('controle-gastos.preferences.v1',JSON.stringify(prefs))}catch{}apply()}};
g.PremiumSettings=api;
if(!g.document)return;
const d=g.document,el=id=>d.getElementById(id),original=new WeakMap();
function redact(){const roots=['summary','health','cards','ledgers','aiChat','smartImpact','smartStatus','premiumToasts','premiumConfirmText','status'];for(const id of roots){const root=el(id);if(!root)continue;const walker=d.createTreeWalker(root,4);let n;while(n=walker.nextNode()){const old=original.get(n);if(prefs.privacy){const raw=old&&n.nodeValue===old.masked?old.raw:n.nodeValue;const masked=mask(raw);if(masked!==raw){original.set(n,{raw,masked});if(n.nodeValue!==masked)n.nodeValue=masked}}else if(old){if(n.nodeValue===old.masked)n.nodeValue=old.raw;original.delete(n)}}}}
function apply(){if(!g.document)return;for(const [k,v] of Object.entries(prefs)){d.documentElement.dataset[k]=String(v);const input=el('pref-'+k);if(input)input.checked=v}const b=el('privacyQuick');if(b){b.setAttribute('aria-pressed',String(prefs.privacy));b.textContent=prefs.privacy?'Mostrar valores':'Ocultar valores'}redact()}
function settings(){el('expensesPanel').hidden=true;el('assistantPanel').hidden=true;el('settingsPanel').hidden=false;for(const id of ['tabExpenses','tabAI','tabSettings'])el(id).setAttribute('aria-selected',String(id==='tabSettings'))}
d.addEventListener('DOMContentLoaded',()=>{for(const k of Object.keys(defaults))el('pref-'+k).onchange=e=>api.set(k,e.target.checked);el('privacyQuick').onclick=()=>api.set('privacy',!prefs.privacy);el('tabSettings').onclick=settings;for(const id of ['tabExpenses','tabAI'])el(id).addEventListener('click',()=>{el('settingsPanel').hidden=true;el('tabSettings').setAttribute('aria-selected','false')});el('settingsAI').onclick=()=>el('aiConfig').click();for(const id of ['sync','local','file','status','disconnect','recoveryControls']){const n=el(id);if(n)el('settingsData').append(n)}let pending=false;new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(()=>{pending=false;redact()})}}).observe(d.body,{subtree:true,childList:true,characterData:true});apply()});
})(globalThis);