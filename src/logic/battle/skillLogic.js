import { isUnitStunned } from './statusLogic.js';
import { evaluateBasicAttackSpatialCandidate } from './atrLogic.js';

// Prototype balance values, not production canon. Cooldown 2: cast T1, ready T3.
export const SKILLS = {
  fortify: { id: 'fortify', unit: 'guard', name: 'Fortify', icon: '◇', core: true, ap: 1, cooldown: 2, range: 2, description: 'Grant 4 temporary Shield to yourself or one ally within 2 tiles. Expires after the next Enemy Turn. Does not stack.' },
  intercept: { id: 'intercept', unit: 'guard', name: 'Intercept', icon: '↪', price: 150, ap: 1, cooldown: 2, range: 2, description: 'Protect one other ally within 2 tiles until the next Enemy Turn ends. Redirect their first incoming basic attack to Guard. Guard must remain alive and within 2 tiles. Area effects are not redirected.' },
  pinning_shot: { id: 'pinning_shot', unit: 'archer', name: 'Pinning Shot', icon: '◎', core: true, ap: 1, cooldown: 2, description: 'Pin one enemy within Attack Range for one Enemy Turn. No damage. Prevents movement, not attacks or special actions.' },
  volley: { id: 'volley', unit: 'archer', name: 'Volley', icon: '✦', price: 150, ap: 2, cooldown: 2, description: 'Target an enemy within Attack Range. Hit enemies in a 3×3 area centered on it for 60% ATK, rounded down after Cover. No friendly fire. Each affected enemy requires a clear action path.' }
};
const STAGE1_FORTIFY = {
  ...SKILLS.fortify,
  ap: 2,
  cooldown: 0,
  range: 0,
  description: 'Self only. Gain 6 Shield immediately. No cooldown or stacking. Expires when depleted or when the next Player Turn begins.'
};

export function getSkillDefinition(state, id) {
  if (state?.flowContext === 'stage1_redesign' && id === 'fortify') {
    return STAGE1_FORTIFY;
  }
  return SKILLS[id] ?? null;
}

