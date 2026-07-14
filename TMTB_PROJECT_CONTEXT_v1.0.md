# TMTB Prototype Project Context v1.0

## 1. Identitas Project

**Project:** TMTB / BeCan  
**Pemilik konteks desain:** YA  
**Role YA:** Game Designer

Prototype ini adalah versi 2D/simulatif dari game TMTB yang secara produksi ditujukan sebagai game 3D turn-based tactics.

Prototype digunakan untuk:

- memvalidasi mekanik, gameplay, flow, progression, dan keputusan pemain;
- melakukan balancing awal dan observasi parameter;
- menyediakan acuan fungsional untuk programmer Unity;
- menyediakan bare-bone UI agar tester dapat memahami informasi yang diperlukan;
- mendukung telemetry dan evaluasi playtest secara bertahap.

Prototype ini bukan:

- implementasi Unity final;
- visual UI/UX final;
- aset karakter/environment final;
- proyek technical tool yang menggantikan fokus Game Designer.

## 2. Pembagian Role

### YA — Game Designer

Bertanggung jawab pada:

- mechanic;
- gameplay;
- game flow;
- progression;
- balancing awal;
- objective;
- encounter;
- functional screen requirement;
- technical-functional game design.

### Programmer

Bertanggung jawab pada:

- implementasi produksi ke Unity;
- arsitektur teknis produksi;
- optimasi;
- integrasi sistem;
- keputusan teknis engine final.

### UI/UX Designer

Bertanggung jawab pada:

- visual UI final;
- layout final;
- interaction design final;
- implementasi aktual UI game.

Prototype hanya perlu menampilkan komponen bare-bone yang diperlukan untuk pengujian.

### 3D Artist

Bertanggung jawab pada karakter dan environment final. Dalam prototype 2D, karakter dan environment direpresentasikan menggunakan bentuk sederhana yang mudah dibedakan.

## 3. Urutan Sumber Kebenaran

Jika terjadi konflik, gunakan urutan berikut:

1. Keputusan langsung YA dalam chat project terbaru.
2. File prototype aktual yang benar-benar berjalan.
3. Dokumen current state/progress terbaru.
4. Dokumen konteks kanonis terbaru.
5. Dokumen canvas lama.
6. Patch atau catatan historis lama.

Konflik tidak boleh disatukan diam-diam. Konflik harus ditandai dan keputusan terbaru YA digunakan.

## 4. Prinsip Workflow

- Diskusikan fitur sebelum menulis kode.
- Jangan membuat perubahan besar sekaligus.
- Lakukan satu perubahan kecil per langkah.
- Sebutkan path file secara lengkap.
- Jelaskan apakah file dibuat, diedit, dipindahkan, atau dihapus.
- Jangan menambah folder/file tanpa instruksi eksplisit.
- Berikan kode siap tempel.
- Jelaskan fungsi kode dengan bahasa non-programmer.
- Berikan expected result.
- Berhenti untuk verifikasi sebelum melanjutkan.
- Gunakan backup/checkpoint sebelum restrukturisasi.
- Jangan menganggap langkah sebelumnya sudah dilakukan tanpa konfirmasi.

Pola default:

```text
Periksa kondisi saat ini
→ buat backup/checkpoint
→ lakukan satu perubahan kecil
→ jalankan prototype
→ verifikasi hasil
→ lanjut
```

## 5. Prinsip Arsitektur Aktif

- Data-driven.
- Data definisi dipisahkan dari runtime state.
- Core rules dipisahkan dari UI.
- Manual play dan auto-simulation future memakai rule engine yang sama.
- UI membaca state; UI tidak menghitung rule inti.
- Scene mengatur flow besar, bukan rule battle.
- Telemetry/evaluation tidak disimpan di UI state.
- Angka balancing diprioritaskan berada di JSON/config.
- Data JSON runtime aktif dibaca melalui `fetch` dari `public/data/`.

Layer konseptual:

```text
data
state
logic
scenes
ui
input
storage
evaluation
```

Nama dan jumlah file dapat menyesuaikan kondisi prototype aktual. Struktur lama tidak boleh dipaksakan secara literal jika kode aktual sudah memiliki bentuk yang lebih relevan.

## 6. Teknologi Prototype

- Vite
- Vanilla JavaScript
- HTML
- CSS
- JSON
- `fetch`
- localStorage secara bertahap
- JSON export lebih dahulu
- CSV export setelah telemetry stabil

Python bukan fondasi prototype utama. Python dapat digunakan untuk analisis data export. Auto-simulation future lebih aman memakai JavaScript/Node.js agar rule engine dapat digunakan ulang.

## 7. Terminologi Combat

### Unit Activation

Kesempatan satu unit untuk:

- bergerak/reposition dalam movement area valid;
- melakukan satu action.

Action dasar:

- Attack
- Skill
- Wait

Setelah action selesai, unit menjadi `exhausted`.

### Player Turn

Seluruh unit player non-exhausted dapat melakukan activation.

