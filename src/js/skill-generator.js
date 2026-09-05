// Geração de habilidades por personagem e regras de progressão.
import { createRng } from "./item-generator.js";
import { CLASS_SKILL_RULES, SKILL_TEMPLATE_BY_ID, SKILL_TEMPLATES } from "./skill-data.js";

function hashSeed(value) {
    if (typeof value === "number") return value;
    const text = String(value || "zenit-character");
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
    return hash >>> 0;
}

function normalizeClass(classKey) {
    return CLASS_SKILL_RULES[classKey] ? classKey : "vanguard";
}

function cloneRequirements(requirements = {}) {
    return {
        attributes: { ...(requirements.attributes || {}) },
        skills: (requirements.skills || []).map((requirement) => ({ ...requirement }))
    };
}

function createSkillInstance(template, { classKey, source = "generated", rng, index = 0 }) {
    const levelCosts = Array.from({ length: template.maxLevel }, (_, level) => template.baseCost + level + Math.floor(rng() * 2));
    return {
        instanceId: `${template.id}:${classKey}:${index}:${Math.floor(rng() * 1000000000)}`,
        id: template.id,
        nameKey: template.nameKey,
        classKey,
        source,
        school: template.school,
        resource: template.resource,
        resourceCost: Math.max(1, template.baseCost - 1),
        level: source === "fixed" ? 1 : 0,
        maxLevel: template.maxLevel,
        levelCosts,
        requirements: cloneRequirements(template.requirements),
        effects: { ...template.effects },
        affinity: template.classes.includes(classKey) ? "primary" : "secondary"
    };
}

function chooseWeightedSkill(pool, classKey, rng) {
    const weights = pool.map((skill) => skill.classes.includes(classKey) ? 5 : skill.classes.length > 1 ? 2 : 0.5);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = rng() * total;
    const index = weights.findIndex((weight) => { roll -= weight; return roll < 0; });
    return pool[Math.max(0, index)];
}

export function createCharacterSkillSet({ classKey = "vanguard", seed, generatedCount = 8, startingPoints = 0 } = {}) {
    const normalizedClass = normalizeClass(classKey);
    const generationSeed = hashSeed(seed ?? normalizedClass);
    const rng = createRng(generationSeed);
    const fixedId = CLASS_SKILL_RULES[normalizedClass].fixedSkill;
    const fixedTemplate = SKILL_TEMPLATE_BY_ID[fixedId];
    const skills = [createSkillInstance(fixedTemplate, { classKey: normalizedClass, source: "fixed", rng, index: 0 })];
    const available = SKILL_TEMPLATES.filter((skill) => skill.id !== fixedId);
    const targetCount = Math.min(Math.max(0, generatedCount), available.length);
    for (let index = 0; index < targetCount; index += 1) {
        const selected = chooseWeightedSkill(available, normalizedClass, rng);
        const selectedIndex = available.indexOf(selected);
        available.splice(selectedIndex, 1);
        skills.push(createSkillInstance(selected, { classKey: normalizedClass, source: "generated", rng, index: index + 1 }));
    }
    return { generationSeed, classKey: normalizedClass, level: 1, skillPoints: startingPoints, skills, hotkeys: {} };
}

function findSkill(skillSet, skillId) { return skillSet?.skills?.find((skill) => skill.id === skillId) || null; }

export function getSkill(skillSet, skillId) { return findSkill(skillSet, skillId); }

export function awardSkillPoints(skillSet, points = 1) {
    skillSet.skillPoints = Math.max(0, skillSet.skillPoints + Math.max(0, Number(points) || 0));
    return skillSet.skillPoints;
}

export function advanceSkillLevel(skillSet, level = 1, pointsPerLevel = 1) {
    const nextLevel = Math.max(skillSet.level || 1, Number(level) || 1);
    const gainedLevels = nextLevel - (skillSet.level || 1);
    skillSet.level = nextLevel;
    if (gainedLevels > 0) awardSkillPoints(skillSet, gainedLevels * pointsPerLevel);
    return skillSet;
}

