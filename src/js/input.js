// Keyboard input and in-game menus.
import { createLevel, getBoxAt, getEnemyAt, getPropAt, isBlocked, isDoor, isInside, isNearWater, isStoneSurface, isWall, isWater, isWoodSurface, removeBox, removeEnemy } from "./map.js";
import { CLASSES, getDirectionVector, initializePlayerStats, resetPlayerPosition } from "./player.js";
import { getText } from "./i18n.js";
import { playAirBuff, playAirOffensive, playBarrelBreak, playBoxBreak, playBowDrop, playChest, playCoin, playCoinDrop, playFireMagic, playLeatherArmor, playMeleeSwing, playMenuCancel, playMenuConfirm, playMenuScroll, playMetalArmor, playMysticSpell, playPlayerFootstep, playStoneFootstep, playWetFootstep, playWoodFootstep, playPlaceholderMagicCast, playPoisonAttack, playPotionPickup, playRangedMiss, playRatDeath, playSlimeBossDeath, playSlimeHit, playSpiderDeath, playSpiderHit, playStandardHit, playLargeSlimePlayerHit, playWeaponUnsheathe, playWoodMaterialDrop, playWoodDoorClose, playWoodDoorOpen } from "./ui-audio.js?v=containers1";
import { assignSkillHotkey, canLearnSkill, getSkillAssignedSlot, getSkillEffect, learnSkill, useSkillHotkey } from "./skill-generator.js";
import { calculateDamage, getAttackPower, getCriticalChance, getDodgeChance, getHitChance } from "./balance.js";
import { runEnemyTurn } from "./enemy-ai.js";

const t = (state, key) => getText(state.language, `gameplay.${key}`);
const m = (state, key) => getText(state.language, `gameplay.messages.${key}`);
const direction = (state, key) => getText(state.language, `gameplay.direction.${key}`);
const itemName = (state, name) => getText(state.language, `gameplay.item.${name}`);
const ITEM_FALLBACK_NAMES = Object.freeze({
    "pt-BR": { healing_potion: "Poção de cura", stamina_tonic: "Tônico de estamina", mana_tonic: "Tônico de mana", antidote: "Antídoto", repair_kit: "Kit de reparo", hood: "Capuz", helmet: "Elmo", amulet: "Amuleto", ring: "Anel", vest: "Colete", cuirass: "Couraça", belt: "Cinto", boots: "Botas", short_sword: "Espada curta", mace: "Maça", spear: "Lança", short_bow: "Arco curto", crossbow: "Besta", wand: "Varinha", lockpick: "Gazua", pickaxe: "Picareta", hammer: "Martelo", shovel: "Pá", sewing_kit: "Kit de costura", field_kit: "Kit de campo" },
    en: { healing_potion: "Healing potion", stamina_tonic: "Stamina tonic", mana_tonic: "Mana tonic", antidote: "Antidote", repair_kit: "Repair kit", hood: "Hood", helmet: "Helmet", amulet: "Amulet", ring: "Ring", vest: "Vest", cuirass: "Cuirass", belt: "Belt", boots: "Boots", short_sword: "Short sword", mace: "Mace", spear: "Spear", short_bow: "Short bow", crossbow: "Crossbow", wand: "Wand", lockpick: "Lockpick", pickaxe: "Pickaxe", hammer: "Hammer", shovel: "Shovel", sewing_kit: "Sewing kit", field_kit: "Field kit" }
});
function itemDisplayName(state, item) {
    if (!item) return t(state, "empty");
    if (item.nameKey) {
        const translated = getText(state.language, item.nameKey);
        if (translated !== item.nameKey) return translated;
    }
    if (item.templateId) return ITEM_FALLBACK_NAMES[state.language]?.[item.templateId] || item.templateId.replaceAll("_", " ");
    return itemName(state, item.nome);
}

const MAIN_MENU = ["status", "inventory", "equipment", "skills"];
const STATUS_MENU = ["class", "power", "coordination", "mind", "hp", "stamina", "mana", "gold"];

