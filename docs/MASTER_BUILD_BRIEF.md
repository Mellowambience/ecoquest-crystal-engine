# EcoQuest: Crystal Engine — Master Build Brief
**Version 1.0 | March 11, 2026**
**Repo:** https://github.com/Mellowambience/ecoquest-crystal-engine
**Live (Base44):** https://eco-quest-guardians.base44.app

---

## What This Is

EcoQuest: Guardians of Earth is a **Pokemon Crystal-style environmental RPG** for kids.
Emoji-native — no external sprite sheets. Turn-based battles, creature capture, companion
evolution, tile overworld, 30-creature Codex, story arc across 6 biomes.

**Dual platform target:**
- **Web** — Base44 SPA / Codex / any React environment (primary)
- **Pico-8** — working Lua cartridge in repo (`pico8/ecoquest.p8`), multi-cart target

**GitHub repo is the source of truth.** Base44 and Pico-8 both derive from it.

---

## Repository Map

```
ecoquest-crystal-engine/
src/
  engine/battle.js          DONE — Crystal damage formula, capture, AI
  systems/modes.js          DONE — Observer/Player/Designer/Developer
  systems/fusion.js         DONE — 2-way + triple fusion, share codes
  data/types.js             DONE — 6-type advantage chart
  data/creatures.js         10/30 EmojiMon — needs 20 more
  services/playfab.js       DONE — Cloud save, leaderboard, Eco Coins
playfab/cloudscript.js      DONE — Anti-cheat server functions
pico8/ecoquest.p8           DONE — Working overworld, battle, capture, save
docs/ (8 reference files)   DONE
```

| Layer | Status |
|-------|--------|
| Battle logic | Done (JS) |
| Type system | Done |
| Fusion system | Done |
| PlayFab backend | Done |
| Pico-8 cartridge | Working prototype |
| Creature roster | 10/30 |
| Web UI (React) | Not yet |
| Overworld grid (web) | Not yet (exists in Pico-8) |
| Story/NPC system | Not yet |
| Sound | Not yet |

---

## The Game in One Paragraph

The player is a **Guardian** — picks a class and receives a starter creature. They explore 6 biomes via tile overworld; walking into tall grass triggers battles. Wild creatures are fought in turn-based combat using a Crystal-derived damage formula with a 6-type system (Forest/Ocean/Sky/Earth/Fire/Storm). Weakened creatures can be captured with an Eco Net (3-shake animation). Captured creatures join the party (max 6), level up, evolve. The EcoCodex catalogs all 30 EmojiMon with real IUCN conservation data. A 3-act story arc features a rival NPC (Shadow Hunter) and legendary creature finale. Progress saved via PlayFab cloud save + global Eco Score leaderboard.

---

## 30-Creature Roster

5 per biome. 10 done, 20 needed.

