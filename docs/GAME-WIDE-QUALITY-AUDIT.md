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

---

## Re-audit — player-flow, script and UX/UI review (2026-11-17)

### Method and confidence

This is a fresh review against every requirement in `Kịch bản 2.docx` (not a review of the prior report). I inspected the current scene source, local assets, state/audio/navigation code, and ran the existing real-canvas pointer tests. A focused Fishing path passed: moving boat-girl → cast → reel → choose Fish → Level 2, with no console or genuine asset-request errors. The broad sequential suite was also started, but it stalled while beginning its Chicken run; it was deliberately stopped rather than being called a pass. This is recorded as a QA infrastructure defect below.

Statuses below mean:

- **Playable**: an interaction can be completed in the current build.
- **Partial**: some working interaction exists, but one or more required script beats are absent or materially changed.
- **Blocked**: content cannot honestly be called complete until the supplied asset/data or a product decision is available.

### Executive assessment

The project has many attractive supplied illustrations and several real interaction loops. It is **not yet script-complete** and should not be presented as such. The most serious risk is not a crash: it is that a child can enter a beautiful-looking area whose interaction has been simplified into generic buttons, uses the wrong supplied art, or silently changes the prescribed rule.

| Priority | Finding | Why this matters to a child/player |
|---|---|---|
| P0 | Sheep Farm replacement is not QA-complete and does not use the exact authored level assets for cutting/collecting/counting. | It currently substitutes a cow grass asset, a text basket and miniature sheep as wool; Level 2 is a click-three-times action rather than cutting along the authored path. |
| P0 | Fishing has only Levels 1–20; Level 18 is intentionally unavailable; Levels 21–40, 39k gate and obstacles do not exist. | The central 40-level promise ends early, and a child is sent back instead of playing Level 18. |
| P0 | Chicken Level 2 does not visually hide individual eggs in the authored locations and gives two eggs for every one of five invisible zones. | This is not the exploration/find-egg interaction specified in the script. |
| P0 | The full regression command currently hangs. | A passing build or one focused test cannot prove every game still works after changes. |
| P1 | Map hover highlights the sign, not the exact cropped farm area. | The user's request was for the whole illustrated area to glow; current large ellipse targets can feel inaccurate. |
| P1 | Global navigation/settings are incomplete. | No proper Settings/Achievement view or supplied Exit confirmation flow; audio is a small two-line split hit target. |
| P1 | Home, Shop and Crop remain materially short of their scripts. | Progression/economy and varied learning loops are not yet credible. |
| P2 | Art scale/typography consistency varies sharply by scene. | Supplied art is often strong, but generic `gameButton` rectangles and text compete with it and reduce polish. |

### Scene-by-scene review

