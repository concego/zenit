#!/usr/bin/env python3
"""Simulação determinística dos duelos entre as três classes-base.

Cenário isolado: atributos iniciais, arma comum inicial, sem armadura,
sem habilidades, sem consumíveis e sem inimigos externos.
"""
from __future__ import annotations

import argparse
import random
import statistics

CLASSES = {
    "Vanguarda": {"hp": 160, "coord": 9, "power": 16, "mind": 9, "weapon": 5, "kind": "melee"},
    "Caçador": {"hp": 120, "coord": 13, "power": 12, "mind": 9, "weapon": 4, "kind": "ranged"},
    # O Místico usa uma magia básica hipotética com dano-base 6.
    "Místico": {"hp": 110, "coord": 10, "power": 11, "mind": 13, "weapon": 6, "kind": "magic"},
}

WEAPONS = {
    "melee": {"attribute": "power", "scale": 0.55, "accuracy": 0.02},
    "ranged": {"attribute": "coord", "scale": 0.50, "accuracy": 0.05},
    "magic": {"attribute": "mind", "scale": 0.65, "accuracy": 0.03},
}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def attack_power(attacker: dict) -> int:
    profile = WEAPONS[attacker["kind"]]
    return max(1, round(attacker["weapon"] + attacker[profile["attribute"]] * profile["scale"]))


def hit_chance(attacker: dict, defender: dict) -> float:
    profile = WEAPONS[attacker["kind"]]
    return clamp(0.75 + (attacker["coord"] - defender["coord"]) * 0.02 + profile["accuracy"], 0.20, 0.95)


def dodge_chance(defender: dict) -> float:
    return min(0.40, 0.03 + max(0, defender["coord"] - 10) * 0.006)


def critical_chance(attacker: dict) -> float:
    return min(0.30, 0.05 + max(0, attacker["coord"] - 10) * 0.004)


def duel(first_name: str, second_name: str, rng: random.Random) -> tuple[str, int]:
    fighters = [CLASSES[first_name], CLASSES[second_name]]
    health = [fighters[0]["hp"], fighters[1]["hp"]]
    order = [0, 1] if fighters[0]["coord"] >= fighters[1]["coord"] else [1, 0]
    rounds = 0
    while health[0] > 0 and health[1] > 0:
        rounds += 1
        for attacker_index in order:
            defender_index = 1 - attacker_index
            if health[defender_index] <= 0:
                break
            attacker = fighters[attacker_index]
            defender = fighters[defender_index]
            effective_hit = hit_chance(attacker, defender) * (1 - dodge_chance(defender))
            if rng.random() <= effective_hit:
                damage = attack_power(attacker)
                if rng.random() < critical_chance(attacker):
                    damage = round(damage * 1.5)
                health[defender_index] -= max(1, damage)
    return (first_name if health[0] > 0 else second_name), rounds


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runs", type=int, default=100_000)
    parser.add_argument("--seed", type=int, default=20260905)
    args = parser.parse_args()
    rng = random.Random(args.seed)
    names = list(CLASSES)
    print(f"runs={args.runs} seed={args.seed}")
    print("class;damage;hit_equal;dodge;critical")
    for name, data in CLASSES.items():
        print(f"{name};{attack_power(data)};{hit_chance(data, data):.3f};{dodge_chance(data):.3f};{critical_chance(data):.3f}")
    print("duel;first_win_rate;second_win_rate;average_rounds;median_rounds")
    for index, first_name in enumerate(names):
        for second_name in names[index + 1 :]:
            results = [duel(first_name, second_name, rng) for _ in range(args.runs)]
            first_wins = sum(winner == first_name for winner, _ in results)
            rounds = [rounds for _, rounds in results]
            print(f"{first_name} vs {second_name};{first_wins / args.runs:.4f};{1 - first_wins / args.runs:.4f};{statistics.mean(rounds):.2f};{statistics.median(rounds):.1f}")


if __name__ == "__main__":
    main()
