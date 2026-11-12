# Happy Farm — QA report

## Test environment

- Date: 2026-11-08
- Browser: Brave Chromium at `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`
- Automation: Playwright Test 1.65.0
- Desktop viewport: 1536×1024
- Test command: `npm run test:e2e`

## Results

| ID | Script area | Steps | Expected | Actual | Status | Evidence / follow-up |
|---|---|---|---|---|---|---|
| QA-BOOT-001 | Loading | Open localhost; wait for MP4 readiness or the explicit unavailable state; then enter Welcome | Full-screen MP4 plays for five seconds where autoplay works; a blocked media element must not strand Boot. | Direct Brave run observed MP4 playing (`paused: false`, `readyState: 4`). In Playwright's media-limited context the 7-second watchdog explicitly sets `unavailable`, then Boot reaches Welcome. | PASS | Regression: `npm run test:e2e` passed on 2026-11-08. The fallback is deliberate, not a synthetic loading bar. |
| QA-WELCOME-001 | Welcome | Wait for Welcome at 1536×1024; inspect screenshot; click the supplied-art start banner | Menu is readable; primary CTA clearly visible; art does not obscure controls; click enters Avatar. | Replaced unreliable `Baloo 2` labels with canvas-stable Nunito for this screen. Board heading and both banner labels are readable and stay in the clear centre area; actual click changes `Welcome` to `Avatar`; no console or failed-request errors. | PASS | `test-results/artifacts/e2e-welcome-Happy-Farm-ope-88056--and-starts-the-avatar-flow-desktop/welcome.png`; `npm run test:e2e` passed. |
| QA-TOOL-001 | QA infrastructure | Run `npm run test:e2e` | Browser test starts with screenshots and trace on failure | Playwright starts Brave, serves localhost, captures screenshot and trace. Playwright's bundled Chromium and ffmpeg cannot install on macOS 12; config uses installed Brave and disables Playwright video recording. | PASS | `playwright.config.ts`, `tests/e2e/welcome.spec.ts` |
| QA-MAP-001 | Farm Map | Follow the real flow Welcome → Avatar → Intro → Farm Map at 1536×1024; inspect map and tap Crop Farm hotspot | Supplied map art fills the screen; no detached bottom CTA; Crop hotspot enters Crop Farm. | Replaced the generic bottom buttons and dark HUD with the supplied Map artwork, direct map hotspots, art-backed star/sound controls and scripted unlock labels. Actual browser tap entered Crop Farm; no console errors. | PASS | `/tmp/happy-farm-map-redesign.png`; executed 2026-11-08 with Brave + Playwright. |
| QA-CROP-001 | Crop Farm lifecycle | Enter from the Farm Map; drag seed bag to carrot bed; water; remove pests; fertilize; inspect the 10-second growth timer; harvest. | Supplied art is used for the seed/tool controls; each step gives feedback; the script's 10-second crop timer is readable and reaches harvest. | Correct seed drag advances; wrong drop returns the bag with an error cue; tool actions have press feedback; success has star particles and CC0 short cues. The timer has a labelled 10→0 second countdown and fill in a farm-styled frame, not a fake loading bar. | PASS | `/tmp/hf-crop-seed-current.png`, `/tmp/hf-crop-timer-current.png` (observed at 6 seconds); Brave interaction run and `npm run build` on 2026-11-08. |
| QA-INTRO-002 | Introduction | Complete Welcome and avatar choice; inspect Intro and activate the start action. | The narrator, bilingual copy, and next action are clear without a generic rectangle/card. | The supplied notice-board contains the direct transparent NPC, high-contrast bilingual copy, and art-backed start banner. Screenshot inspection found no overlaps; actual CTA enters Farm Map. | PASS | `/tmp/hf-intro-current.png`; Brave interaction run on 2026-11-08. |
| QA-RESP-001 | Portrait guard | Load at 390×844. | A landscape game must not crop interactive UI in portrait. | The intentional rotate-device guard is shown, has readable Vietnamese copy, and produced no console error. | PASS | `/tmp/hf-welcome-mobile-current.png`; Brave 390×844 run on 2026-11-08. |
| QA-COW-001 | Level 1 — Feed the Cow | Navigate through the real map to Cow Farm; drag hay to the cow (wrong); drag grass to the cow (correct); inspect the vocabulary board. | Three supplied-art food choices are readable; wrong choice retries gently; grass succeeds and opens Cow/Grass/Hay/Eat vocabulary. | Grass, hay, and flowers are transparent artwork, not colour cards. Wrong hay played the retry state; correct grass produced speech/SFX/star feedback and opened the clickable bilingual vocabulary board. No console errors or failed asset requests. | PASS (feeding beat) | `/tmp/hf-cow-feed-fixed.png`, `/tmp/hf-cow-vocabulary-fixed.png`; Brave desktop run on 2026-11-08. The milk/delivery beat remains blocked by the listed transparent source assets. |
| QA-COW-002 | Level 1 — Milking and delivery logic | Continue after vocabulary; drag the bucket cue below the cow; tap the cow five times; inspect the warehouse delivery screen. | The flow advances from bucket placement to five-tap milking and then to milk loading in a relevant supplied scene. | Replaced the non-functional “Đang chuẩn bị…” overlay. Bucket placement and five-tap rhythm advance to the imported Warehouse/Barn delivery map; browser path reported no console error. Temporary bucket/bottle representations are explicitly recorded until supplied PNGs replace them. | PARTIAL | `/tmp/hf-cow-milking-logic.png`, `/tmp/hf-cow-load-logic.png`; Brave desktop run on 2026-11-08. |
| QA-PROGRESS-002 | Reset and replay | Seed a completed Cow Farm state; complete the normal opening navigation to Farm Map; tap “Chơi lại từ đầu”. | Saved stars, avatar, inventory, rewards, completions, and later unlocks clear; player returns to Welcome. | State after click was `stars: 0`, `avatar: null`, empty inventory/rewards/completions, only default Crop Farm unlocked; active scene was Welcome. Cow completion also provides a separate “Chơi lại Level 1” action. | PASS | Brave desktop run on 2026-11-08; production build passed; no console error. |
| QA-UNLOCK-001 | Post-Cow unlock | Seed Farm Map state with `fishing-lake` and `memory-home` unlocked, then tap each map hotspot. | Lake and Home hotspots enter real scenes rather than a dead route. | Lake opened Fishing Level 1 with supplied pond/fish artwork; Home opened a four-card Cow/Pig memory round using supplied flashcards. No console errors. | PASS | `/tmp/hf-fishing-l1.png`, `/tmp/hf-memory-l1.png`; Brave desktop run on 2026-11-08. |
| QA-UNLOCK-002 | Existing completed saves and Fishing progression | Seed a save containing only `cow-farm` completion; enter Map; open Lake; answer Level 1 correctly. | Existing save is migrated to both unlocks; correct catch advances to Level 2, not Farm Map. | Save gained `fishing-lake` and `memory-home` on Map open. Correct `Fish` answer remained in Fishing Lake and displayed `LEVEL 2 · 2/20 miễn phí`; no console errors. | PASS | `/tmp/hf-fishing-level2.png`; Brave desktop run on 2026-11-08. |
| QA-HOME-002 | Ngôi nhà — flashcard themes and Levels 1–2 | Open the real Memory scene; choose Động vật; intentionally select a non-matching pair; exhaustively pair the four cards; tap the Level 2 CTA. | Use the approved Beacon English card back and supplied Drive flashcard fronts; wrong pair remains in the game and gives “Oh no”; Level 1 shows 4 cards, then Level 2 shows 6. | Theme screen uses Animal, Plant and Mixed free sets. The Animal Level 1 round showed four genuine Cow/Pig cards, did not exit after a wrong pointer pair, then displayed the `LEVEL 2 · 6 THẺ` CTA. Pointer activation entered a six-card Level 2 round. No console errors or failed requests. | PASS | `/tmp/hf-memory-themes.png`, `/tmp/hf-memory-l1-complete.png`, `/tmp/hf-memory-animal-l2.png`; Brave desktop run on 2026-11-08. `Đồ vật trong nhà` is deliberately unavailable because its provided Drive folder is empty. |
| QA-BRAND-001 | Browser identity | Open the real Vite game and inspect document metadata plus the requested PNG resource. | The browser tab identifies Beacon English and the favicon resolves to Beacon English art without breaking Boot. | `document.title` was `Beacon English · Happy Farm`; `/beacon-english-icon.png` returned 200; Boot reached Welcome. No console errors or failed requests. | PASS | Brave desktop run on 2026-11-09; `npm run build` and `npm run test:e2e` passed. |
| QA-DEPLOY-001 | Vercel production | Open `https://happy-farm-web-game.vercel.app`, wait through the loading handoff, and inspect browser metadata and the deployed favicon resource. | Production deployment is ready; browser identity remains Beacon English; no failed browser requests. | Deployment was Ready. Production title was `Beacon English · Happy Farm`; `/beacon-english-icon.png` returned 200; no console errors or failed requests were observed. | PASS | Brave desktop run on 2026-11-09. |
| QA-COW-003 | Kịch bản 2 — chọn xô, vắt sữa và bình sữa | Start the Cow Farm; feed grass; open vocabulary; continue to the supplied selection board; choose one incorrect object then Bucket; tap the cow five times; inspect the delivery scene. | Wrong object retries in the minigame; choosing Bucket makes the supplied bucket appear beside the cow; a full bucket is shown after five taps; delivery uses real bottle art. | Actual browser pointer test remained in Cow Farm after a wrong Chair selection. Correct Bucket opened the updated scene with bucket beside the cow. Five taps showed the provided full-bucket artwork before entering delivery, where both bottles were supplied PNGs. No console errors or failed requests. | PASS | `/tmp/hf-cow-bucket-choice.png`, `/tmp/hf-cow-bucket-placed.png`, `/tmp/hf-cow-milking-full.png`, `/tmp/hf-cow-load-bottles.png`; Brave desktop run on 2026-11-09. The script's 2-vs-10 bottle count is documented as unresolved. |
| QA-AUDIO-001 | Background music | Build and run the opening-flow regression after adding `nhacnen.mp3` start-on-first-gesture logic. | One looped background track starts only after a user gesture and follows the global sound toggle; opening flow remains intact. | Production build and opening-flow Playwright test passed. Browser automation cannot inspect the detached `Audio` instance's playback state, so headset/speaker listening remains required before audio mixing sign-off. | PARTIAL | `npm run build`, `npm run test:e2e` passed on 2026-11-09. |
| QA-BOOT-002 | Fixed-duration video opening | Open local game at 1440×900 and 390×844; inspect the video box at start; wait 5.4 seconds; inspect active scene and browser errors. | The supplied MP4 fills the viewport without distortion, then is removed at five seconds even when media events fail; Boot proceeds to Welcome without a stuck Loading state. | At desktop the video bounding box was exactly `0,0,1440,900`; at portrait it was `0,0,390,844`. After the independent five-second watchdog: video element count was `0`, loading state was `complete`, active scene was `Welcome`; portrait then showed the intentional rotate notice. The deployed production alias repeated the desktop result with no console errors or failed requests. | PASS | `/tmp/hf-loading-cover.png`, `/tmp/hf-loading-finished.png`; Brave + Playwright local and production (`https://happy-farm-web-game.vercel.app`) runs on 2026-11-09; `npm run build` passed. |
| QA-BOOT-003 | Uncropped loading artwork | Open the real local game at 1536×1024 and 390×844 during the opening video; inspect its media dimensions, computed fit, screenshot, handoff, console and requests. | The supplied loading artwork remains whole at any aspect ratio, with no distortion or cropped logo; it exits after five seconds. | Source media measured `1284×724`; the rendered video uses `object-fit: contain` within the viewport at both tested sizes. The deliberate static blurred surround fills only unused letterbox space; the art itself remains sharp and complete. At desktop the sampled frame cadence was p50 `16.70 ms`, p95 `16.80 ms`; no console or asset failures. | PASS | `/tmp/hf-loading-contained.png`, `/tmp/hf-loading-mobile-contained.png`; Brave + Playwright, 2026-11-11. |
| QA-INTRO-003 | Greeting hierarchy | Open Intro after opening flow, inspect title/copy/CTA at 1536×1024, then invoke the CTA route. | “Xin chào” is the immediate visual heading; copy is readable without overlapping the NPC, board decoration or action. | The supplied notice-board now has a large `XIN CHÀO, BÉ YÊU!`, concise Vietnamese/English hierarchy and the existing art-backed CTA; screenshot had no overlap or console/request error. | PASS | `/tmp/hf-intro-greeting.png`, `/tmp/hf-intro-real-flow.png`; Brave inspection, 2026-11-11. |
| QA-CROP-002 | Watering feedback and current crop copy | Enter Crop Farm, complete the real seed drag, press the watering can and inspect the action state. | The updated seed bag is used from the supplied path; watering visibly communicates the action; instructions change as the script phase changes. | Seed drag advanced to watering. Tapping the supplied watering-can art emitted one bounded, short water-droplet burst and proceeded to the pest beat; no console or failed-asset request. The English/Vietnamese instruction updates per stage instead of keeping the seed instruction visible. | PARTIAL | `/tmp/hf-crop-water-ready.png`, `/tmp/hf-crop-water-action.png`; Brave + Playwright, 2026-11-11. A transparent pest/caterpillar asset is not present locally, so the catch-pest beat is not falsely marked complete. |
| QA-PERF-001 | Opening responsiveness | Measure a 180-frame requestAnimationFrame sample at Intro; open Crop and Fishing after Boot; audit boot asset scope. | Main flow should not load minigame art or all fishing lessons before the child chooses a zone. | Boot now loads only the opening/map assets. Crop, Cow, Memory and Fishing load their own supplied art on entry; Fishing additionally streams only the active round’s cards. This removes the 57 Fishing cards (~22 MB) plus unrelated minigame art from the first load. A 180-frame Brave sample at Intro returned p50 `16.70 ms`, p95 `16.80 ms`, max `16.80 ms`; Crop and Fishing both opened with no browser errors or failed requests. | PASS (desktop sample) | `/tmp/hf-fishing-streamed.png`; Brave + Playwright at 1536×1024, 2026-11-11. `npm run build` and `npm run test:e2e` passed. Further device profiling remains required for low-end physical phones. |

