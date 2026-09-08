// Sons de interface carregados como assets WAV gerados fora do código.

const SOUND_IDS = Object.freeze({
    scroll: "menuScrollSound",
    confirm: "menuConfirmSound",
    cancel: "menuCancelSound",
    coin: "inventoryCoinSound",
    coinDrop: "inventoryCoinDropSound",
    leatherArmor: "inventoryLeatherArmorSound",
    metalArmor: "inventoryMetalArmorSound",
    potionUse: "inventoryPotionUseSound",
    potionPickup: "inventoryPotionPickupSound",
    chest: "worldChestSound",
    slimeBossStep: "slimeBossStepSound",
    slimeBossAttack: "slimeBossAttackSound",
    slimeBossHit: "slimeBossHitSound",
    slimeHit: "slimeHitSound",
    mysticSpell: "mysticSpellSound",
    placeholderFootstep: "placeholderFootstepSound",
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
export function playLeatherArmor() { playSound("leatherArmor"); }
export function playMetalArmor() { playSound("metalArmor"); }
export function playPotionUse() { playSound("potionUse"); }
export function playPotionPickup() { playSound("potionPickup"); }
export function playChest() { playSound("chest"); }
export function playSlimeBossStep() { playSound("slimeBossStep"); }
export function playSlimeBossAttack() { playSound("slimeBossAttack"); }
export function playSlimeBossHit() { playSound("slimeBossHit"); }
export function playSlimeHit() { playSound("slimeHit"); }
export function playMysticSpell() { playSound("mysticSpell"); }
export function playPlaceholderFootstep() { playSound("placeholderFootstep"); }
export function playPlaceholderEnemyAttack() { playSound("placeholderEnemyAttack"); }
export function playPlaceholderEnemyMove() { playSound("placeholderEnemyMove"); }
export function playPlaceholderEnemyHit() { playSound("placeholderEnemyHit"); }
export function playPlaceholderMagicCast() { playSound("placeholderMagicCast"); }
export function playMeleeSwing() { playSound("swing"); }
export function playWeaponUnsheathe() { playSound("unsheathe"); }