function skillsMenu(state) { return state.player.skills?.skills?.map((skill) => skill.id) || []; }
const EQUIPMENT_MENU = ["head", "neck", "ring1", "ring2", "torso", "body", "waist", "legs", "feet", "melee", "ranged", "shield"];
const equipmentByKey = { head: "cabeca", neck: "pescoco", ring1: "anel1", ring2: "anel2", torso: "tronco", body: "sobreCorpo", waist: "cintura", legs: "pernas", feet: "pes", melee: "armaMelee", ranged: "armaRanged", shield: "escudo" };

function statusDetail(state, player, option) {
    const { attributes, stats } = player;
    switch (option) {
        case "class": return `${t(state, "class")}: ${itemName(state, CLASSES[player.classeAtiva]?.nome || player.classeAtiva)}.`;
        case "power": return `${t(state, "power")}: ${attributes.potencia}.`;
        case "coordination": return `${t(state, "coordination")}: ${attributes.coordenacao}.`;
        case "mind": return `${t(state, "mind")}: ${attributes.mente}.`;
        case "hp": return `${t(state, "hp")}: ${stats.hpAtual} / ${stats.hpMax}.`;
        case "stamina": return `${t(state, "stamina")}: ${stats.estAtual} / ${stats.estMax}.`;
        case "mana": return `${t(state, "mana")}: ${stats.manaAtual} / ${stats.manaMax}.`;
        case "gold": return `${t(state, "gold")}: ${stats.ouro}.`;
        default: return option;
    }
}

function equipmentDetail(state, player, option) {
    const item = player.equipment[equipmentByKey[option]];
    const range = item && item.alcance !== undefined ? item.alcance : 1;
    const name = item ? `${itemDisplayName(state, item)} (${t(state, "range")}: ${range})` : t(state, "empty");
    return `${t(state, option)}: ${name}.`;
}

function skillTranslationKey(skill) { return skill.id || skill.nameKey?.split(".").pop() || "unknown"; }
function skillLabel(state, skill) { return getText(state.language, `skills.names.${skillTranslationKey(skill)}`); }

function skillDescription(state, skill) { return getText(state.language, `skills.descriptions.${skillTranslationKey(skill)}`); }

function skillResourceLabel(state, resource) { return resource === "stamina" ? t(state, "stamina") : resource === "mana" ? t(state, "mana") : t(state, "hp"); }

function skillDetail(state, skillId) {
    const skill = state.player.skills.skills.find((item) => item.id === skillId);
    if (!skill) return m(state, "skillUnavailable");
    const nextCost = skill.level >= skill.maxLevel ? "—" : skill.levelCosts[skill.level];
    const requirementParts = [];
    Object.entries(skill.requirements.attributes || {}).forEach(([attribute, value]) => requirementParts.push(`${t(state, attribute === "potencia" ? "power" : attribute === "coordenacao" ? "coordination" : "mind")}: ${value}`));
    (skill.requirements.skills || []).forEach((requirement) => requirementParts.push(`${skillLabel(state, state.player.skills.skills.find((item) => item.id === requirement.id) || { id: requirement.id })} ${t(state, "skillLevelShort")}: ${requirement.level}`));
    const result = canLearnSkill(state.player.skills, skill.id, state.player.attributes);
    const shortcut = getSkillAssignedSlot(state.player.skills, skill.id);
    const status = skill.level >= skill.maxLevel ? m(state, "skillMax") : result.allowed ? m(state, "skillReady") : result.reason === "skill_points" ? m(state, "skillNeedPoints") : result.reason === "requirements" ? m(state, "skillNeedRequirements") : "";
    const rangeDetail = getSkillEffect(skill, "range") ? ` ${m(state, "skillRange")}: ${getSkillEffect(skill, "range")}.` : "";
    return `${skillLabel(state, skill)}. ${m(state, "skillDescription")}: ${skillDescription(state, skill)}${rangeDetail} ${m(state, "skillLevel")}: ${skill.level}/${skill.maxLevel}. ${m(state, "skillCost")}: ${nextCost}. ${m(state, "skillUseCost")}: ${skillResourceLabel(state, skill.resource)} ${skill.resourceCost + skill.level - 1}. ${m(state, "skillPoints")}: ${state.player.skills.skillPoints}. ${m(state, "skillRequirements")}: ${requirementParts.join(", ") || m(state, "skillNone")}. ${m(state, "skillShortcut")}: ${shortcut || m(state, "skillNone")}. ${status}`;
}

