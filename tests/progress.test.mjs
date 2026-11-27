import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({});
vm.runInContext(readFileSync(new URL('../js/components.js',import.meta.url),'utf8'),context);
test('a barra mostra consumo e valor acessível',()=>{const s=context.bar(25,100);assert.match(s,/width:25%/);assert.match(s,/25% do orçamento consumido/)});
test('a barra limita largura mas informa excesso',()=>{const s=context.bar(150,100);assert.match(s,/width:100%/);assert.match(s,/150% do orçamento consumido/)});
test('despesa sem orçamento mantém a barra cheia',()=>{const s=context.bar(20,0);assert.match(s,/width:100%/);assert.match(s,/Sem orçamento definido/)});