### Enemy Turn

Seluruh enemy melakukan activation.

### Turn Count

Bertambah setelah Enemy Turn selesai dan flow kembali ke Player Turn.

### Unit State

- `ready`: belum melakukan action dan masih bebas menentukan posisi.
- `positioned`: sudah dipindahkan tetapi belum melakukan action.
- `exhausted`: sudah melakukan Attack, Skill, atau Wait.

## 8. Movement Rule Aktif

- Movement area dihitung dari `originTile` pada awal activation/turn unit.
- Perubahan posisi sementara tidak mengubah origin.
- Unit boleh dipilih kembali selama belum exhausted.
- Obstacle memblokir path.
- Enemy memblokir path seperti obstacle.
- Ally boleh dilewati saat menghitung traversal.
- Ally dan enemy tidak boleh menjadi final destination jika tile masih ditempati.
- Dua unit tidak boleh berakhir pada tile yang sama.

## 9. ATR dan Combat Rule

ATR = Attack Range.

ATR dihitung sebagai radius horizontal flat dari titik tengah tile penyerang ke titik tengah tile target.

### Ranged

- Target dalam ATR tetap dapat dipilih.
- Path/line membaca obstacle.
- Clear: damage normal.
- Partial cover: damage dikurangi sebelum DEF.
- Full cover: damage 0.
- Pemain tetap boleh mengonfirmasi attack 0 damage.
- Action tetap dikonsumsi.

### Melee

- Target harus berada dalam ATR.
- Garis center-to-center tidak boleh melewati interior obstacle.
- Jika garis hanya menyentuh sudut/batas obstacle, target tetap valid.

### Damage Baseline

```text
Final Damage =
floor(
  max(
    0,
    ATK × (1 - Cover Percentage) - DEF
  )
)
```

## 10. Baseline Unit Aktif

### Guard

- HP: 25
- ATK: 5
- DEF: 4
- Move: 3
- ATR: 1.5

### Archer

- HP: 18
- ATK: 7
- DEF: 1
- Move: 4
- ATR: 3.0

### Sword Enemy

- HP: 16
- ATK: 6
- DEF: 2
- Move: 3
- ATR: 1.5
- Type: melee

## 11. Baseline Stage 1

Stage 1 adalah Lumberjack / Carpentry Area.

Baseline evaluasi prototype awal:

```text
Guard + Archer
vs
2 Sword Enemy
```

Objective:

```text
eliminate_all
```

Stage 1 digunakan untuk menguji:

- movement;
- unit switching;
- action flow;
- Wait;
- ATR melee/ranged;
- target selection;
- cover;
- damage;
- Enemy Turn;
- Victory/Defeat result.

## 12. Crystal

### Run Crystal

Crystal yang dikumpulkan selama run aktif.

### Meta Crystal

Crystal permanen yang digunakan di Main Menu/Shop.

Untuk prototype awal:

- 100% Run Crystal dikonversi menjadi Meta Crystal saat run gagal;
- 100% Run Crystal dikonversi saat prototype selesai;
- tidak ada penalti konversi.

UI dapat memakai:

```text
Crystal [X] added to inventory
```

Makna sistem:

```text
Run Crystal [X] converted to Meta Crystal
```

## 13. Region 1

Struktur:

```text
Stage 1 fixed
→ dua variant Stage 2 dari pool A/B/C
→ dua variant Stage 3 dari pool A/B/C
→ Stage 4 fixed mini-boss
```

Semua node hasil generate terlihat sejak awal. Hanya node `available` yang dapat dimasuki.

Status node:

- future
- available
- current
- completed
- blocked

Variant mempertahankan ID asli, misalnya `r1_s2_a`.

Reward wajib dipilih sebelum node berikutnya menjadi available.

Stage 4 tetap memberikan reward sebelum prototype completion agar flow kompatibel dengan full game yang akan berlanjut ke Region 2.

## 14. Save Direction

Profile save future perlu menampung:

- tutorial completion flag;
- Meta Crystal;
- permanent upgrades;
- death markers;
- run history;
- unlock flags.

Active run resume adalah sistem berbeda dan belum menjadi requirement aktif.

## 15. Balancing Model Lama

Model lama seperti Current Player Capability, Stage Pressure, dan Difficulty Gap tetap dapat dipakai sebagai referensi sementara, tetapi tidak boleh menjadi ketergantungan keras core combat/progression.

Model balancing akan direvisi berdasarkan arahan akademik terbaru.

## 16. Dokumen Arsip

Dokumen canvas lama tetap berguna sebagai referensi historis:

- Master Design Note Prototype V0
- Prototype Architecture Note V0
- State & Data Model Summary V0
- UI Flow Summary V0
- Control & Input Mapping Summary V0
- Patch Revisi Catatan Desain Model
- Prototype Progress Tracker
- Context Export Percakapan Pengembangan Prototype

Dokumen arsip tidak mengungguli keputusan terbaru YA atau kode aktual.
