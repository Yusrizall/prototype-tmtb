# TMTB Shop and Four Skills: Implementation Checkpoint v1.0

Status: IMPLEMENTED, automated checks passed; awaiting Game Designer browser/runtime validation.
Source baseline: uploaded `prototype-tmtb(1).zip`, not an assumed Git checkout. The archive includes changes beyond its Git HEAD; this patch is compared against archive bytes. No commit or push was performed.

## Authority and intent

The user's latest decisions supersede old DEF and Shop-access passages in v3.3 and handoff v3.1. DEF is removed globally. Max HP and ATK remain. Cover remains functional. Shop is a permanent progression UI accessed only from Region Overview (internal scene name `run_overview`). Settlement returns to Main Menu. All run Crystal still converts, with no added completion bonus. Skill details below are provisional implementation choices, not production canon.

## Shop

Four character pages: Guard, Archer, Support locked, Trickster locked. No empty Global page. Header shows Back, Shop, and current Meta Crystal. Center has Upgrades and Skills tabs; right side has item description, current/next values, level, price and purchase action. Locked characters display their future-region requirement. Max items remain visible. Purchases apply immediately without a confirmation modal or refund. Insufficient funds produce inline feedback. Transactions persist before the app replaces its in-memory profile. Rapid purchases have a 450 ms UI guard; skill unlocks and stale level requests are also validated in logic.

Max HP: +2 per level, four levels, prices 30/60/100/150.
ATK: +1 per level, four levels, prices 40/80/130/190.
Intercept and Volley: 150 each, purchased once. Fortify and Pinning Shot are free core skills.

Guard and Archer stay available from the beginning for this prototype. Full-game Archer unlock after first entering Stage 3 and availability only at Stage 3+ remain deferred. Support/Trickster unlock logic awaits future region content. No skill-enhancement buffs, global shop page, or respec system is implemented.

Prices use existing stage reward values as a starting point. The requested 3–4 runs to Stage 3 plus 2–3 more runs to clear Stage 4 is a playtest target, not a validated outcome. Enemy threat was not retuned in this patch.

## Four playable skills

| Skill | Access | Cost | Target and effect |
| --- | --- | --- | --- |
| Fortify | Guard core | 1 AP | Self or living ally within Euclidean range 2. Grants 4 Shield, does not stack, no healing. Incoming basic damage consumes Shield before HP. |
| Intercept | Guard shop unlock | 1 AP | Another living ally within range 2. Redirects their first incoming basic attack to living Guard if Guard is still within range 2. No teleport. Only one protected ally per caster. |
| Pinning Shot | Archer core | 1 AP | One living enemy within Archer's current Attack Range. No damage. Prevents movement for one Enemy Turn, while attacks and special actions remain legal. |
| Volley | Archer shop unlock | 2 AP | Enemy-centered 3×3 square, center within current Attack Range. Enemies only; no structures or friendly fire. Each hit deals floor(ATK × 0.6 × (1 − Cover)). Each victim needs an action-valid path; outer victims can lie beyond center targeting range. |

All four have cooldown 2: cast on Player Turn 1, unavailable on Turn 2, ready on Turn 3. Cooldowns tick after Enemy Turn. Shield, Intercept and Pin expire after the next Enemy Turn. They reset on a new stage because stage units are rebuilt. Intercept preserves the original attack's Cover mitigation, then uses Guard's Shield/HP; it does not recurse or redirect special area status effects such as Blue's Stun.

Casting spends shared Team AP and locks caster movement; it does not introduce a one-action-per-unit rule. Stun, death, insufficient AP, ownership, cooldown and target validity are checked before spending. Cancellation spends nothing. Skill selection is through Action → Skill, then a target-list button. Native Tab/Enter/Space works in the skill panel, Esc/Z backs out. The battle underneath the panel is inert. Status labels appear on occupied tiles. Volley lists affected enemies before casting. There is no animated projectile or graphical AoE targeting overlay yet.

Skills are available in normal battles and Tutorial Phase 8. Earlier guided phases reject casts. Phase 8 skill kills use the existing completion refresh, so pending waves still gate victory. Tutorial retry/victory routing is preserved.

