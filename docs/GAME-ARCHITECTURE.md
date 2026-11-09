# Happy Farm — Game architecture

The React shell owns the single Phaser instance and the orientation notice. Phaser owns all game-world rendering, scene transitions and inputs. Persistent learner progress is isolated in `ProgressManager` and stored in versioned LocalStorage; React does not duplicate gameplay state.

```text
React App → Phaser.Game
              ├─ Boot → Welcome → FarmMap → Vocabulary → Quiz → Result
              ├─ config/assets + config/farmZones
              ├─ objects/GameButton + objects/AnimalCard
              └─ systems/AudioManager + ProgressManager
```

The design world is fixed at 1536 × 1024. Phaser `FIT` + `CENTER_BOTH` preserves the full map at every supported landscape viewport. Portrait phones receive an HTML rotate-device notice.

`AudioManager` cancels speech when a scene ends and uses `en-US` Speech Synthesis only when the learner has enabled sound. `QuizScene` randomizes question and answer order, retains five choices per question, allows retries, and awards the score only for first attempts.
