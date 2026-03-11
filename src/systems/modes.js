// EcoQuest: Crystal Engine — Mode System
// Observer / Player / Designer / Developer
// Applies to both human users and AI agents.

export const MODES = { OBSERVER: 'OBSERVER', PLAYER: 'PLAYER', DESIGNER: 'DESIGNER', DEVELOPER: 'DEVELOPER' };

export const PERMISSIONS = {
  OBSERVER:  { read: ['gameState','emojipidia','worldMap','storyLog','ecoFacts','battleSpectate'], write: [], execute: [], ui: ['codex-panel','world-map-panel','eco-facts-panel','story-log-panel'] },
  PLAYER:    { read: ['*'], write: ['player.party','player.inventory','player.quests','player.fusions','player.layout','player.codex'], execute: ['battle','capture','explore','fuse','evolve','trade','quest.complete','shop.buy'], ui: ['*'] },
  DESIGNER:  { read: ['*'], write: ['creatures.registry','biomes.maps','quests.pool','emojipidia.entries','fusion.recipes','npc.dialogue','story.scripts','player.*'], execute: ['preview','sandbox','export','creature.create','map.edit','quest.create','dialogue.write','battle'], ui: ['*','creature-editor','map-editor','quest-editor','dialogue-editor','sandbox-panel'] },
  DEVELOPER: { read: ['*'], write: ['*'], execute: ['*'], ui: ['*','engine-console','save-admin','deploy-panel','agent-manager','diagnostics'] },
};

export const MODE_COLORS = { OBSERVER: '#6b7280', PLAYER: '#16a34a', DESIGNER: '#7c3aed', DEVELOPER: '#dc2626' };
export const MODE_ICONS  = { OBSERVER: '🔭', PLAYER: '🎮', DESIGNER: '🎨', DEVELOPER: '🛠️' };

let _currentMode = MODES.PLAYER;
const _agents = {};

export function getCurrentMode() { return _currentMode; }

export function setMode(mode) {
  if (!Object.values(MODES).includes(mode)) return false;
  _currentMode = mode;
  localStorage.setItem('ecoquest_mode', mode);
  window.dispatchEvent(new CustomEvent('modeChange', { detail: { mode } }));
  return true;
}

export function can(type, target) {
  const perms = PERMISSIONS[_currentMode];
  if (!perms) return false;
  const allowed = perms[type] || [];
  if (allowed.includes('*')) return true;
  if (allowed.includes(target)) return true;
  const ns = target.split('.')[0];
  if (allowed.includes(`${ns}.*`)) return true;
  return false;
}

export function gate(type, target) {
  if (!can(type, target)) throw new Error(`Mode ${_currentMode} cannot ${type} "${target}"`);
}

export function registerAgent(agentId, mode, options = {}) {
  _agents[agentId] = { mode, grantedBy: options.grantedBy || 'system', restrictions: options.restrictions || [], grantedAt: Date.now() };
}

export function initModeSystem() {
  const saved = localStorage.getItem('ecoquest_mode');
  if (saved && Object.values(MODES).includes(saved)) _currentMode = saved;
  // Default agent assignments
  registerAgent('surething-ai',         MODES.DEVELOPER, { grantedBy: 'Mellowambience' });
  registerAgent('discord-observer-bot', MODES.OBSERVER,  { grantedBy: 'Mellowambience' });
  registerAgent('content-agent',        MODES.DESIGNER,  { grantedBy: 'Mellowambience', restrictions: ['no-deploy'] });
}
