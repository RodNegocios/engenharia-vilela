# Validação da entrega

Validação local em Chromium, Node 24.19.0 e npm 11.9.0. Os resultados abaixo descrevem a versão de produção executada no ambiente de desenvolvimento; não representam teste do domínio na Hostinger.

## Checks concluídos

- Instalação limpa com `npm ci`, usando o lockfile versionado.
- `npm run check` e build Vite concluídos. HTML/CSS/JS, fontes, licenças e imagens são publicados na raiz pelo script de build.
- Auditoria npm: **zero vulnerabilidades conhecidas** na consulta realizada; isso é uma observação da base consultada, não uma garantia permanente.
- **12 testes Playwright**: carregamento sem erros ou recursos externos; máscara do hero e passagem direta para o segundo bloco, sem pin ou zoom; acordeão; galeria; lightbox; foco; formulário e codificação do WhatsApp; movimento reduzido, inclusive troca em tempo real; telas de 360, 390 e 768 px; análise axe em desktop/mobile/formulário; bloqueio local de arquivos internos; conteúdo e contatos sem JavaScript.
- No formulário, a abertura externa é interceptada no teste e a URL é inspecionada. Nenhuma mensagem real é enviada.
- Revisão do hero em 1440 × 900, 360 × 740, 390 × 844 e 430 × 932. Na entrega inicial também foram revisados os enquadramentos dos retratos e a página completa.
- Todos os 11 originais foram comparados byte a byte com os blobs da main recebida. O inventário registra hashes e tamanhos.

## Lighthouse móvel

Auditoria da entrega inicial (commit `05f8ee0`), anterior à revisão do nome VILELA e à remoção da transição do hero. Não foi refeita nesta alteração visual. Perfil móvel simulado, Chromium headless e servidor local com gzip equivalente ao configurado no `.htaccess`:

| Categoria / métrica | Resultado |
| --- | --- |
| Desempenho | **92/100** |
| Acessibilidade | **100/100** |
| Boas práticas | **100/100** |
| SEO | **100/100** |
| First Contentful Paint | 0,8 s |
| Largest Contentful Paint | 3,3 s |
| Total Blocking Time | 60 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1,0 s |

São métricas de laboratório, sujeitas a variação. O LCP móvel simulado ainda pode melhorar em conexões lentas; não se afirma desempenho de campo nem aprovação universal de Core Web Vitals. A mansão usa uma versão móvel de aproximadamente 139 KB e uma desktop de 242 KB, contra o original PNG de 2,44 MB. O JavaScript de produção tem aproximadamente 53 KB com gzip. A análise automática de acessibilidade complementa testes de teclado, foco e leitura estrutural; não certifica todas as combinações de leitores de tela e navegadores.

## Limites externos e próximos passos

- Domínio público e acesso à conta Hostinger não foram fornecidos. HTTPS, webhook de deploy, regras Apache/LiteSpeed e disponibilidade do site remoto precisam ser confirmados no domínio real.
- O servidor de validação local bloqueia arquivos internos e aplica CSP/headers, mas não interpreta `.htaccess`. As regras para Hostinger foram preparadas e revisadas, sem afirmar teste remoto do Apache/LiteSpeed.
- A auditoria npm e os testes locais não substituem o resultado da execução futura do workflow GitHub. A automação foi adicionada para validar pushes na main.
- Canonical, URL absoluta da imagem social e sitemap serão gerados quando o domínio real for informado em `.site/site.config.js` e um novo build for realizado.
- As referências visuais externas que a rede bloqueou e a seleção dos materiais estão documentadas em `MATERIAIS.md`.
