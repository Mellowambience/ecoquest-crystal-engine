# PlayFab Setup Guide
**EcoQuest: Crystal Engine**

Get PlayFab running in ~15 minutes. Free tier handles up to 1,000 players.

---

## Step 1 — Create Account + Title

1. Go to **https://developer.playfab.com**
2. Sign in with your Microsoft account
3. New Studio → New Title → name it `EcoQuest`
4. Copy your **Title ID** from the dashboard (format: `AB1CD`)

---

## Step 2 — Set Your Title ID

Create `.env` at the repo root:
```bash
VITE_PLAYFAB_TITLE_ID=AB1CD
```
Or set it directly in `src/services/playfab.js` line 11.

---

## Step 3 — Virtual Currency (Eco Coins)

1. Dashboard → **Economy** → **Currency** → **New Currency**
2. Set: Currency Code `EC`, Display Name `Eco Coins`, Initial Deposit `50`
3. Save

---

## Step 4 — Leaderboard Statistics

Dashboard → **Leaderboards** → **Statistics** → create:

| Stat Name | Aggregation | Reset |
|-----------|------------|-------|
| `EcoScore` | Max | Never |
| `BiomesRestored` | Max | Never |
| `CreaturesCaught` | Max | Never |
| `FusionsCreated` | Sum | Never |

---

## Step 5 — Deploy CloudScript

1. Dashboard → **Automation** → **CloudScript (Legacy)**
2. Paste the contents of `playfab/cloudscript.js`
3. **Save as Revision** → **Deploy to Live**

This gives you server-side coin awards, anti-cheat capture, and daily login bonuses.

---

## Step 6 — Wire Into Web Build

```javascript
import { initPlayFab, saveGame, updateStats, trackEvent } from './src/services/playfab.js';

// App startup
const localSave = JSON.parse(localStorage.getItem('ecoquest_save') || 'null');
const { save, isNewPlayer } = await initPlayFab(localSave);
if (save) applyGameState(save);
if (isNewPlayer) showWelcomeScreen();

// After battle, level-up, biome restore:
await saveGame(currentGameState);
await updateStats({ ecoScore: currentGameState.ecoScore, creaturesCaught: party.length });
await trackEvent('battle_won', { biome: 'whispering_woods', turns: 5 });
```

---

## Step 7 — Pico-8 Bridge (Optional)

Pico-8 web export can call JS from Lua via `poke()` / JavaScript bridge:
```lua
-- Pico-8 cart calls this to trigger a save
function save_to_cloud(data)
  js_call("window.pfSaveGame", pico8_to_json(data))
end
```
```javascript
// In your web export shell HTML:
window.pfSaveGame = async (data) => { await saveGame(JSON.parse(data)); };
```

---

## Free Tier Limits

| Feature | Free |
|---------|------|
| Dev titles | 10 |
| Players | 1,000 lifetime |
| API requests | ~1M/month |
| User Data storage | 10KB/player |

**Upgrade path:** Apply for [ID@Azure](https://developer.microsoft.com/en-us/games/publish) after your demo is playable — 2 years of $99/month Standard Plan free + $5,000 Azure credits.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `TitleNotFound` | Wrong Title ID — check `.env` |
| `NotAuthenticated` | Call `loginAnonymous()` before other APIs |
| CloudScript error | Check Dashboard → Automation → Revision History |
| Save not loading | Key must be exactly `save_v1` (case-sensitive) |
