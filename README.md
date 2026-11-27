# Controle de Gastos — V1.9.3 (homologação)
Aplicação estática de orçamento mensal com lançamento manual/inteligente e assistente financeiro. Produção permanece na main até aprovação.
## Arquitetura
- index.html: estrutura; css/variables.css e layout.css: estilos.
- js/app.js: interface e operações; js/components.js: componentes.
- js/financial-engine.js: cálculos compartilhados; dashboard-engine.js: auxiliares.
- js/sync-manager.js: cache, fila, reconciliação e recuperação.
- js/assistant.js e cloudflare/worker.mjs: assistente e interpretação.
## Testes
Node 22 e Python 3. Execute npm install, npm test, npx playwright install chromium e npm run test:e2e. O Playwright usa dados fictícios e bloqueia gravações GitHub e chamadas Worker. Não usar credenciais reais.
## Recuperação
Exportar backup local antes de descartar pendências. Comparar versões e renovar autorização quando necessário. A fila usa localStorage e Web Locks; navegadores sem Web Locks não gravam. O cache não é criptografado. Não compartilhar arquivos de backup.
## Publicação
Exigir testes verdes, backup independente verificado, homologação offline/concorrência/Worker e revisão do diff. Não fazer merge automático. Não substituir gastos.json por snapshot antigo. Confirmar Pages após merge. Em regressão, reverter somente commits de código, preservando dados.
