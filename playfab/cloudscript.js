// ============================================================
// EcoQuest: Crystal Engine — PlayFab CloudScript
// playfab/cloudscript.js
// ============================================================
// Deploy to: PlayFab Dashboard → Automation → CloudScript (Legacy)
// These run server-side — clients cannot tamper with them.
// ============================================================

"use strict";

// Award Eco Coins — anti-cheat safe, per-reason caps
handlers.awardCoins = function(args) {
  var CAPS = { battle_victory:25, biome_restored:100, creature_caught:30, quest_completed:50, daily_login:10, fusion_created:20, game_event:10 };
  var reason = args.reason || 'game_event';
  var amount = Math.min(Math.floor(args.amount || 0), CAPS[reason] || 10);
  if (amount <= 0) return { awarded:0, reason:'invalid_amount' };
  var r = server.AddUserVirtualCurrency({ PlayFabId:currentPlayerId, VirtualCurrency:'EC', Amount:amount });
  server.WritePlayerEvent({ PlayFabId:currentPlayerId, EventName:'eco_coins_awarded', Body:{ amount:amount, reason:reason, balance_after:r.Balance } });
  return { awarded:amount, balance:r.Balance, reason:reason };
};

// Validate + deduct coins for fusion
handlers.validateFusion = function(args) {
  var COST = 50;
  var inv  = server.GetUserInventory({ PlayFabId:currentPlayerId });
  var coins = (inv.VirtualCurrency||{}).EC || 0;
  if (coins < COST) return { allowed:false, reason:'insufficient_coins', balance:coins, required:COST };
  server.SubtractUserVirtualCurrency({ PlayFabId:currentPlayerId, VirtualCurrency:'EC', Amount:COST });
  return { allowed:true, coinsDeducted:COST };
};

// Daily login bonus — once per day
handlers.claimDailyBonus = function(args) {
  var today = new Date().toISOString().slice(0,10);
  var data  = server.GetUserData({ PlayFabId:currentPlayerId, Keys:['last_daily_bonus'] });
  if ((data.Data.last_daily_bonus||{}).Value === today) return { claimed:false, reason:'already_claimed_today' };
  var r = server.AddUserVirtualCurrency({ PlayFabId:currentPlayerId, VirtualCurrency:'EC', Amount:10 });
  server.UpdateUserData({ PlayFabId:currentPlayerId, Data:{ last_daily_bonus:today } });
  return { claimed:true, awarded:10, balance:r.Balance };
};

// Server-authoritative capture validation
handlers.validateCapture = function(args) {
  var hpRatio = parseFloat(args.hpRatio||1.0);
  var rate    = parseFloat(args.captureRate||0.8);
  if (hpRatio<0||hpRatio>1||rate<0||rate>1) return { valid:false, reason:'invalid_params' };
  var p = (1-hpRatio)*rate;
  var shakes = [Math.random()<p, Math.random()<p, Math.random()<p];
  var success = shakes[0]&&shakes[1]&&shakes[2];
  if (success) {
    server.WritePlayerEvent({ PlayFabId:currentPlayerId, EventName:'creature_captured', Body:{ creature_id:args.creatureId||'unknown', hp_ratio:hpRatio } });
    server.AddUserVirtualCurrency({ PlayFabId:currentPlayerId, VirtualCurrency:'EC', Amount:30 });
  }
  return { success:success, shakes:shakes };
};
