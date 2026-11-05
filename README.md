# Raiz · protótipo das telas (FIAP · PBL Fase 3)

Versão web das telas do Raiz, caderno de campo digital para a agricultura familiar (ODS 2, meta 2.3). Feito com HTML, Tailwind CSS e JavaScript, do jeito que as apostilas da Fase 3 ensinam.

- **Pitch Vídeo:** https://youtu.be/I5J52yaLe0c
- **Protótipo online:** https://richardalmeida-dev.github.io/Raiz-Fase3/

## Integrantes · Grupo Bug Hunters

| Nome completo | RM |
|---|---|
| Alexandre Oliveira Machado | RM575671 |
| Francisco Wellington da Silva Rodrigues | RM566700 |
| Luiza Eduarda Luza Neckel | RM576827 |
| Paulo Henrique Oliveira Freitas | RM574796 |
| Richard Henrique Godoy de Almeida | RM574660 |

## Como abrir

Abra o arquivo `dist/index.html` no navegador (ou o `index.html` da raiz, que leva até ele). O CSS já está gerado em `dist/css/styles.css`, então não precisa instalar nada só para ver.

O vídeo do Início é um iframe do YouTube. Aberto direto do computador (endereço `file://`), o YouTube pode recusar o player. Nesse caso, use o link logo abaixo do vídeo ou a versão online.

Para editar as classes do Tailwind, gere o CSS de novo (igual à aula de Tailwind):

```
npm install
npm run build
```

O `npm run build` fica rodando com `--watch` e atualiza o CSS sempre que uma classe muda no HTML ou no JS.

## As 5 seções

1. **Início (home):** saudação, atalhos, resumo (aplicações, lotes e talhões em carência), talhões, últimos registros e o Pitch Vídeo com o link.
2. **Registrar aplicação:** registro por voz (simulado) ou pelo formulário. Ao salvar, mostra a data em que o talhão vai poder ser colhido.
3. **Talhões e lotes:** prazo de carência e histórico de cada talhão. Na colheita, gera o lote com etiqueta e QR Code, e mostra o relatório com todos os registros. Talhão em carência fica bloqueado na colheita.
4. **Procedência:** o que o comprador vê ao escanear o QR do lote.
5. **Fale Conosco:** formulário validado pelo HTML5 e a equipe do projeto.

O app funciona de verdade dentro da página: o que você registra aparece no Início, nos Talhões, no relatório e na Procedência. Os dados ficam em arrays na memória, então ao recarregar a página tudo volta ao exemplo inicial (nesta fase não há banco de dados).

## Recursos usados (das aulas)

- **HTML5 semântico:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `fieldset`/`legend`, `table`, `iframe`.
- **Validação do HTML5 no Fale Conosco e nos formulários:** `required`, `type="email"`, `type="tel"`, `type="number"` com `min`/`max`, `type="date"` com `max`, `pattern`, `minlength` e `maxlength`.
- **Tailwind CSS (aula 02):**
  - instalação pela CLI;
  - `src/input.css` com `@import "tailwindcss"`;
  - cores da marca no `@theme` (namespace `--color-`) e fonte Inter importada do Google Fonts (`--font-inter`);
  - box model, flexbox, grid e breakpoints `sm`/`md`/`lg` (mobile first);
  - `hover:` com `duration-`, valor arbitrário com `bg-[url(...)]`;
  - modo escuro com `@custom-variant dark` e `classList.toggle('dark')`.
- **JavaScript (aulas 03 e 06):**
  - `const`/`let`, objetos e arrays (`push`, `filter`, `sort`, `slice`), funções e arrow functions;
  - `if`/`else` e `for`, template strings;
  - objeto `Date` (cálculo da carência) e métodos de String (`split`, `trim`, `replace`);
  - `alert`;
  - DOM com `getElementById`, `querySelector`, `querySelectorAll`, `createElement`, `append`, `innerText`, `innerHTML`, `value`, `classList` e `addEventListener`.

## Onde editar

- **Pitch Vídeo:** em `dist/index.html`, procure `PITCH VÍDEO`. O ID do vídeo aparece no `src` do iframe e no `href` do link.
- **Equipe:** em `dist/index.html`, procure `Equipe do projeto`.
- **Cores:** em `src/input.css`, bloco `@theme`. Depois rode `npm run build`.

## Estrutura

```
Raiz-Fase3-BugHunters.pdf  (link do Pitch Vídeo e nomes completos do grupo)
README.md
index.html               (atalho para dist/index.html)
package.json
package-lock.json
src/input.css            (entrada do Tailwind, não vai para o navegador)
dist/
  index.html
  css/styles.css         (CSS gerado pelo Tailwind)
  js/app.js
  images/
```

Nomes, lugares e números das telas são dados de demonstração.
