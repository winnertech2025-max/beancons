# Happy Farm — local asset mapping

This is an evidence-based mapping of files currently present in `public/assets`; it does **not** claim that un-downloaded Google Drive folders were inspected. Original Drive files are treated as read-only source assets.

| Asset group | Files / properties | Current use | Best valid next use | Status |
|---|---|---|---|---|
| World backgrounds | `drive/backgrounds/{farm-overview,crop-farm,cow-farm,fishing-pond,chicken-farm,sheep-farm}.png`, all 1536×1024, opaque | Welcome, Avatar, Intro, Farm Map, Crop, Cow use the first three. | Fishing, Chicken and Sheep scenes when their real gameplay is built. | Three used; three reserved. |
| Loading | `kling_20261108_VIDEO_Animate_th_4110_0.mp4` (4,812,054 bytes) and `beacon-loading.png` 1672×941 | Native video is the loading visual; static PNG is fallback artwork. | Keep MP4 full-screen without an extra synthetic loader; test video-error fallback. | In use / QA pending. |
| Drive UI | `notice-board.png`, `cow-banner.png`, `check.png`, `help.png`, `star.png`, `sound-{on,off}.png`, `arrow-left.png`, `home.png` — alpha PNGs | Welcome uses board/banner/check/help/star; shared navigation uses arrow/sound. | Replace common generic controls only where their art fits without covering essential artwork. | Partially used. |
| NPC poses | 8 girl poses, 6 boy poses, all alpha PNGs | Avatar and Intro use a subset. | Success/failure/help reactions in remaining scenes. Preserve alpha: no generic white card/background behind a portrait. | Partially used. |
| Crop tools/items | `seed-bag.png`, `watering-can.png`, `garden-fork.png` — alpha PNGs | Crop seed/water/fertilize flow. | Use matching real insect net, pest, harvest basket/sickle only if source assets are imported. | Partially used. |
| Decorations | `tree.png`, `flower-bush.png`, `path.png`, `bush.png`, `sunflower.png` — alpha PNGs | Declared but not visibly layered in the core scenes. | Scene-specific foreground/depth layers where they improve composition; avoid blanket decorative overlays. | Available. |
| Chicken Farm (imported 2026-11-08) | `drive/chicken/{chick,hen,hen-happy,feed-trough,water-trough,nest,bush-a,bush-b,bush-c,sunflower,item-6039,item-6040,item-6046}.png`; all verified alpha PNGs | Declared in the asset manifest for the Chicken scene. | Recognition, feeding/drinking, egg-nest and environmental composition. | Imported; scene not yet implemented. |
| Vocabulary animals | `animals/{cat,dog,cow,pig,duck}.png`, 1536×1024; Cat/Dog alpha, Cow/Pig/Duck opaque | Vocabulary and Quiz. | Obtain approved transparent variants for Cow/Pig/Duck before using them as cut-outs. Do not add a fake frame to disguise an opaque background. | Used with limitation. |
| Legacy map/clouds | `backgrounds/farm-map.png`, cloud layers | `BaseScene.sky()` legacy learning/quiz screens. | Keep only where it matches the particular scene; do not use as a universal fallback background. | Used. |
| Audio | `public/assets/audio/` | Kenney Interface Sounds CC0: tap, select, drop, tick, success, error, and bong cues. | Keep Web Speech for word pronunciation until approved animal/narration audio is supplied. Licence retained as `LICENSE-KENNEY-INTERFACE-SOUNDS.txt`. | Partial: UI feedback is available; narration/animal recordings are missing. |

## Cow Farm / Level 1 asset gap (verified 2026-11-08)

Available and now used: transparent `grass`, `hay`, and farm vehicle artwork from the shared Drive, plus the Cow Farm background which contains the three cows.

Drive map intake also found a suitable illustrated **Warehouse/Barn** map. It is now the delivery backdrop for the milk-loading beat; no separate illustrated milking-room map exists in the supplied set.

Required before the milk-and-delivery half can meet the same standard (do not replace these with coloured rectangles):

- transparent **milk bucket** (empty and/or filling state); the current art-backed label is logic-only;
- transparent **milk bottle/can** (one image is sufficient; it can be instanced ten times); the current white bottles are logic-only;
- transparent **tap/hand prompt** for the rhythmic milking interaction;
- transparent **delivery truck** with a visible cargo bed (the available Drive vehicle is a tractor, not a delivery truck);
- transparent **Little Farmer trophy/cup**;
- optional transparent happy/chewing cow pose, if the feeding reaction should be character animation rather than stars/copy only.

## Confirmed missing or unresolved source art

- **Chicken Level 2:** a separate transparent egg asset (not eggs baked into a nest) is required for the script's 10/16 individual hidden-egg interactions and fly-to-basket animation.
- **Chicken colouring:** an egg colouring base plus an approved palette/paint feedback art is required; it was not found in the Chicken Drive folder root.
- **Chicken feeding list:** the script names cabbage, grain, straw and flowers; a clear individual asset for each selectable food was not identified in the folder root. Do not substitute unrelated objects as final answer art.

## Asset-first implementation gate

Before adding any visible object, panel, icon, animal, or character:

1. Search the mapping and `public/assets` for a semantically matching original.
2. Inspect its dimensions and alpha channel rather than assuming it is a cut-out.
3. Use the source asset at a compositionally appropriate scale; do not distort it or cover its occupied artwork with text.
4. If no source exists, record the missing asset in the scene's QA row. A temporary primitive may only communicate a functional target during implementation; it cannot be called final art.

# Flashcard / Ngôi nhà update — 2026-11-08

| Source | Local asset | Used by | Purpose | Status |
|---|---|---|---|---|
| Flashcard root `BE107...` | `public/assets/drive/memory/flashcard-back.png` | Ngôi nhà | Approved Beacon English **card back** | In use |
| Flashcard → Động vật → Level 2 | `memory/animal-l2-1..4.png` | Ngôi nhà → Động vật | Cow, Pig, Chicken, Goat fronts | In use |
| Flashcard → Thực vật → Level 2 | `memory/plant-l2-1..3.png` | Ngôi nhà → Thực vật / Tổng hợp | Pumpkin, Tomato, Carrot fronts | In use |
| Flashcard → Đồ vật trong nhà | — | Ngôi nhà → Đồ vật trong nhà | The supplied Drive folder was empty when inspected | Missing — the game labels this set as awaiting flashcards rather than substituting made-up art |

