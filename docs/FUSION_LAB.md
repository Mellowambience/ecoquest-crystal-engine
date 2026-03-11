# Fusion Lab — Build Your Own EmojiMon
**EcoQuest: Crystal Engine**

## How It Works

Fuse any 2 creatures → new EmojiMon with combined emoji, dual type, averaged stats (+10% bonus), and best 2 moves from each parent.

```
🦊🍃 Leafpaw Fox  +  🦦🌊 Tideclaw Otter  =  🦊🌊 Tidepaw
Forest               Ocean                    Forest/Ocean
```

## Fusion Stat Formula
```javascript
fusedStat = Math.round(((parentA.stat + parentB.stat) / 2) * 1.10)
```

## Triple Fusion (Elder Guardian+ unlock)
Fuse 3 creatures → Triple-type Legendary EmojiMon. Stats at 0.9× triple average. 6 moves.

## EmojiMon Builder (Designer Mode)
Create from scratch: pick 3 emoji, set type/stats/moves/evolution, add real eco fact + conservation status. Custom entries tagged [Community] in Emojipidia.

## Fusion Codex
All fusions appear in your personal Emojipidia section with shareable codes:
`TIDEPAW-MARS-2026` — other players can import to view your creation.

## Limits by Mode
| Mode | Limit | Cost |
|------|-------|------|
| Player | 6 fusions per save | 50 Eco Coins |
| Designer | Unlimited | Free (sandbox) |
| Developer | Unlimited | Free (live inject) |
