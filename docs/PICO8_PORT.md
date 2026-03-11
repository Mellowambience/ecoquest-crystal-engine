# Pico-8 Port Strategy
**EcoQuest: Crystal Engine**

## Hardware Constraints
| Spec | Limit |
|------|-------|
| Screen | 128×128, 16 colors |
| Sprites | 128 (8×8) + 128 shared |
| Map | 128×32 tiles (128×64 with shared) |
| Code | 8,192 tokens max |
| Audio | 4 channels, 64 SFX, 64 patterns |
| Cart | 32KB (up to 16 carts linked) |

## Multi-Cart Plan
```
cart 0: ecoquest.p8         ← Title + Eco Village
cart 1: ecoquest_battle.p8  ← Battle engine
cart 2: ecoquest_woods.p8   ← Whispering Woods
cart 3: ecoquest_shores.p8  ← Crystal Shores
cart 4: ecoquest_dunes.p8   ← Sun Dunes
cart 5: ecoquest_peaks.p8   ← Frozen Peaks
cart 6: ecoquest_canopy.p8  ← Emerald Canopy + Legendary
cart 7: ecoquest_codex.p8   ← Emojipidia
cart 8: ecoquest_fusion.p8  ← Fusion Lab
```

## cartdata Save Layout (256 bytes)
```
Byte 0:    Save version
Bytes 1-5: Player stats (level, xp, coins, eco_score, energy)
Bytes 6-7: Player position (x, y)
Bytes 8-9: Story flags (bitfield)
Bytes 10-33: Party (6 creatures × 4 bytes: id, level, hp_cur, hp_max)
Bytes 34-63: Codex caught bitfield (30 creatures)
```

## Audio
- Pattern 0: Eco Village overworld
- Pattern 1: Battle theme
- Pattern 2: Whispering Woods
- Pattern 3: Crystal Shores
- Pattern 4: Victory fanfare
- Pattern 5: Rival encounter
- Pattern 6: Legendary (full 4 channels)

See `pico8/ecoquest.p8` for full Lua implementation.
