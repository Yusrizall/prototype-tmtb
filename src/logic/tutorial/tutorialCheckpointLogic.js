export function captureTutorialCheckpoint(
  checkpointId,
  battleState
) {
  return {
    checkpointId,
    snapshot: structuredClone(battleState)
  };
}

export function restoreTutorialCheckpoint(
  checkpoint
) {
  if (!checkpoint?.snapshot) {
    throw new Error(
      "Tutorial checkpoint tidak memiliki snapshot."
    );
  }

  return structuredClone(
    checkpoint.snapshot
  );
}