| # | Emoji | Name | Type | Biome | Done? |
|---|-------|------|------|-------|-------|
| 01 | hedgehog | Thornback | Forest | Whispering Woods | YES |
| 02 | fox | Leafpaw Fox | Forest | Whispering Woods | YES |
| 03 | bear | Moss Bear Cub | Forest | Whispering Woods | YES |
| 04 | bee | Bumble Buddy | Forest | Whispering Woods | YES |
| 05 | deer | Fern Deer | Forest | Whispering Woods | YES |
| 06 | otter | Tideclaw Otter | Ocean | Crystal Shores | YES |
| 07 | fish | Coral Koi | Ocean | Crystal Shores | YES |
| 08 | crab | Blue Crab | Ocean | Crystal Shores | YES |
| 09 | jellyfish | Jellylight | Ocean | Crystal Shores | YES |
| 10 | bird | Sandpiper Scout | Sky | Crystal Shores | YES |
| 11 | snake | Garden Snake | Earth | Eco Village | NEEDS ENTRY |
| 12 | worm | Earth Worm | Earth | Eco Village | NEEDS ENTRY |
| 13 | caterpillar | Seedling Sprite | Forest | Eco Village | NEEDS ENTRY |
| 14 | bird | Robin Fledgling | Sky | Eco Village | NEEDS ENTRY |
| 15 | ladybug | Bark Beetle | Forest | Eco Village | NEEDS ENTRY |
| 16 | fox | Cactus Fennec | Fire | Sun Dunes | NEEDS ENTRY |
| 17 | scorpion | Dune Scorpion | Earth | Sun Dunes | NEEDS ENTRY |
| 18 | turtle | Desert Tortoise | Earth | Sun Dunes | NEEDS ENTRY |
| 19 | eagle | Mirage Hawk | Sky | Sun Dunes | NEEDS ENTRY |
| 20 | dragon | Sandstorm Drake | Fire | Sun Dunes | NEEDS ENTRY |
| 21 | polar bear | Frost Bear | Earth | Frozen Peaks | NEEDS ENTRY |
| 22 | seal | Ice Seal Pup | Ocean | Frozen Peaks | NEEDS ENTRY |
| 23 | owl | Blizzard Owl | Sky | Frozen Peaks | NEEDS ENTRY |
| 24 | lizard | Glacier Salamander | Earth | Frozen Peaks | NEEDS ENTRY |
| 25 | fox | Aurora Fox | Sky | Frozen Peaks | NEEDS ENTRY |
| 26 | leopard | Canopy Jaguar | Forest | Emerald Canopy | NEEDS ENTRY |
| 27 | parrot | Rainbow Toucan | Sky | Emerald Canopy | NEEDS ENTRY |
| 28 | snake | Vine Serpent | Forest | Emerald Canopy | NEEDS ENTRY |
| 29 | monkey | Cloud Monkey | Forest | Emerald Canopy | NEEDS ENTRY |
| 30 | globe | Earth Titan | Earth | Emerald Canopy | LEGENDARY |

**Entry schema** — match exactly to creatures.js entries 1-10:
```js
{
  id: 11,
  emoji: 'snake-emoji',
  name: 'Garden Snake',
  type: 'Earth',
  biome: 'Eco Village',
  level: { min: 2, max: 5 },
  hp: { base: 30, perLevel: 4 },
  stats: { atk: 10, def: 8, spd: 14, specialAtk: 9 },
  moves: [
    { name: 'Slither Strike', power: 35, accuracy: 95, type: 'Earth', pp: 35 },
    { name: 'Coil', power: 0, accuracy: 100, type: 'Earth', effect: 'def+2', pp: 20 },
    { name: 'Shed Skin', power: 0, accuracy: 100, type: 'Earth', effect: 'heal_25pct', pp: 10 },
    { name: 'Tail Whip', power: 25, accuracy: 100, type: 'Normal', pp: 40 },
  ],
  evolution: { evolvesAt: 18, evolvesInto: 'King Serpent' },
  captureRate: 0.75,
  ecoFact: 'Common garden snakes eat slugs and pests. Completely harmless to humans.',
  realAnimal: 'Grass Snake (Natrix natrix)',
  conservationStatus: 'Least Concern',
  height: '0.6m',
  weight: '0.15kg',
}
```

**Codex prompt to complete 20 missing entries:**
> Open src/data/creatures.js. Entries 11-30 are missing. Add all 20 using the exact schema of entries 1-10. Use real IUCN conservation data for each real-world animal the creature is based on. Creatures 16-30 span Sun Dunes (Fire/Earth), Frozen Peaks (Ocean/Sky/Earth), and Emerald Canopy (Forest/Sky). Creature 30 (Earth Titan) is Legendary: no evolution, captureRate 0.05, legendary: true.

---

## Type Advantage Chart

| Attacker | Forest | Ocean | Sky | Earth | Fire | Storm |
|----------|--------|-------|-----|-------|------|-------|
| Forest   | 1x     | 0.5x  | 0.5x| 2x    | 2x   | 1x    |
| Ocean    | 1x     | 1x    | 1x  | 0.5x  | 2x   | 0.5x  |
| Sky      | 2x     | 1x    | 0.5x| 1x    | 1x   | 2x    |
| Earth    | 0.5x   | 2x    | 1x  | 1x    | 0.5x | 1x    |
| Fire     | 0.5x   | 0.5x  | 1x  | 2x    | 0.5x | 2x    |
| Storm    | 1x     | 2x    | 0.5x| 1x    | 0.5x | 0.5x  |

---

## Damage Formula (src/engine/battle.js)

