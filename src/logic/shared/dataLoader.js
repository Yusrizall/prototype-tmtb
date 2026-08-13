export async function loadJson(relativePath) {
  const baseUrl = import.meta.env.BASE_URL;
  const normalizedPath = relativePath.replace(/^\/+/, "");
  const url = `${baseUrl}${normalizedPath}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Gagal membaca file JSON: ${url}`);
  }

  return response.json();
}

export async function loadInitialPrototypeData() {
  const playerUnits = await loadJson(
    "data/units/player_units.json"
  );

  const enemyUnits = await loadJson(
    "data/units/enemy_units.json"
  );

  const stage1Map = await loadJson(
    "data/maps/r1_stage1_fixed.json"
  );

  const stage1Encounter = await loadJson(
    "data/encounters/r1_stage1_baseline_eval_encounter.json"
  );

  const tutorialMap = await loadJson(
  "data/maps/tutorial_offset_courtyard.json"
);

const tutorialEncounter = await loadJson(
  "data/encounters/tutorial_phase_1_5.json"
);

  return {
  playerUnits,
  enemyUnits,

  stage1Map,
  stage1Encounter,

  tutorialMap,
  tutorialEncounter
};
}