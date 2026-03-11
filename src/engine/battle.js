// EcoQuest: Crystal Engine — Battle Engine
// Derived from pret/pokecrystal engine/battle/core.asm
// Reference: https://github.com/pret/pokecrystal

import { TYPE_CHART } from '../data/types.js';

export function createBattleState(playerCreature, wildCreature, context = 'wild') {
  return {
    context, turn: 1, phase: 'PLAYER_CHOICE',
    player: { creature: { ...playerCreature }, action: null, statusEffects: [] },
    enemy:  { creature: { ...wildCreature },   action: null, statusEffects: [], canCapture: false },
    log: [], result: null,
  };
}

// Crystal damage formula: ((2*level/5+2)*power*atk/def)/50+2 × typeEff × STAB × rand
export function calculateDamage(attacker, defender, move) {
  if (move.power === 0) return 0;
  const atk = move.category === 'special' ? attacker.base_stats.sp_atk : attacker.base_stats.atk;
  const def = move.category === 'special' ? defender.base_stats.sp_def : defender.base_stats.def;
  const base = (((2 * attacker.level / 5 + 2) * move.power * atk / def) / 50) + 2;
  const eff  = getTypeEffectiveness(move.type, defender.type);
  const stab = attacker.type.includes(move.type) ? 1.5 : 1.0;
  const rand = 0.85 + Math.random() * 0.15;
  return Math.max(1, Math.round(base * eff * stab * rand));
}

export function getTypeEffectiveness(attackType, defenderTypes) {
  let mult = 1.0;
  for (const dt of defenderTypes) {
    const row = TYPE_CHART[attackType];
    if (row && row[dt] !== undefined) mult *= row[dt];
  }
  return mult;
}

export function getEffectivenessLabel(mult) {
  if (mult >= 4)  return { text: "It's super effective!!",   color: '#fbbf24' };
  if (mult >= 2)  return { text: "It's super effective!",    color: '#f59e0b' };
  if (mult <= 0)  return { text: "It had no effect...",      color: '#6b7280' };
  if (mult < 1)   return { text: "It's not very effective...", color: '#9ca3af' };
  return null;
}

export function hitCheck(move) {
  if (!move.accuracy || move.accuracy >= 100) return true;
  return Math.random() * 100 < move.accuracy;
}

// Crystal escape formula
export function attemptEscape(playerSpd, enemySpd, escapeAttempts = 1) {
  const chance = (playerSpd * 32 / (enemySpd || 1) + 30 * escapeAttempts) / 256;
  return Math.random() < chance;
}

// Capture formula (Crystal-derived)
export function attemptCapture(creature, item = 'ECO_NET') {
  const ITEM_BONUSES = { ECO_NET: 1.0, BIO_TRAP: 1.5, MASTER_NET: 255 };
  const bonus    = ITEM_BONUSES[item] || 1.0;
  const hpRatio  = 1 - (creature.hp.current / creature.hp.max);
  const rate     = hpRatio * (creature.captureRate || 0.8) * bonus;
  const shakes   = [Math.random() < rate, Math.random() < rate, Math.random() < rate];
  return { success: shakes.every(Boolean), shakes, rate };
}

export function enemyChooseAction(enemy, player) {
  const usable = enemy.moves.filter(m => m.pp > 0);
  if (!usable.length) return { type: 'FIGHT', payload: { move: { name: 'Struggle', power: 50, accuracy: 100, type: 'Normal', pp: Infinity, category: 'physical' } } };
  const scored = usable.map(m => ({ move: m, score: (m.power||0) * getTypeEffectiveness(m.type, player.type) }));
  const best   = scored.sort((a,b) => b.score - a.score)[0].move;
  const chosen = Math.random() < 0.8 ? best : usable[Math.floor(Math.random() * usable.length)];
  return { type: 'FIGHT', payload: { move: chosen } };
}
