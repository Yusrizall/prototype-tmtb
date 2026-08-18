import test from "node:test";
import assert from "node:assert/strict";
import {
  applyUnitStatus,
  tickPlayerTurnStatuses,
  isUnitStunned,
  canPlayerUnitMove,
  canPlayerUnitAttack,
  canPlayerUnitSkill,
  canPlayerUnitHold
} from "../../src/logic/battle/statusLogic.js";
import { calculateTeamApCapacity } from "../../src/logic/battle/battleSetup.js";

function state() {
  return {
    playerUnits: [
      { battleUnitId: "guard", currentHP: 10, statuses: [] },
      { battleUnitId: "archer", currentHP: 11, statuses: [] }
    ]
  };
}

test("STUN 2 denies unit capabilities but living unit still contributes Team AP", () => {
  const next = applyUnitStatus(state(), "guard", { statusId: "stun", remainingPlayerTurns: 2 });
  const guard = next.playerUnits[0];
  assert.equal(isUnitStunned(guard), true);
  assert.equal(canPlayerUnitMove(guard), false);
  assert.equal(canPlayerUnitAttack(guard), false);
  assert.equal(canPlayerUnitSkill(guard), false);
  assert.equal(canPlayerUnitHold(guard), false);
  assert.equal(calculateTeamApCapacity(next.playerUnits), 4);
});

test("STUN ticks at affected Player Turn end: 2 to 1 to expired", () => {
  let next = applyUnitStatus(state(), "guard", { statusId: "stun", remainingPlayerTurns: 2 });
  next = tickPlayerTurnStatuses(next);
  assert.equal(next.playerUnits[0].statuses[0].remainingPlayerTurns, 1);
  next = tickPlayerTurnStatuses(next);
  assert.equal(next.playerUnits[0].statuses.length, 0);
  assert.equal(isUnitStunned(next.playerUnits[0]), false);
});

test("missing Status data behaves as unstunned", () => {
  const unit = { currentHP: 5 };
  assert.equal(canPlayerUnitMove(unit), true);
  assert.equal(canPlayerUnitAttack(unit), true);
});

test("Stun replacement refreshes the same Status instead of duplicating it",()=>{
 let next=applyUnitStatus(state(),"guard",{statusId:"stun",remainingPlayerTurns:1});
 next=applyUnitStatus(next,"guard",{statusId:"stun",remainingPlayerTurns:2});
 assert.equal(next.playerUnits[0].statuses.length,1);
 assert.equal(next.playerUnits[0].statuses[0].remainingPlayerTurns,2);
});