```js
damage = Math.floor(
  ((2 * attacker.level / 5 + 2) * move.power * attacker.atk / defender.def / 50 + 2)
  * typeMultiplier
  * (0.85 + Math.random() * 0.15)
)
```

---

## Starter Companions by Class

| Class | Starter | Type | Evolves |
|-------|---------|------|---------|
| Forest Ranger | Leafpaw Fox | Forest | Forest Guardian at Lv16 |
| Ocean Guardian | Tideclaw Otter | Ocean | Tidal Warden at Lv14 |
| Sky Watcher | Windwing Hawk | Sky | Storm Eagle at Lv15 |
| Earth Healer | Rootbear Cub | Earth | Grove Bear at Lv17 |

---

## PlayFab Functions (src/services/playfab.js)

| Function | Purpose |
|----------|---------|
| initPlayFab(localSave) | Login + cloud sync on startup |
| saveGame(state) | Cloud save, cross-device |
| loadGame() | Load cloud save |
| updateStats({ecoScore, ...}) | Update leaderboard stats |
| getEcoScoreLeaderboard(10) | Global top 10 |
| awardEcoCoins(amount, reason) | Anti-cheat via CloudScript |
| trackEvent(name, body) | Analytics to PlayStream |

One-line startup init:
```js
const { save, isNewPlayer } = await initPlayFab(
  JSON.parse(localStorage.getItem('ecoquest_save') || 'null')
);
```

Full setup: docs/PLAYFAB_SETUP.md

---

## 4-Mode System (src/systems/modes.js)

| Mode | Access | Who |
|------|--------|-----|
| Observer | View only | Discord bot, viewers |
| Player | Full game | Human players |
| Designer | Edit creatures/maps | Human designers |
| Developer | Full system | SureThing AI, devs |

---

## Build Execution Order

Phase 1 — Data (no UI dependency)
1. Complete EmojiMon 11-30 in src/data/creatures.js

Phase 2 — Web UI
2. Battle screen: wire battle.js into React component
3. Party/Companion screen: 6-slot party, stats, exp bar, evolve animation
4. EcoCodex screen: 30-creature grid, silhouettes for undiscovered
5. Overworld grid: 10x8 tiles, WASD movement, tall grass encounters

Phase 3 — Story
6. NPC dialogue: Elder (gives starter), Shadow Hunter (rival)
7. Story arc: 3 acts, chapter flags, story log panel
8. Quest completion gating biome unlocks

Phase 4 — Backend
9. PlayFab init on startup, replace localStorage
10. Leaderboard panel: top 10 Eco Scores, current rank highlighted
11. Post-battle stats sync: updateStats() after battle/capture/restore

Phase 5 — Polish
12. Audio: Web Audio API, procedural 8-bit sounds, per-biome melodies
13. Modular UI: 14-panel drag-drop dashboard, 4 layout presets
14. Animations: evolution, capture shake, level-up confetti

---

## Codex / Cursor / Replit Handoff Prompt

Paste this as opening context for any AI coding tool:

---
Context: You are building EcoQuest: Crystal Engine — a Pokemon Crystal-style environmental RPG for kids. The full codebase is at Mellowambience/ecoquest-crystal-engine on GitHub. Read the repo before writing anything.

Architecture locked — do not change:
- Emoji-native creatures — no external sprites
- src/engine/battle.js — complete, do not rewrite
- src/data/types.js — 6 types: Forest/Ocean/Sky/Earth/Fire/Storm (fixed)
- src/services/playfab.js — use for all save/load, not localStorage directly
- src/systems/modes.js — 4-mode permission system
- src/systems/fusion.js — fusion mechanic

Current task: [INSERT SPECIFIC TASK HERE]
---

---

## P0 Blockers (Base44 app)

1. No persistence: call initPlayFab() on startup, use saveGame()
2. No exploration feedback: add animated result card after Explore
3. Eco Village 0 quests: add 3 tutorial quests
4. Base44 watermark: remove before public launch

---

## Links

- GitHub repo: https://github.com/Mellowambience/ecoquest-crystal-engine
- Base44 app: https://eco-quest-guardians.base44.app
- PlayFab dashboard: https://developer.playfab.com
- IUCN Red List: https://www.iucnredlist.org
- Pico-8 cart: pico8/ecoquest.p8 in repo
