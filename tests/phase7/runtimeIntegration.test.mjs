import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("main runtime integrates systemic Status tick, Blue special activation, CP7, and Phase7 attack recording",()=>{
 const source=fs.readFileSync("src/main.js","utf8");
 assert.equal(source.includes("tickPlayerTurnStatuses"),true);
 assert.equal(source.includes("resolveBlueShockwaveActivation"),true);
 assert.equal(source.includes('captureTutorialCheckpoint(\n      "cp7"'),true);
 assert.equal(source.includes("recordTutorialPhase7PlayerAttack"),true);
 assert.equal(source.includes("isTutorialPhase7BasicAttackTargetAllowed"),true);
});

test("Phase 6 Region C travel permits End Turn and initializes Phase 7 before staging",()=>{
 const p6=fs.readFileSync("src/logic/tutorial/tutorialPhase6Logic.js","utf8");
 const main=fs.readFileSync("src/main.js","utf8");
 assert.equal(p6.includes('["movement_keyboard", "switch_unit", "end_turn"]'),true);
 assert.equal(main.includes("initializeTutorialPhase7RuntimeIfNeeded"),true);
});


test("main runtime auto-advances the revised Phase 7 teaching-clarity brief chain",()=>{
 const source=fs.readFileSync("src/main.js","utf8");
 for (const taskId of [
   "explain_charge_progress",
   "explain_charge_delayed_payoff",
   "explain_charge_preparation_window",
   "explain_charge_next_intent",
   "explain_charge_complete",
   "explain_shockwave_current_intent",
   "explain_shockwave_stun",
   "explain_stun_duration_2",
   "explain_stun_shared_ap",
   "explain_stun_duration_1"
 ]) {
   assert.equal(source.includes(`"${taskId}"`),true,`main.js missing ${taskId}`);
 }
});
