import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/theme.js', import.meta.url), 'utf8');
function setup(saved, prefersDark = false, storageFails = false) {
  let stored = saved, change, ready, selectChange;
  const media = {matches: prefersDark, addEventListener: (_, fn) => { change = fn; }};
  const select = {value: '', addEventListener: (_, fn) => { selectChange = fn; }};
  const document = {documentElement: {dataset:{}}, getElementById: id => id === 'themeMode' ? select : null, addEventListener: (_, fn) => { ready = fn; }};
  const localStorage = {getItem: () => {if(storageFails) throw Error(); return stored;}, setItem: (_, value) => {if(storageFails) throw Error(); stored = value;}};
  vm.runInNewContext(source, {document, localStorage, window:{matchMedia:()=>media}});
  ready();
  return {document, media, select, change:()=>change(), choose:value=>{select.value=value;selectChange();}, stored:()=>stored};
}
test('auto acompanha preferência clara',()=>assert.equal(setup(null).document.documentElement.dataset.theme,'light'));
test('auto acompanha preferência escura',()=>assert.equal(setup(null,true).document.documentElement.dataset.theme,'dark'));
test('modo manual claro prevalece',()=>assert.equal(setup('light',true).document.documentElement.dataset.theme,'light'));
test('modo manual escuro prevalece',()=>assert.equal(setup('dark').document.documentElement.dataset.theme,'dark'));
test('preferência inválida usa automático',()=>assert.equal(setup('invalid',true).select.value,'auto'));
test('mudança do sistema atualiza automático',()=>{const x=setup(null);x.media.matches=true;x.change();assert.equal(x.document.documentElement.dataset.theme,'dark')});
test('mudança do sistema respeita modo manual',()=>{const x=setup('light');x.media.matches=true;x.change();assert.equal(x.document.documentElement.dataset.theme,'light')});
test('seleção é aplicada e salva',()=>{const x=setup(null);x.choose('dark');assert.equal(x.document.documentElement.dataset.theme,'dark');assert.equal(x.stored(),'dark')});
test('armazenamento indisponível não impede seleção',()=>{const x=setup(null,false,true);x.choose('dark');assert.equal(x.document.documentElement.dataset.theme,'dark')});

