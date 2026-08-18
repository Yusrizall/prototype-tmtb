import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

test("Phase 6 authored data matches approved PVS contract", () => {
  const enemies = readJson("public/data/units/enemy_units.json").units;
  const structures = readJson("public/data/structures/structure_definitions.json").structures;
  const encounter = readJson("public/data/encounters/tutorial_phase_1_5.json");
  const map = readJson("public/data/maps/tutorial_offset_courtyard.json");

  const sword = enemies.find((unit) => unit.unitId === "sword_enemy");
  assert.equal(sword.movementRule, "seek_melee_engagement");
  assert.equal(sword.actionRule, "basic_attack");

  const spear = enemies.find((unit) => unit.unitId === "spear_enemy");
  assert.deepEqual(
    {
      hp: spear.maxHP,
      atk: spear.baseATK,
      def: spear.baseDEF,
      move: spear.move,
      atr: spear.atr,
      attackType: spear.attackType,
      movementRule: spear.movementRule,
      actionRule: spear.actionRule
    },
    {
      hp: 15,
      atk: 6,
      def: 2,
      move: 4,
      atr: 3,
      attackType: "ranged",
      movementRule: "seek_max_effective_atr",
      actionRule: "basic_attack_if_effective"
    }
  );

  const hut = structures.find(
    (structure) => structure.structureDefId === "tutorial_hut"
  );
  assert.equal(hut.maxHP, 28);
  assert.equal(hut.baseDEF, 0);
  assert.equal(hut.targetable, true);
  assert.equal(hut.occupiesTacticalSpace, true);

  assert.equal(map.tiles[8][10], "E2");
  assert.equal(map.regionIds[8][10], "B");

  assert.deepEqual(encounter.phase6Content.enemySpawns, [
    { unitId: "spear_enemy", spawnLabel: "E2" }
  ]);
  assert.deepEqual(encounter.phase6Content.structures, [
    {
      battleStructureId: "tutorial_hut_1",
      structureDefId: "tutorial_hut",
      topLeft: { x: 11, y: 9 },
      width: 3,
      height: 3
    }
  ]);
});
