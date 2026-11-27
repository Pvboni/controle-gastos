(function () {
  'use strict';
  const key = 'controle-gastos.theme.v1';
  const valid = ['auto', 'light', 'dark'];
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let mode = 'auto';
  try { const saved = localStorage.getItem(key); if (valid.includes(saved)) mode = saved; } catch (_) {}
  function apply() {
    const dark = mode === 'dark' || (mode === 'auto' && media.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const selector = document.getElementById('themeMode');
    if (selector) selector.value = mode;
  }
  apply();
  media.addEventListener('change', apply);
  document.addEventListener('DOMContentLoaded', function () {
    const status = document.getElementById('status');
    const summary = document.getElementById('summary');
    if (status && summary) {
      new MutationObserver(function () {
        const loading = summary.querySelector('.loading-placeholder');
        if (loading && /não foi possível|falha/i.test(status.textContent)) {
          loading.textContent = 'Não foi possível carregar o resumo. Confira a conexão e tente atualizar.';
        }
      }).observe(status, {childList:true, characterData:true, subtree:true});
    }
    const selector = document.getElementById('themeMode');
    if (!selector) return;
    selector.value = mode;
    selector.addEventListener('change', function () {
      if (!valid.includes(selector.value)) return;
      mode = selector.value;
      try { localStorage.setItem(key, mode); } catch (_) {}
      apply();
    });
  });
}());

