import test from "node:test";
import assert from "node:assert/strict";
import {
  getBattleCameraFocusKey
} from "../../src/ui/battle/battleCameraLogic.js";

test("Phase 6 completion task focuses Region C without changing phase", () => {
  const battleState = {
    flowContext: "tutorial",
    tutorialState: {
      phaseId:
        "phase_6_spear_defensive_cover_objective",
      taskId: "proceed_to_region_c"
    }
  };

  assert.equal(
    getBattleCameraFocusKey(battleState),
    "tutorial:C"
  );
});
