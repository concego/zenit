// Estado do jogador e regras de classes do Zenit.
import { createCharacterSkillSet } from "./skill-generator.js";

export const CLASSES = Object.freeze({
    VANGUARDA: Object.freeze({
        nome: "Vanguarda / Campeão",
        foco: "Potência",
        descricao: "A fantasia de ser inabalável, forte e portar lâminas pesadas.",
        bonusAtributos: Object.freeze({ potencia: 4, coordenacao: -1, mente: -1 })
    }),
    CACADOR: Object.freeze({
        nome: "Caçador / Patrulheiro",
        foco: "Coordenação",
        descricao: "A fantasia do arqueiro ágil, furtivo e letal que nunca erra o alvo.",
        bonusAtributos: Object.freeze({ potencia: 0, coordenacao: 3, mente: -1 })
    }),
    MISTICO: Object.freeze({
        nome: "Místico / Erudito",
        foco: "Mente",
        descricao: "A fantasia de dominar os segredos arcanos e soltar magias devastadoras.",
        bonusAtributos: Object.freeze({ potencia: -1, coordenacao: 0, mente: 3 })
    })
});

const BASE_ATTRIBUTES = Object.freeze({ potencia: 12, coordenacao: 10, mente: 10 });

export function getDirectionVector(direction) {
    switch (direction) {
        case "CIMA": return { dx: 0, dy: -1 };
        case "BAIXO": return { dx: 0, dy: 1 };
        case "ESQUERDA": return { dx: -1, dy: 0 };
        case "DIREITA": return { dx: 1, dy: 0 };
        default: return { dx: 0, dy: 0 };
    }
}

export function createPlayer(character = null) {
    const player = {
        character,
        skills: createCharacterSkillSet({ classKey: character?.classKey || "vanguard", seed: character?.skillSeed ?? character?.name ?? character?.presetKey }),
        x: 0,
        y: 0,
        dir: "DIREITA",
        classeAtiva: character?.classKey === "hunter" ? "CACADOR" : character?.classKey === "mystic" ? "MISTICO" : "VANGUARDA",
        baseAttributes: { ...BASE_ATTRIBUTES },
        attributes: { ...BASE_ATTRIBUTES },
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
            armaMelee: { nome: "Espada Curta", tipo: "corpoA_corpo", alcance: 1, dano: 5, duasMaos: false },
            armaRanged: { nome: "Arco Curto", tipo: "distancia", alcance: 5, dano: 4, duasMaos: true },
            escudo: null
        },
        instanciaAtiva: "MELEE"
    };

    initializePlayerStats(player);
    return player;
}

export function initializePlayerStats(player) {
    const classInfo = CLASSES[player.classeAtiva] || CLASSES.VANGUARDA;
    const bonus = classInfo.bonusAtributos;

    player.attributes = {
        potencia: player.baseAttributes.potencia + bonus.potencia,
        coordenacao: player.baseAttributes.coordenacao + bonus.coordenacao,
        mente: player.baseAttributes.mente + bonus.mente
    };

    player.stats.hpMax = player.attributes.potencia * 10;
    player.stats.hpAtual = player.stats.hpMax;
    player.stats.estMax = (player.attributes.potencia + player.attributes.coordenacao) * 5;
    player.stats.estAtual = player.stats.estMax;
    player.stats.manaMax = player.attributes.mente * 10;
    player.stats.manaAtual = player.stats.manaMax;
}

export function setPlayerClass(player, classKey) {
    if (!CLASSES[classKey]) return false;
    player.classeAtiva = classKey;
    initializePlayerStats(player);
    return true;
}

export function resetPlayerPosition(player) {
    player.x = 0;
    player.y = 0;
    player.dir = "DIREITA";
}

