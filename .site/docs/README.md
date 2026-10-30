# Vilela Engenharia — manutenção e publicação

Site editorial em português, com GSAP/ScrollTrigger, navegação suave no desktop, retratos originais e contato confirmado no WhatsApp **(65) 99943-8988**. Código-fonte em `.site/`; produção estática na raiz do repositório. Todo o trabalho acontece na **main**, sem worktrees ou outras branches.

## Arquivos

- `index.html`, `assets/`, `robots.txt`, `.htaccess`: produção pronta para a Hostinger, sem Node ou build no servidor.
- `.site/index.html`: conteúdo, estrutura semântica e metadados.
- `.site/site.config.js`: telefone, Instagram e domínio público opcional.
- `.site/src/style.css`: identidade, tipografia, composições e responsividade.
- `.site/src/main.js`: animações, menu, acordeão, galeria, diálogos e mensagem para WhatsApp.
- `.site/materials/`: os 11 originais, preservados byte a byte. Consulte `MATERIAIS.md` e `materials-manifest.json`.
- `.site/public/`: imagens WebP otimizadas e arquivos públicos copiados pelo build.
- `.site/scripts/`: publicação local, conversão de imagens, licenças e servidor de validação.
- `.site/tests/`: testes funcionais, responsivos e de acessibilidade.
- `.github/workflows/validate.yml`: validação em pushes na main; não configura nem executa o deploy da Hostinger.

## Desenvolvimento

Requer Node 22.12+; validado com Node 24.19.0 e npm 11.9.0.

```sh
cd /workspace/engenharia-vilela/.site
npm ci
npm run dev
```

O repositório da tarefa já é isolado. Use este checkout existente na main, sem criar worktrees. A instalação não precisa de credenciais da aplicação. O acesso GitHub usa a autenticação HTTPS fornecida pela plataforma; não crie tokens em arquivos.

Para gerar a produção e verificar:

```sh
cd /workspace/engenharia-vilela/.site
npm run check
npm run build
npm test
```

Os testes usam Chromium disponível em `/usr/bin/chromium`, ou `CHROMIUM_PATH` se definido. Em outra máquina, use `npx playwright install --with-deps chromium`; o runner usa o Chromium do Playwright se não encontrar o binário do sistema. A suíte inicia o servidor de produção automaticamente quando necessário.

Para examinar a versão compilada, execute `node .site/scripts/serve.mjs` na raiz. Porta padrão 4173, configurável por `PORT`. Esse servidor expõe somente arquivos públicos e aplica os headers de segurança equivalentes; não interpreta `.htaccess`.

## Atualizações e Hostinger

1. Edite os arquivos de `.site/`. O telefone e o Instagram são centralizados em `site.config.js`; não coloque credenciais nesse arquivo.
2. Execute build, testes e revisão visual. O build substitui somente a saída pública prevista, preservando os originais.
3. Faça commit de **fonte e produção juntos na main**. Envie apenas a versão completa validada.
4. Na integração Git da Hostinger, selecione `RodNegocios/engenharia-vilela`, branch `main`, com a raiz no diretório publicado (`public_html` conforme a configuração da conta). Não há comando de build na Hostinger.
5. O domínio e o acionamento do deploy automático/webhook dependem da configuração da conta Hostinger. Nenhuma integração ou implantação remota foi presumida a partir de um push GitHub.

O conteúdo público é apenas `index.html`, `assets/`, `robots.txt`, `.htaccess` e, quando houver domínio configurado, `sitemap.xml`. Para um deploy seletivo, envie apenas esses arquivos. Se a integração Git copiar o checkout inteiro, o `.htaccess` bloqueia `.site`, `.git`, `.github`, dotfiles e extensões internas; `.site/.htaccess` também nega acesso. Mantenha essas regras na Hostinger/Apache/LiteSpeed. Não sirva o checkout inteiro por um servidor que ignore essas regras; em outro servidor, publique somente o conjunto público.

Após o deploy, verifique o carregamento da página, links WhatsApp, galeria, formulário, ausência de erros no console e HTTP 403/404 para `/.site/package.json`, `/.site/materials/projeto1.png` e `/.git/config`. Esta validação remota depende do domínio real e do acesso à hospedagem.

## Domínio, SEO e conteúdo

O domínio não foi informado. Portanto, nenhum domínio, canonical ou URL de sitemap foi inventado. Defina `siteUrl` em `site.config.js` com a origem HTTPS real e faça o build; isso gera canonical, Open Graph com imagem absoluta e sitemap. Também é possível passar `SITE_URL` ao build. Use a configuração no arquivo para que o CI possa reproduzi-la.

Título, descrição, idioma, favicon, metadados sociais textuais, robots e dados estruturados `ProfessionalService` já estão incluídos. O esquema usa o endereço e os horários fornecidos, sem avaliações, números de registro, métricas comerciais ou credenciais não confirmadas.

As fotos de arquitetura são apresentadas como **referências e possibilidades**, sem afirmar execução pela empresa, área construída, local, prazos ou clientes. A mansão está identificada como imagem conceitual. O texto sobre financiamento não promete aprovação, taxa, subsídio ou parceria bancária.

## Imagens e animações

Para recriar as derivações WebP, use Python com Pillow e execute `python3 .site/scripts/images.py` na raiz. Os arquivos derivados estão versionados, portanto Python não é necessário no build habitual.

O hero usa duas instâncias alinhadas da mesma imagem e uma máscara SVG da cobertura. O texto é intercalado entre as camadas. O nome usa Cormorant Garamond em estilo romano, com entrada breve por trás do telhado e escala ampliada no celular. O hero acompanha a rolagem normal, sem pin, zoom ou tela intermediária antes da seção seguinte. A fotografia de fundo e a máscara devem manter exatamente a mesma escala; não mova uma delas isoladamente, pois a casa duplicaria.

Em telas pequenas, o título ocupa quase toda a largura disponível e a rolagem é nativa. `prefers-reduced-motion` elimina a animação de entrada, parallax, reveals e smooth scrolling. O HTML continua legível sem JavaScript, com contatos e links reais de imagem.

## Segurança e privacidade

Não há backend, cookies de marketing, analytics, scripts de CDN, iframe externo, chaves ou armazenamento de formulário. A mensagem é validada e codificada com `encodeURIComponent`, depois aberta no WhatsApp; o visitante confirma o envio lá. Há link alternativo se o navegador bloquear a nova aba. Nenhuma mensagem foi enviada durante os testes.

Links externos usam `noopener noreferrer`. A política CSP permite scripts/fontes/recursos locais; estilos inline são necessários para GSAP. `.htaccess` inclui proteção de frames, MIME sniffing, política de referência, bloqueio de diretórios e cache. HTTPS depende do certificado configurado na hospedagem; não foi inventado um certificado nem ativado HSTS sem conhecer o domínio.

Consulte `VALIDACAO.md` para resultados e limites. As licenças distribuídas estão em `assets/third-party-licenses.txt`.
