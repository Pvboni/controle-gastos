import {test} from 'node:test';
import assert from 'node:assert/strict';
import '../js/settings.js';
const P=globalThis.PremiumSettings;
const cases=[
['defaults',()=>P.get().motion===true],
['invalid privacy',()=>P.normalize({privacy:'true'}).privacy===false],
['valid privacy',()=>P.normalize({privacy:true}).privacy===true],
['invalid motion',()=>P.normalize({motion:null}).motion===true],
['disable notifications',()=>P.normalize({toasts:false}).toasts===false],
['large text',()=>P.normalize({large:true}).large===true],
['positive amount',()=>P.mask('Saldo R$ 2.651,00')==='Saldo R$ •••••'],
['negative amount',()=>P.mask('−R$ 80,00')==='R$ •••••'],
['multiple amounts',()=>P.mask('R$ 1,00 e R$ 2,00')==='R$ ••••• e R$ •••••'],
['ordinary text',()=>P.mask('Mercado')==='Mercado']];
for(const [name,fn] of cases)test(name,()=>assert.ok(fn()));
