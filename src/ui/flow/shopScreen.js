import { getPermanentUpgradeCost } from '../../logic/profile/profileStorage.js';
import { SKILLS, skillOwned } from '../../logic/battle/skillLogic.js';

export const createShopUi = () => ({ unit: 'guard', tab: 'upgrades', item: 'maxHP', message: '', busyUntil: 0 });
const names = { guard: 'Guard', archer: 'Archer', support: 'Support', trickster: 'Trickster' };
const stats = { maxHP: ['♡', 'Vitality Training', 'Max HP', 2], atk: ['⚔', 'Weapon Training', 'ATK', 1] };
export function renderShop(profile, ui, definitions = []) {
  const locked = !['guard', 'archer'].includes(ui.unit);
  const def = (definitions.units ?? definitions).find(d => d.unitId === ui.unit);
  const itemIds = ui.tab === 'upgrades' ? Object.keys(stats) : Object.values(SKILLS).filter(s => s.unit === ui.unit).map(s => s.id);
  const cards = itemIds.map(id => {
    const s = SKILLS[id];
    const lv = profile.permanentUpgrades?.[ui.unit]?.[id] ?? 0;
    const owned = s && skillOwned(profile, id);
    const cost = s ? s.price : getPermanentUpgradeCost(lv, id);
    const status = s ? (owned ? (s.core ? 'CORE · AVAILABLE' : 'OWNED') : `◆ ${cost}`) : (lv >= 4 ? 'MAX' : `Level ${lv} / 4 · ◆ ${cost}`);
    return `<button class="shop-card ${ui.item === id ? 'selected' : ''}" data-shop-item="${id}"><span class="shop-icon">${s?.icon ?? stats[id][0]}</span><span><strong>${s?.name ?? stats[id][1]}</strong><small>${status}</small></span></button>`;
  }).join('');
  const skill = SKILLS[ui.item];
  const info = stats[ui.item];
  const lv = profile.permanentUpgrades?.[ui.unit]?.[ui.item] ?? 0;
  const owned = skill && skillOwned(profile, ui.item);
  const max = !skill && lv >= 4;
  const cost = skill ? skill.price : getPermanentUpgradeCost(lv, ui.item);
  const base = ui.item === 'maxHP' ? (def?.maxHP ?? 0) : (def?.baseATK ?? 0);
  const current = base + lv * (info?.[3] ?? 0);
  return `<main class="shop-shell">
    <header class="shop-header"><button data-shop-back>← BACK</button><h1>SHOP</h1><strong>META CRYSTAL <span class="shop-balance">◆ ${profile.metaCrystal}</span></strong></header>
    <div class="shop-layout"><nav class="shop-rail" aria-label="Characters">${Object.entries(names).map(([id,name]) => `<button data-shop-unit="${id}" class="${ui.unit === id ? 'selected' : ''}" aria-pressed="${ui.unit === id}"><span class="shop-icon">${name[0]}</span>${name}<small>${['support','trickster'].includes(id) ? 'LOCKED' : ''}</small></button>`).join('')}</nav>
    ${locked ? `<section class="shop-locked"><h2>${names[ui.unit]}</h2><p>🔒 CHARACTER LOCKED</p><p>Unlock a future region to access this character.</p><p>Not available in this prototype.</p></section>` : `<section class="shop-catalog"><h2>${names[ui.unit]}</h2><p>Permanent progression · Applies to future runs</p><div class="shop-tabs">${['upgrades','skills'].map(tab => `<button data-shop-tab="${tab}" aria-pressed="${ui.tab === tab}" class="${ui.tab === tab ? 'selected' : ''}">${tab.toUpperCase()}</button>`).join('')}</div>${cards}</section>
    <aside class="shop-detail"><span class="shop-icon">${skill?.icon ?? info?.[0]}</span><h2>${skill?.name ?? info?.[1]}</h2><p>${skill?.description ?? `Permanently increase ${names[ui.unit]}'s ${info?.[2]} by ${info?.[3]} per level.`}</p>
    ${skill ? `<p>${owned ? 'AVAILABLE' : 'LOCKED → AVAILABLE'}</p><p>${skill.ap} AP · Cooldown ${skill.cooldown} turns</p><p>All owned skills appear in Action → Skill.</p>` : `<div class="shop-values"><span>CURRENT<strong>${current}</strong></span><span>→</span><span>${max ? 'MAX' : 'AFTER PURCHASE'}<strong>${max ? current : current + info[3]}</strong></span></div><p>Level ${lv} / 4 · ${'●'.repeat(lv)}${'○'.repeat(4-lv)}</p>`}
    <div class="shop-buy-area"><p>${owned || max ? 'No further purchase required.' : `COST ◆ ${cost}`}</p><button data-shop-buy data-level="${lv}" ${owned || max ? 'disabled' : ''}>${owned ? (skill.core ? 'CORE SKILL' : 'OWNED') : max ? 'MAX' : skill ? 'UNLOCK' : 'BUY'}</button><p class="shop-message" role="status">${ui.message || (!owned && !max && profile.metaCrystal < cost ? `Not enough Meta Crystal. Need ◆ ${cost-profile.metaCrystal} more.` : '')}</p></div></aside>`}
    </div></main>`;
}