export function getSkillsForUnit(state, unitId) {
  if (state?.flowContext === 'stage1_redesign') {
    return unitId === 'guard' ? [STAGE1_FORTIFY] : [];
  }
  return Object.values(SKILLS).filter((skill) => skill.unit === unitId);
}
export function skillOwned(profile, id) {
  const s = SKILLS[id];
  return Boolean(s && (s.core || profile?.unlockedSkills?.[s.unit]?.includes(id)));
}
export function skillBlockReason(state, profile, id) {
  const unit = state?.playerUnits?.find(u => u.battleUnitId === state.selectedUnitId);
  const s = getSkillDefinition(state, id);
  if (!s || !unit || unit.unitDefId !== s.unit || unit.currentHP <= 0) return 'Invalid character';
  if (state.phase !== 'player_phase') return 'Player Turn only';
  if (state.flowContext === 'tutorial' && !state.tutorialState?.phaseId?.startsWith('phase_8')) return 'Available in Tutorial Phase 8';
  if (isUnitStunned(unit)) return 'Stunned';
  if (!skillOwned(profile, id)) return 'Unlock in Shop';
  if (state.flowContext === 'stage1_redesign' && id === 'fortify' && (unit.fortifyShield ?? 0) > 0) return 'Already Fortified';
  if ((unit.skillCooldowns?.[id] ?? 0) > 0) return `Cooldown: ${unit.skillCooldowns[id]} turn(s)`;
  if (state.teamApCurrent < s.ap) return 'Not enough Team AP';
  return null;
}
export function skillTargets(map, state, id) {
  const s = getSkillDefinition(state, id);
  const caster = state.playerUnits.find(u => u.battleUnitId === state.selectedUnitId);
  if (!s || !caster) return [];
  if (state.flowContext === 'stage1_redesign' && id === 'fortify') return [caster];
  const friendly = s.unit === 'guard';
  return (friendly ? state.playerUnits : state.enemyUnits).filter(u => {
    if (u.currentHP <= 0 || (id === 'intercept' && u.battleUnitId === caster.battleUnitId)) return false;
    if (friendly && u.battleUnitId === caster.battleUnitId) return true;
    return evaluateBasicAttackSpatialCandidate(map, { ...caster, derivedStats: { ...caster.derivedStats, atr: s.range ?? caster.derivedStats.atr } }, u).actionValid;
  });
}
export function volleyTargets(map, state, caster, center) {
  return state.enemyUnits.filter(u => u.currentHP > 0 && Math.abs(u.tileX - center.tileX) <= 1 && Math.abs(u.tileY - center.tileY) <= 1 && evaluateBasicAttackSpatialCandidate(map, { ...caster, derivedStats: { ...caster.derivedStats, atr: Infinity } }, u).actionValid);
}
export function resolveSkill(map, state, profile, id, targetId) {
  const error = skillBlockReason(state, profile, id);
  if (error) return { battleState: state, error };
  const target = skillTargets(map, state, id).find(u => u.battleUnitId === targetId);
  if (!target) return { battleState: state, error: 'Target no longer valid' };
  const s = getSkillDefinition(state, id);
  const caster = state.playerUnits.find(u => u.battleUnitId === state.selectedUnitId);
  let next = { ...state, teamApCurrent: state.teamApCurrent - s.ap,
    playerUnits: state.playerUnits.map(u => u === caster ? { ...u, movementLocked: true, hasActed: true, skillCooldowns: s.cooldown > 0 ? { ...u.skillCooldowns, [id]: s.cooldown } : { ...u.skillCooldowns } } : { ...u }),
    enemyUnits: state.enemyUnits.map(u => ({ ...u })) };
  if (id === 'fortify') next.playerUnits = next.playerUnits.map(u => u.battleUnitId === targetId
    ? state.flowContext === 'stage1_redesign'
      ? { ...u, fortifyShield: 6 }
      : { ...u, temporaryShield: Math.max(u.temporaryShield ?? 0, 4) }
    : u);
  if (id === 'intercept') {
    next.playerUnits = next.playerUnits.map(u => {
      const clean = u.interceptBy === caster.battleUnitId ? { ...u, interceptBy: null } : u;
      return u.battleUnitId === targetId ? { ...clean, interceptBy: caster.battleUnitId } : clean;
    });
  }
  if (id === 'pinning_shot') next.enemyUnits = next.enemyUnits.map(u => u.battleUnitId === targetId ? { ...u, pinnedEnemyTurns: 1 } : u);
  const hits = [];
  if (id === 'volley') {
    for (const victim of volleyTargets(map, state, caster, target)) {
      const path = evaluateBasicAttackSpatialCandidate(map, caster, victim).pathResult;
      const damage = Math.max(0, Math.floor(caster.derivedStats.atk * 0.6 * (1 - (path.coverPercentage ?? 0))));
      next.enemyUnits = next.enemyUnits.map(u => u.battleUnitId === victim.battleUnitId ? { ...u, currentHP: Math.max(0, u.currentHP - damage) } : u);
      hits.push(`${victim.name}: -${damage} HP`);
    }
  }
  next.feedbackMessage = `${s.name} → ${target.name}. ${hits.join(' · ')} Team AP -${s.ap}.`;
  next.battleControlState = 'unit_selected_movement';
  return { battleState: next, error: null };
}
export function finishSkillEnemyTurn(state) {
  return { ...state,
    playerUnits: state.playerUnits.map(u => {
      const nextUnit = { ...u, temporaryShield: 0, interceptBy: null,
        skillCooldowns: Object.fromEntries(Object.entries(u.skillCooldowns ?? {}).map(([k,v]) => [k, Math.max(0, v - 1)])) };
      return state.flowContext === 'stage1_redesign'
        ? { ...nextUnit, fortifyShield: 0 }
        : nextUnit;
    }),
    enemyUnits: state.enemyUnits.map(u => ({ ...u, pinnedEnemyTurns: Math.max(0, (u.pinnedEnemyTurns ?? 0) - 1) })) };
}