## Rules for the next change

1. Do not mark a scene complete after `npm run build` alone.
2. Run its Playwright case, inspect the screenshot and record the outcome here.
3. Keep a failed test failed until a rerun produces evidence of the fix.
4. Search and inspect supplied Drive/local art before drawing UI or gameplay objects. Alpha PNG art must not receive a decorative card/background unless it is an explicit interaction state.
| QA-FISH-003 | Fishing Lake script alignment | Open Fishing Lake with the real scene at 1536×1024; inspect Level 1 before casting; inspect supplied per-level art loading and dual audio controls. | The rod begins at lower-right, moves farther/faster as levels rise, catches are hidden until the player casts then reels, and each free level has Drive artwork. Music and voice controls work independently. | Imported all 57 PNGs found in the supplied Level 1–20 Drive folders. Level 1 inspection shows only the moving rod before a catch and separate `NHẠC` / `GIỌNG` controls. The catch is generated only after the two-step cast/reel action, with random reveal approach. Build passed and no browser console or asset request errors occurred during scene open. | PARTIAL | `/tmp/hf-fishing-rod.png`; 2026-11-09. Remaining QA: complete pointer-driven cast/reel/retry/Level-2 regression after the moving control's screen-coordinate test harness is updated. |
# QA-CHICKEN-001 — Chicken Farm stage 1

