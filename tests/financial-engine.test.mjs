import assert from 'node:assert/strict';
import '../js/financial-engine.js';
const f=globalThis.FinanceAI,d={inicio:'2026-12',orcamento:{Mercado:4500,iFood:500,'Farmácia':500,Transporte:800},meses:{},lancamentos:[{data:'2026-12-02',categoria:'iFood',valor:150,local:'Frangão'}]};
assert.equal(f.stats(d,'2026-12','iFood').balance,35000);
for(const [a,status] of [[10000,0],[15000,1],[20000,2],[40000,3]])assert.equal(f.decision(35000,12500,a),status);
assert.equal(f.period('2028-02','2028-02-29','month')[1],'2028-02-29');
assert.equal(f.forecast(d,'2026-12','iFood','2026-12-02'),null);
assert.equal(f.answer(d,'2026-12','2026-12-10',{intent:'simulate_purchase',items:[{category:'iFood',amount:200},{category:'iFood',amount:200}]}).status,3);
for(const intent of ['balance','period_budget','forecast','risk','merchant','compare','savings','recommend','spending'])assert.ok(f.answer(d,'2026-12','2026-12-10',{intent,merchant:'Frangão'}).lines.length);
