import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));

test("Tutorial Phase 7 authored data matches approved Blue PVS contract",()=>{
 const encounter=read("public/data/encounters/tutorial_phase_1_5.json");
 const enemies=read("public/data/units/enemy_units.json");
 const map=read("public/data/maps/tutorial_offset_courtyard.json");
 const p7=encounter.phase7Content;
 assert.equal(p7.enemySpawns[0].statOverrides.maxHP,33);
 assert.deepEqual(p7.guardStaging,{x:12,y:4});
 assert.deepEqual(p7.archerStaging,{x:11,y:3});
 assert.deepEqual(p7.archerSafe,{x:9,y:2});
 assert.equal(p7.shockwaveRadius,2);
 assert.equal(p7.stunPlayerTurns,2);
 assert.equal(map.tiles[2][12],"E3");
 const blue=enemies.units.find(u=>u.unitId==="blue_charger_candidate");
 assert.equal(blue.actionRule,"blue_charge_shockwave");
 assert.equal(blue.move,0);
});
