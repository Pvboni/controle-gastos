(function(g){
const clone=x=>JSON.parse(JSON.stringify(x)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),key='controle-gastos.queue.v1',cacheKey='controle-gastos.cache.v1';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function patch(before,after){return {before:clone(before),after:clone(after)}}
function apply(remote,p){if(eq(remote,p.after))return clone(remote);if(!eq(remote,p.before))throw Error('CONFLICT');return clone(p.after)}
function log(code){console.info('[controle-gastos]',code)}
async function retry(fn){for(let i=0;;i++){try{return await fn()}catch(e){if(i>=2||!e.transient)throw e;await new Promise(r=>setTimeout(r,500*2**i))}}}
function error(status){let e=Error('HTTP '+status);e.transient=status===429||status>=500;return e}
g.GastoSync={clone,eq,patch,apply,log,retry,error,queue:()=>read(key,[]),saveQueue:q=>write(key,q),cache:()=>read(cacheKey,null),saveCache:d=>write(cacheKey,d)};
})(globalThis);