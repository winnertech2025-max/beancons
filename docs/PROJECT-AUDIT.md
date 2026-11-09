# Happy Farm — Project audit

Audit date: 07 Nov 2026. This records the repository state before the script-led expansion. Status `PARTIAL` means code exists but has not passed an end-to-end browser test.

| Module | Current status | Existing implementation | Required action |
|---|---|---|---|
| React / Phaser shell | PARTIAL | One React host creates one Phaser game with FIT scaling and a portrait notice. | Keep; test responsive viewports after each scene expansion. |
| Loading / Welcome | PARTIAL | Boot loading bar and a Welcome scene exist. | Replace flow with character selection and bilingual introduction. |
| NPC / character | MISSING | No selected farmer or shared narrator state. | Add character choice and persisted narrator data. |
| Main Farm map | PARTIAL | Five marker map for legacy animal vocabulary. | Rework into script zones, locks and farm navigation. |
| Crop Farm | MISSING | No crop lifecycle, inventory or tools. | Implement first; it is the unlock gate in the script. |
| Cow Farm | MISSING | Cow is only a vocabulary/quiz picture. | Add feed, milk and truck stages. |
| Fishing Lake | MISSING | No fishing loop or 40-level data. | Implement data and progressive gameplay after core systems. |
| Memory cards | MISSING | No deck or matching game. | Add data-driven card scene. |
| Chicken Farm | MISSING | No chicken interactions, eggs or colouring. | Add after lake/home unlock path. |
| Sheep Farm | MISSING | No jump-count game. | Add data-driven rounds. |
| Delivery | MISSING | No orders, timer, drag/drop or inventory linkage. | Add once inventory is live. |
| Farm Shop | MISSING | No ownership or purchase logic. | Add fixed-price first items only. |
| Question Bank | BUG / PARTIAL | Legacy scene hard-coded five animals despite script needing an extensible bank. | Replace with validated data, selector and scoring model. |
| Audio | PARTIAL | Web Speech API wrapper exists. | Keep as fallback; centralize bilingual queue and audio availability checks. |
| Progress / stars | PARTIAL | LocalStorage stores limited stars/learned animals. | Migrate to versioned game progress, inventory, unlocks and purchases. |
| Assets | PARTIAL | Local map/clouds and five animal PNGs exist; no supplied crop/cow/fishing/chicken audio/UI pack in the repository. | Keep originals, inventory Drive intake, mark asset-bound content honestly. |

## Constraints discovered

- This directory is not a Git working tree, so branch/remote/commit verification and push cannot be performed here.
- The linked Drive folder is public and can be enumerated/downloaded, but bulk requests may be throttled. No Drive file has been substituted for an existing local original without an explicit logical mapping.
- `cow.png`, `pig.png` and `duck.png` are opaque PNGs in the local package. They must not be presented as transparent art in the asset audit.
