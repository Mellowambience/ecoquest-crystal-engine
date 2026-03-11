# Mode System — Observer / Player / Designer / Developer
**EcoQuest: Crystal Engine**

Four operational modes for users AND AI agents.

## Modes

### 🔭 OBSERVER
Read-only. Watch game state, Emojipidia, live battles, world map. No writes.
- Ideal for: classroom observers, parent dashboards, Discord spectator bots, AI monitoring agents

### 🎮 PLAYER  
Full gameplay. Battle, capture, explore, fuse, level up.
- Ideal for: end users, kids, AI rival NPCs

### 🎨 DESIGNER
All Player access + Creature Editor, Map Editor, Quest Editor, Emojipidia Editor, Fusion Recipe Editor, Dialogue Writer, Balance Sandbox.
- Ideal for: content creators, teachers, AI content-generation agents
- Requires: publish approval from Developer before changes go live

### 🛠 DEVELOPER
Full engine access. Code editing, data tables, save admin, deploy triggers, agent permission management.
- Ideal for: Mars (@Mellowambience), trusted AI agents with build authority, CI/CD

## Mode Colors
- Observer: `#6b7280` (gray)
- Player: `#16a34a` (green)  
- Designer: `#7c3aed` (purple)
- Developer: `#dc2626` (red)

## Agent Mode Assignment
```javascript
assignAgentMode({ agentId: 'surething-ai',         mode: 'DEVELOPER', grantedBy: 'Mellowambience' })
assignAgentMode({ agentId: 'discord-observer-bot', mode: 'OBSERVER',  grantedBy: 'Mellowambience' })
assignAgentMode({ agentId: 'content-agent',        mode: 'DESIGNER',  restrictions: ['no-deploy'] })
```

## Permissions
```javascript
const PERMISSIONS = {
  OBSERVER:  { read: ['gameState','emojipidia','worldMap','storyLog','ecoFacts','battleSpectate'], write: [], execute: [] },
  PLAYER:    { read: ['*'], write: ['player.*'], execute: ['battle','capture','explore','fuse','evolve'] },
  DESIGNER:  { read: ['*'], write: ['creatures.registry','biomes.maps','quests.pool','emojipidia.entries','fusion.recipes'], execute: ['preview','sandbox','export'] },
  DEVELOPER: { read: ['*'], write: ['*'], execute: ['*'] },
}
```

See `src/systems/modes.js` for full implementation.
