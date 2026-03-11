// EcoQuest: Crystal Engine — Fusion Lab
// Fuse 2 (or 3) EmojiMon to create custom hybrids.

import { can } from './modes.js';

const FUSION_BONUS = 1.10;
const TRIPLE_MULTIPLIER = 0.9;
const MAX_PLAYER_FUSIONS = 6;
const FUSION_COIN_COST = 50;

export function fuseCreatures(parentA, parentB, customName = null) {
  can('execute', 'fuse');
  const stats = fusedStats(parentA.base_stats, parentB.base_stats, FUSION_BONUS);
  const types = [...new Set([...parentA.type, ...parentB.type])].slice(0, 2);
  const moves = selectMoves(parentA.moves, parentB.moves);
  const emoji = combineEmoji(parentA.emoji, parentB.emoji);
  const name  = customName || generateName(parentA.name, parentB.name);
  const level = Math.round((parentA.level + parentB.level) / 2);
  const fusion = {
    id: `F${Date.now()}`, name, emoji, type: types, level, base_stats: stats, moves,
    isFusion: true, parents: [parentA.id, parentB.id],
    eco_fact: `A fusion of ${parentA.real_animal} × ${parentB.real_animal}. Conservation: ${parentA.conservation_status} & ${parentB.conservation_status}.`,
    real_animal: `${parentA.real_animal} × ${parentB.real_animal}`,
    conservation_status: 'Custom Fusion',
    created_at: new Date().toISOString(),
    created_by: localStorage.getItem('ecoquest_guardian_name') || 'Unknown Guardian',
  };
  fusion.share_code = `${name.toUpperCase().replace(/[^A-Z]/g,'').slice(0,8)}-${(fusion.created_by||'ANON').toUpperCase().slice(0,4)}-${new Date().getFullYear()}`;
  return fusion;
}

export function tripleFuse(a, b, c, name = null) {
  can('execute', 'fuse');
  const stats = {};
  for (const k of Object.keys(a.base_stats)) stats[k] = Math.round(((a.base_stats[k]+b.base_stats[k]+c.base_stats[k])/3)*TRIPLE_MULTIPLIER*FUSION_BONUS);
  return {
    id: `F${Date.now()}`, name: name || `${a.name.slice(0,3)}${b.name.slice(0,3)}${c.name.slice(0,3)}`,
    emoji: `${[...a.emoji][0]}${[...b.emoji][0]}${[...c.emoji][0]}`,
    type: [...new Set([...a.type,...b.type,...c.type])].slice(0,3),
    level: Math.round((a.level+b.level+c.level)/3), base_stats: stats,
    moves: tripleSelectMoves(a.moves, b.moves, c.moves),
    isFusion: true, isTripleFusion: true, parents: [a.id, b.id, c.id],
  };
}

function fusedStats(sA, sB, bonus) {
  const out = {};
  for (const k of Object.keys(sA)) out[k] = Math.round(((sA[k]+sB[k])/2)*bonus);
  return out;
}

function selectMoves(mA, mB) {
  const byPow = (m) => [...m].sort((a,b) => (b.power||0)-(a.power||0));
  const seen = new Set();
  return [...byPow(mA).slice(0,2), ...byPow(mB).slice(0,2)].filter(m => { if(seen.has(m.name)) return false; seen.add(m.name); return true; }).slice(0,4);
}

function tripleSelectMoves(mA, mB, mC) {
  const byPow = (m) => [...m].sort((a,b) => (b.power||0)-(a.power||0));
  const seen = new Set();
  return [...byPow(mA).slice(0,2),...byPow(mB).slice(0,2),...byPow(mC).slice(0,2)].filter(m => { if(seen.has(m.name)) return false; seen.add(m.name); return true; }).slice(0,6);
}

function combineEmoji(eA, eB) { return `${[...eA][0]}${[...eB][0]}`; }

function generateName(nA, nB) {
  const h = (s) => s.slice(0, Math.ceil(s.length/2));
  const b = (s) => s.slice(Math.floor(s.length/2));
  return h(nA) + b(nB).toLowerCase();
}
