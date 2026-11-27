(function(g){
const clone=x=>JSON.parse(JSON.stringify(x)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),key='controle-gastos.queue.v1',cacheKey='controle-gastos.cache.v1';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function normalize(d){let out=clone(d),seen=new Map();for(let r of out.lancamentos){if(r.id)continue;let k=JSON.stringify([r.data,r.categoria,r.local,r.descricao??'',r.valor]),n=seen.get(k)||0;seen.set(k,n+1);r.id='legacy:'+encodeURIComponent(k)+':'+n}return out}
function patch(before,after){return {before:clone(before),after:clone(after)}}
function apply(remote,p){remote=normalize(remote);p={before:normalize(p.before),after:normalize(p.after)};if(eq(remote,p.after))return clone(remote);if(eq(remote,p.before))return clone(p.after);let out=clone(remote);const conflict=()=>{throw Error('CONFLICT')};const rows=x=>{let map=new Map();for(let r of x.lancamentos){if(!r.id||map.has(r.id))conflict();map.set(r.id,r)}return map};let b=rows(p.before),a=rows(p.after),r=rows(out);for(let id of new Set([...b.keys(),...a.keys()])){let old=b.get(id),next=a.get(id),cur=r.get(id);if(eq(old,next)||eq(cur,next))continue;if(!eq(cur,old))conflict();if(next)r.set(id,clone(next));else r.delete(id)}out.lancamentos=[...r.values()];for(let k of new Set([...Object.keys(p.before.meses),...Object.keys(p.after.meses)])){let old=p.before.meses[k],next=p.after.meses[k],cur=out.meses[k];if(eq(old,next)||eq(cur,next))continue;if(!eq(cur,old))conflict();if(next)out.meses[k]=clone(next);else delete out.meses[k]}return out}
function locked(fn){if(!navigator.locks)throw Error('LOCK_UNAVAILABLE');return navigator.locks.request('controle-gastos-write',fn)}
function clearCache(){localStorage.removeItem(cacheKey)}
function downloadBackup(d,q){let u=URL.createObjectURL(new Blob([JSON.stringify({base:d,pendencias:q},null,2)],{type:'application/json'}));let a=document.createElement('a');a.href=u;a.download='controle-gastos-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function log(code){console.info('[controle-gastos]',code)}
async function retry(fn){for(let i=0;;i++){try{return await fn()}catch(e){if(i>=2||!(e.transient||e instanceof TypeError))throw e;await new Promise(r=>setTimeout(r,500*2**i))}}}
function error(status){let e=Error('HTTP '+status);e.status=status;e.transient=status===409||status===422||status===429||status>=500;return e}
g.GastoSync={normalize,locked,clearCache,downloadBackup,clone,eq,patch,apply,log,retry,error,queue:()=>read(key,[]),saveQueue:q=>write(key,q),cache:()=>read(cacheKey,null),saveCache:d=>write(cacheKey,d)};
})(globalThis);