| Area | What a real player can do now | Script compliance | Missing asset / content / defect | UX/UI observation | Status |
|---|---|---|---|---|---|
| Loading, Welcome, avatar, intro | Enter game, choose a child avatar, see one intro board, enter Map. | **Partial**: required three-part bilingual NPC narration, NPC disappearance and guided hand into garden are not all represented as a timed sequence. | Need exact hand/cursor asset wiring and dialogue-state flow. | Opening is visually stronger than generic scenes, but narrative handoff is abrupt. | Partial |
| Farm Map | Directly tap every zone; signs lift/glow on hover; shop opens. | **Product override**: all zones are open, rather than crop → cow → lake/home → chicken/sheep progression. | Exact transparent/silhouette overlays are not currently used as map hit/hover art. | The hit areas are broad ellipses. Hovering a farm gives a glowing label, not the requested illuminated farm boundary; it feels imprecise. | Partial |
| Crop Farm | Drag five seed packets to matching beds, water, drag net over pests, fertilise, wait, harvest. | **Partial**: core loop exists. Per-crop staged wait times (+5 seconds each), first-bed NPC tutorial, bag/inventory presentation, harvest axe/basket and warehouse selling are not complete. | Local crop art is large (50 MB) but not yet mapped into a complete multi-crop growth/harvest progression. | Stronger than earlier generic loop, but tool states still need clearer step affordance and less text-heavy instruction. | Partial |
| Cow Farm | Feed grass, vocabulary board, identify bucket, five touch taps, load ten bottles, START, reward. | **Partial**: several prescribed beats work. Vocabulary should be Cow/Grass/Hay/Flower; current implementation previously exposed `Eat` in trace history and must remain checked. The source turns 1 bucket into 10 bottles to satisfy the later delivery count, although script also says 1 bucket = 2 bottles. | Needs explicit product resolution for 2-vs-10 bottle contradiction. Needs supplied hand-touch/cursor asset in the actual rhythmic tap UI if present locally. | Object selection is clearer than old version, but `TOUCH BÒ` remains a generic button instead of the requested hand on cow. | Partial |
| Fishing Lake | Focused browser test passed using the supplied girl-in-boat: moving target, cast, reel, reveal, answer and next level. Incorrect answer retries. | **Partial**: Levels 1–17 and 19–20 data are wired. There is no random caught animal after cast (the target is fixed by level); no 21–40, paid unlock, payment/entitlement, obstacles, shoe joke, or obstacle-specific feedback. | Level 18 has no usable Squid answer card locally and is intentionally blocked. Exact Level 21–40 art/data must be imported and mapped. | Boat-girl asset is now correct. Answer cards scale only 2.5% on hover, which is reasonable; caught art and bottom answers must be re-checked on mobile for overlap. | Partial / blocked after Level 17 |
| Home / Memory | Choose Animals, Plants or Mixed; flip/match 4 then 6 cards; mismatch says “Oh no”. | **Partial**: 3 free themes exist. Required 4 themes + combined offering and 2 paid themes are absent. | `ĐỒ VẬT TRONG NHÀ` remains explicitly unavailable (`Chờ flashcard Drive`) in source; no local card mapping. Payment/entitlement is absent. | The theme menu uses a generic cow-banner for unrelated categories, weakening recognisability; cards otherwise have sensible modest hover. | Partial / blocked |
| Chicken Farm Level 1 | Learn Hen/Chick, answer Chick, drag corn, water, collect 10 eggs, select colour, colour egg, reward. Existing pointer test covers this end-to-end. | **Partial**: script loop is broadly present, but food vocabulary requires the child to click each item; only corn is draggable/correct, and egg appearance does not use the scripted 3-minute cadence. | Needs the client’s authored Level-2 chicken-coop background where intended, instead of a shared default backdrop. | Direct screenshot review: the chick is scaled dramatically larger than the hen and dominates most of the screen, reducing composition/readability. Text is legible but heavily duplicated across title/subtitle/heading. | Partial |
| Chicken Farm Level 2 | Start then tap 5 labelled regions; every region produces 2 eggs, reaching 10. | **Partial**: has five named regions and completion. Script itself conflicts between 16 hidden eggs and later repeated 10; current code uses 10. | Need client decision 10 vs 16; then place individual egg targets behind authored objects, wrong-area feedback, idle hint, basket animation/count per egg. | Labels expose every answer location and invisible rectangular zones are not exploratory. This is a major gameplay/UX mismatch. | Partial |
| Sheep Farm | Current uncommitted replacement offers Feed Sheep → Shear → Collect → Count → final. | **Partial and unverified**: flow reflects supplied Sheep flow chart, but it does not faithfully use the supplied scene-specific art/actions. | Partial local folder now contains all 14 named sections, but code references only a few and falls back to `/drive/cow/grass.png`; wool is rendered as sheep; basket is text; scissors action is a generic emoji/text button. | The minified one-line source is difficult to maintain and has not had a real pointer/browser test or screenshots. Do not merge/claim it complete yet. | P0: incomplete QA |
| Warehouse / delivery | Ready → female NPC → order → explore 9 shelf items → load selected goods → result; individual pointer regressions were previously authored. | **Partial**: it has a real 05:00 timer and four orders, but script/card quantities conflict. Current source intentionally follows selected Drive card rather than contradictory DOCX wording. | Supplied full Settings Exit board is not local; only the red `Exit.png` button was found previously. | Strong asset-backed screens, but timers and instructions create cognitive load; the home/back route is too easy to use as an accidental exit without confirmation. | Partial / decision required |
| Farm Shop / decor | Spend stars on a small fixed list; purchase persists. | **Partial**: only a basic purchase loop. Required categories, instant placement on avatar/map, vehicle skins/friends and purchase star-flight feedback are absent. | Needs catalog assets plus placement/state model. | Generic buy buttons and no preview/placement loop make it feel like a test menu, not a child’s creative decor shop. | Partial |
| Settings, audio, exit, achievements | Music/voice are separately toggleable by tapping upper/lower halves of a small top-right control. | **Partial**: audio separation exists; settings/achievement page and authored Exit confirmation are absent. | Vietnamese voice depends on OS having a Vietnamese speech voice. If unavailable, bilingual playback falls back to English only. | The control’s invisible upper/lower split is undiscoverable, especially on touch. It needs two explicit buttons or a settings popup. | Partial |

### Evidence-based defect log

