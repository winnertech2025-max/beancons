# Happy Farm — Game-wide quality audit

**Audit date:** 2026-11-08  
**Scope completed:** all local TypeScript scenes, state/systems, local assets, the supplied script, and Project Overview.  
**Not yet complete:** browser interaction/screenshots for every scene; this remains a Phase F deliverable and must not be inferred from this audit.

## Product flow: script versus current source

| Script area | Current source route / state | Current implementation | Quality / delivery state |
|---|---|---|---|
| Loading | `App.tsx` video + `BootScene` | MP4 plays while Phaser preloads; Boot waits for video completion or fallback. | Partial; direct browser retest required for exact five-second sequence and fallback. |
| Welcome | `WelcomeScene` | Supplied farm artwork, notice board and cow-banner CTA assets. | In active visual QA; text placement and contrast were recently corrected, final screenshot retest pending. |
| Farmer choice | `AvatarScene` | Girl/boy Drive PNGs, persisted selection and Intro route. | In active visual QA; transparent portraits no longer use white cards, screenshot retest pending. |
| NPC introduction | `IntroScene` | Bilingual prompt and selected NPC pose; one confirmation CTA. | Partial; only first dialogue beat is implemented, not the script's follow-up dialogue/animated guide. |
| Main Farm / unlocks | `FarmMapScene` | Crop entry and Cow unlock after crop completion. | Partial; generic buttons, does not represent all script zones, guided hand, warehouse/settings/shop, or progressive zone map. |
| Crop Farm | `CropFarmScene` | Seed drag, water, pest action, fertilize, 10-second growth, harvest, inventory/star unlock. | Partial playable loop; pest/harvest art and several interactions still use temporary controls rather than matching supplied assets. |
| Cow Farm | `CowFarmScene` | Feed choice, bucket placement, tap milking, load two bottles, reward/unlock. | Partial playable loop; food, bucket, truck and bottles are primitive drawings; script calls for richer object interactions and delivery feedback. |
| Vocabulary | `VocabularyScene` | Five-animal learning card and speech synthesis. | Partial legacy/MVP flow; opaque cow/pig/duck artwork is presented in a dark photo frame and needs asset treatment. |
| Quiz | `QuizScene` | Data-driven bank, random round/options, retry/no duplicate score. | Functional core; answer presentation and feedback still use generic UI components. |
| Results | `ResultScene` | First-attempt score, star award and replay/back. | Partial; generic graphics, no supplied result/reward artwork. |
| Fishing Lake | No scene registered | Background is present in assets only. | Missing. 40-level script data, catch mechanic, obstacle/free/paid policy and valid approved vocabulary are not implemented. |
| Memory Home | No scene registered | No deck, level data, matching logic or route. | Missing. |
| Chicken Farm | `ChickenFarmScene` via Farm Map after Lake + Home | Stage 1 is playable: touch Hen/Chick to hear the words, then answer “Where is the chick?”. Uses supplied transparent Hen/Chick art and actual retry/success feedback. | Partial. Feeding, egg collection, colouring and Level 2 remain unavailable until their matching food/egg/colour assets are supplied. The 16-versus-10 egg conflict remains recorded in `SCRIPT-ISSUES.md`. |
| Sheep Farm | No scene registered | Sheep Farm background exists. | Missing. |
| Farm Delivery | No scene registered | Inventory state can support it, but no order/timer/drag delivery scene. | Missing. |
| Farm Shop / decor | No scene registered | Stars and owned-item state exist, but no catalog/shop/decor placement. | Missing. |
| Pause / settings / achievements | Shared sound toggle only | Sound persists. | Missing as explicit screens; settings, achievements, home and pause experience are incomplete. |

## Shared systems audit

| System | Observed state | Required follow-up |
|---|---|---|
| Question bank | 50 authored Cat/Dog/Cow/Pig/Duck records, validator, selection for 5/10/15/20, retry scoring. | Add type-specific rendering only as supported by approved audio/art; test selector/scoring in browser and unit tests. |
| Progress / save | Zustand + LocalStorage v3 holds avatar, stars, inventory, unlocks, owned items and completion events. | Add migration/error QA and ensure every future minigame writes idempotent rewards. |
| Audio | English Web Speech fallback, persisted mute state, and short UI feedback cues. | Kenney Interface Sounds CC0 has been imported for tap, select, drop, tick, success, and error. Animal/narration recordings are still missing; retain Web Speech as their fallback. |
| Common UI | `BaseScene`, `GameButton`, `AnimalCard` contain generic rectangles/text panels. | Phase B must replace or restrict these to states where no supplied UI asset exists. Avoid applying one template to all minigames. |
| Responsive | Phaser FIT world 1536×1024; HTML portrait rotate notice. | Browser-test desktop, tablet landscape and portrait notice for every finalized scene. |

## Highest-priority quality gaps

1. Complete the visual QA and interaction test of Loading → Welcome → Avatar → Intro → Farm Map before declaring the core experience complete.
2. Establish an asset-backed design system: readable typography, navigation, panels only when required, feedback, and safe anchor zones. Reuse Drive UI/transparent assets first.
3. Replace temporary drawn objects in Crop and Cow with matching supplied assets where they exist; record exact missing source art where they do not.
4. Build missing script modules one at a time, with their actual gameplay loops and QA evidence — Fishing/Memory only after their unresolved script data is handled without invention.
5. Do not characterize the current product as a completed game: six major scripted modules do not yet have registered scenes.

## Phase status

- **Phase A — source/script/local asset audit:** complete with the limits stated above.
- **Phase B onward:** not complete. Each phase must use `.agents/skills/happy-farm-quality/SKILL.md`, build, browser-test, inspect screenshots, and update `docs/QA-REPORT.md`.

