// Módulo do Jogador e Classes de Zenit
const classesDoJogo = {
    VANGUARDA: {
        nome: "Vanguarda / Campeão",
        foco: "Potência",
        descricao: "A fantasia de ser inabalável, forte e portar lâminas pesadas.",
        bonusAtributos: { potencia: 4, coordenacao: -1, mente: -1 }
    },
    CACADOR: {
        nome: "Caçador / Patrulheiro",
        foco: "Coordenação",
        descricao: "A fantasia do arqueiro ágil, furtivo e letal que nunca erra o alvo.",
        bonusAtributos: { potencia: 0, coordenacao: 3, mente: -1 }
    },
    MISTICO: {
        nome: "Místico / Erudito",
        foco: "Mente",
        descricao: "A fantasia de dominar os segredos arcanos e soltar magias devastadoras.",
        bonusAtributos: { potencia: -1, coordenacao: 0, mente: 3 }
    }
};

let player = { 
    x: 0, 
    y: 0, 
    dir: 'DIREITA', 
    classeAtiva: 'VANGUARDA',

    attributes: {
        potencia: 12,     
        coordenacao: 10,  
        mente: 10         
    },

    stats: {
        hpMax: 0,
        hpAtual: 0,
        estMax: 0,
        estAtual: 0,
        manaMax: 0,
        manaAtual: 0,
        ouro: 0
    },

    equipment: {
        cabeca: null,
        pescoco: null,
        anel1: null,
        anel2: null,
        tronco: null,
        sobreCorpo: null,
        cintura: null,
        pernas: null,
        pes: null,
        armaMelee: { nome: 'Espada Curta', tipo: 'corpoA_corpo', alcance: 1, dano: 5, duasMaos: false }, 
        armaRanged: { nome: 'Arco Curto', tipo: 'distancia', alcance: 5, dano: 4, duasMaos: true },   
        escudo: null
    },

    instanciaAtiva: 'MELEE'
};

// Função de vetor de direção movida para cá para ficar acessível globalmente
function getDirectionVector(dir) {
    switch (dir) {
        case 'CIMA': return { dx: 0, dy: -1 };
        case 'BAIXO': return { dx: 0, dy: 1 };
        case 'ESQUERDA': return { dx: -1, dy: 0 };
        case 'DIREITA': return { dx: 1, dy: 0 };
        default: return { dx: 0, dy: 0 };
    }
}

function aplicarBonusDeClasse() {
    let classeInfo = classesDoJogo[player.classeAtiva];
    if (classeInfo) {
        player.attributes.potencia += classeInfo.bonusAtributos.potencia;
        player.attributes.coordenacao += classeInfo.bonusAtributos.coordenacao;
        player.attributes.mente += classeInfo.bonusAtributos.mente;
    }
}

function inicializarAtributosDoJogador() {
    aplicarBonusDeClasse();

    player.stats.hpMax = player.attributes.potencia * 10;
    player.stats.hpAtual = player.stats.hpMax;

    player.stats.estMax = (player.attributes.potencia + player.attributes.coordenacao) * 5;
    player.stats.estAtual = player.stats.estMax;

    player.stats.manaMax = player.attributes.mente * 10;
    player.stats.manaAtual = player.stats.manaMax;
}