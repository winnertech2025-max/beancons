# Happy Farm — implementation specification

## Source-of-truth flow

`Loading → Character selection → bilingual NPC introduction → Main Farm → Crop Farm (unlock gate) → Cow Farm → Lake / Home games → Chicken & Sheep → Delivery → Shop`.

The existing legacy animal-vocabulary path is retained only as a reusable learning activity, not as the complete product flow.

## Question Bank contract

The current core bank contains 50 authored items: 10 for each of Cat, Dog, Cow, Pig and Duck. It is split into 25 `LISTEN_AND_CHOOSE` and 25 `IMAGE_AND_CHOOSE` questions. All five supplied animal keys are available, so this initial pack is selectable; later script vocabulary must use `assetStatus: "missing"` and remain excluded until matching original art exists.

## Core data systems

- `GameProgress`: character, stars, unlocked zones, inventory, vocabulary, owned decorations and completion flags; persisted with a version.
- `FarmInventory`: actual counts for crops, eggs, milk and other script items. Inventory changes are idempotent event transactions.
- `QuestionBank`: data-only question definitions, validation, selection and round scoring. It does not contain scene code.
- `AudioManager`: one bilingual-aware voice/asset interface; stops prior speech before new speech.

## Implementation scope and asset rule

Gameplay logic may be implemented with Phaser graphics where the script has no UI asset. Character/animal/object art is used only when the matching supplied asset exists. Any question referencing a missing image must be marked unavailable and never selected for a playable round.

## Approved extension

The Question Bank begins with 50 questions: 10 each for cat, dog, cow, pig and duck, split evenly between `LISTEN_AND_CHOOSE` and `IMAGE_AND_CHOOSE`. The selector supports 5, 10, 15 and 20 questions per round; the default remains 5.
