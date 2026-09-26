export const VALIDATION_SCHEMA_VERSION = 2;
export const VALIDATION_BUILD_VERSION = "stage1-redesign-v0.4-two-stage";
export const VALIDATION_DESIGN_VERSION = "TMTB battle redesign v0.4";
export const VALIDATION_STAGE_1_ID = "r1_stage1_redesign_v0_2";
export const VALIDATION_STAGE_2_ID = "r1_stage2_validation_placeholder_v0_1";

function clone(value) {
  return value == null ? value : structuredClone(value);
}

function getStageKey(stageId) {
  return stageId === VALIDATION_STAGE_2_ID ? "stage2" : "stage1";
}

function getAttemptNumber(session, stageId) {
  return stageId === VALIDATION_STAGE_2_ID
    ? session.stage2AttemptNumber
    : session.stage1AttemptNumber;
}

export function appendValidationSessionEvent(
  session,
  eventType,
  {
    stageId = session.currentStageId,
    attemptNumber = getAttemptNumber(session, stageId),
    payload = {},
    timestamp = new Date().toISOString()
  } = {}
) {
  if (!session || !eventType) return session;
  let safePayload = {};
  try {
    safePayload = clone(payload) ?? {};
  } catch {
    safePayload = { telemetry_capture_error: "payload_not_cloneable" };
  }

  return {
    ...session,
    events: [
      ...(session.events ?? []),
      {
        participant_code: session.participantCode,
        session_id: session.sessionId,
        attempt_number: attemptNumber ?? 0,
        stage_id: stageId ?? null,
        timestamp,
        player_turn: null,
        phase: session.phase,
        event_type: eventType,
        actor_id: null,
        target_id: null,
        payload: safePayload
      }
    ]
  };
}

export function createTwoStageValidationSession(
  {
    participantCode,
    sessionId,
    timestamp = new Date().toISOString()
  }
) {
  const session = {
    schemaVersion: VALIDATION_SCHEMA_VERSION,
    buildVersion: VALIDATION_BUILD_VERSION,
    designVersion: VALIDATION_DESIGN_VERSION,
    participantCode,
    sessionId,
    startedAt: timestamp,
    endedAt: null,
    status: "active",
    phase: "stage_1",
    currentStageId: VALIDATION_STAGE_1_ID,
    stage1AttemptNumber: 1,
    stage2AttemptNumber: 0,
    stageResults: { stage1: [], stage2: [] },
    stage1FinalHP: null,
    stage2EntrySnapshot: null,
    stage2FinalHP: null,
    buffDecision: {
      offers: [],
      selectionHistory: [],
      selectedBuffId: null,
      confirmedBuffId: null,
      skipped: false,
      effectsActive: false,
      startedAt: null,
      decisionDurationMs: null
    },
    finalOutcome: null,
    exportStatus: "not_required",
    exportFeedback: null,
    events: []
  };

  return appendValidationSessionEvent(session, "session_started", {
    stageId: null,
    attemptNumber: 0,
    payload: {
      build_version: session.buildVersion,
      design_version: session.designVersion,
      schema_version: session.schemaVersion
    },
    timestamp
  });
}

export function syncValidationBattleEvents(session, battleState) {
  if (!session || !battleState?.telemetryEvents) return session;
  return {
    ...session,
    events: clone(battleState.telemetryEvents)
  };
}

