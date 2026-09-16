import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProfileState, purchasePermanentUpgrade, purchaseSkill, loadProfileState } from '../../src/logic/profile/profileStorage.js';
import { resolveSkill, finishSkillEnemyTurn, skillTargets, skillBlockReason } from '../../src/logic/battle/skillLogic.js';
import { resolveBasicAttackBetweenUnits } from '../../src/logic/battle/damageLogic.js';
import { resolveEnemyMovementPhase } from '../../src/logic/battle/enemyMovementLogic.js';
import { renderShop, createShopUi } from '../../src/ui/flow/shopScreen.js';
import { renderSkillPanel } from '../../src/ui/battle/skillPanel.js';
import { evaluateBasicAttackSpatialCandidate } from '../../src/logic/battle/atrLogic.js';
const storage = new Map();
globalThis.window = { localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) } };
const profile = () => normalizeProfileState({ metaCrystal: 1000 });
const map = { width: 9, height: 7, tiles: Array.from({length:7}, () => Array(9).fill('.')) };
function unit(id, side, x, y) { return { battleUnitId:id, unitDefId:id, name:id, side, currentHP:20, maxHP:20, tileX:x, tileY:y, derivedStats:{atk:7,atr:3,move:3}, startGrid:{x,y}, statuses:[], currentTargetId:'guard', currentIntent:{intentType:'basic_attack',targetId:'guard'} }; }
function state(selectedUnitId='guard') { return { phase:'player_phase', flowContext:'run_stage', battleControlState:'skill_targeting', selectedUnitId, teamApCurrent:4, playerUnits:[unit('guard','player',1,1),unit('archer','player',2,1)], enemyUnits:[unit('enemy','enemy',3,1),unit('enemy2','enemy',3,2)], structures:[] }; }
test('migration preserves crystal/tutorial/valid upgrades; discards DEF only', () => {
 const p = normalizeProfileState({metaCrystal:210,tutorialCompleted:true,permanentUpgrades:{guard:{maxHP:2,atk:1,def:3}}});
 assert.equal(p.metaCrystal,210); assert.equal(p.tutorialCompleted,true); assert.deepEqual(p.permanentUpgrades.guard,{maxHP:2,atk:1}); assert.equal(p.version,2);
});
test('new profile has no DEF and unlocked skills initialized', () => { storage.clear(); const p=loadProfileState(); assert.deepEqual(p.unlockedSkills,{guard:[],archer:[]}); assert.equal('def' in p.permanentUpgrades.guard,false); });
test('HP and ATK use distinct prices, no mutation of old profile', () => { const p=profile(); assert.equal(purchasePermanentUpgrade(p,'guard','maxHP',0).metaCrystal,970); assert.equal(purchasePermanentUpgrade(p,'guard','atk',0).metaCrystal,960); assert.equal(p.metaCrystal,1000); });
test('stale purchase, invalid unit, DEF, and insufficient funds are rejected', () => { const p=profile(); assert.equal(purchasePermanentUpgrade(p,'guard','atk',1),p); assert.equal(purchasePermanentUpgrade(p,'support','maxHP',0),p); assert.equal(purchasePermanentUpgrade(p,'guard','def',0),p); const poor={...p,metaCrystal:0}; assert.equal(purchasePermanentUpgrade(poor,'guard','maxHP',0),poor); });
test('four levels is a hard cap', () => { let p=profile(); for(let i=0;i<4;i++)p=purchasePermanentUpgrade(p,'guard','atk',i); assert.equal(p.permanentUpgrades.guard.atk,4); assert.equal(purchasePermanentUpgrade(p,'guard','atk',4),p); });
test('skill purchase persists exactly once and cannot buy a core skill', () => { const p=purchaseSkill(profile(),'volley'); assert.equal(p.metaCrystal,850); assert.equal(purchaseSkill(p,'volley'),p); assert.equal(purchaseSkill(p,'fortify'),p); assert.deepEqual(loadProfileState().unlockedSkills.archer,['volley']); });
test('Fortify applies shield, spends AP, locks movement, does not change HP', () => { const s=state(); const r=resolveSkill(map,s,profile(),'fortify','archer'); assert.equal(r.error,null); assert.equal(r.battleState.teamApCurrent,3); assert.equal(r.battleState.playerUnits[0].movementLocked,true); assert.equal(r.battleState.playerUnits[1].temporaryShield,4); assert.equal(s.playerUnits[1].temporaryShield,undefined); });
test('shield absorbs first then HP; second attack cannot reuse shield', () => { let s=resolveSkill(map,state(),profile(),'fortify','archer').battleState; let r=resolveBasicAttackBetweenUnits(s,'enemy','archer',{coverPercentage:0}); assert.equal(r.attackResult.shieldAbsorbed,4); assert.equal(r.battleState.playerUnits[1].currentHP,17); r=resolveBasicAttackBetweenUnits(r.battleState,'enemy2','archer',{coverPercentage:0}); assert.equal(r.battleState.playerUnits[1].currentHP,10); });
test('Shield and Intercept expire after Enemy Turn, cooldown ready T3', () => { let s=resolveSkill(map,state(),profile(),'fortify','guard').battleState; s=finishSkillEnemyTurn(s); assert.equal(s.playerUnits[0].temporaryShield,0); assert.equal(s.playerUnits[0].skillCooldowns.fortify,1); s=finishSkillEnemyTurn(s); assert.equal(s.playerUnits[0].skillCooldowns.fortify,0); });
test('Intercept redirects only first basic attack and preserves original ally', () => { const p=purchaseSkill(profile(),'intercept'); let s=resolveSkill(map,state(),p,'intercept','archer').battleState; let r=resolveBasicAttackBetweenUnits(s,'enemy','archer',{coverPercentage:0}); assert.equal(r.attackResult.targetId,'guard'); assert.equal(r.battleState.playerUnits[0].currentHP,13); assert.equal(r.battleState.playerUnits[1].currentHP,20); r=resolveBasicAttackBetweenUnits(r.battleState,'enemy2','archer',{coverPercentage:0}); assert.equal(r.battleState.playerUnits[1].currentHP,13); });
test('Intercept does not redirect when Guard dies or moves out of range', () => { for(const dead of [true,false]) { let s=state(); s.playerUnits[1].interceptBy='guard'; if(dead)s.playerUnits[0].currentHP=0; else s.playerUnits[0].tileX=8; const r=resolveBasicAttackBetweenUnits(s,'enemy','archer',{}); assert.equal(r.attackResult.targetId,'archer'); } });
test('Intercept cannot target self', () => { const p=purchaseSkill(profile(),'intercept'); const s=state(); assert.equal(resolveSkill(map,s,p,'intercept','guard').battleState,s); });
test('Pinning Shot does not damage; immobilization clears after enemy turn', () => { const s=resolveSkill(map,state('archer'),profile(),'pinning_shot','enemy').battleState; assert.equal(s.enemyUnits[0].currentHP,20); assert.equal(s.enemyUnits[0].pinnedEnemyTurns,1); assert.equal(finishSkillEnemyTurn(s).enemyUnits[0].pinnedEnemyTurns,0); });
test('Pinned enemy cannot move but can still resolve an attack', () => { let s=resolveSkill(map,state('archer'),profile(),'pinning_shot','enemy').battleState; const r=resolveEnemyMovementPhase(map,s,['enemy']); assert.equal(r.battleState.enemyUnits[0].tileX,3); assert.equal(r.battleState.enemyUnits[0].tileY,1); assert.ok(resolveBasicAttackBetweenUnits(s,'enemy','archer',{}).attackResult); });
test('Volley hits both enemies for floor(7*.6)=4 with no friendly fire', () => { const p=purchaseSkill(profile(),'volley'); const r=resolveSkill(map,state('archer'),p,'volley','enemy'); assert.equal(r.error,null); assert.deepEqual(r.battleState.enemyUnits.map(u=>u.currentHP),[16,16]); assert.deepEqual(r.battleState.playerUnits.map(u=>u.currentHP),[20,20]); assert.equal(r.battleState.teamApCurrent,2); });
test('Volley kills clamp at zero', () => { const p=purchaseSkill(profile(),'volley'); const s=state('archer'); s.enemyUnits[0].currentHP=2; assert.equal(resolveSkill(map,s,p,'volley','enemy').battleState.enemyUnits[0].currentHP,0); });
test('AP, ownership, stun and cooldown prevent casts without mutation', () => { const p=profile(); let s=state('archer'); assert.equal(resolveSkill(map,s,p,'volley','enemy').battleState,s); s.teamApCurrent=0; assert.equal(resolveSkill(map,s,p,'pinning_shot','enemy').battleState,s); s.teamApCurrent=4; s.playerUnits[1].statuses=[{statusId:'stun',remainingPlayerTurns:1}]; assert.equal(resolveSkill(map,s,p,'pinning_shot','enemy').battleState,s); s.playerUnits[1].statuses=[]; s.playerUnits[1].skillCooldowns={pinning_shot:1}; assert.match(skillBlockReason(s,p,'pinning_shot'),/Cooldown/); });
test('dead, out of range, opposing and invalid targets rejected without AP cost', () => { const s=state(); assert.equal(resolveSkill(map,s,profile(),'fortify','enemy').battleState,s); s.playerUnits[1].tileX=8; assert.equal(resolveSkill(map,s,profile(),'fortify','archer').battleState,s); s.playerUnits[1].tileX=2; s.playerUnits[1].currentHP=0; assert.equal(resolveSkill(map,s,profile(),'fortify','archer').battleState,s); });
test('tutorial skill eligibility starts in Phase 8; enemy phase is blocked', () => { const s=state(); s.flowContext='tutorial'; s.tutorialState={phaseId:'phase_7_status_temporal_threat'}; assert.ok(skillBlockReason(s,profile(),'fortify')); s.tutorialState.phaseId='phase_8_wave_graduation'; assert.equal(skillBlockReason(s,profile(),'fortify'),null); s.phase='enemy_phase'; assert.ok(skillBlockReason(s,profile(),'fortify')); });
test('Shop renders real base stats, skill state and locked pages', () => { const defs={units:[{unitId:'guard',maxHP:25,baseATK:5}]}; let ui=createShopUi(); assert.match(renderShop(profile(),ui,defs),/25/); assert.match(renderShop(profile(),ui,defs),/27/); ui.unit='support'; assert.match(renderShop(profile(),ui,defs),/CHARACTER LOCKED/); ui={...createShopUi(),tab:'skills',item:'fortify'}; assert.match(renderShop(profile(),ui,defs),/CORE SKILL/); });
test('skill panel renders list and target selection without charging AP', () => { const s=state(); s.battleControlState='skill_menu'; assert.match(renderSkillPanel(map,s,profile()),/Fortify/); s.battleControlState='skill_targeting'; s.selectedSkill='fortify'; assert.match(renderSkillPanel(map,s,profile()),/data-skill-target/); assert.equal(s.teamApCurrent,4); });
test('Volley applies Cover before rounding and respects center range', () => {
 const s=state('archer'); s.playerUnits[1].tileX=0; s.playerUnits[1].requiresPathCheck=true; s.playerUnits[1].usesProjectile=true;
 const covered=structuredClone(map); covered.tiles[1][1]='O30';
 const center=s.enemyUnits[0]; const cover=evaluateBasicAttackSpatialCandidate(covered,s.playerUnits[1],center).pathResult.coverPercentage;
 assert.equal(cover,.3);
 const r=resolveSkill(covered,s,purchaseSkill(profile(),'volley'),'volley','enemy');
 assert.equal(r.battleState.enemyUnits[0].currentHP,20-Math.floor(7*.6*.7));
 s.enemyUnits[0].tileX=8; assert.equal(resolveSkill(map,s,purchaseSkill(profile(),'volley'),'volley','enemy').battleState,s);
});
test('Intercept uses original attack Cover and Guard shield, without recursion', () => {
 let s=state(); s.playerUnits[1].interceptBy='guard'; s.playerUnits[0].temporaryShield=4;
 const r=resolveBasicAttackBetweenUnits(s,'enemy','archer',{coverPercentage:.3});
 assert.equal(r.attackResult.shieldAbsorbed,4); assert.equal(r.battleState.playerUnits[0].currentHP,20); assert.equal(r.battleState.playerUnits[1].interceptBy,null);
});
test('storage failure leaves in-memory purchase uncommitted', () => {
 const p=profile(); const original=window.localStorage.setItem;
 window.localStorage.setItem=()=>{throw new Error('quota');};
 try { assert.throws(()=>purchaseSkill(p,'intercept'),/quota/); assert.throws(()=>purchasePermanentUpgrade(p,'guard','atk',0),/quota/); assert.equal(p.metaCrystal,1000); }
 finally { window.localStorage.setItem=original; }
});