function activateSkillEffects(state, skill, { prepareAttack = true } = {}) {
    const player = state.player;
    player.skillState = player.skillState || { buffs: {}, pendingAttack: null, companion: null };
    const level = skill.level;
    const cost = (skill.resourceCost || 1) + level - 1;
    const resource = skill.resource;
    const resourceFields = { hp: ["hpAtual", "hpMax"], stamina: ["estAtual", "estMax"], mana: ["manaAtual", "manaMax"] };
    const resourceField = resourceFields[resource];
    const actualCost = resource === "hp" && skill.effects.hpCost ? getSkillEffect(skill, "hpCost") : cost;
    if (resourceField && player.stats[resourceField[0]] < actualCost) return { allowed: false, reason: "resource", cost: actualCost, resource };
    if (resourceField) player.stats[resourceField[0]] -= actualCost;

    const outcome = [];
    const heal = getSkillEffect(skill, "heal");
    const stamina = getSkillEffect(skill, "stamina");
    if (heal) { const before = player.stats.hpAtual; player.stats.hpAtual = Math.min(player.stats.hpMax, player.stats.hpAtual + heal); outcome.push(`${m(state, "skillHeal")}: ${player.stats.hpAtual - before}`); }
    if (stamina) { const before = player.stats.estAtual; player.stats.estAtual = Math.min(player.stats.estMax, player.stats.estAtual + stamina); outcome.push(`${m(state, "skillStamina")}: ${player.stats.estAtual - before}`); }

    const attackEffects = ["damage", "poison", "stagger", "control", "critical"];
    const pending = {};
    attackEffects.forEach((effect) => { const value = getSkillEffect(skill, effect); if (value) pending[effect] = value; });
    const range = getSkillEffect(skill, "range");
    if (range) pending.range = range;
    if (prepareAttack && Object.keys(pending).length) { player.skillState.pendingAttack = { skillId: skill.id, ...pending }; outcome.push(m(state, "skillNextAttack")); }

    const persistentEffects = ["armor", "damageReduction", "accuracy", "evasion", "resistance", "block", "movement", "power", "coordination"];
    const activeEffects = {};
    persistentEffects.forEach((effect) => { const value = getSkillEffect(skill, effect); if (value) activeEffects[effect] = value; });
    if (Object.keys(activeEffects).length) { player.skillState.buffs[skill.id] = { level, effects: activeEffects }; outcome.push(m(state, "skillEffectActive")); }
    const companionDamage = getSkillEffect(skill, "companionDamage");
    if (companionDamage) { player.skillState.companion = { damage: companionDamage, hp: getSkillEffect(skill, "companionHp"), skillId: skill.id }; outcome.push(m(state, "skillCompanion")); }
    player.skillState.lastUsed = skill.id;
    return { allowed: true, cost: actualCost, resource, outcome };
}

function isRangedMagicSkill(skill) {
    return skill.resource === "mana" && getSkillEffect(skill, "damage") > 0 && getSkillEffect(skill, "range") > 0;
}