export function captureValidationBattleResult(session, battleState) {
  if (!session || !battleState?.resultSnapshot) return session;
  const synced = syncValidationBattleEvents(session, battleState);
  const snapshot = clone(battleState.resultSnapshot);
  const stageId = snapshot.stage.id;
  const stageKey = getStageKey(stageId);
  const attemptNumber = snapshot.metrics.attemptNumber;
  const existing = synced.stageResults[stageKey].some((entry) => (
    entry.stage.id === stageId && entry.metrics.attemptNumber === attemptNumber
  ));
  if (existing) return synced;

  const finalGuardHP = snapshot.metrics.finalGuardHP;
  let next = {
    ...synced,
    stageResults: {
      ...synced.stageResults,
      [stageKey]: [...synced.stageResults[stageKey], snapshot]
    },
    stage1FinalHP: stageKey === "stage1" ? finalGuardHP : synced.stage1FinalHP,
    stage2FinalHP: stageKey === "stage2" ? finalGuardHP : synced.stage2FinalHP,
    finalOutcome: synced.finalOutcome,
    exportStatus:
      stageKey === "stage1" && snapshot.result === "victory"
        ? "not_required"
        : "required",
    exportFeedback:
      stageKey === "stage1" && snapshot.result === "victory"
        ? "Continue to Buff Selection. Export is required after Stage 2."
        : "Export JSON is required before Retry or Main Menu."
  };

  next = appendValidationSessionEvent(next, "battle_result_created", {
    stageId,
    attemptNumber,
    payload: {
      result: snapshot.result,
      final_guard_hp: finalGuardHP,
      reward: snapshot.metrics.crystalGained,
      total_turns: snapshot.metrics.totalTurns,
      duration_ms: snapshot.metrics.durationMs
    }
  });

  if (stageKey === "stage2" && snapshot.result === "victory") {
    next = endTwoStageValidationSession(next, "victory");
  }

  return next;
}

export function prepareValidationBuffDecision(
  session,
  offers,
  timestamp = new Date().toISOString()
) {
  let next = {
    ...session,
    phase: "buff_selection",
    currentStageId: null,
    buffDecision: {
      offers: clone(offers),
      selectionHistory: [],
      selectedBuffId: null,
      confirmedBuffId: null,
      skipped: false,
      effectsActive: false,
      startedAt: timestamp,
      decisionDurationMs: null
    }
  };
  return appendValidationSessionEvent(next, "buff_offers_generated", {
    stageId: null,
    attemptNumber: 0,
    payload: {
      offers: offers.map((offer) => offer.buffId),
      effects_active: false
    },
    timestamp
  });
}

export function recordValidationBuffSelection(
  session,
  selectedBuffId,
  timestamp = new Date().toISOString()
) {
  const historyEntry = { selected_buff_id: selectedBuffId, timestamp };
  let next = {
    ...session,
    buffDecision: {
      ...session.buffDecision,
      selectedBuffId,
      selectionHistory: [
        ...session.buffDecision.selectionHistory,
        historyEntry
      ]
    }
  };
  return appendValidationSessionEvent(next, "buff_selection_changed", {
    stageId: null,
    attemptNumber: 0,
    payload: {
      selected_buff_id: selectedBuffId,
      effects_active: false
    },
    timestamp
  });
}

export function completeValidationBuffDecision(
  session,
  selectedBuffId,
  timestamp = new Date().toISOString()
) {
  const started = Date.parse(session.buffDecision.startedAt);
  const ended = Date.parse(timestamp);
  const durationMs = Number.isFinite(started) && Number.isFinite(ended)
    ? Math.max(0, ended - started)
    : 0;
  const skipped = !selectedBuffId;
  let next = {
    ...session,
    buffDecision: {
      ...session.buffDecision,
      selectedBuffId,
      confirmedBuffId: selectedBuffId,
      skipped,
      effectsActive: false,
      decisionDurationMs: durationMs
    }
  };
  next = appendValidationSessionEvent(
    next,
    skipped ? "buff_skipped" : "buff_confirmed",
    {
      stageId: null,
      attemptNumber: 0,
      payload: {
        selected_buff_id: selectedBuffId,
        decision_duration_ms: durationMs,
        effects_active: false
      },
      timestamp
    }
  );
  return next;
}

