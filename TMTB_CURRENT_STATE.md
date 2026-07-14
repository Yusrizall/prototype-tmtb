# TMTB Prototype Current State

**Checkpoint:** Phase 1 — Movement Keyboard v0  
**Status:** Aktif dikembangkan  
**Project root lokal:** `C:\Datas\prototype-tmtb`

## 1. Technology

- Vite
- Vanilla JavaScript
- HTML
- CSS
- JSON
- `fetch`

Environment yang pernah terkonfirmasi:

- Node.js: `v24.16.0`
- npm: `11.13.0`
- Local development server: `http://localhost:5173/`

## 2. Struktur Project Aktual

```text
prototype-tmtb/
├── index.html
├── package.json
├── package-lock.json
├── public/
│   └── data/
│       ├── units/
│       ├── maps/
│       └── encounters/
└── src/
    ├── main.js
    ├── style.css
    ├── logic/
    │   ├── shared/
    │   │   └── dataLoader.js
    │   └── battle/
    │       ├── battleSetup.js
    │       └── movementLogic.js
    └── ui/
        ├── mapRenderer.js
        └── battle/
            └── battleHud.js
```

Struktur persis harus selalu diverifikasi terhadap ZIP/project aktual sebelum perubahan.

## 3. Data Aktif

Data JSON berada di:

```text
public/data/
```

Path fetch yang benar:

```text
/data/...
```

Bukan:

```text
/public/data/...
```

Data yang sudah ada:

```text
public/data/units/player_units.json
public/data/units/enemy_units.json
public/data/maps/r1_stage1_fixed.json
public/data/encounters/r1_stage1_baseline_eval_encounter.json
```

## 4. Fitur yang Sudah Berjalan

- Vite project berjalan.
- Starter Vite sudah dibersihkan.
- Placeholder prototype sudah tampil.
- JSON loader sudah membaca data awal.
- Grid Stage 1 sudah dirender dari Map JSON.
- Battle state awal dibangun dari:
  - Map Definition
  - Encounter Definition
  - Unit Definitions
- Spawn runtime:
  - Guard
  - Archer
  - Sword Enemy A
  - Sword Enemy B
- Battle HUD v0 sudah tampil:
  - top bar;
  - roster panel;
  - battlefield;
  - unit detail;
  - command band;
  - input hint bar.
- Guard menjadi selected unit awal.
- WASD/Arrow menggerakkan unit aktif.
- `Q` mengganti unit non-exhausted.
- Movement masih dihitung dari `originTile`.
- Obstacle tidak dapat ditempati.
- Klik tile cyan masih tersedia sebagai debug movement sementara.
- Unit runtime sudah memiliki konsep:
  - `originTile`;
  - current position;
  - `turnState`;
  - `hasActed`;
  - current HP;
  - derived stats.

## 5. Known Gaps

### Movement

Implementasi movement saat ini masih perlu diaudit/diperbaiki:

- movement area masih diduga berbasis Manhattan distance, belum pathfinding penuh;
- obstacle mungkin baru memblokir occupancy, belum memutus reachability secara path;
- ally masih diperlakukan sebagai blocker penuh;
- traversal ally dan destination ally belum dibedakan;
- enemy dan ally belum memiliki rule traversal yang berbeda;
- reset `originTile` pada turn berikutnya belum terkonfirmasi.

Target rule:

```text
Traversal:
- obstacle: blocked
- enemy: blocked
- ally: passable

Destination:
- obstacle: invalid
- enemy: invalid
- ally occupied: invalid
```

### Data Loader

Pastikan semua fetch memakai:

```text
/data/...
```

agar development dan production build konsisten.

## 6. Belum Diimplementasikan

- Action Menu aktif.
- `Attack`.
- `Skill`.
- `Wait`.
- Back flow menggunakan `Z`.
- `atrLogic`.
- Target validity.
- Target cycling.
- Path/line obstacle untuk attack.
- Cover outcome.
- Damage calculation.
- HP reduction.
- Unit defeated.
- Exhaustion setelah action.
- Player Turn completion.
- Enemy Turn.
- Enemy AI.
- Turn counter update.
- `eliminate_all` resolver.
- Victory check.
- Defeat check.
- Victory/Defeat overlay.
- Crystal reward.
- Telemetry.
- Reward selection.
- Map progression.
- Run Crystal/Meta Crystal.
- Shop-lite.
- Tutorial system.
- Profile save.
- Active run resume.
- Auto-simulation.

## 7. Current Implementation Phase

### Phase 0 — Setup

Status: selesai.

### Phase 1 — Battle Core Minimal

Status: berjalan.

Target akhir Phase 1:

```text
Stage 1 playable dari battle start sampai Victory/Defeat
```

Cakupan:

```text
movement rule stabil
→ Action Menu
→ Wait
→ Attack
→ ATR target selection
→ damage dan cover
→ exhausted/turn transition
→ Enemy Turn sederhana
→ eliminate_all
→ Victory/Defeat Result
```

## 8. Next Recommended Step

Sebelum Action Menu, lakukan audit/perbaikan kecil terhadap movement agar rule dasarnya stabil.

Urutan aman:

1. Backup/checkpoint project saat ini.
2. Buka dan audit `src/logic/battle/movementLogic.js`.
3. Verifikasi:
   - bagaimana reachable tiles dihitung;
   - bagaimana obstacle dibaca;
   - bagaimana ally/enemy occupancy dibaca.
4. Perbaiki satu rule movement dalam satu langkah.
5. Jalankan prototype.
6. Verifikasi expected result.
7. Setelah movement stabil, lanjut Action Menu v0.
8. Implementasikan `Wait` sebelum `Attack`.

## 9. Workflow Wajib

Setiap perubahan harus berisi:

- tujuan;
- path file;
- jenis perubahan;
- langkah satu per satu;
- kode siap tempel;
- expected result;
- checkpoint verifikasi.

Jangan menambah file/folder tanpa instruksi eksplisit.
