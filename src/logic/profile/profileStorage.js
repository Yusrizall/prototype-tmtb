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
  "atk",
  "def"
];

const DEFAULT_PROFILE_STATE = {
  version: 1,

  tutorialCompleted: false,

  metaCrystal: 0,

  permanentUpgrades: {
    guard: {
      maxHP: 0,
      atk: 0,
      def: 0
    },

    archer: {
      maxHP: 0,
      atk: 0,
      def: 0
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

function normalizeProfileState(
  savedProfile
) {
  const defaultProfile =
    createDefaultProfileState();

  return {
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
  currentLevel
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

  return PERMANENT_UPGRADE_COSTS[
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
      currentLevel
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