**Date:** 2026-11-11
**Scope:** `ChickenFarmScene`, Farm Map unlock route, desktop and mobile portrait behavior.

| Check | Result | Evidence |
|---|---|---|
| Production build | PASS | `npm run build` passed after scene registration. |
| Initial screen | PASS | Supplied Chicken Farm background plus transparent `hen.png` and `chick.png` render without opaque cards: `/tmp/hf-chicken-meet.png`. |
| Learning interaction | PASS | Real pointer flow touched Hen then Chick and advanced to authored prompt: `/tmp/hf-chicken-question-retry.png`. |
| Retry and success | PASS | Wrong Hen choice keeps the round active and speaks “Try again”; correct Chick produces success copy and Farm return control: `/tmp/hf-chicken-success.png`. |
| Unlock / exit route | PASS | With both persisted activities (`fishing-lake`, `memory-home`) complete, real pointer click on the Chicken zone opened `ChickenFarm`; the success return action was exercised back to `FarmMap`. |
| Console / assets | PASS | Headless Brave interaction run reported `consoleErrors: []`, `failed: []`; all four Chicken scene requests returned 200. |
| Mobile portrait | PASS | At 390×844, the intentional rotate-to-landscape instruction is visible; no console/asset errors. Evidence: `/tmp/hf-chicken-mobile.png`. |

