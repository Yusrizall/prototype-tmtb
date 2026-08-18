import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const main=fs.readFileSync("src/main.js","utf8");

test("main runtime wires P7→P8, CP8, Wave spawn, Phase8 attack completion, and Jump8 retry state",()=>{
  for(const token of [
    "initializeTutorialPhase8RuntimeIfNeeded",
    "captureTutorialCheckpoint(\n      \"cp8\"",
    "spawnTelegraphedWaves(",
    "refreshEnemyReadabilityState(\n      waveSpawnResolution.battleState",
    "recordTutorialPhase8PlayerTurnStart(",
    "recordTutorialPhase8PlayerAttack(",
    "createTutorialPhase8RetryCheckpointState(appData)"
  ]) assert.equal(main.includes(token),true,token);
});

test("Wave spawn hook occurs after the existing enemy activation loop so spawned enemies get no attached action",()=>{
  const fnStart=main.indexOf("function resolveEnemyPhaseActions()");
  const loop=main.indexOf("for (const enemyId of enemyOrder)",fnStart);
  const spawn=main.indexOf("spawnTelegraphedWaves(",loop);
  const playerTurn=main.indexOf("const nextPlayerUnits",spawn);
  assert.ok(fnStart>=0&&loop>fnStart&&spawn>loop&&playerTurn>spawn);
});

test("Tutorial full-party defeat restores CP8 instead of restarting the whole Tutorial when CP8 exists",()=>{
  const start=main.indexOf("function handleBattleResultPrimaryAction()");
  const end=main.indexOf("const isRunStageBattle",start);
  const source=main.slice(start,end);
  assert.match(source,/latestTutorialCheckpoint\?\.checkpointId === "cp8"/);
  assert.match(source,/restoreTutorialCheckpoint/);
});
