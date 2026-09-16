const PROFILE_STORAGE_KEY =
  "tmtb_profile_v1";

  export const PERMANENT_UPGRADE_COSTS = [
  30,
  60,
  100,
  150
];

export const MAX_PERMANENT_UPGRADE_LEVEL =
  PERMANENT_UPGRADE_COSTS.length;

const VALID_UPGRADE_UNITS = [
  "guard",
  "archer"
];

const VALID_UPGRADE_STATS = [
  "maxHP",
  "atk"
];

const DEFAULT_PROFILE_STATE = {
  version: 2,
  unlockedSkills: { guard: [], archer: [] },

  tutorialCompleted: false,

  metaCrystal: 0,

  permanentUpgrades: {
    guard: {
      maxHP: 0,
      atk: 0
    },

    archer: {
      maxHP: 0,
      atk: 0
    }
  }
};

function createDefaultProfileState() {
  return JSON.parse(
    JSON.stringify(
      DEFAULT_PROFILE_STATE
    )
  );
}

export function normalizeProfileState(
  savedProfile
) {
  const defaultProfile =
    createDefaultProfileState();

  const result = {
    ...defaultProfile,
    ...savedProfile,

    permanentUpgrades: {
      guard: {
        ...defaultProfile
          .permanentUpgrades
          .guard,

        ...savedProfile
          ?.permanentUpgrades
          ?.guard
      },

      archer: {
        ...defaultProfile
          .permanentUpgrades
          .archer,

        ...savedProfile
          ?.permanentUpgrades
          ?.archer
      }
    }
  };
  result.version = 2;
  result.metaCrystal = Math.max(0, Math.floor(Number(result.metaCrystal) || 0));
  result.unlockedSkills = {};
  for (const id of VALID_UPGRADE_UNITS) {
    delete result.permanentUpgrades[id].def;
    for (const stat of VALID_UPGRADE_STATS) result.permanentUpgrades[id][stat] = Math.min(4, Math.max(0, Math.floor(Number(result.permanentUpgrades[id][stat]) || 0)));
    const allowed = id === 'guard' ? 'intercept' : 'volley';
    result.unlockedSkills[id] = savedProfile?.unlockedSkills?.[id]?.includes(allowed) ? [allowed] : [];
  }
  return result;
}

export function saveProfileState(
  profileState
) {
  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profileState)
  );

  return profileState;
}

export function loadProfileState() {
  const savedProfileText =
    window.localStorage.getItem(
      PROFILE_STORAGE_KEY
    );

  if (!savedProfileText) {
    const defaultProfile =
      createDefaultProfileState();

    saveProfileState(defaultProfile);

    return defaultProfile;
  }

  try {
    const parsedProfile =
      JSON.parse(savedProfileText);

    const normalizedProfile =
      normalizeProfileState(
        parsedProfile
      );

    saveProfileState(
      normalizedProfile
    );

    return normalizedProfile;
  } catch (error) {
    console.warn(
      "Profile save tidak valid. " +
      "Default profile dibuat ulang.",
      error
    );

    const defaultProfile =
      createDefaultProfileState();

    saveProfileState(defaultProfile);

    return defaultProfile;
  }
}

export function markTutorialCompleted(
  profileState
) {
  const nextProfileState = {
    ...profileState,
    tutorialCompleted: true
  };

  saveProfileState(
    nextProfileState
  );

  return nextProfileState;
}

export function resetProfileState() {
  const defaultProfile =
    createDefaultProfileState();

  saveProfileState(
    defaultProfile
  );

  return defaultProfile;
}

export function addMetaCrystal(
  profileState,
  amount
) {
  const numericAmount =
    Number(amount);

  const safeAmount =
    Number.isFinite(numericAmount)
      ? Math.max(
          0,
          Math.floor(numericAmount)
        )
      : 0;

  const currentMetaCrystal =
    profileState?.metaCrystal ?? 0;

  const nextProfileState = {
    ...profileState,

    metaCrystal:
      currentMetaCrystal +
      safeAmount
  };

  saveProfileState(
    nextProfileState
  );

  return nextProfileState;
}

export function getPermanentUpgradeCost(
  currentLevel, statId = 'maxHP'
) {
  const numericLevel =
    Number(currentLevel);

  const isValidLevel =
    Number.isInteger(numericLevel) &&
    numericLevel >= 0 &&
    numericLevel <
      MAX_PERMANENT_UPGRADE_LEVEL;

  if (!isValidLevel) {
    return null;
  }

  return (statId === 'atk' ? [40, 80, 130, 190] : PERMANENT_UPGRADE_COSTS)[
    numericLevel
  ];
}

export function purchasePermanentUpgrade(
  profileState,
  unitId,
  statId,
  expectedCurrentLevel = null
) {
  if (
    !profileState ||
    !VALID_UPGRADE_UNITS.includes(
      unitId
    ) ||
    !VALID_UPGRADE_STATS.includes(
      statId
    )
  ) {
    return profileState;
  }

  const unitUpgrades =
    profileState.permanentUpgrades
      ?.[unitId];

  const currentLevel =
    unitUpgrades?.[statId];

  const isValidCurrentLevel =
    Number.isInteger(currentLevel) &&
    currentLevel >= 0 &&
    currentLevel <=
      MAX_PERMANENT_UPGRADE_LEVEL;

  if (!isValidCurrentLevel) {
    return profileState;
  }

  if (
    expectedCurrentLevel !== null &&
    Number(expectedCurrentLevel) !==
      currentLevel
  ) {
    return profileState;
  }

  const upgradeCost =
    getPermanentUpgradeCost(
      currentLevel, statId
    );

  if (upgradeCost === null) {
    return profileState;
  }

  const currentMetaCrystal =
    Math.max(
      0,
      Math.floor(
        Number(
          profileState.metaCrystal
        ) || 0
      )
    );

  if (
    currentMetaCrystal <
    upgradeCost
  ) {
    return profileState;
  }

  const nextProfileState = {
    ...profileState,

    metaCrystal:
      currentMetaCrystal -
      upgradeCost,

    permanentUpgrades: {
      ...profileState
        .permanentUpgrades,

      [unitId]: {
        ...unitUpgrades,

        [statId]:
          currentLevel + 1
      }
    }
  };

  saveProfileState(
    nextProfileState
  );

  return nextProfileState;
}

export function purchaseSkill(profile, skillId) {
  const unit = skillId === 'intercept' ? 'guard' : skillId === 'volley' ? 'archer' : null;
  if (!unit || profile.metaCrystal < 150 || profile.unlockedSkills?.[unit]?.includes(skillId)) return profile;
  const next = { ...profile, metaCrystal: profile.metaCrystal - 150, unlockedSkills: { ...profile.unlockedSkills, [unit]: [...(profile.unlockedSkills?.[unit] ?? []), skillId] } };
  saveProfileState(next);
  return next;
}
