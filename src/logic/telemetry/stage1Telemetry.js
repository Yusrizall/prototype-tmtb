const STAGE1_ID = "r1_stage1_redesign_v0_2";

export function normalizeParticipantCode(value) {
  return String(value ?? "").trim();
}

export function createStage1SessionId(randomUuid = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  if (typeof randomUuid === "function") {
    return randomUuid();
  }

  return `stage1_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

export function appendStage1TelemetryEvent(
  battleState,
  eventType,
  {
    actorId = null,
    targetId = null,
    payload = {},
    timestamp = new Date().toISOString()
  } = {}
) {
  if (!battleState?.stage1Session || !eventType) {
    return battleState;
  }

  let safePayload = {};
  try {
    safePayload = payload && typeof payload === "object"
      ? structuredClone(payload)
      : {};
  } catch {
    safePayload = { telemetry_capture_error: "payload_not_cloneable" };
  }

  const event = {
    participant_code: battleState.stage1Session.participantCode,
    session_id: battleState.stage1Session.sessionId,
    attempt_number: battleState.stage1Session.attemptNumber,
    stage_id: battleState.stageId ?? STAGE1_ID,
    timestamp,
    player_turn: battleState.turnCount ?? 1,
    phase: battleState.phase ?? null,
    event_type: eventType,
    actor_id: actorId,
    target_id: targetId,
    payload: safePayload
  };

  return {
    ...battleState,
    telemetryEvents: [
      ...(battleState.telemetryEvents ?? []),
      event
    ]
  };
}

export function serializeStage1Telemetry(battleState) {
  return JSON.stringify({
    schema_version: 1,
    stage_id: battleState?.stageId ?? STAGE1_ID,
    participant_code: battleState?.stage1Session?.participantCode ?? null,
    session_id: battleState?.stage1Session?.sessionId ?? null,
    exported_at: new Date().toISOString(),
    events: battleState?.telemetryEvents ?? []
  }, null, 2);
}
