function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getSettlementResult(runState) {
  if (runState?.runStatus === "completed") return "completed";
  if (runState?.runStatus === "defeated") return "defeated";
  return null;
}

function getBattleHistory(runState) {
  const history = runState?.battleResultHistory ?? [];
  if (history.length > 0) return history;
  return runState?.lastBattleResult
    ? [runState.lastBattleResult]
    : [];
}

function getNodeTypeSummary(runState) {
  const visitedNodes = (runState?.generatedNodes ?? []).filter((node) => {
    return node.status === "completed" || node.status === "failed";
  });
  const counts = new Map();

  visitedNodes.forEach((node) => {
    const label = String(node.nodeType ?? "stage")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return counts.size > 0
    ? [...counts.entries()].map(([label, count]) => `${label}: ${count}`)
    : ["No completed encounters"];
}

function renderFinalParty(party = []) {
  if (party.length === 0) {
    return '<p class="settlement-empty-copy">No final party record is available.</p>';
  }

  return party.slice(0, 4).map((unit) => {
    const maxHP = Math.max(0, Number(unit.maxHP) || 0);
    const currentHP = Math.max(0, Number(unit.currentHP) || 0);
    const percent = maxHP > 0
      ? Math.round((currentHP / maxHP) * 100)
      : 0;
    const isDefeated = unit.status === "defeated" || currentHP === 0;

    return `
      <article class="settlement-party-row ${isDefeated ? "settlement-party-defeated" : ""}">
        <span class="settlement-unit-portrait">${String(unit.name ?? "?").slice(0, 1).toUpperCase()}</span>
        <div>
          <div class="settlement-party-heading">
            <strong>${unit.name ?? "Unknown Unit"}</strong>
            <span>${currentHP} / ${maxHP}</span>
          </div>
          <div class="settlement-hp-track" role="progressbar" aria-label="${unit.name ?? "Unit"} HP" aria-valuemin="0" aria-valuemax="${maxHP}" aria-valuenow="${currentHP}">
            <span style="width: ${percent}%"></span>
          </div>
        </div>
        ${isDefeated ? '<strong class="settlement-defeated-label">DEFEATED</strong>' : ''}
      </article>
    `;
  }).join("");
}

function renderActiveBuffs(activeRunBuffs = []) {
  if (activeRunBuffs.length === 0) {
    return '<p class="settlement-empty-copy">No buffs were taken this run.</p>';
  }

  return activeRunBuffs.map((buff) => {
    return `
      <article class="settlement-buff-item buff-rarity-${buff.rarity}">
        <span class="settlement-buff-icon">${buff.icon ?? "✦"}</span>
        <div>
          <strong>${buff.name}</strong>
          <p>${buff.description}</p>
        </div>
      </article>
    `;
  }).join("");
}

export function renderRunSettlementScreen(runState) {
  const result = getSettlementResult(runState);
  const isComplete = result === "completed";
  const isDefeat = result === "defeated";
  const isSettled = runState?.crystalConversionCompleted === true;

  if (!isSettled || (!isComplete && !isDefeat)) {
    return `
      <main class="flow-screen">
        <section class="flow-card error-card">
          <p class="eyebrow">Settlement State Error</p>
          <h1>Run settlement is unavailable.</h1>
        </section>
      </main>
    `;
  }

  const history = getBattleHistory(runState);
  const finalResult = runState.lastBattleResult ?? history.at(-1) ?? null;
  const finalStage = finalResult?.stage?.name ?? "Unknown location";
  const enemyDefeated = history.reduce((total, battle) => {
    return total + Math.max(0, Number(battle.metrics?.enemyDefeated) || 0);
  }, 0);
  const totalTurns = history.reduce((total, battle) => {
    return total + Math.max(0, Number(battle.metrics?.totalTurns) || 0);
  }, 0);
  const completedCount = (runState.completedNodeIds ?? []).length;
  const crystalTotal = Math.max(0, Number(runState.convertedRunCrystal) || 0);
  const nodeTypeSummary = getNodeTypeSummary(runState)
    .map((item) => `<li>${item}</li>`)
    .join("");
  const resultTitle = isComplete ? "RUN COMPLETE" : "RUN FAILED";
  const resultKicker = isComplete ? "REGION 1 CLEARED" : "RUN ENDED";
  const resultCopy = isComplete
    ? "The River Bridge Approach has been secured."
    : `Your party fell at ${finalStage}.`;

  return `
    <main class="flow-screen settlement-screen">
      <section class="flow-card run-settlement-card ${isComplete ? "run-settlement-complete" : "run-settlement-failed"}">
        <header class="run-settlement-header">
          <p class="eyebrow">${resultKicker}</p>
          <h1>${resultTitle}</h1>
          <p>${resultCopy}</p>
        </header>

        <div class="run-settlement-layout">
          <section class="settlement-summary-panel">
            <h2>RUN SUMMARY</h2>
            <dl class="settlement-summary-list">
              <div><dt>Last Location</dt><dd>${finalStage}</dd></div>
              <div><dt>Encounters Cleared</dt><dd>${pluralize(completedCount, "node")}</dd></div>
              <div><dt>Enemies Defeated</dt><dd>${enemyDefeated}</dd></div>
              <div><dt>Total Turns</dt><dd>${totalTurns}</dd></div>
            </dl>
            <h3>NODE TYPES</h3>
            <ul class="settlement-node-types">${nodeTypeSummary}</ul>
          </section>

          <section class="settlement-party-panel">
            <h2>FINAL PARTY STATUS</h2>
            <div class="settlement-party-list">
              ${renderFinalParty(finalResult?.party)}
            </div>
          </section>

          <section class="settlement-buffs-panel">
            <header><h2>ACTIVE BUFFS</h2><span>${runState.activeRunBuffs?.length ?? 0}</span></header>
            <div class="settlement-buff-list">
              ${renderActiveBuffs(runState.activeRunBuffs ?? [])}
            </div>
          </section>
        </div>

        <footer class="run-settlement-footer">
          <div class="settlement-crystal-reward">
            <span aria-hidden="true">◇</span>
            <div><small>RUN CRYSTAL</small><strong>+${crystalTotal}</strong></div>
          </div>
          <button type="button" class="main-menu-button main-menu-button-active" data-action="run-settlement-main-menu">
            <span>MAIN MENU</span><small>Enter / E / Space</small>
          </button>
        </footer>
      </section>
    </main>
  `;
}
