(function(){
'use strict';
const el=id=>document.getElementById(id);
function toast(message){const root=el('premiumToasts');if(!root||!message)return;const item=document.createElement('div');item.className='premium-toast';item.textContent=message;root.replaceChildren(item);setTimeout(()=>item.remove(),4500)}
let active=false;
function confirmAction(message){if(active)return Promise.resolve(false);const d=el('premiumConfirm');if(!d||typeof d.showModal!=='function')return Promise.resolve(window.confirm(message));active=true;el('premiumConfirmText').textContent=message;d.returnValue='cancel';return new Promise(resolve=>{d.addEventListener('close',()=>{active=false;resolve(d.returnValue==='yes')},{once:true});d.showModal()})}
window.PremiumUI={toast,confirm:confirmAction};
document.addEventListener('DOMContentLoaded',()=>{
const status=el('status');let previous='';if(status)new MutationObserver(()=>{const s=status.textContent.trim();if(s&&s!==previous){previous=s;status.dataset.state=/falha|conflito|não foi possível/i.test(s)?'error':/pendente|offline|locais/i.test(s)?'pending':/sincronizado/i.test(s)?'success':'working';if(status.dataset.state!=='working')toast(s)}}).observe(status,{childList:true,characterData:true,subtree:true});
el('premiumAdd').onclick=()=>{el('tabExpenses').click();el('newEntry').click()};
});
})();