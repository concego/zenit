// IA simples dos inimigos: reação local, sem planejamento ou pathfinding.
import { getText } from "./i18n.js";
import { isBlocked, isInside, isNearWater, isStoneSurface, isWoodSurface } from "./map.js";
import { calculateDamage, getCriticalChance, getDodgeChance, getHitChance } from "./balance.js";
import { playHumanoidFootstep, playHumanoidWoodFootstep, playPlaceholderEnemyAttack, playPlaceholderEnemyHit, playPlaceholderEnemyMove, playSlimeAttack, playSlimeBossAttack, playSlimeBossHit, playSlimeBossStep, playSlimeStep, playStoneFootstep, playWetFootstep, playWoodFootstep, playZombieFootstep } from "./ui-audio.js?v=containers1";

const RULES = Object.freeze({
    rat: Object.freeze({ detection: 7, moveChance: 0.9 }),
    spider: Object.freeze({ detection: 5, moveChance: 0.85, ambushDistance: 4 }),
    slime: Object.freeze({ detection: 5, moveChance: 0.7, slow: true })
});

function message(state, key) { return getText(state.language, `gameplay.messages.${key}`); }
function label(state, enemy) { return getText(state.language, enemy.nameKey || `enemies.species.${enemy.species}`); }
function distance(enemy, player) { return Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y); }

function playerDefense(state) {
    const equipmentDefense = Object.values(state.player.equipment || {}).reduce((sum, item) => sum + (item?.armor || 0), 0);
    const skillDefense = Object.values(state.player.skillState?.buffs || {}).reduce((sum, buff) => sum + (buff.effects?.armor || 0), 0);
    return equipmentDefense + skillDefense;
}

function moveEnemy(state, enemy) {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const candidates = [];
    if (Math.abs(dx) >= Math.abs(dy) && dx) candidates.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
    if (dy) candidates.push({ x: enemy.x, y: enemy.y + Math.sign(dy) });
    if (dx && !candidates.some((candidate) => candidate.x === enemy.x + Math.sign(dx) && candidate.y === enemy.y)) candidates.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
    for (const candidate of candidates) {
        if (isInside(state.level, candidate.x, candidate.y) && !isBlocked(state.level, candidate.x, candidate.y) && !(candidate.x === state.player.x && candidate.y === state.player.y)) {
            enemy.x = candidate.x;
            enemy.y = candidate.y;
            if (enemy.isBoss && enemy.species === "slime") playSlimeBossStep();
            else if (enemy.species === "slime") playSlimeStep();
            else if (isWoodSurface(state.level, enemy.x, enemy.y)) {
                if (enemy.type === "humanoid") playHumanoidWoodFootstep();
                else playWoodFootstep();
            } else if (isNearWater(state.level, enemy.x, enemy.y)) playWetFootstep();
            else if (enemy.species === "zombie") playZombieFootstep();
            else if (isStoneSurface(state.level, enemy.x, enemy.y)) playStoneFootstep();
            else if (enemy.type === "humanoid") playHumanoidFootstep();
            else playPlaceholderEnemyMove();
            return true;
        }
    }
    return false;
}

function enemyAttack(state, enemy) {
    if (enemy.isBoss && enemy.species === "slime") playSlimeBossAttack();
    else if (enemy.species === "slime") playSlimeAttack();
    else playPlaceholderEnemyAttack();
    const hitChance = getHitChance({ attackerCoordination: enemy.stats.coordination || 10, defenderCoordination: state.player.attributes.coordenacao, weaponAccuracy: 0 });
    const effectiveHit = hitChance * (1 - getDodgeChance({ coordination: state.player.attributes.coordenacao }));
    if (Math.random() > effectiveHit) return `${label(state, enemy)} ${message(state, "enemyMisses")}.`;
    const critical = Math.random() < getCriticalChance({ coordination: enemy.stats.coordination || 10 });
    if (enemy.isBoss && enemy.species === "slime") playSlimeBossHit();
    else playPlaceholderEnemyHit();
    const pressureMultiplier = enemy.isBoss ? 1.4 : 1.2;
    const damage = calculateDamage({ attackPower: Math.round(enemy.stats.damage * pressureMultiplier), targetDefense: playerDefense(state), critical });
    state.player.stats.hpAtual = Math.max(0, state.player.stats.hpAtual - damage);
    if (state.player.stats.hpAtual <= 0) {
        state.gameState = "FRONT_MAIN";
        state.hasSave = false;
        state.menuIndex = 1;
        return `${label(state, enemy)} ${message(state, "enemyHits")}: ${damage}. ${message(state, "playerDefeated")}`;
    }
    return `${label(state, enemy)} ${message(state, "enemyHits")}: ${damage}. ${message(state, "playerHp")}: ${state.player.stats.hpAtual}.`;
}

function reactEnemy(state, enemy) {
    const rule = RULES[enemy.species] || { detection: 4, moveChance: 0.5 };
    const currentDistance = distance(enemy, state.player);
    if (currentDistance > (enemy.isBoss ? rule.detection + 2 : rule.detection)) return null;
    if (currentDistance === 1) return enemyAttack(state, enemy);
    if (rule.ambushDistance && currentDistance > rule.ambushDistance) return null;
    if (rule.slow && state.turn % 2 !== 0) return null;
    if (Math.random() > (enemy.isBoss ? Math.min(1, rule.moveChance + 0.15) : rule.moveChance)) return null;
    return moveEnemy(state, enemy) ? `${label(state, enemy)} ${message(state, "enemyMoves")}.` : null;
}

export function runEnemyTurn(state) {
    if (state.gameState !== "NORMAL" || !state.level?.enemies?.length || state.player.stats.hpAtual <= 0) return [];
    state.turn = (state.turn || 0) + 1;
    const reactions = [];
    [...state.level.enemies].forEach((enemy) => {
        if (state.player.stats.hpAtual <= 0 || state.gameState !== "NORMAL") return;
        const reaction = reactEnemy(state, enemy);
        if (reaction) reactions.push(reaction);
    });
    return reactions;
}