export function captureStage2EntrySnapshot(session, battleState) {
  const guard = battleState.playerUnits.find((unit) => unit.unitDefId === "guard");
  const snapshot = clone({
    stage_id: battleState.stageId,
    entry_hp: guard?.currentHP ?? 0,
    max_hp: guard?.maxHP ?? 0,
    position: guard ? { x: guard.tileX, y: guard.tileY } : null,
    attempt_number: battleState.stage1Session?.attemptNumber ?? 1
  });
  let next = {
    ...session,
    phase: "stage_2",
    currentStageId: VALIDATION_STAGE_2_ID,
    stage2AttemptNumber: 1,
    stage2EntrySnapshot: snapshot,
    exportStatus: "not_required",
    exportFeedback: null
  };
  return appendValidationSessionEvent(next, "stage_transitioned", {
    stageId: VALIDATION_STAGE_2_ID,
    attemptNumber: 1,
    payload: {
      from_stage_id: VALIDATION_STAGE_1_ID,
      to_stage_id: VALIDATION_STAGE_2_ID,
      entry_hp: snapshot.entry_hp,
      buff_effects_active: false
    }
  });
}

export function setValidationAttemptNumber(session, stageId, attemptNumber) {
  return {
    ...session,
    status: "active",
    endedAt: null,
    finalOutcome: null,
    currentStageId: stageId,
    stage1AttemptNumber:
      stageId === VALIDATION_STAGE_1_ID ? attemptNumber : session.stage1AttemptNumber,
    stage2AttemptNumber:
      stageId === VALIDATION_STAGE_2_ID ? attemptNumber : session.stage2AttemptNumber,
    exportStatus: "not_required",
    exportFeedback: null
  };
}

export function recordValidationExportRequested(session) {
  const next = {
    ...session,
    exportStatus: "requested",
    exportFeedback: "Preparing complete-session JSON export…"
  };
  return appendValidationSessionEvent(next, "export_requested", {
    payload: { scope: "complete_session" }
  });
}

export function recordValidationExportSucceeded(session) {
  const next = {
    ...session,
    exportStatus: "succeeded",
    exportFeedback: "Export succeeded. Download initiation completed."
  };
  return appendValidationSessionEvent(next, "export_succeeded", {
    payload: { scope: "complete_session", download_initiated: true }
  });
}

export function recordValidationExportFailed(session, message) {
  const next = {
    ...session,
    exportStatus: "failed",
    exportFeedback: `Export failed: ${message}. Gameplay state and snapshots are unchanged.`
  };
  return appendValidationSessionEvent(next, "export_failed", {
    payload: { scope: "complete_session", error: String(message) }
  });
}

export function endTwoStageValidationSession(
  session,
  outcome,
  timestamp = new Date().toISOString()
) {
  if (session.status === "completed") return session;
  let next = {
    ...session,
    status: "completed",
    endedAt: timestamp,
    finalOutcome: outcome
  };
  return appendValidationSessionEvent(next, "session_ended", {
    payload: { outcome },
    timestamp
  });
}

export function serializeTwoStageValidationSession(session) {
  return JSON.stringify({
    schema_version: session.schemaVersion,
    build_version: session.buildVersion,
    design_version: session.designVersion,
    participant_code: session.participantCode,
    session_id: session.sessionId,
    started_at: session.startedAt,
    ended_at: session.endedAt,
    status: session.status,
    final_session_outcome: session.finalOutcome,
    stage_1: {
      stage_id: VALIDATION_STAGE_1_ID,
      attempts: clone(session.stageResults.stage1),
      final_hp: session.stage1FinalHP
    },
    buff_selection: {
      ...clone(session.buffDecision),
      effects_active: false
    },
    stage_2: {
      stage_id: VALIDATION_STAGE_2_ID,
      placeholder: true,
      entry_snapshot: clone(session.stage2EntrySnapshot),
      attempts: clone(session.stageResults.stage2),
      final_hp: session.stage2FinalHP,
      reward: 0
    },
    events: clone(session.events)
  }, null, 2);
}