export function checkSkillRequirements(skillSet, skill, attributes = {}) {
    const missingAttributes = Object.entries(skill.requirements.attributes || {}).filter(([attribute, value]) => (attributes[attribute] || 0) < value).map(([attribute, value]) => ({ attribute, required: value, current: attributes[attribute] || 0 }));
    const missingSkills = (skill.requirements.skills || []).filter((requirement) => (findSkill(skillSet, requirement.id)?.level || 0) < requirement.level).map((requirement) => ({ ...requirement, current: findSkill(skillSet, requirement.id)?.level || 0 }));
    return { satisfied: missingAttributes.length === 0 && missingSkills.length === 0, missingAttributes, missingSkills };
}

export function canLearnSkill(skillSet, skillId, attributes = {}) {
    const skill = findSkill(skillSet, skillId);
    if (!skill) return { allowed: false, reason: "missing_skill" };
    if (skill.level >= skill.maxLevel) return { allowed: false, reason: "max_level", skill };
    const cost = skill.levelCosts[skill.level] || skill.levelCosts[skill.levelCosts.length - 1];
    if (skillSet.skillPoints < cost) return { allowed: false, reason: "skill_points", cost, skill };
    const requirements = checkSkillRequirements(skillSet, skill, attributes);
    if (!requirements.satisfied) return { allowed: false, reason: "requirements", cost, skill, requirements };
    return { allowed: true, cost, skill, requirements };
}

export function learnSkill(skillSet, skillId, attributes = {}) {
    const result = canLearnSkill(skillSet, skillId, attributes);
    if (!result.allowed) return result;
    skillSet.skillPoints -= result.cost;
    result.skill.level += 1;
    return { ...result, level: result.skill.level };
}

export function canUseSkill(skillSet, skillId, attributes = {}) {
    const skill = findSkill(skillSet, skillId);
    if (!skill || skill.level < 1) return { allowed: false, reason: "not_learned", skill };
    const requirements = checkSkillRequirements(skillSet, skill, attributes);
    return requirements.satisfied ? { allowed: true, skill } : { allowed: false, reason: "requirements", skill, requirements };
}

export function assignSkillHotkey(skillSet, slot, skillId) {
    const normalizedSlot = String(slot);
    if (!/^[0-9]$/.test(normalizedSlot)) return { allowed: false, reason: "invalid_slot" };
    const skill = findSkill(skillSet, skillId);
    if (!skill || skill.level < 1) return { allowed: false, reason: "not_learned", skill };
    const previousSkillId = skillSet.hotkeys?.[normalizedSlot] || null;
    skillSet.hotkeys = { ...(skillSet.hotkeys || {}), [normalizedSlot]: skill.id };
    return { allowed: true, slot: normalizedSlot, skill, previousSkillId };
}

export function getSkillHotkey(skillSet, slot) {
    return skillSet?.hotkeys?.[String(slot)] || null;
}

export function getSkillAssignedSlot(skillSet, skillId) {
    const entry = Object.entries(skillSet?.hotkeys || {}).find(([, assignedSkillId]) => assignedSkillId === skillId);
    return entry ? entry[0] : null;
}

export function useSkillHotkey(skillSet, slot, attributes = {}) {
    const skillId = getSkillHotkey(skillSet, slot);
    if (!skillId) return { allowed: false, reason: "unassigned", slot: String(slot) };
    const result = canUseSkill(skillSet, skillId, attributes);
    return result.allowed ? { allowed: true, slot: String(slot), skill: result.skill } : { ...result, slot: String(slot) };
}

export function getSkillEffect(skill, effectKey) {
    if (!skill || skill.level < 1) return 0;
    const baseValue = skill.effects[effectKey] || 0;
    return typeof baseValue === "number" ? baseValue * skill.level : baseValue;
}