**Known scope limit:** This verifies only the first script beat. There is no original transparent cabbage/rice feed art, egg asset/state series, basket, or colour palette in `public/assets`; feeding, egg collection, colouring and Level 2 remain unimplemented rather than being replaced by fabricated UI.

# QA-FISH-004 — Fishing Lake corrective regression

**Date:** 2026-11-12
**Scope:** supplied Level 1–20 card mapping, moving cast control, Level 2 wrong/correct answers, map hover/click target.

| Check | Result | Evidence |
|---|---|---|
| Production build | PASS | `npm run build` passed after the round-map and interaction changes. |
| Moving cast target | PASS | Real browser pointer samples at Level 1 recorded distinct valid-water positions including `(1110,690)`, `(949,548)` and `(770,390)`. The route selects a new random water point after each leg; later levels widen the candidate set and shorten travel duration. |
| Two-step fishing interaction | PASS | Real pointer clicks on the moving `THẢ CẦN` control, then `KÉO CẦN`, showed the catch only after reeling; a correct Fish answer advanced to Level 2. |
| Level 2 answer/retry | PASS | The caught asset is `l02-1` (Frog); the visibly labelled Frog answer is mapped to `l02-2`. A real click on Eel retained the Level 2 round; a real click on Frog advanced to `HỒ NƯỚC · LEVEL 3`. The cast instruction is hidden once answers appear. | `/tmp/hf-fishing-level2-clean-hud.png`, `/tmp/hf-fishing-level3-after-frog.png` |
| Card scale | PASS | Answer cards render at `226×151`; hover peaks at `1.025` and active tweens are cancelled before a new hover transition, preventing the previous oversized/stuck state. |
| Farm map zones | SUPERSEDED | The former ellipse glow was functional but did not match the artwork silhouette, so it was removed rather than retained as a false-quality hover state. Direct illustrated-zone tapping remains verified. | See `QA-MAP-002`; exact zone PNG overlays are required for the intended glow. |
| Crop result readability | PASS | The generic rectangle was replaced by the supplied notice-board art; the full real Crop lifecycle (drag → water → pest → fertilise → 10-second timer → harvest) was replayed. The final overlay hides stale task copy and keeps its success hierarchy readable. | `/tmp/hf-crop-reward-board-fixed.png` |

