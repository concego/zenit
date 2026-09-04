# Zenit

Protótipo de roguelike 2D em HTML, CSS e JavaScript modular.

## Estrutura

```text
.
├── index.html
└── src
    ├── css
    │   └── style.css
    └── js
        ├── game.js    # estado global e inicialização
        ├── input.js   # teclado, menus e ações
        ├── map.js     # mapas, colisões e objetos
        ├── player.js  # jogador, classes e atributos
        └── render.js  # renderização SVG
```

## Executar localmente

O projeto usa módulos ES nativos. Abra-o por um servidor HTTP local, não diretamente por `file://`:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000/`.

## Controles

- Setas: mover
- Shift + setas: mudar a direção do olhar sem mover
- `T`: anunciar a direção atual
- `S`: fazer uma varredura em cone
- `W`: alternar arma corpo a corpo/distância
- `A`: atacar caixas ao alcance
- `Enter`: interagir com a porta
- `C`: abrir o menu
- `Escape`: voltar ou fechar o menu

## Decisões desta reorganização

- Corrigido o erro de nomenclatura `imput.js` para `input.js`.
- Arquivos separados em `src/js` e `src/css`.
- Carregamento convertido para módulos ES, sem dependências globais entre scripts.
- Inicialização de atributos tornada idempotente, sem acumular bônus de classe.
- A porta agora cria um novo estado de nível, reposiciona o jogador e restaura recursos.
- Caixas, paredes e portas pertencem ao estado do nível.
- `alert()` removido; mensagens usam a região `aria-live`.
- Áudio sintético removido para manter o feedback no leitor de tela.
- Interface com semântica básica, foco visível e adaptação para telas menores.
