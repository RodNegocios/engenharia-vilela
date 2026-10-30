# Curadoria dos materiais

Todos os **11 arquivos** presentes na main foram examinados visualmente, inclusive canais alpha e resolução. Os originais foram movidos para `.site/materials/` sem alteração do conteúdo e sem descarte; as somas SHA-256 constam de `materials-manifest.json`. Essa pasta é interna e bloqueada no acesso HTTP.

| Original | Decisão e aplicação |
| --- | --- |
| `imagem capa do primeiro bloco.png` | Hero: cenário principal, versão WebP e máscara SVG da arquitetura. Apresentado como imagem conceitual, sem atribuição de execução. |
| `foto do enegenheiro.png` | Retrato frontal com transparência real. Seção institucional, composição editorial clara com desenho técnico, enquadramento proporcional e sombra discreta. |
| `foto do enegenheiro1.png` | Retrato com planta e transparência real. Seção de serviços, composição escura com linhas arquitetônicas e iluminação responsiva ao ponteiro. |
| `fachada da vilela engenharia.png` | Seção de contato, vinculada à busca da empresa no Google Maps. Reforça a presença física com material fornecido. |
| `portfolio1.png` | Galeria, fachada comercial. Sem apresentar como obra executada ou contrato comprovado. |
| `portfolio2.png` | Galeria, estrutura comercial. Sem inventar cliente, área, localização, escopo ou autoria. |
| `projeto1.png` | Galeria, referência residencial verde e bege. Formato que respeita a resolução pequena e mostra a composição completa. |
| `projeto3.png` | Galeria, referência residencial com jardim. Enquadramento mais vertical, sem aumento artificial da resolução do arquivo. |
| `foto do engenheiro.png` | **Não usado na página.** É RGB: o quadriculado de transparência está incorporado aos pixels. Inserir diretamente causaria a aparência de recorte artificial. As outras duas fotos têm alpha verdadeiro e atendem melhor à solicitação. |
| `projeto2.jpg` | **Não usado na página.** Peça vertical com texto publicitário incorporado, moldura e espaço vazio. Sua apresentação destoa da galeria e o texto não pode ser separado com fidelidade. Preservado para eventual uso em campanha específica. |
| `inspiração para capa.jpg` | **Referência de direção visual apenas.** Orientou escala tipográfica, sobreposição do nome e composição cinematográfica. Não foi publicada como obra ou imagem própria da Vilela. |

A imagem de marca anexada à conversa orientou o símbolo geométrico e a assinatura tipográfica em SVG/texto. Não foi fornecido um arquivo vetorial oficial separado. A interpretação vetorial preserva a linguagem de três formas e a assinatura VILELA ENGENHARIA; um vetor oficial pode substituí-la sem mudar o layout.

## Referências, licenças e compatibilidade

- `motionsites.ai`, `awwwards.com/websites` e `reactbits.dev` foram consultados pelo proxy, que retornou bloqueio de política. Não se afirma ter navegado em demos inacessíveis. A imagem de inspiração do próprio repositório foi analisada integralmente.
- O código público de **SpotlightCard** e **ScrollFloat** foi consultado em `https://github.com/DavidHDev/react-bits`, em `src/content/Components/SpotlightCard/SpotlightCard.jsx` e `src/content/TextAnimations/ScrollFloat/ScrollFloat.jsx`.
- Foram implementados padrões leves de iluminação com coordenadas do ponteiro e reveals tipográficos em linhas com GSAP. Não foi incluído React, WebGL ou um pacote inteiro de efeitos para funções que o DOM e CSS resolvem.
- A licença oficial consultada é **MIT + Commons Clause**, copyright David Haz 2026. Autoriza incorporação em websites comerciais e restringe redistribuição/venda dos componentes isolados. A licença completa está em `REACT-BITS-LICENSE.md` e nos créditos públicos.
- GSAP/ScrollTrigger usa a licença Standard “no charge”, que permite websites comerciais; Lenis é MIT; Manrope e Cormorant Garamond usam SIL OFL 1.1. Fontes e bibliotecas são servidas localmente. Direitos de autoria das imagens não foram inferidos além do fornecimento pelo cliente para o projeto.
- Não havia vídeo no repositório. O storytelling foi produzido com as imagens fornecidas e camadas reais de composição, sem acrescentar mídia de procedência externa.

## Decisões de conteúdo

O WhatsApp **(65) 99265-3142** foi confirmado pelo cliente durante a execução e aplicado em todos os canais. O número alternativo das campanhas foi omitido. Não foram criados nome completo/CREA, anos de experiência, quantidade de obras, depoimentos, valores de financiamento ou vínculos bancários. O contato e o horário vêm do briefing, e os textos foram condensados conforme solicitado.