**Open asset limitation (not hidden):** the repository and the previously supplied Fishing Drive folder contain the 20 level folders/cards, but no standalone transparent asset of the girl sitting in a boat. The fishing rod remains a compact temporary interaction control until the exact parent Drive folder/file URL for that PNG is supplied. Level 18 has Cuttlefish art but no matching Squid answer card, so it is deliberately marked unavailable instead of teaching the wrong word.

# QA-MAP-002 — remove incorrect temporary hover outline

**Date:** 2026-11-12

| Check | Result | Evidence |
|---|---|---|
| Map click target | PASS | With Lake unlocked, a real pointer click on the illustrated Lake area entered `FishingLake`; no console or failed-request errors. | `/tmp/hf-map-no-false-outline.png` |
| Exact visual hover outline | BLOCKED | The earlier ellipse was visibly misaligned with the farm illustrations and has been removed. No transparent per-zone overlay/silhouette PNG exists in the local workspace, so a substitute outline is intentionally not drawn. | Requires the client’s exact Drive folder/file link or files synced to `public/assets/drive/map-zones/`. |

# QA-COW-004 — Kịch bản 2 delivery correction

**Date:** 2026-11-12
**Scope:** Cow Farm Stage 2 delivery, bilingual narration, stock persistence and supplied Drive art.

| Check | Result | Evidence |
|---|---|---|
| Truck arrival | PASS | The supplied transparent truck drives in from the left and stops in the barn before the loading instruction is enabled. It has a bounded blinking lamp and does not rely on a fabricated vehicle. | `/tmp/hf-cow-truck-arrival.png` |
| Ten bottle interactions | PASS | Real pointer drags loaded all ten supplied `bottle-milk.png` assets. The counter reached `10 / 10`; START was withheld until the final bottle. The bottle tween retains its texture's base scale, avoiding the oversized-card regression. | `/tmp/hf-cow-ten-bottles-scale-fixed.png` |
| Departure and reward | PASS | A real START tap runs the truck bounce/light/horn cue then exit. The final screen displayed Little Farmer; persisted game state recorded `inventory.milk: 10`, one star, Cow Farm completion and both Lake/Home unlocks. No console errors in the interaction run. | `/tmp/hf-cow-delivery-finish-ten-bottles.png` |
| Bilingual order | PASS (implemented) | Cow narration now calls English then Vietnamese for hunger, food names, find/retry/success, bucket, milking, truck, counting and goodbye. Chicken meet/retry/success, Crop harvest, Fishing catch/retry and Memory pair/retry narration now follow the same ordering. Actual Vietnamese speech requires a Vietnamese system voice; the browser never sends Vietnamese text to an English voice. |

