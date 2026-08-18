import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));

test("Phase 8 authored Wave PVS matches approved Sword, Spear, and split two-Sword Wave 3 contract",()=>{
  const encounter=read("public/data/encounters/tutorial_phase_1_5.json");
  const map=read("public/data/maps/tutorial_offset_courtyard.json");
  const phase8=encounter.phase8Content;
  const waves=phase8.waves;
  assert.equal(waves.length,4);
  assert.deepEqual(waves[0],{
    waveId:"phase8_wave_1_sword",required:true,unitId:"sword_enemy",spawnLabel:"E4",battleUnitId:"tutorial_wave_sword_1",telegraphLabel:"SWORD"
  });
  assert.deepEqual(waves[1],{
    waveId:"phase8_wave_2_spear",required:true,unitId:"spear_enemy",spawnLabel:"E5",battleUnitId:"tutorial_wave_spear_1",telegraphLabel:"SPEAR",statOverrides:{atk:5}
  });
  assert.deepEqual(waves[2],{
    waveId:"phase8_wave_3_sword_a",required:true,unitId:"sword_enemy",spawnLabel:"E6",battleUnitId:"tutorial_wave_sword_2",telegraphLabel:"SWORD"
  });
  assert.deepEqual(waves[3],{
    waveId:"phase8_wave_3_sword_b",required:true,unitId:"sword_enemy",spawnLabel:"E7",battleUnitId:"tutorial_wave_sword_3",telegraphLabel:"SWORD"
  });
  assert.deepEqual(phase8.wave3SpawnPairs,[["E6","E7"],["E8","E9"],["E10","E11"],["E12","E13"]]);
  const positions={E4:[12,5],E5:[15,2],E6:[10,0],E7:[14,5],E8:[9,1],E9:[15,4],E10:[14,0],E11:[9,4],E12:[15,1],E13:[10,5]};
  for(const [label,[x,y]] of Object.entries(positions))assert.equal(map.tiles[y][x],label,label);
});
