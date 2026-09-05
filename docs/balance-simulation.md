# Simulação de combate entre classes

## Cenário

Simulação determinística com 100.000 duelos para cada combinação, seed `20260905`.

O objetivo é medir apenas o núcleo numérico das classes antes da entrada dos inimigos no mapa.

Foram usados:

- atributos iniciais atuais;
- arma comum inicial de cada arquétipo;
- nenhuma armadura;
- nenhuma habilidade;
- nenhum consumível;
- nenhum equipamento adicional;
- turnos alternados pela Coordenação;
- acerto, esquiva e crítico conforme `src/js/balance.js`;
- sem terreno, distância, cobertura ou efeitos de status.

O Místico foi simulado com uma magia básica hipotética de dano-base 6.

## Valores individuais

| Classe | Dano bruto | Acerto contra igual | Esquiva | Crítico |
|---|---:|---:|---:|---:|
| Vanguarda | 14 | 77,0% | 3,0% | 5,0% |
| Caçador | 10 | 80,0% | 4,8% | 6,2% |
| Místico | 14 | 78,0% | 3,0% | 5,0% |

## Resultado dos duelos

| Duelo | Vitória do primeiro | Vitória do segundo | Média de rodadas | Mediana |
|---|---:|---:|---:|---:|
| Vanguarda × Caçador | 90,6% | 9,4% | 13,50 | 13 |
| Vanguarda × Místico | 88,5% | 11,5% | 10,80 | 11 |
| Caçador × Místico | 41,2% | 58,8% | 11,87 | 12 |

## Leitura inicial

O núcleo atual favorece muito a Vanguarda em confrontos diretos. Isso acontece principalmente porque ela começa com 160 de vida e dano bruto 14, enquanto o Caçador começa com 120 de vida e dano 10, e o Místico com 110 de vida e dano 14.

O Caçador possui melhores acerto, esquiva e crítico, mas esses bônus não compensam a diferença de vida e dano em um duelo prolongado. O Místico consegue superar o Caçador apesar da menor vida porque mantém dano igual ao da Vanguarda.

## Decisão

Nenhuma alteração de balanceamento foi aplicada automaticamente. O resultado ainda não representa o combate final: habilidades, equipamentos, armadura, distância, cobertura, terreno, consumíveis e fraquezas dos inimigos ainda não participam da simulação.

A conclusão provisória é que precisamos testar o papel de cada classe antes de buscar igualdade em duelos:

- Vanguarda deve resistir mais, mas não pode vencer quase todos os confrontos apenas por vida;
- Caçador precisa converter Coordenação em dano ou controle com mais eficiência;
- Místico precisa manter dano e utilidade, mas deve depender mais de mana e posicionamento.

O script reproduzível está em `tools/simulate_balance.py`.
