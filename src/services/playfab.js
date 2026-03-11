// ============================================================
// EcoQuest: Crystal Engine — PlayFab Service Layer
// src/services/playfab.js
// ============================================================
// Handles: Auth, Cloud Save, Leaderboards, Economy (Eco Coins)
// SDK: playfab-sdk (npm) OR direct REST (no npm required)
// Docs: https://learn.microsoft.com/en-us/gaming/playfab/
// Setup: see docs/PLAYFAB_SETUP.md
// ============================================================

const PLAYFAB_TITLE_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PLAYFAB_TITLE_ID) || 'YOUR_TITLE_ID_HERE';
const API_BASE = `https://${PLAYFAB_TITLE_ID}.playfabapi.com`;

let _sessionTicket = null;
let _playFabId = null;

export const isLoggedIn  = () => !!_sessionTicket;
export const getPlayFabId = () => _playFabId;

async function pfPost(endpoint, body = {}) {
  const headers = { 'Content-Type': 'application/json', 'X-PlayFabSDK': 'EcoQuest-1.0' };
  if (_sessionTicket) headers['X-Authorization'] = _sessionTicket;
  const res  = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.code !== 200) throw new Error(`PlayFab [${data.code}]: ${data.errorMessage || data.status}`);
  return data.data;
}

// ── AUTH ─────────────────────────────────────────────────────

export async function loginAnonymous(customId = null) {
  if (!customId) {
    let id = localStorage.getItem('ecoquest_device_id');
    if (!id) { id = `ECO-${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('ecoquest_device_id', id); }
    customId = id;
  }
  const result = await pfPost('/Client/LoginWithCustomID', { TitleId: PLAYFAB_TITLE_ID, CustomId: customId, CreateAccount: true });
  _sessionTicket = result.SessionTicket;
  _playFabId     = result.PlayFabId;
  console.log(`[PlayFab] Logged in as ${_playFabId} (${result.NewlyCreated ? 'new' : 'returning'})`);
  return result;
}

export async function linkGoogleAccount(googleAccessToken) {
  return pfPost('/Client/LinkGoogleAccount', { AccessToken: googleAccessToken, ForceLink: false });
}

// ── CLOUD SAVE ───────────────────────────────────────────────

export async function saveGame(saveData) {
  await pfPost('/Client/UpdateUserData', {
    Data: {
      save_v1:       JSON.stringify(saveData),
      last_saved:    new Date().toISOString(),
      guardian_name: saveData.guardianName || '',
      eco_score:     String(saveData.ecoScore || 0),
      level:         String(saveData.level || 1),
    },
    Permission: 'Public',
  });
  console.log('[PlayFab] Game saved to cloud');
}

export async function loadGame() {
  const result = await pfPost('/Client/GetUserData', { Keys: ['save_v1', 'last_saved'] });
  const raw = result.Data?.save_v1?.Value;
  if (!raw) { console.log('[PlayFab] No cloud save found'); return null; }
  console.log(`[PlayFab] Save loaded (${result.Data.last_saved?.Value})`);
  return JSON.parse(raw);
}

export async function syncSave(localSave = null) {
  try {
    const cloudSave = await loadGame();
    if (!cloudSave && localSave) { await saveGame(localSave); return localSave; }
    if (cloudSave && localSave) {
      const cloudTs = new Date(cloudSave.savedAt || 0).getTime();
      const localTs = new Date(localSave.savedAt  || 0).getTime();
      return cloudTs >= localTs ? cloudSave : localSave;
    }
    return cloudSave || localSave;
  } catch (err) {
    console.warn('[PlayFab] Sync failed, using local:', err.message);
    return localSave;
  }
}

// ── LEADERBOARDS ─────────────────────────────────────────────

export async function updateEcoScore(ecoScore) {
  await pfPost('/Client/UpdatePlayerStatistics', { Statistics: [{ StatisticName: 'EcoScore', Value: Math.floor(ecoScore) }] });
}

export async function updateStats({ ecoScore, biomesRestored, creaturesCaught, fusionCount }) {
  const stats = [];
  if (ecoScore        !== undefined) stats.push({ StatisticName: 'EcoScore',        Value: Math.floor(ecoScore) });
  if (biomesRestored  !== undefined) stats.push({ StatisticName: 'BiomesRestored',   Value: biomesRestored });
  if (creaturesCaught !== undefined) stats.push({ StatisticName: 'CreaturesCaught',  Value: creaturesCaught });
  if (fusionCount     !== undefined) stats.push({ StatisticName: 'FusionsCreated',   Value: fusionCount });
  if (stats.length) await pfPost('/Client/UpdatePlayerStatistics', { Statistics: stats });
}

export async function getEcoScoreLeaderboard(maxResults = 10) {
  const result = await pfPost('/Client/GetLeaderboard', {
    StatisticName: 'EcoScore', StartPosition: 0, MaxResultsCount: maxResults,
    ProfileConstraints: { ShowDisplayName: true },
  });
  return result.Leaderboard.map(e => ({
    rank:        e.Position + 1,
    displayName: e.Profile?.DisplayName || e.PlayFabId.slice(0, 8),
    ecoScore:    e.StatValue,
    playFabId:   e.PlayFabId,
    isMe:        e.PlayFabId === _playFabId,
  }));
}

export async function getMyRank() {
  const result = await pfPost('/Client/GetLeaderboardAroundPlayer', { StatisticName: 'EcoScore', MaxResultsCount: 1 });
  const me = result.Leaderboard?.[0];
  return me ? { rank: me.Position + 1, ecoScore: me.StatValue } : null;
}

// ── ECONOMY ──────────────────────────────────────────────────

export async function getEcoCoins() {
  const result = await pfPost('/Client/GetUserInventory', {});
  return { ecoCoins: result.VirtualCurrency?.EC || 0, inventory: result.Inventory || [] };
}

export async function awardEcoCoins(amount, reason = 'game_event') {
  return pfPost('/Client/ExecuteCloudScript', {
    FunctionName: 'awardCoins',
    FunctionParameter: { amount, reason },
    GeneratePlayStreamEvent: true,
  });
}

// ── DISPLAY NAME ─────────────────────────────────────────────

export async function setGuardianName(name) {
  return pfPost('/Client/UpdateUserTitleDisplayName', { DisplayName: name.slice(0, 25) });
}

// ── ANALYTICS ────────────────────────────────────────────────

export async function trackEvent(eventName, body = {}) {
  try {
    await pfPost('/Client/WritePlayerEvent', {
      EventName: eventName,
      Body: { ...body, game_version: '0.1.0', platform: 'web' },
    });
  } catch (err) {
    console.warn(`[PlayFab] trackEvent failed (${eventName}):`, err.message);
  }
}

// ── INIT ─────────────────────────────────────────────────────

/**
 * Call on app startup. Logs in + syncs save in one shot.
 * @param {object|null} localSave - Existing localStorage save
 * @returns {{ save, playFabId, isNewPlayer }}
 */
export async function initPlayFab(localSave = null) {
  try {
    const loginResult = await loginAnonymous();
    const save = await syncSave(localSave);
    if (save?.guardianName && !loginResult.NewlyCreated) {
      await setGuardianName(save.guardianName).catch(() => {});
    }
    return { save, playFabId: _playFabId, isNewPlayer: loginResult.NewlyCreated };
  } catch (err) {
    console.error('[PlayFab] Init failed:', err.message);
    return { save: localSave, playFabId: null, isNewPlayer: false };
  }
}
