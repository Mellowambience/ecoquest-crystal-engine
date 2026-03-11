# Battle Engine
**EcoQuest: Crystal Engine** — derived from [pret/pokecrystal](https://github.com/pret/pokecrystal)

## Crystal Formula (damage)
```
damage = ((2*level/5 + 2) * power * atk / def) / 50 + 2
       × typeEffectiveness × STAB × random(0.85–1.0)
```

## Actions
- **FIGHT** — choose from 4 moves (each has Power, Accuracy, PP, Type, Effect)
- **ITEM** — use inventory item in battle
- **SWITCH** — swap active creature with another in party
- **RUN** — 60% base escape chance (Crystal formula: playerSpd*32/enemySpd+30 vs rnd(256))
- **CAPTURE** — appears when enemy HP < 30%. Costs 1 Eco Net.

## Capture Formula
```
rate = ((maxHP - currentHP) / maxHP) × captureRate × itemBonus
Success = 3 consecutive rolls all < rate
```

## Status Effects
| Effect | Description |
|--------|-------------|
| Entangled 🌿 | Skip 1 turn |
| Mud-Splattered 💩 | Accuracy -50% |
| Energized ⚡ | ATK ×1.5 |
| Camouflaged 🌿 | DEF ×1.5 |
| Poisoned ☠️ | 6.25% max HP per turn |
| Sleeping 💤 | Skip 2 turns |
| Frozen 🧊 | Skip 3 turns |

## Type Chart
See `docs/TYPE_CHART.md`

## Source
`src/engine/battle.js` — fully documented JS implementation.