| ID | Severity | Reproduction / evidence | Required correction |
|---|---|---|---|
| QA-20261117-01 | P0 | `npx playwright test …` broad run starts 10 tests but remains running beyond its intended per-test progression during Chicken; process was stopped. Focused Fishing test completed successfully. | Repair the suite lifecycle before relying on broad regression. Run each targeted test with a hard CI timeout and retain summary output. |
| QA-20261117-02 | P0 | `SheepFarmScene.ts` has no test; code uses cow grass fallback, a text basket and sheep art as wool. | Map every Sheep stage to supplied Sheep folder assets; implement drag scissors/path and wool-to-basket; add initial/wrong/correct/final/return pointer tests. |
| QA-20261117-03 | P0 | Fishing `LEVELS` contains 20 items only; Level 18 carries `unavailableReason`; no paid state/obstacle code exists. | Import/match assets Levels 21–40; add 39k entitlement gate and obstacle rounds only after payment design is approved. |
| QA-20261117-04 | P1 | FarmMap uses `this.add.ellipse(...)` for each region and tints/lifts sign artwork. | Use each client-supplied transparent farm-area crop as the hit sprite and attach glow filter/outline to that sprite, with pixel-appropriate bounds. |
| QA-20261117-05 | P1 | `ChickenFarmScene.playLevelTwo()` uses five invisible 220×170 zones and gives each exactly two eggs. | Use an authored Level-2 coop scene; distribute individually hidden eggs, expose only actual target regions, add wrong/idle hint logic. |
| QA-20261117-06 | P1 | Screenshot `test-results/artifacts/e2e-chicken-Chicken-Farm-c-41c69-ats-with-real-pointer-input-desktop/chicken-meet.png`. | Reduce chick display size and rebalance hen/chick baselines; reserve centre space for task copy rather than stacking title, subtitle and heading. |
| QA-20261117-07 | P1 | `MemoryHomeScene.ts` marks home and bonus themes unavailable; no payment implementation. | Import and map house flashcards; define exact free/paid theme list and purchase persistence. |
| QA-20261117-08 | P1 | `BaseScene.soundToggle()` uses pointer Y to choose Music vs Voice with no distinct visual targets. | Replace with explicit settings panel and separate large buttons; add Exit confirmation when source board is supplied. |
| QA-20261117-09 | P2 | Repeated generic `gameButton` appears in art-led Sheep/Crop/Shop flows. | Prefer the authored Drive buttons/panels, retaining procedural buttons only as temporary marked fallbacks. |

### Assets: what is actually local, versus what is not confirmed

I confirmed local Drive-imported areas for Cow, Crop, Chicken, Fishing, Memory, Map, NPC, Sheep and Warehouse. Size is not proof of use: Crop is ~50 MB, Sheep ~30 MB and Warehouse ~134 MB, yet several scenes still use only a small subset or fallbacks. The local Sheep folder now has named subfolders 1–14, so its current placeholder use is an implementation problem, not an asset-absence claim. In contrast, the Home scene itself still declares its house-card theme unavailable; its missing mapping must be fixed only after verifying its particular supplied folder is actually present locally.

### Recommended correction order

1. Stabilise the regression runner and add Sheep coverage; no more “completed” claims without this.
2. Finish Sheep from its 14 supplied folders and browser-QA every beat.
3. Correct Chicken Level 2 target design and visual scale; then complete its script conflict decision (10 vs 16 eggs).
4. Build Fishing 21–40/payment/obstacle design only with imported, verified cards; do not fill them with placeholders.
5. Replace map ellipse hover with the supplied cropped-area overlays.
6. Finish House themes/payment and Settings/Exit; then make Farm Shop actually place purchased decorations.

This report intentionally distinguishes unavailable content from supplied-but-unwired art. It is a QA baseline, not a claim that the listed issues are already fixed.

### Remediation status after the re-audit (2026-11-17)

The preceding table is the baseline captured before corrective work in this same quality pass. The following items were re-opened, corrected, and re-tested; they should not be read as still-open visual defects:

| Item | Current verified state | Evidence |
|---|---|---|
| Welcome branding | Replaced the generic `HAPPY FARM` heading with `BEACON ENGLISH`; subtitle remains bilingual and does not collide with the board. | Visual-audit capture `01-welcome.png`. |
| Memory locked packs | Re-centred the lower pair, reduced the title size for long labels, and raised contrast without making a locked item look playable. | Visual-audit capture `08-memory.png`. |
| Cow first task | Removed the low-contrast duplicate instruction that was drawn over scene art. The top bilingual line and the three lower food targets now form the single clear reading order. | `output/playwright/cow-feed-initial-final.png`; full real-pointer Cow regression passed. |
| Chicken opening | Reduced chick scale and heading density, then re-ran the full Chicken pointer flow. | `QA-SHEEP-009` in `docs/QA-REPORT.md`. |
| Sheep three-level flow | Replaced the old jump-only loop with Feed → Shear → Collect → Count → reward and verified it with real browser input. Exact grass/scissors/basket authored art is still a content-integration limitation, so this is **playable partial**, not falsely marked script-perfect. | `QA-SHEEP-009` in `docs/QA-REPORT.md`. |

The remaining P0/P1 script/content gaps above (Fishing 21–40/paywall/obstacles, exact Farm Map cropped-region glow, hidden Chicken Level-2 egg locations, Home paid decks and Settings/Exit) remain open and must not be presented as finished.

