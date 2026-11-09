# Happy Farm — Asset inventory

Inventory generated from the assets currently committed in `public/assets`. The approved originals below were downloaded from the supplied Drive folder on 07 Nov 2026 and copied into `public/assets/drive/` without overwriting their source files.

| Filename | Dimensions | Format | Alpha | Category | Usage |
|---|---:|---|---|---|---|
| `backgrounds/farm-map.png` | 1535 × 1024 | PNG | No | Background | Farm Map and scene backdrop |
| `backgrounds/cloud-layer-transparent.png` | 1536 × 1024 | PNG | Yes | Decoration | Subtle moving cloud layer |
| `backgrounds/cloud-layer.png` | 1536 × 1024 | PNG | No | Reference | Not loaded by the game |
| `animals/cat.png` | 1536 × 1024 | PNG | Yes | Animal | Cat Farm, vocabulary and quiz |
| `animals/dog.png` | 1536 × 1024 | PNG | Yes | Animal | Dog Farm, vocabulary and quiz |
| `animals/cow.png` | 1536 × 1024 | PNG | No | Animal | Cow Farm, vocabulary and quiz; replace with transparent source version before release |
| `animals/pig.png` | 1536 × 1024 | PNG | No | Animal | Pig Farm, vocabulary and quiz; replace with transparent source version before release |
| `animals/duck.png` | 1536 × 1024 | PNG | No | Animal | Duck Pond, vocabulary and quiz; replace with transparent source version before release |
| `drive/backgrounds/farm-overview.png` | 1536 × 1024 | PNG | No | Main map | Welcome and Main Farm map |
| `drive/backgrounds/crop-farm.png` | 1536 × 1024 | PNG | No | Crop Farm | Crop Farm gameplay background |
| `drive/backgrounds/cow-farm.png` | 1536 × 1024 | PNG | No | Cow Farm | Cow Farm gameplay background |
| `drive/backgrounds/fishing-pond.png` | 1536 × 1024 | PNG | No | Fishing | Reserved for Fishing Lake scene |
| `drive/backgrounds/chicken-farm.png` | 1536 × 1024 | PNG | No | Chicken | Reserved for Chicken Farm scene |
| `drive/backgrounds/sheep-farm.png` | 1536 × 1024 | PNG | No | Sheep | Reserved for Sheep Farm scene |
| `drive/backgrounds/beacon-loading.png` | 1672 × 941 | PNG | No | Loading artwork | Official loading/welcome visual |
| `drive/items/seed-bag.png` | 1312 × 1199 | PNG | Yes | Crop item | Draggable seed bag in Crop Farm |
| `drive/decorations/tree.png` | 1234 × 1274 | PNG | Yes | Decoration | Available for map composition |
| `drive/decorations/flower-bush.png` | 1536 × 1024 | PNG | Yes | Decoration | Available for map composition |
| `drive/decorations/path.png` | 1024 × 1536 | PNG | Yes | Decoration | Available for map composition |

## Drive intake rule

Never overwrite a provided original. Add approved source files under `public/assets/`, retain their original names in a `source/` folder when needed, then add the logical mapping in `src/game/config/assets.ts`. The project now includes the short CC0 Kenney Interface Sounds UI cues under `public/assets/audio/`; Web Speech remains the fallback for pronunciation because no approved animal/narration recordings were supplied.

## Outstanding assets

The official Map pack is now in use for the Main Farm, Crop Farm and Cow Farm. Additional original UI frames, item art and audio from Drive still need a scene-by-scene mapping; the game must not revert to generic rectangles for those scenes.
