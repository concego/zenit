# Balanceamento numérico inicial

## Atributos e recursos

Os atributos continuam em três eixos:

- **Potência:** vida, dano corpo a corpo e resistência física;
- **Coordenação:** acerto, esquiva, dano à distância e mobilidade;
- **Mente:** mana, magia e efeitos sobrenaturais.

Fórmulas atuais:

- Vida máxima = Potência × 10;
- Estamina máxima = (Potência + Coordenação) × 5;
- Mana máxima = Mente × 10.

Valores iniciais:

| Classe | Potência | Coordenação | Mente | Vida | Estamina | Mana |
|---|---:|---:|---:|---:|---:|---:|
| Vanguarda | 16 | 9 | 9 | 160 | 125 | 90 |
| Caçador | 12 | 13 | 9 | 120 | 125 | 90 |
| Místico | 11 | 10 | 13 | 110 | 105 | 130 |

## Ataque

- Acerto-base: 75%;
- Limite mínimo: 20%;
- Limite máximo: 95%;
- Bônus de acerto: 2 pontos percentuais por ponto de diferença de Coordenação;
- Bônus de precisão da arma: 2% corpo a corpo, 5% à distância, 3% magia;
- Crítico-base: 5%;
- Crítico por Coordenação acima de 10: 0,4 ponto percentual por ponto;
- Limite de crítico: 30%;
- Dano crítico: 1,5×.

Escala de dano do atributo:

- corpo a corpo: Potência × 0,55;
- à distância: Coordenação × 0,50;
- magia: Mente × 0,65.

Com as armas iniciais, o dano bruto esperado fica aproximadamente em:

- Vanguarda com espada curta: 14;
- Caçador com arco curto: 11;
- Místico com magia básica de dano 6: 14.

Isso permite que inimigos pequenos sejam derrotados em poucos ataques, sem tornar o primeiro mapa trivial.

## Defesa

A redução não será linear, evitando que defesa alta torne o personagem invulnerável:

`redução = defesa / (defesa + 40)`

Limite máximo: 75%.

Referências:

| Defesa | Redução |
|---:|---:|
| 2 | 4,8% |
| 5 | 11,1% |
| 10 | 20% |
| 20 | 33,3% |
| 40 | 50% |
| 80 | 66,7% |

## Progressão

- Nível inicial: 1;
- Limite planejado inicial: 20;
- XP para o nível seguinte: 100 + 75 × (nível atual − 1);
- 3 pontos de atributo por nível;
- 1 ponto de habilidade por nível.

Os pontos de habilidade são separados do custo de uso das habilidades.

## Qualidade dos itens

Multiplicadores de qualidade:

- comum: 1×;
- incomum: 1,2×;
- raro: 1,5×;
- épico: 1,9×;
- lendário: 2,45×.

## Observação de implementação

As fórmulas estão centralizadas em `src/js/balance.js`. A vida, a estamina e a mana do jogador já usam esse módulo. A resolução completa de acerto, esquiva, crítico e dano será aplicada quando o combate contra inimigos for conectado.