## Save and DEF migration

Storage key remains `tmtb_profile_v1`; payload version becomes 2. Existing Meta Crystal, tutorial completion and valid HP/ATK upgrades are preserved. Legacy `def` upgrades are dropped without refund, as agreed. Skill IDs are stored per character. DEF no longer exists in active unit/structure definitions, derived stats, or upgrade choices. Damage calculation retains a zero `targetDefense` field only for result compatibility.

The former Layered Plates DEF buff now grants +2 Max HP, using the same stable buff ID. This is a provisional replacement so it remains useful under the new rules. Existing result/buff flow and reward amounts are preserved.

## Presentation and limits

Shop has entry fade/slide, selection states, success glow, failure shake and a 350 ms balance countdown. Numeric stat preview updates immediately; individual stat count-up, cascading character entrances and grayscale-to-color skill artwork are not implemented. Icons are text placeholders. These are presentation simplifications of the earlier proposed design, not missing combat effects.

Validation: 185/185 Node tests pass, including 24 Shop/Skill tests; production Vite build succeeds. Existing assertions that required DEF were updated to the newly approved behavior. Browser visual/end-to-end validation was not run because the local Playwright browser executable is unavailable. Build used the available Vite 8.0.14 installation; the project's dependency declaration and lockfile were not upgraded.

## Install

1. Stop the local dev server. Keep the uploaded latest prototype as your backup.
2. Extract the patch into the project root, the directory containing package.json. Merge folders and replace matching files; do not replace entire src/public/docs directories.
3. No file deletion and no new dependency installation are required. Run `npm test`, `npm run build`, then `npm run dev`.
4. Test with the same browser origin/port to retain localStorage. Do not Reset Profile unless intentionally testing a fresh profile.

## Runtime checklist

- [ ] Region Overview → Shop → Back returns correctly. No active-run access. Settlement still returns to Main Menu.
- [ ] Guard/Archer pages show real base stats plus purchased levels; Support/Trickster show locked pages.
- [ ] Buy one HP and ATK level; check prices, stat increase, balance countdown and next price. Reload and verify persistence.
- [ ] With insufficient funds, buying does not change balance or level and shows a warning.
- [ ] At Level 4 the item stays visible as MAX. Rapid double input does not buy an unintended second tier.
- [ ] Fortify and Pinning Shot appear as core. Buy Intercept and Volley; each costs 150 once, becomes OWNED and survives reload.
- [ ] Start a new run. HP/ATK upgrades apply; no DEF appears or subtracts damage. Cover still reduces damage.
- [ ] Open Action → Skill. Select each owned skill; cancel with Esc/Z and verify no AP was spent.
- [ ] Fortify self and ally within two tiles. Shield is 4. With 7 incoming uncovered damage, Shield absorbs 4 and HP loses 3. Unused Shield expires after Enemy Turn.
- [ ] Intercept Archer, then let Archer receive a basic attack while Guard is alive within two tiles. Guard takes it; a second attack damages Archer. Move Archer out of protection range in a separate trial and verify no redirect.
- [ ] Pin an enemy. It stays on its tile for that Enemy Turn but attacks if already in range. It can move on its next Enemy Turn.
- [ ] Volley on adjacent enemies. For ATK 7 and no Cover each loses 4 HP; allies lose none. Try a covered enemy, an invalid center and a last-enemy kill.
- [ ] Cast Turn 1: movement locks and AP drops by the documented cost. The same skill is blocked Turn 2 and ready Turn 3. Stunned/dead units cannot cast.
- [ ] Tutorial Phases 1–7 still follow guided steps. Phase 8 skills work, pending waves still prevent premature victory, full defeat retries Phase 8, final victory returns to Region Overview.
- [ ] Normal victory → animated Battle Result → Buff Selection works; skip still requires two empty Confirm presses. Defeat and Stage 4 completion still settle once.
- [ ] At desktop resolution, inspect Shop overflow, focus visibility, skill target panel, status badges and readable feedback; browser console has no new errors.

Return feedback by checklist item, including screenshot/console error and the exact action sequence for any failure. Mark this checkpoint RUNTIME CONFIRMED only after those results.