function castRangedMagic(state, skill, announce, render) {
    const pendingAttack = {
        damage: getSkillEffect(skill, "damage") || 0,
        range: getSkillEffect(skill, "range") || 1,
        accuracy: getSkillEffect(skill, "accuracy") || 0,
        critical: getSkillEffect(skill, "critical") || 0
    };
    state.player.skillState.pendingAttack = null;
    if (skill.id === "elemental_bolt") playFireMagic();
    else if (skill.id !== "arcane_spark") playPlaceholderMagicCast();
    const vector = getDirectionVector(state.player.dir);
    for (let distance = 1; distance <= pendingAttack.range; distance += 1) {
        const x = state.player.x + vector.dx * distance;
        const y = state.player.y + vector.dy * distance;
        if (!isInside(state.level, x, y)) break;
        if (isWall(state.level, x, y)) {
            announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "attackWall")} X ${x}, Y ${y}.`));
            render();
            return;
        }
        if (isDoor(state.level, x, y)) {
            announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "attackDoor")}`));
            render();
            return;
        }
        const enemy = getEnemyAt(state.level, x, y);
        if (!enemy) continue;
        const hitChance = getHitChance({ attackerCoordination: state.player.attributes.coordenacao, defenderCoordination: enemy.stats.coordination || 10, weaponAccuracy: 0.03, accuracyBonus: pendingAttack.accuracy });
        const effectiveHit = hitChance * (1 - getDodgeChance({ coordination: enemy.stats.coordination || 10 }));
        if (Math.random() > effectiveHit) {
            announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "attackMissed")} ${enemyLabel(state, enemy)}.`));
            render();
            return;
        }
        const critical = Math.random() < getCriticalChance({ coordination: state.player.attributes.coordenacao, criticalBonus: pendingAttack.critical });
        const attackPower = getAttackPower({ attribute: state.player.attributes.mente, kind: "magic", tier: "common", flatBonus: pendingAttack.damage });
        const damage = calculateDamage({ attackPower, targetDefense: enemy.stats.defense, critical });
        enemy.stats.hpAtual -= damage;
        if (enemy.isBoss && enemy.species === "slime") playLargeSlimePlayerHit();
        else if (enemy.species === "slime") playSlimeHit();
        else if (enemy.species === "spider") playSpiderHit();
        if (enemy.stats.hpAtual <= 0) {
            if (enemy.isBoss && enemy.species === "slime") playSlimeBossDeath();
            else if (enemy.species === "rat") playRatDeath();
            else if (enemy.species === "spider") playSpiderDeath();
            removeEnemy(state.level, enemy);
            const lootText = collectEnemyLoot(state, enemy);
            announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "enemyDefeated")} ${enemyLabel(state, enemy)}. ${m(state, "damageDealt")}: ${damage}. ${lootText}`));
        } else {
            announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "damageDealt")}: ${damage}. ${enemyLabel(state, enemy)} ${m(state, "enemyRemaining")}: ${enemy.stats.hpAtual}.`));
        }
        render();
        return;
    }
    announce(withEnemyReactions(state, `${skillLabel(state, skill)}: ${m(state, "noTarget")}`));
    render();
}

function useAssignedSkill(state, slot, announce, render) {
    const result = useSkillHotkey(state.player.skills, slot, state.player.attributes);
    if (!result.allowed) {
        if (result.reason === "unassigned") announce(`${m(state, "skillSlot")} ${slot}: ${m(state, "skillUnassigned")}`);
        else if (result.reason === "resource") announce(`${m(state, "skillNoResource")}: ${result.resource === "stamina" ? t(state, "stamina") : result.resource === "mana" ? t(state, "mana") : t(state, "hp")}.`);
        else announce(m(state, "skillCannotUse"));
        return;
    }
    const rangedMagic = isRangedMagicSkill(result.skill);
    const activation = activateSkillEffects(state, result.skill, { prepareAttack: !rangedMagic });
    if (!activation.allowed) { announce(`${m(state, "skillNoResource")}: ${activation.resource === "stamina" ? t(state, "stamina") : activation.resource === "mana" ? t(state, "mana") : t(state, "hp")}.`); return; }
    if (result.skill.element === "air") {
        if (rangedMagic) playAirOffensive();
        else playAirBuff();
    } else if (result.skill.id === "arcane_spark") playMysticSpell();
    if (rangedMagic) { castRangedMagic(state, result.skill, announce, render); return; }
    const details = activation.outcome.length ? ` ${activation.outcome.join(" ")}.` : "";
    announce(withEnemyReactions(state, `${skillLabel(state, result.skill)}: ${m(state, "skillUsed")}. ${skillDescription(state, result.skill)}${details}`));
    render();
}

function frontPosition(state) {
    const vector = getDirectionVector(state.player.dir);
    return { x: state.player.x + vector.dx, y: state.player.y + vector.dy };
}

function move(state, directionName, announce, render) {
    const vector = getDirectionVector(directionName);
    const newX = state.player.x + vector.dx;
    const newY = state.player.y + vector.dy;
    if (!isInside(state.level, newX, newY)) { announce(m(state, "boundary")); return; }
    if (isBlocked(state.level, newX, newY)) {
        const prop = getPropAt(state.level, newX, newY);
        const container = getBoxAt(state.level, newX, newY);
        const reason = isDoor(state.level, newX, newY) ? m(state, "doorAhead") : getEnemyAt(state.level, newX, newY) ? m(state, "enemyAhead") : container ? ` ${containerLabel(state, container)}${m(state, "blocksPath")}` : isWater(state.level, newX, newY) ? m(state, "waterAhead") : prop ? ` ${propLabel(state, prop)}${m(state, "blocksPath")}` : "";
        announce(`${m(state, "blocked")} ${direction(state, directionName)}.${reason}`); return;
    }
    state.player.x = newX; state.player.y = newY;
    if (isWoodSurface(state.level, newX, newY)) playWoodFootstep();
    else if (isNearWater(state.level, newX, newY)) playWetFootstep();
    else if (isStoneSurface(state.level, newX, newY)) playStoneFootstep();
    else playPlayerFootstep();
    const reactions = runEnemyTurn(state);
    announce([`${newX},${newY}`, ...reactions].join(" "));
    render();
}

function relativeScanDistance(state, x, y) {
    const horizontal = x < state.player.x ? `l${state.player.x - x}` : x > state.player.x ? `r${x - state.player.x}` : "";
    const vertical = y < state.player.y ? `n${state.player.y - y}` : y > state.player.y ? `s${y - state.player.y}` : "";
    return [horizontal, vertical].filter(Boolean).join(",");
}

function scanPoint(state, label, x, y) {
    return `${label} ${relativeScanDistance(state, x, y)}`;
}

function scan(state, announce) {
    const vector = getDirectionVector(state.player.dir); const found = []; const checked = new Set();
    for (let distance = 1; distance <= 5; distance += 1) {
        const spread = Math.floor(distance / 2);
        for (let offset = -spread; offset <= spread; offset += 1) {
            const vertical = state.player.dir === "CIMA" || state.player.dir === "BAIXO";
            const x = vertical ? state.player.x + offset : state.player.x + vector.dx * distance;
            const y = vertical ? state.player.y + vector.dy * distance : state.player.y + offset;
            const key = `${x},${y}`;
            if (!isInside(state.level, x, y) || checked.has(key)) continue; checked.add(key);
            if (isWall(state.level, x, y)) found.push(scanPoint(state, m(state, "scanWall"), x, y));
            else if (isWater(state.level, x, y)) found.push(scanPoint(state, m(state, "scanWater"), x, y));
            else if (getBoxAt(state.level, x, y)) { const container = getBoxAt(state.level, x, y); found.push(scanPoint(state, containerLabel(state, container), x, y)); }
            else if (getEnemyAt(state.level, x, y)) { const enemy = getEnemyAt(state.level, x, y); found.push(scanPoint(state, enemyLabel(state, enemy), x, y)); }
            else if (getPropAt(state.level, x, y)) found.push(scanPoint(state, propLabel(state, getPropAt(state.level, x, y)), x, y));
            else if (isDoor(state.level, x, y)) found.push(scanPoint(state, m(state, "scanDoor"), x, y));
        }
    }
    announce(`${m(state, "scanDone")}: ${found.length ? found.join(", ") : m(state, "scanNone")}.`);
}

function enemyLabel(state, enemy) { return getText(state.language, enemy.nameKey || `enemies.species.${enemy.species}`); }
function propLabel(state, prop) { return getText(state.language, `gameplay.props.${prop.type}`); }
function containerLabel(state, container) { return container.containerType === "barrel" ? getText(state.language, "gameplay.barrel") : getText(state.language, "gameplay.box"); }

function playLootItemSound(item) {
    if (item.category === "consumable") playPotionPickup();
    else if (item.category === "weapon" && item.kind === "ranged") playBowDrop();
    else if (item.category === "weapon" && item.kind === "melee") playWeaponUnsheathe();
    else if (item.category === "equipment" && item.material === "leather") playLeatherArmor();
    else if (item.category === "equipment" && item.material === "metal") playMetalArmor();
}

function collectEnemyLoot(state, enemy) {
    const loot = state.level.enemyLoot?.find((entry) => entry.enemyId === enemy.instanceId);
    if (!loot) return "";
    const found = [];
    (loot.materials || []).forEach((material) => {
        state.player.craftingMaterials[material.materialId] = (state.player.craftingMaterials[material.materialId] || 0) + material.quantity;
        if (material.materialId === "wood") playWoodMaterialDrop();
        found.push(`${material.quantity} ${getText(state.language, material.nameKey)}`);
    });
    (loot.items || []).forEach((item) => {
        state.player.inventory.push(item);
        playLootItemSound(item);
        found.push(`${m(state, "enemyItem")}: ${itemDisplayName(state, item)}`);
    });
    if (loot.gold) { state.player.stats.ouro += loot.gold; playCoinDrop(); playCoin(); found.push(`${loot.gold} ${t(state, "gold")}`); }
    return found.length ? `${m(state, "enemyLoot")}: ${found.join(", ")}.` : "";
}

function withEnemyReactions(state, text) {
    return [text, ...runEnemyTurn(state)].filter(Boolean).join(" ");
}

function collectContainerLoot(state, container) {
    const loot = container.loot;
    if (!loot) return "";
    const found = [];
    if (container.containerType === "barrel") playBarrelBreak();
    else if (loot.source === "chest") playChest();
    else playBoxBreak();
    (loot.materials || []).forEach((material) => {
        state.player.craftingMaterials[material.materialId] = (state.player.craftingMaterials[material.materialId] || 0) + material.quantity;
        if (material.materialId === "wood") playWoodMaterialDrop();
        found.push(`${material.quantity} ${getText(state.language, material.nameKey)}`);
    });
    (loot.items || []).forEach((item) => { state.player.inventory.push(item); playLootItemSound(item); found.push(`${m(state, "enemyItem")}: ${itemDisplayName(state, item)}`); });
    if (loot.gold) { state.player.stats.ouro += loot.gold; playCoin(); found.push(`${loot.gold} ${t(state, "gold")}`); }
    return found.length ? `${m(state, "containerLoot")}: ${found.join(", ")}.` : "";
}

function attackEnemy(state, enemy, weapon, pendingAttack, announce, render) {
    const kind = state.player.instanciaAtiva === "MELEE" ? "melee" : "ranged";
    const attribute = kind === "melee" ? state.player.attributes.potencia : state.player.attributes.coordenacao;
    const weaponDamage = weapon.dano ?? weapon.damage ?? 1;
    const attackPower = getAttackPower({ weaponDamage, attribute, kind, tier: "common", flatBonus: pendingAttack?.damage || 0 });
    const hitChance = getHitChance({ attackerCoordination: state.player.attributes.coordenacao, defenderCoordination: enemy.stats.coordination || 10, weaponAccuracy: kind === "melee" ? 0.02 : 0.05, accuracyBonus: pendingAttack?.accuracy || 0 });
    const effectiveHit = hitChance * (1 - getDodgeChance({ coordination: enemy.stats.coordination || 10 }));
    state.player.skillState.pendingAttack = null;
    if (Math.random() > effectiveHit) {
        if (kind === "ranged") playRangedMiss();
        announce(withEnemyReactions(state, `${m(state, "attackMissed")} ${enemyLabel(state, enemy)}.`));
        return;
    }
    const critical = Math.random() < getCriticalChance({ coordination: state.player.attributes.coordenacao, criticalBonus: pendingAttack?.critical || 0 });
    const damage = calculateDamage({ attackPower, targetDefense: enemy.stats.defense, critical });
    if (pendingAttack?.poison) playPoisonAttack();
    enemy.stats.hpAtual -= damage;
    if (enemy.isBoss && enemy.species === "slime") playLargeSlimePlayerHit();
    else if (enemy.species === "slime") playSlimeHit();
    else if (enemy.species === "spider") playSpiderHit();
    else playStandardHit();
    if (enemy.stats.hpAtual <= 0) {
        if (enemy.isBoss && enemy.species === "slime") playSlimeBossDeath();
        else if (enemy.species === "rat") playRatDeath();
        else if (enemy.species === "spider") playSpiderDeath();
        removeEnemy(state.level, enemy);
        const lootText = collectEnemyLoot(state, enemy);
        announce(withEnemyReactions(state, `${enemy.isBoss ? m(state, "bossDefeated") : m(state, "enemyDefeated")} ${enemyLabel(state, enemy)}. ${m(state, "damageDealt")}: ${damage}. ${lootText}`));
    } else announce(withEnemyReactions(state, `${m(state, "damageDealt")}: ${damage}. ${enemyLabel(state, enemy)} ${m(state, "enemyRemaining")}: ${enemy.stats.hpAtual}.`));
    render();
}

function attack(state, announce, render) {
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    if (!weapon) { announce(m(state, "noWeapon")); return; }
    if (state.player.instanciaAtiva === "MELEE") playMeleeSwing();
    const pendingAttack = state.player.skillState?.pendingAttack || null;
    const bonusText = pendingAttack?.damage ? ` ${m(state, "skillAttackBonus")}: ${pendingAttack.damage}.` : "";
    const vector = getDirectionVector(state.player.dir); const range = pendingAttack?.range || (weapon.alcance !== undefined ? weapon.alcance : 1);
    for (let distance = 1; distance <= range; distance += 1) {
        const x = state.player.x + vector.dx * distance; const y = state.player.y + vector.dy * distance;
        if (!isInside(state.level, x, y)) break;
        if (isWall(state.level, x, y)) { state.player.skillState.pendingAttack = null; announce(withEnemyReactions(state, `${m(state, "attackWall")} X ${x}, Y ${y}.${bonusText}`)); return; }
        if (isDoor(state.level, x, y)) { state.player.skillState.pendingAttack = null; announce(withEnemyReactions(state, `${m(state, "attackDoor")}${bonusText}`)); return; }
        const enemy = getEnemyAt(state.level, x, y);
        if (enemy) { attackEnemy(state, enemy, weapon, pendingAttack, announce, render); return; }
        const box = getBoxAt(state.level, x, y);
        if (box) { const lootText = collectContainerLoot(state, box); removeBox(state.level, box); state.player.skillState.pendingAttack = null; announce(withEnemyReactions(state, `${containerLabel(state, box)} X ${x}, Y ${y} ${m(state, "destroyed")}. ${lootText} ${m(state, "total")}: ${state.player.stats.ouro}.${bonusText}`)); render(); return; }
    }
    state.player.skillState.pendingAttack = null;
    announce(withEnemyReactions(state, `${m(state, "attackDone")} ${itemName(state, weapon.nome)}.${bonusText} ${m(state, "noTarget")}`));
}

function interact(state, announce, render) {
    const position = frontPosition(state);
    if (!isDoor(state.level, position.x, position.y)) { announce(m(state, "nothing")); return; }
    playWoodDoorOpen();
    state.levelNumber += 1; state.level = createLevel(state.levelNumber); resetPlayerPosition(state.player); initializePlayerStats(state.player);
    setTimeout(() => playWoodDoorClose(), 450);
    announce(`${m(state, "doorOpened")} ${state.levelNumber}.`); render();
}

function toggleWeapon(state, announce) {
    state.player.instanciaAtiva = state.player.instanciaAtiva === "MELEE" ? "RANGED" : "MELEE";
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    if (state.player.instanciaAtiva === "MELEE" && weapon) playWeaponUnsheathe();
    announce(`${m(state, "activeWeapon")}: ${weapon ? itemName(state, weapon.nome) : m(state, "none")}.`);
}

function handleMenuKey(state, event, announce) {
    const { key } = event;
    const menu = state.gameState === "MENU_STATUS" ? STATUS_MENU : state.gameState === "MENU_EQUIPAMENTO" ? EQUIPMENT_MENU : state.gameState === "MENU_HABILIDADES" ? skillsMenu(state) : MAIN_MENU;
    if (state.gameState === "MENU_HABILIDADES" && /^[0-9]$/.test(key)) {
        const skillId = skillsMenu(state)[state.menuIndex];
        const skill = state.player.skills.skills.find((item) => item.id === skillId);
        const result = assignSkillHotkey(state.player.skills, key, skillId);
        if (result.allowed) { playMenuConfirm(); announce(`${skillLabel(state, skill)}: ${m(state, "skillAssigned")} ${key}.`); }
        else { playMenuCancel(); announce(m(state, "skillMustBeLearned")); }
        return true;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
        playMenuScroll();
        const increment = key === "ArrowDown" ? 1 : -1;
        state.menuIndex = (state.menuIndex + increment + menu.length) % menu.length;
        const option = menu[state.menuIndex];
        announce(state.gameState === "MENU_STATUS" ? statusDetail(state, state.player, option) : state.gameState === "MENU_EQUIPAMENTO" ? equipmentDetail(state, state.player, option) : state.gameState === "MENU_HABILIDADES" ? skillDetail(state, option) : t(state, option));
        return true;
    }
    if (key === "Escape") {
        playMenuCancel();
        const previous = state.gameState;
        if (previous === "MENU_PRINCIPAL") { state.gameState = "NORMAL"; announce(`${state.player.x},${state.player.y}`); }
        else {
            state.gameState = "MENU_PRINCIPAL";
            state.menuIndex = previous === "MENU_STATUS" ? 0 : previous === "MENU_HABILIDADES" ? 3 : 2;
            announce(`${t(state, "mainMenu")}. ${m(state, "option")}: ${t(state, MAIN_MENU[state.menuIndex])}.`);
        }
        return true;
    }
    if (state.gameState === "MENU_PRINCIPAL" && key === "Enter") {
        playMenuConfirm();
        const option = MAIN_MENU[state.menuIndex];
        if (option === "status") { state.gameState = "MENU_STATUS"; state.menuIndex = 0; announce(`${m(state, "submenuStatus")} ${statusDetail(state, state.player, STATUS_MENU[0])}`); }
        else if (option === "inventory") announce(m(state, "inventoryEmpty"));
        else if (option === "equipment") { state.gameState = "MENU_EQUIPAMENTO"; state.menuIndex = 0; announce(`${m(state, "submenuEquipment")} ${equipmentDetail(state, state.player, EQUIPMENT_MENU[0])}`); }
        else { state.gameState = "MENU_HABILIDADES"; state.menuIndex = 0; const firstSkill = skillsMenu(state)[0]; announce(`${m(state, "submenuSkills")} ${skillDetail(state, firstSkill)}`); }
        return true;
    }
    if (state.gameState === "MENU_HABILIDADES" && key === "Enter") {
        const skillId = skillsMenu(state)[state.menuIndex];
        const result = learnSkill(state.player.skills, skillId, state.player.attributes);
        if (result.allowed) { playMenuConfirm(); announce(`${skillLabel(state, result.skill)}: ${m(state, "skillPurchased")} ${result.level}. ${skillDetail(state, skillId)}`); }
        else { playMenuCancel(); announce(`${skillDetail(state, skillId)} ${m(state, "skillCannotPurchase")}`); }
        return true;
    }
    return false;
}

export function installInput({ state, announce, render }) {
    function onKeyDown(event) {
        if (state.gameState.startsWith("FRONT_")) return;
        if (state.gameState !== "NORMAL") { if (handleMenuKey(state, event, announce)) event.preventDefault(); return; }
        const key = event.key; const lowerKey = key.toLowerCase(); const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key); const isNumberHotkey = /^[0-9]$/.test(key); const isGameKey = isArrow || isNumberHotkey || ["a", "c", "enter", "s", "t", "w"].includes(lowerKey); if (isGameKey) event.preventDefault();
        if (isNumberHotkey) useAssignedSkill(state, key, announce, render);
        else if (lowerKey === "s") scan(state, announce);
        else if (lowerKey === "c") { state.gameState = "MENU_PRINCIPAL"; state.menuIndex = 0; announce(`${t(state, "mainMenu")}. ${m(state, "menuHint")}`); }
        else if (lowerKey === "t") announce(`${m(state, "looking")} ${direction(state, state.player.dir)}.`);
        else if (lowerKey === "w") toggleWeapon(state, announce);
        else if (lowerKey === "a") attack(state, announce, render);
        else if (key === "Enter") interact(state, announce, render);
        else if (isArrow) { const dir = { ArrowUp: "CIMA", ArrowDown: "BAIXO", ArrowLeft: "ESQUERDA", ArrowRight: "DIREITA" }[key]; if (event.shiftKey) { state.player.dir = dir; announce(`${m(state, "look")} ${direction(state, dir)}.`); render(); } else move(state, dir, announce, render); }
    }
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
}
