const BUFF_DEFINITIONS = [
  {
    buffId: "iron_resolve",
    name: "Iron Resolve",
    icon: "G",
    rarity: "common",
    category: "unit",
    requiredUnitId: "guard",
    description: "Guard gains +4 Max HP for this run.",
    effects: [
      { type: "stat_modifier", target: "guard", stat: "maxHP", amount: 4 }
    ]
  },
  {
    buffId: "keen_string",
    name: "Keen String",
    icon: "A",
    rarity: "common",
    category: "unit",
    requiredUnitId: "archer",
    description: "Archer gains +2 ATK for this run.",
    effects: [
      { type: "stat_modifier", target: "archer", stat: "atk", amount: 2 }
    ]
  },
  {
    buffId: "marching_drill",
    name: "Marching Drill",
    icon: "M",
    rarity: "common",
    category: "party",
    description: "All allies gain +1 Movement for this run.",
    effects: [
      { type: "stat_modifier", target: "party", stat: "move", amount: 1 }
    ]
  },
  {
    buffId: "layered_plates",
    name: "Layered Plates",
    icon: "P",
    rarity: "common",
    category: "party",
    description: "All allies gain +1 DEF for this run.",
    effects: [
      { type: "stat_modifier", target: "party", stat: "def", amount: 1 }
    ]
  },
  {
    buffId: "rallying_rhythm",
    name: "Rallying Rhythm",
    icon: "R",
    rarity: "rare",
    category: "global",
    description: "Gain +1 Team AP Capacity for this run.",
    effects: [
      { type: "team_ap_modifier", amount: 1 }
    ]
  },
  {
    buffId: "eagle_eye",
    name: "Eagle Eye",
    icon: "E",
    rarity: "rare",
    category: "unit",
    requiredUnitId: "archer",
    description: "Archer gains +1 Attack Range for this run.",
    effects: [
      { type: "stat_modifier", target: "archer", stat: "atr", amount: 1 }
    ]
  },
  {
    buffId: "unyielding_line",
    name: "Unyielding Line",
    icon: "U",
    rarity: "rare",
    category: "party",
    description: "All allies gain +3 Max HP for this run.",
    effects: [
      { type: "stat_modifier", target: "party", stat: "maxHP", amount: 3 }
    ]
  },
  {
    buffId: "vanguard_oath",
    name: "Vanguard Oath",
    icon: "V",
    rarity: "epic",
    category: "party",
    description: "All allies gain +2 ATK and +2 Max HP for this run.",
    effects: [
      { type: "stat_modifier", target: "party", stat: "atk", amount: 2 },
      { type: "stat_modifier", target: "party", stat: "maxHP", amount: 2 }
    ]
  },
  {
    buffId: "limit_break",
    name: "Limit Break",
    icon: "L",
    rarity: "epic",
    category: "global",
    description: "Gain +2 Team AP Capacity for this run.",
    effects: [
      { type: "team_ap_modifier", amount: 2 }
    ]
  }
];

const RARITY_WEIGHTS_BY_NODE_TYPE = {
  stage: { common: 70, rare: 20, epic: 10 },
  mini_boss: { common: 20, rare: 50, epic: 30 },
  boss: { common: 10, rare: 45, epic: 45 },
  special: { common: 35, rare: 45, epic: 20 }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getBuffDefinitions() {
  return clone(BUFF_DEFINITIONS);
}

export function rollBuffRarity(nodeType, random = Math.random) {
  const weights = RARITY_WEIGHTS_BY_NODE_TYPE[nodeType] ??
    RARITY_WEIGHTS_BY_NODE_TYPE.stage;
  const roll = Math.max(0, Math.min(0.999999, Number(random()) || 0)) * 100;

  if (roll < weights.common) return "common";
  if (roll < weights.common + weights.rare) return "rare";
  return "epic";
}

function chooseOne(items, random) {
  if (items.length === 0) return null;
  const index = Math.floor(Math.max(0, Math.min(0.999999, Number(random()) || 0)) * items.length);
  return items[index];
}

export function generateBuffOffers({
  nodeType = "stage",
  availableBuffIds = BUFF_DEFINITIONS.map((buff) => buff.buffId),
  partyUnitIds = ["guard", "archer"],
  random = Math.random,
  offerCount = 2
} = {}) {
  const availableIds = new Set(availableBuffIds);
  const partyIds = new Set(partyUnitIds);
  const eligible = BUFF_DEFINITIONS.filter((buff) => {
    return availableIds.has(buff.buffId) &&
      (!buff.requiredUnitId || partyIds.has(buff.requiredUnitId));
  });
  const selected = [];

  for (let slot = 0; slot < offerCount; slot += 1) {
    const rarity = rollBuffRarity(nodeType, random);
    const unused = eligible.filter((buff) => {
      return !selected.some((item) => item.buffId === buff.buffId);
    });
    const matching = unused.filter((buff) => buff.rarity === rarity);
    const chosen = chooseOne(matching.length > 0 ? matching : unused, random);
    if (chosen) selected.push(clone(chosen));
  }

  return selected;
}

export function applyActiveRunBuffsToBattleState(battleState, activeRunBuffs = []) {
  if (!battleState) return battleState;

  const teamApBonus = activeRunBuffs.reduce((total, buff) => {
    return total + (buff.effects ?? []).reduce((buffTotal, effect) => {
      return buffTotal + (
        effect.type === "team_ap_modifier"
          ? Number(effect.amount) || 0
          : 0
      );
    }, 0);
  }, 0);

  const nextPlayerUnits = (battleState.playerUnits ?? []).map((unit) => {
    const nextUnit = clone(unit);

    activeRunBuffs.forEach((buff) => {
      (buff.effects ?? []).forEach((effect) => {
        const targetsUnit = effect.type === "stat_modifier" &&
          (effect.target === "party" || effect.target === unit.unitDefId);
        if (!targetsUnit) return;

        const amount = Number(effect.amount) || 0;
        if (effect.stat === "maxHP") {
          nextUnit.maxHP += amount;
          nextUnit.currentHP += amount;
          nextUnit.stageStartHP = nextUnit.currentHP;
          nextUnit.derivedStats.maxHP += amount;
        } else if (effect.stat === "atr") {
          nextUnit.derivedStats.atr += amount;
        } else if (effect.stat in nextUnit.derivedStats) {
          nextUnit.derivedStats[effect.stat] += amount;
        }
      });
    });

    return nextUnit;
  });

  const safeTeamApBonus = Math.max(0, Math.round(teamApBonus));
  const baseCapacity = battleState.teamApCapacity ?? 0;

  return {
    ...battleState,
    playerUnits: nextPlayerUnits,
    teamApCapacity: baseCapacity + safeTeamApBonus,
    teamApCurrent: (battleState.teamApCurrent ?? baseCapacity) + safeTeamApBonus,
    appliedRunBuffIds: activeRunBuffs.map((buff) => buff.buffId)
  };
}
