---
name: happy-farm-quality
description: Implement, review, or QA Happy Farm scenes and minigames using the project's script, supplied assets, visual quality rules, and evidence-based browser testing.
---

# Happy Farm quality gate

Use this skill before every Happy Farm implementation, visual change, gameplay change, or QA pass. Read [the master quality brief](../../../../docs/MASTER-QUALITY-OVERHAUL.md) before a new phase; treat the original script and Project Overview as the source of truth for gameplay.

## Before changing code

1. Identify the exact player flow and scene(s) affected. Inspect the relevant source, state, navigation, and existing tests.
2. Inspect `public/assets` and the asset manifest first. Prefer supplied Drive assets over procedural rectangles, CSS panels, emoji, or fabricated substitutes. Record a missing asset instead of pretending one exists.
3. Inspect the supplied asset itself when composition or transparency matters. Alpha PNG characters, animals, and decorations must remain visually integrated with the scene; do not place them in generic white cards, boxes, or backgrounds unless that background conveys a necessary interaction state.
4. Keep the game script intact. If the script is contradictory or cannot be implemented with available assets, record the issue in documentation rather than silently changing the rules.

## Visual and interaction standard

- Design for a child at the game viewport: readable hierarchy, high text/background contrast, generous touch targets, and no text overlapping decorative art or an occupied portion of an asset.
- Anchor UI to the intended safe visual area and preserve aspect ratio on desktop and mobile. Avoid using one generic UI template across unrelated minigames.
- Use motion deliberately: feedback must communicate interaction, success, failure, or environment life; it must not obscure gameplay, make the whole background jitter, or overload the frame budget.
- Retain the existing Phaser 3 architecture. Do not replace gameplay with a non-interactive mock screen or create a new project.

## Required verification

After every scene or minigame change:

1. Run the production build.
2. Open the real game in the browser at the supported desktop viewport and inspect a screenshot. Test the actual pointer/touch interaction and navigation, not only a scene-start hook.
3. Exercise meaningful states: initial, interaction, success, retry/failure where applicable, exit/return, and any persisted progress affected.
4. Check console errors and failed asset requests. Test a representative mobile/portrait condition when the scene is responsive.
5. Update `docs/QA-REPORT.md` with a truthful pass/fail result, evidence location, and outstanding limitation. A build alone is never completion.

For a completed minigame, run the full checklist above again after its final visual change. Do not mark it complete while a required interaction, script beat, asset, or QA result is missing.

