import { SKILLS, skillBlockReason, skillTargets, volleyTargets } from '../../logic/battle/skillLogic.js';
export function renderSkillPanel(map, state, profile) {
  if (!['skill_menu','skill_targeting'].includes(state.battleControlState)) return '';
  const caster = state.playerUnits.find(u => u.battleUnitId === state.selectedUnitId);
  const skill = SKILLS[state.selectedSkill];
  const targeting = state.battleControlState === 'skill_targeting';
  return `<section class="skill-panel" role="dialog" aria-label="Skills"><h2>${targeting ? skill.name + ': choose target' : caster.name + ' · Skills'}</h2>
    ${targeting ? skillTargets(map, state, skill.id).map(u => `<button data-skill-target="${u.battleUnitId}">${u.name} · (${u.tileX}, ${u.tileY}) · HP ${u.currentHP}${skill.id === 'volley' ? `<small>3×3 hits: ${volleyTargets(map,state,caster,u).map(v => v.name).join(', ')}</small>` : ''}</button>`).join('') || '<p>No valid targets in range.</p>' : Object.values(SKILLS).filter(s => s.unit === caster.unitDefId).map(s => { const reason = skillBlockReason(state,profile,s.id); return `<button data-skill-id="${s.id}" ${reason ? 'disabled' : ''}><strong>${s.icon} ${s.name} · ${s.ap} AP</strong><small>${reason ?? s.description}</small></button>`; }).join('')}
    <p>${targeting ? 'Click a target to cast. No AP spent when cancelling.' : 'Choose a skill. Cooldowns reset between stages.'}</p><button data-skill-back>BACK (Esc)</button></section>`;
}
