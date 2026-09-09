// Sons de interface carregados como assets WAV gerados fora do código.

const SOUND_IDS = Object.freeze({
    scroll: "menuScrollSound",
    confirm: "menuConfirmSound",
    cancel: "menuCancelSound",
    coin: "inventoryCoinSound",
    coinDrop: "inventoryCoinDropSound",
    bowDrop: "bowDropSound",
    leatherArmor: "inventoryLeatherArmorSound",
    metalArmor: "inventoryMetalArmorSound",
    potionUse: "inventoryPotionUseSound",
    potionPickup: "inventoryPotionPickupSound",
    chest: "worldChestSound",
    woodDoorOpen: "woodDoorOpenSound",
    woodDoorClose: "woodDoorCloseSound",
    airBuff: "airBuffSound",
    airOffensive: "airOffensiveSound",
    zombieFootstep: ["zombieFootstepSound", "zombieFootstep2Sound"],
    wetFootstep: ["wetFootstepSound", "wetFootstep2Sound"],
    woodFootstep: ["woodFootstepSound", "woodFootstep2Sound"],
    humanoidWoodFootstep: ["humanoidWoodFootstepSound", "humanoidWoodFootstep2Sound"],
    slimeStep: "slimeStepSound",
    slimeAttack: "slimeAttackSound",
    slimeBossStep: "slimeBossStepSound",
    slimeBossAttack: "slimeBossAttackSound",
    slimeBossHit: "slimeBossHitSound",
    slimeBossDeath: "slimeBossDeathSound",
    slimeHit: "slimeHitSound",
    standardHit: "standardHitSound",
    rangedMiss: "rangedMissSound",
    mysticSpell: "mysticSpellSound",
    fireMagic: "fireMagicSound",
    electricFear: "electricFearSound",
    lockOpen: "lockOpenSound",
    lockpickSuccess: "lockpickSuccessSound",
    lockedMetal: "lockedMetalSound",
    drawerOpen: "drawerOpenSound",
    leverActivate: "leverActivateSound",
    shieldEquip: "shieldEquipSound",
    shieldBlock: "shieldBlockSound",
    poisonAttack: "poisonAttackSound",
    leatherCrafting: "leatherCraftingSound",
    consumableCrafting: "consumableCraftingSound",
    woodMaterialDrop: "woodMaterialDropSound",
    metalCrafting: "metalCraftingSound",
    playerFootstep: ["playerFootstepSound", "playerFootstep2Sound"],
    humanoidFootstep: "humanoidFootstepSound",
    stoneFootstep: ["stoneFootstepSound", "stoneFootstep2Sound"],
    placeholderEnemyAttack: "placeholderEnemyAttackSound",
    placeholderEnemyMove: "placeholderEnemyMoveSound",
    placeholderEnemyHit: "placeholderEnemyHitSound",
    placeholderMagicCast: "placeholderMagicCastSound",
    swing: ["battleSwingSound", "battleSwing2Sound", "battleSwing3Sound"],
    unsheathe: ["battleUnsheatheSound", "battleUnsheathe2Sound", "battleUnsheathe3Sound", "battleUnsheathe4Sound", "battleUnsheathe5Sound"]
});

function playSound(kind) {
    const soundId = SOUND_IDS[kind];
    const selectedId = Array.isArray(soundId) ? soundId[Math.floor(Math.random() * soundId.length)] : soundId;
    const audio = document.getElementById(selectedId);
    if (!audio) return;
    audio.volume = kind === "scroll" ? 0.42 : kind === "coin" || kind === "coinDrop" ? 0.55 : 0.5;
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
}

export function playMenuScroll() { playSound("scroll"); }
export function playMenuConfirm() { playSound("confirm"); }
export function playMenuCancel() { playSound("cancel"); }
export function playCoin() { playSound("coin"); }
export function playCoinDrop() { playSound("coinDrop"); }
export function playBowDrop() { playSound("bowDrop"); }
export function playLeatherArmor() { playSound("leatherArmor"); }
export function playMetalArmor() { playSound("metalArmor"); }
export function playPotionUse() { playSound("potionUse"); }
export function playPotionPickup() { playSound("potionPickup"); }
export function playChest() { playSound("chest"); }
export function playWoodDoorOpen() { playSound("woodDoorOpen"); }
export function playWoodDoorClose() { playSound("woodDoorClose"); }
export function playLockedMetal() { playSound("lockedMetal"); }
export function playLockpickSuccess() { playSound("lockpickSuccess"); }
export function playDrawerOpen() { playSound("drawerOpen"); }
export function playLeverActivate() { playSound("leverActivate"); }
export function playShieldEquip() { playSound("shieldEquip"); }
export function playShieldBlock() { playSound("shieldBlock"); }
export function playPoisonAttack() { playSound("poisonAttack"); }
export function playAirBuff() { playSound("airBuff"); }
export function playAirOffensive() { playSound("airOffensive"); }
export function playFireMagic() { playSound("fireMagic"); }
export function playElectricFear() { playSound("electricFear"); }
export function playZombieFootstep() { playSound("zombieFootstep"); }
export function playWetFootstep() { playSound("wetFootstep"); }
export function playWoodFootstep() { playSound("woodFootstep"); }
export function playHumanoidWoodFootstep() { playSound("humanoidWoodFootstep"); }
export function playSlimeStep() { playSound("slimeStep"); }
export function playSlimeAttack() { playSound("slimeAttack"); }
export function playSlimeBossStep() { playSound("slimeBossStep"); }
export function playSlimeBossAttack() { playSound("slimeBossAttack"); }
export function playSlimeBossHit() { playSound("slimeBossHit"); }
export function playSlimeBossDeath() { playSound("slimeBossDeath"); }
export function playSlimeHit() { playSound("slimeHit"); }
export function playStandardHit() { playSound("standardHit"); }
export function playRangedMiss() { playSound("rangedMiss"); }
export function playMysticSpell() { playSound("mysticSpell"); }
export function playLockOpen() { playSound("lockOpen"); }
export function playMetalCrafting() { playSound("metalCrafting"); }
export function playLeatherCrafting() { playSound("leatherCrafting"); }
export function playConsumableCrafting() { playSound("consumableCrafting"); }
export function playWoodMaterialDrop() { playSound("woodMaterialDrop"); }
export function playPlayerFootstep() { playSound("playerFootstep"); }
export function playHumanoidFootstep() { playSound("humanoidFootstep"); }
export function playStoneFootstep() { playSound("stoneFootstep"); }
export function playPlaceholderEnemyAttack() { playSound("placeholderEnemyAttack"); }
export function playPlaceholderEnemyMove() { playSound("placeholderEnemyMove"); }
export function playPlaceholderEnemyHit() { playSound("placeholderEnemyHit"); }
export function playPlaceholderMagicCast() { playSound("placeholderMagicCast"); }
export function playMeleeSwing() { playSound("swing"); }
export function playWeaponUnsheathe() { playSound("unsheathe"); }
