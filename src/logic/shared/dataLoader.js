export async function loadJson(relativePath) {
  const response = await fetch(relativePath);

  if (!response.ok) {
    throw new Error(`Gagal membaca file JSON: ${relativePath}`);
  }

  return response.json();
}

export async function loadInitialPrototypeData() {
  const playerUnits = await loadJson("/public/data/units/player_units.json");
  const enemyUnits = await loadJson("/public/data/units/enemy_units.json");
  const stage1Map = await loadJson("/public/data/maps/r1_stage1_fixed.json");
  const stage1Encounter = await loadJson(
    "/public/data/encounters/r1_stage1_baseline_eval_encounter.json"
  );

  return {
    playerUnits,
    enemyUnits,
    stage1Map,
    stage1Encounter
  };
}