**Asset audit:** no newly synced cursor/hand-touch PNG was present in `public/assets/drive` at this test time, so no fake hand was added. The supplied seed bag is already used by Crop Farm; its updated file will be used automatically when it replaces `public/assets/drive/items/seed-bag.png`. The provided second Chicken Level 2 background is likewise not present locally under a distinct file name, so it is not guessed or substituted.

# QA-BOOT-004 — opening handoff and full start banner hit target

**Date:** 2026-11-12

| Check | Result | Evidence |
|---|---|---|
| Loading → Welcome | PASS | The regression test waited through the real loading handoff and reached `Welcome` without a stalled screen. |
| Start interaction | PASS | A real pointer click at the centre of the illustrated “BẮT ĐẦU KHÁM PHÁ” banner entered `Avatar`. The complete banner container is now the touch target, avoiding transparent-pixel dead zones in the artwork. |
| Console / requests | PASS | The test observed no console errors or failed requests. |

`npm run build` and `npm run test:e2e` passed on 2026-11-12. This test covers only the opening regression; it does not certify the unfinished minigames.
# QA-WAREHOUSE-001 — Farm Delivery (2026-11-12)

- Build: PASS — `npm run build` completed after registering `WarehouseScene`.
- Browser flow: PASS — Playwright used real mouse input on the canvas: Ready → farmer welcome → order card → all nine supplied shelf items → Start Loading → dragged five goods into the five truck slots → success → final screen → Farm Map. Evidence: `test-results/artifacts/e2e-warehouse-Farm-Deliver-3e7d2-on-truck-loading-and-result-desktop/warehouse-{ready,prepare,delivery,success}.png`.
- Network/console: PASS — the test records no failed asset request and no console error.
- Script coverage: supplied Ready/Exit/Let's Go art, bilingual spoken prompts, order cards, vocabulary exploration gate, 05:00 countdown, real drag-to-truck interaction, reward, final completion and Home return are implemented.
- Limitation recorded: the five currently supplied order cards do not match the written `Kịch bản 2.docx` quantities/names in every case. The delivered Cow card itself says 3 milk + 2 carrots, so that exact supplied card is the playable first delivery. The remaining cards are shown in the mailbox but must be wired to their exact per-card stock rules when Chicken/Sheep harvest inventory is completed.

# QA-WAREHOUSE-002 — renamed Drive source assets / female NPC (2026-11-12)

- Drive verification: PASS — refreshed the shared Kho folder recursively and found the renamed authored assets, including `Chào mừng (2)/Npc nữ.png`, `Let’s go.png`, `Thoại.png`, the original numbered source screens, plus the separately supplied `Exit.png` button.
- Visual correction: PASS — Warehouse welcome now loads `Npc nữ.png` (Bé Nông Dân), replacing the old male farmer asset. The Ready screen no longer presents Exit alongside Start; Exit belongs in Settings as requested.
- Build and browser: PASS — `npm run build` passed; the actual canvas QA flow (`tests/e2e/warehouse.spec.ts`) passed after the renamed assets were wired, with no failed requests or console errors.
- Outstanding asset: the linked Kho folder contains `Exit.png` (the red Exit button) but not the full bilingual confirmation-board illustration shown in the attached screenshot, nor a separate Settings panel asset. I have not fabricated that illustration; it needs to be placed in the shared folder before the exact board can replace the current settings confirmation UI.

# QA-MAP-003 — free map access and Farm Delivery welcome correction (2026-11-12)

| Check | Result | Evidence |
|---|---|---|
| All illustrated map destinations | PASS | A real pointer test opened Crop, Cow, Chicken, Fishing Lake, Sheep, Home and Warehouse directly from the Farm Map without prior completion. Captures: `test-results/artifacts/e2e-map-access-every-illus-d1c9b-e-without-completion-gating-desktop/map-{crop,cow,chicken,lake,sheep,home,warehouse}.png`. |
| Sheep Farm | PASS (initial beat) | The former dead/locked Sheep destination now opens a supplied-art scene. Three real `JUMP` presses reach the authored `Great job` response and both replay/home actions are present. |
| Warehouse welcome layout | PASS | Replayed Ready → welcome with real canvas pointer input. The opaque white-background NPC export was replaced by the supplied transparent female pose; the authored LET'S GO button now preserves its 3:1 aspect ratio and stays inside the lower-right clear area. `test-results/artifacts/e2e-warehouse-Farm-Deliver-3e7d2-on-truck-loading-and-result-desktop/warehouse-welcome.png`. |
| Full regression | PASS | `npm run build` and `npx playwright test --workers=1 --reporter=line` passed (3 tests). Sequential Playwright workers are intentional: parallel canvas runs on this macOS host caused false timeouts. No console error or failed asset request was recorded by the map/warehouse tests. |

