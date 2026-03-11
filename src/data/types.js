// EcoQuest: Crystal Engine — Type Chart
// 6-type advantage matrix. 2=super, 0.5=resisted, 0=immune, 1=normal.

export const TYPES = ['Forest','Ocean','Sky','Earth','Fire','Storm'];

export const TYPE_CHART = {
  Forest: { Forest:1,   Ocean:0.5, Sky:0.5, Earth:2,   Fire:2,   Storm:1   },
  Ocean:  { Forest:1,   Ocean:1,   Sky:1,   Earth:0.5, Fire:2,   Storm:0.5 },
  Sky:    { Forest:2,   Ocean:1,   Sky:0.5, Earth:1,   Fire:1,   Storm:2   },
  Earth:  { Forest:0.5, Ocean:2,   Sky:1,   Earth:1,   Fire:0.5, Storm:1   },
  Fire:   { Forest:0.5, Ocean:0.5, Sky:1,   Earth:2,   Fire:0.5, Storm:2   },
  Storm:  { Forest:1,   Ocean:2,   Sky:0.5, Earth:1,   Fire:0.5, Storm:0.5 },
};

export const TYPE_COLORS = { Forest:'#16a34a', Ocean:'#0284c7', Sky:'#7c3aed', Earth:'#92400e', Fire:'#dc2626', Storm:'#6366f1' };
export const TYPE_EMOJI  = { Forest:'🌿', Ocean:'🌊', Sky:'🌤️', Earth:'🌍', Fire:'🔥', Storm:'⚡' };
