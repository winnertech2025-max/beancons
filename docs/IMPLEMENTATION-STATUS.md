# Implementation status

## Phase 0 — audit

- [x] Read `Kịch bản.docx`, Project Overview and the continuation prompt.
- [x] Audit current scenes, data, assets and persistence.
- [x] Record script ambiguities without changing business rules.
- [ ] Browser end-to-end audit (local in-app browser bridge is unavailable in this environment).

## Phase 1 — core systems (in progress)

- [x] Add a 50-question core animal bank: 10 per cat/dog/cow/pig/duck, 25 Listen & Choose and 25 Image & Choose.
- [x] Add standalone validator, random selector and round score model.
- [x] Add versioned Zustand + LocalStorage state for stars, inventory, unlocks, character, purchases and activities.
- [x] Add character selection and bilingual opening dialogue.
- [x] Add a playable crop lifecycle: seed drag, water, pest, fertilize, 10-second carrot growth, harvest, inventory/star reward and Cow Farm unlock.
- [x] Add a playable Cow Farm: correct feed retry, bucket placement, five-tap milking, milk loading, inventory/star reward and downstream unlocks.

## Next implementation order

1. Replace the remaining legacy main-map marker navigation with the script zone map.
2. Build Fishing Lake and Memory Card from script data and unlock rules.
3. Build Chicken, Sheep, Delivery and Shop modules using the shared state.

The remaining script modules are not represented as complete simply because their UI may exist; each requires real interaction, data and persistence before completion.
