# Happy Farm — script issues requiring confirmation

This is a requirements record, not a silent rewrite of the supplied script.

| Area | Source requirement | Issue | Safe implementation position |
|---|---|---|---|
| Chicken missing eggs | Level 2 first specifies 16 hidden eggs, later task panel says 10 eggs. | Completion count conflicts. | Keep both values as separate configuration candidates; do not publish the level until a final count is selected. |
| Fishing level 1 / 3 | Options contain `Grab` for a fish/crab question. | Likely typo for `Crab`; level 3 may lack a valid answer. | Preserve source data in the fishing-data record; exclude invalid levels from playable selection until approved. |
| Fishing level 23 | `Crap` is listed for carp. | Likely spelling mistake. | Preserve source string and flag as invalid; do not silently correct learner content. |
| Fishing level 26 | Target is written `Ba ba`. | English term is unspecified. | Mark missing English target/asset. |
| Fishing level 38 | Target is swordfish; options are flying fish / manta ray. | No matching answer supplied. | Disable level pending approved options. |
| Paid content | Levels 21–40 mention 39,000đ. | No payment provider, entitlement policy or consent flow provided. | Present as a locked future pack only; no real payment integration. |
| Milk conversion | A full bucket is described as becoming 2 bottles, but the detailed delivery beat explicitly requires dragging and counting ten bottles. | The source contains two incompatible totals. | The detailed Stage 2 instruction now takes precedence: 10 real bottle drags, English→Vietnamese count one through ten, and 10 milk recorded in the warehouse. Confirm with client if the earlier “2 bottles” should instead be restored. |
| Delivery orders | DOCX: Chicken 1 milk; Cow 2 eggs; Sheep 3 worms; Fish 3 carrots + 2 milk. Current Drive cards: Chicken 1 milk; Cow 3 milk + 2 carrots; Sheep 1 egg; Fish 3 worms. | Three of four orders conflict between the written script and visual cards children select. | The current playable flow mirrors the chosen Drive card exactly, preventing a false order/item mismatch. Client must nominate DOCX or replacement card art as the final content source before this can be marked script-complete. |
