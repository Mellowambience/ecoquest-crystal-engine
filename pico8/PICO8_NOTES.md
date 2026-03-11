# Pico-8 Port Notes

See `docs/PICO8_PORT.md` for full strategy.

## Quick Reference
- Token limit: 8,192 per cart
- Current cart (main): ~3,050 estimated tokens
- Multi-cart: 9 linked carts for full game
- Save: cartdata() — 256 bytes persistent
- Audio: 4 channels, procedural 8-bit sounds

## Key Pico-8 Tricks Used
```lua
-- mid() instead of clamp
v = mid(0, v, 100)
-- Ternary
b = (a==1) and 2 or b
-- Compact table iteration
for i,v in ipairs(t) do ... end
```

## Sprite Sheet Layout
- Row 0 (0-15):   Terrain tiles
- Row 1 (16-31):  Player (4 dirs × 2 frames)
- Row 2 (32-47):  Creatures 1-16 (battle sprites)
- Row 3 (48-63):  Creatures 17-30 + special effects
- Row 4 (64-79):  UI elements
- Row 5 (80-95):  NPC sprites