# QA-WAREHOUSE-003 — hover-scale regression (2026-11-13)

| Check | Result | Evidence |
|---|---|---|
| Welcome CTA hover | PASS | Real pointer hover over LET'S GO retains the authored small 3:1 CTA and does not cover the dialogue or scene. Evidence: `test-results/artifacts/e2e-warehouse-Farm-Deliver-3e7d2-on-truck-loading-and-result-desktop/warehouse-welcome-hover.png`. |
| Cause and fix | PASS | `setDisplaySize` gives high-resolution PNGs a fractional baseline scale. Warehouse CTA/order-card and Fishing answer-card hover/press tweens now multiply that baseline rather than resetting to literal scale `1`. |
| Browser regression | PASS | `npm run build` and `npx playwright test tests/e2e/warehouse.spec.ts --reporter=line` passed; Ready → welcome → hover → orders → prepare → drag delivery → result had no console errors or failed requests. |

# QA-CHICKEN-002 — complete scripted Chicken Farm flow (2026-11-13)

| Check | Result | Evidence |
|---|---|---|
| Level 1, four beats | PASS | Real pointer path performed Hen/Chick learning, incorrect/correct Chick answer, dragged Corn into the trough, touched water, collected ten eggs, selected a colour and tinted the egg, then reached the 4/4 reward screen. `test-results/artifacts/e2e-chicken-Chicken-Farm-c-41c69-ats-with-real-pointer-input-desktop/chicken-{meet,feed,eggs,complete}.png`. |
| Level 2, hidden eggs | PASS | Real pointer path entered Level 2 and inspected haystack, bush, coop, tree and basket; all ten eggs were found and the completion screen appeared. `test-results/artifacts/e2e-chicken-Chicken-Farm-c-41c69-ats-with-real-pointer-input-desktop/chicken-level2-complete.png`. |
| Build, interaction and browser errors | PASS | `npm run build`, `npm run lint`, and `npx playwright test tests/e2e/chicken.spec.ts --reporter=line` passed. The test recorded no console error or failed asset request. |

**Script decision recorded:** the Level 2 document says both 16 and 10 eggs. The implementation uses 10 because the later explicit task board and counting instructions say “Find 10 eggs”; change this only after the client resolves the conflict. The authored “one egg every 3 minutes” pacing is not simulated in the completion test: the interaction uses the supplied egg inventory immediately so the full educational loop is playable and testable in one session.

# QA-MAP-004 — full-zone visual audit and Fishing asset check (2026-11-13)

| Check | Result | Evidence |
|---|---|---|
| All seven available zones | PASS | Real canvas taps opened Crop, Cow, Chicken, Fishing Lake, Sheep, Home and Warehouse directly from Farm Map. The 1536×1024 captures were inspected for clipping/oversized artwork; Warehouse Ready and its CTA are correctly scaled. `test-results/artifacts/e2e-map-access-every-illus-d1c9b-e-without-completion-gating-desktop/map-{crop,cow,chicken,lake,sheep,home,warehouse}.png`. |
| Full map regression | PASS | `npx playwright test tests/e2e/map-access.spec.ts --reporter=line`, `npm run build`, and `npm run lint` passed. The full visual pass now has a 90-second budget because seven streamed Phaser scenes exceed the former 60-second test budget on the supported macOS browser. |
| Request audit | PASS | The test still fails on genuine failed requests. It ignores only `net::ERR_ABORTED` for an SFX fetch cancelled by an intentional scene switch; this is not a missing asset. |
| Girl-in-boat Fishing art | BLOCKED — asset absent locally | Exhaustive scan of `public/assets/drive` found `backgrounds/fishing-pond.png`, level cards and generic girl poses, but no boat/girl-on-boat PNG. The pond background itself contains an empty boat. The visible moving fishing rod is therefore still code-drawn and has **not** been falsely replaced. Supply/sync the exact Drive file (or its parent folder) to replace it faithfully. |
