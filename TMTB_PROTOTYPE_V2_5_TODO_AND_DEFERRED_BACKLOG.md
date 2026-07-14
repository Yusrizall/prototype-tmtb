# TMTB Prototype v2.5 — To-Do dan Deferred Backlog

**Project:** TMTB 2D / Simulative Turn-Based Tactics Prototype  
**Current milestone:** Prototype v2.5 — Full Game Loop Core  
**Status:** Siap dipresentasikan sebagai versi loop utuh pertama  
**Last updated:** 14 July 2026

---

## 1. Posisi Prototype Saat Ini

Versi 2.5 sudah memiliki loop utama:

```text
Title
→ Main Menu
→ Tutorial untuk pemain baru
→ Map Selection
→ Branching Stage 1–4
→ Battle
→ Reward Selection
→ Victory atau Defeat Settlement
→ Run Crystal dikonversi menjadi Meta Crystal
→ Post-Run Shop
→ Permanent Upgrade tersimpan
→ Journey baru menggunakan stat upgrade
```

### Sistem yang sudah berfungsi

- Title Screen dan Main Menu.
- Tutorial gate, tutorial victory, dan retry saat defeat.
- Run generation dengan branching Stage 2 dan Stage 3.
- Node preview, difficulty label, dan route blocking.
- Battle core: movement, action menu, basic attack, ATR, path check, cover, damage, enemy phase, victory, dan defeat.
- Reward selection setelah kemenangan stage.
- Run Crystal dan Meta Crystal.
- Run completion dan run defeat settlement.
- Konversi 100% Run Crystal menjadi Meta Crystal.
- Post-Run Shop.
- Enam permanent upgrade untuk Guard dan Archer.
- Permanent upgrade diterapkan ke battle pada journey berikutnya.
- Profile persistence melalui `localStorage`.
- Reset Data.

---

## 2. Persiapan Presentasi v2.5

Versi 2.5 sudah cukup untuk menunjukkan loop gameplay utuh. Hindari menambah sistem besar tepat sebelum presentasi kecuali ada bug yang menghalangi demo.

### Checklist presentasi

- [ ] Buat backup final versi 2.5.
- [ ] Jalankan satu full regression test.
- [ ] Pastikan `npm run dev` berjalan dari komputer presentasi.
- [ ] Pastikan browser dapat membuka `http://localhost:5173/`.
- [ ] Siapkan profile dengan Meta Crystal secukupnya untuk demo Shop.
- [ ] Siapkan alur demo: tutorial → map → battle → reward → result → shop → upgrade → journey baru.
- [ ] Siapkan screenshot atau video cadangan apabila live demo gagal.
- [ ] Jelaskan bahwa map dan encounter saat ini masih menggunakan placeholder yang sama.
- [ ] Catat pertanyaan dan feedback dosen.

### Nama backup yang disarankan

```text
prototype-tmtb_checkpoint_phase2.5-complete_2026-07-14.zip
```

---

# 3. Phase 2.6 — Stabilization

Bagian ini sebaiknya dilakukan sebelum menambah fitur besar.

## 3.1 Full-Loop Regression

- [ ] Test pemain baru dari Reset Data.
- [ ] Test tutorial victory.
- [ ] Test tutorial defeat dan Retry.
- [ ] Test Stage 1–4 victory.
- [ ] Test branch Stage 2 dan Stage 3.
- [ ] Test sibling node menjadi blocked.
- [ ] Test defeat pada setiap stage.
- [ ] Test conversion pada completion dan defeat.
- [ ] Test conversion tidak terjadi dua kali.
- [ ] Test Shop setelah completion dan defeat.
- [ ] Test pembelian, saldo tidak cukup, level maksimum, dan double-click.
- [ ] Test persistence setelah refresh.
- [ ] Test permanent upgrade pada journey berikutnya.
- [ ] Test Reset Data menghapus seluruh progression.

## 3.2 State dan Flow Hardening

- [ ] Cegah double input pada perpindahan scene.
- [ ] Cegah reward dipilih dua kali.
- [ ] Cegah conversion diproses dua kali.
- [ ] Cegah purchase diproses dua kali.
- [ ] Validasi scene hanya dapat dibuka dari state yang benar.
- [ ] Pastikan `runState` dan `battleState` dibersihkan pada waktu yang benar.
- [ ] Pastikan timer enemy phase selalu dihentikan saat meninggalkan battle.
- [ ] Audit semua `data-action` agar tidak mengandung whitespace multiline.
- [ ] Tambahkan fallback untuk profile lama atau tidak lengkap.
- [ ] Tambahkan error state yang lebih jelas untuk data JSON yang hilang.

## 3.3 Release Snapshot

- [ ] Tandai build sebagai **Full Loop Core v0.2 / Prototype v2.5**.
- [ ] Buat backup release.
- [ ] Perbarui dokumen handoff.
- [ ] Minta role lain melakukan gameplay test.
- [ ] Masukkan bug dan feedback dosen ke backlog.

---

# 4. Fitur yang Ditunda Demi Menyelesaikan Loop Utuh

## 4.1 Map Stage yang Berbeda

Saat ini Stage 1–4 masih dapat memakai map dasar yang sama.

- [ ] Buat map khusus Stage 1.
- [ ] Buat variasi map Stage 2A/B/C.
- [ ] Buat variasi map Stage 3A/B/C.
- [ ] Buat map khusus Stage 4.
- [ ] Bedakan obstacle, cover, dan spawn per map.
- [ ] Tambahkan identitas visual sederhana per lokasi.
- [ ] Validasi movement dan path checking pada setiap map.

## 4.2 Encounter yang Berbeda

- [ ] Buat encounter data per stage node.
- [ ] Variasikan jumlah dan komposisi enemy.
- [ ] Variasikan posisi spawn.
- [ ] Buat Stage 4 terasa seperti mini-boss.
- [ ] Hubungkan setiap node ke map dan encounter sendiri.
- [ ] Hentikan ketergantungan semua stage pada `stage1Map` dan `stage1Encounter`.

## 4.3 Enemy Variety

- [ ] Tambahkan enemy ranged.
- [ ] Tambahkan enemy tank/defensive.
- [ ] Tambahkan enemy cepat.
- [ ] Tambahkan mini-boss.
- [ ] Buat perilaku AI berbeda per role.
- [ ] Test kombinasi encounter agar tidak terlalu mudah atau mustahil.

## 4.4 Difficulty yang Benar-Benar Aktif

Saat ini `easy`, `normal`, dan `hard` masih terutama label.

- [ ] Tentukan aturan difficulty.
- [ ] Easy: enemy lebih sedikit atau lebih lemah.
- [ ] Normal: baseline encounter.
- [ ] Hard: enemy lebih banyak, lebih kuat, atau posisi lebih berbahaya.
- [ ] Sesuaikan Crystal Reward dengan risiko.
- [ ] Hubungkan difficulty ke encounter generation.
- [ ] Tampilkan alasan sebuah node memiliki difficulty tertentu.

## 4.5 Objective Variety

Saat ini objective utama masih `eliminate_all`.

- [ ] Tambahkan `survive_turns`.
- [ ] Tambahkan `defend_area`.
- [ ] Tambahkan `reach_destination`.
- [ ] Tambahkan `defeat_priority_target`.
- [ ] Tambahkan `escape`.
- [ ] Buat resolver terpisah per objective.
- [ ] Tampilkan progress objective pada HUD.

---

# 5. Gameplay Depth

## 5.1 Reward Effects Aktif

Reward sekarang dipilih dan disimpan, tetapi efeknya belum aktif.

- [ ] Aktifkan reward Guard Max HP/ATK/DEF.
- [ ] Aktifkan reward Archer Max HP/ATK/DEF.
- [ ] Aktifkan Party Recovery.
- [ ] Aktifkan Bonus Run Crystal.
- [ ] Terapkan reward hanya pada run aktif.
- [ ] Hapus reward ketika run selesai atau kalah.
- [ ] Tampilkan reward aktif pada map dan battle HUD.
- [ ] Tampilkan base stat, permanent bonus, run bonus, dan final stat.
- [ ] Tentukan aturan stacking dan duplicate reward.

## 5.2 Skill System

Tombol Skill masih placeholder.

- [ ] Tentukan skill Guard.
- [ ] Tentukan skill Archer.
- [ ] Tentukan cooldown atau biaya.
- [ ] Tentukan targeting, ATR, cover, dan path interaction.
- [ ] Tambahkan target preview dan effect resolver.
- [ ] Pastikan penggunaan skill membuat unit exhausted.
- [ ] Tambahkan feedback visual dan teks.

## 5.3 Scripted Tutorial

Tutorial sekarang masih battle placeholder.

- [ ] Buat langkah movement.
- [ ] Buat langkah memilih unit.
- [ ] Buat langkah membuka action menu.
- [ ] Buat langkah basic attack.
- [ ] Jelaskan ATR dan cover.
- [ ] Jelaskan Wait dan exhaustion.
- [ ] Jelaskan Player Phase dan Enemy Phase.
- [ ] Batasi input sesuai langkah tutorial.
- [ ] Tambahkan opsi Skip Tutorial bila dibutuhkan.

## 5.4 HP Carry, Recovery, dan Attrition

Saat ini setiap stage dimulai dengan HP penuh.

- [ ] Simpan HP party setelah battle.
- [ ] Bawa HP ke stage berikutnya.
- [ ] Tentukan perlakuan unit yang kalah.
- [ ] Implementasikan recovery antar-stage.
- [ ] Aktifkan Party Recovery reward.
- [ ] Pertimbangkan rest/healing node.
- [ ] Tampilkan HP party pada Map Selection.
- [ ] Tentukan aturan saat Max HP berubah.

---

# 6. Branching dan Roguelite Structure

## 6.1 Branch Consequences

- [ ] Berikan encounter khas per jalur.
- [ ] Berikan reward pool berbeda per jalur.
- [ ] Berikan risiko dan keuntungan yang jelas.
- [ ] Buat keputusan Stage 2 memengaruhi Stage 3.
- [ ] Buat pilihan jalur memengaruhi Stage 4.
- [ ] Tambahkan route modifier.
- [ ] Tambahkan informasi preview agar pilihan tidak terasa acak.

## 6.2 Event Nodes

- [ ] Rest node.
- [ ] Treasure node.
- [ ] Risk/reward event.
- [ ] In-run Shop.
- [ ] Story/dialogue node.
- [ ] Bedakan fungsi in-run Shop dan post-run Shop.

## 6.3 Region Generation

- [ ] Gambar graph dari connection data secara dinamis.
- [ ] Kurangi layout hard-coded.
- [ ] Tambahkan run seed untuk debugging.
- [ ] Tambahkan lebih banyak kemungkinan route.
- [ ] Validasi bahwa setiap generated run dapat diselesaikan.

---

# 7. Persistence dan Data

## 7.1 Active Run Persistence

Saat ini refresh membuang run aktif.

- [ ] Simpan `runState` ke `localStorage`.
- [ ] Simpan scene, selected node, Run Crystal, rewards, dan route status.
- [ ] Simpan party HP bila HP carry sudah aktif.
- [ ] Tentukan apakah battle state juga disimpan.
- [ ] Tambahkan Continue Run pada Main Menu.
- [ ] Tambahkan Abandon Run dengan konfirmasi.
- [ ] Tambahkan save version migration.
- [ ] Cegah save corrupt menghentikan aplikasi.

## 7.2 Run History

- [ ] Simpan hasil completed/defeated.
- [ ] Simpan stage terakhir dan route.
- [ ] Simpan rewards dan Crystal yang dikonversi.
- [ ] Simpan tanggal dan durasi run.
- [ ] Buat Run Notes / Run History Screen.
- [ ] Batasi jumlah history yang disimpan.

---

# 8. UI, Feedback, dan Presentation

## 8.1 Stat Explanation

- [ ] Tampilkan base stat.
- [ ] Tampilkan permanent bonus.
- [ ] Tampilkan run reward bonus.
- [ ] Tampilkan final stat.

Contoh:

```text
Guard ATK
Base: 5
Permanent Bonus: +2
Run Bonus: +1
Final: 8
```

## 8.2 Battle Feedback

- [ ] Damage number yang lebih jelas.
- [ ] Indicator unit defeated.
- [ ] Animasi sederhana movement dan attack.
- [ ] Highlight attacker dan target.
- [ ] Cover icon.
- [ ] Prediction damage sebelum attack.
- [ ] Alasan target invalid.
- [ ] Enemy intent bila diperlukan.

## 8.3 Map dan Flow UI

- [ ] Bedakan completed, blocked, available, current, dan failed dengan lebih jelas.
- [ ] Tambahkan legend.
- [ ] Tambahkan party summary sebelum battle.
- [ ] Tambahkan reward history dalam run.
- [ ] Tambahkan transition antar-scene.
- [ ] Perbaiki narrow-screen layout.

## 8.4 Accessibility dan Input

- [ ] Audit keyboard navigation dan focus state.
- [ ] Tambahkan ARIA label.
- [ ] Pastikan warna bukan satu-satunya indikator status.
- [ ] Tambahkan mouse support pada action menu.
- [ ] Tambahkan touch support sederhana.

---

# 9. Menu Sekunder

## Settings

- [ ] Volume dan audio setting bila audio sudah ada.
- [ ] Fullscreen.
- [ ] Animation speed.
- [ ] Control reference.
- [ ] Reset confirmation yang lebih aman.

## Credits

- [ ] Nama project dan anggota/role.
- [ ] Asset attribution.
- [ ] Software dan library yang digunakan.
- [ ] Keterangan prototype akademik.

## Quit

Untuk versi browser, Quit tidak penting.

- [ ] Hapus menu Quit, atau
- [ ] Ubah menjadi Exit to Title, atau
- [ ] Biarkan disabled.

---

# 10. Balancing dan Economy

## 10.1 Battle Balance

- [ ] Evaluasi Guard, Archer, dan enemy stats.
- [ ] Evaluasi ATR melee dan ranged.
- [ ] Evaluasi cover dan full-cover 0 damage.
- [ ] Evaluasi enemy movement dan targeting.
- [ ] Evaluasi apakah DEF permanent terlalu kuat.
- [ ] Evaluasi difficulty tiap stage.

## 10.2 Progression Economy

Angka saat ini:

```text
Upgrade cost: 30 / 60 / 100 / 150
Run Crystal conversion: 100%
Max HP bonus: +2 per level
ATK bonus: +1 per level
DEF bonus: +1 per level
```

- [ ] Hitung jumlah run rata-rata untuk mencapai level maksimum.
- [ ] Test apakah defeat terlalu menguntungkan.
- [ ] Test apakah completion cukup memberi reward.
- [ ] Test apakah jalur hard sepadan.
- [ ] Pertimbangkan conversion rate selain 100%.
- [ ] Pertimbangkan completion bonus atau defeat penalty.
- [ ] Tentukan apakah semua upgrade harus memiliki harga sama.
- [ ] Catat hasil playtest dalam spreadsheet balancing.

---

# 11. Technical Cleanup

## 11.1 Data-Driven Battle Setup

- [ ] Pilih map dan encounter berdasarkan node aktif.
- [ ] Buat battle setup menerima `mapData` dan `encounterData` secara eksplisit.
- [ ] Tambahkan validation untuk unit ID dan spawn label.
- [ ] Hapus asumsi bahwa semua battle memakai Stage 1.

## 11.2 Code Organization

- [ ] Rapikan formatting dan indentation.
- [ ] Pecah `main.js` yang terlalu besar.
- [ ] Pisahkan scene controller.
- [ ] Pisahkan input controller.
- [ ] Pisahkan settlement dan shop controller.
- [ ] Buat constants terpusat.
- [ ] Hindari magic string untuk scene dan status.

## 11.3 Automated Tests

- [ ] Damage formula.
- [ ] ATR dan cover calculation.
- [ ] BFS movement.
- [ ] Node progression dan branch blocking.
- [ ] Reward selection.
- [ ] Conversion idempotency.
- [ ] Purchase validation.
- [ ] Permanent upgrade application.
- [ ] Profile normalization.
- [ ] Objective resolver.

---

# 12. Fitur Opsional Jangka Panjang

Fitur berikut tidak wajib untuk prototype akademik awal:

- [ ] Audio dan music.
- [ ] Character portrait dan dialogue.
- [ ] Story progression.
- [ ] Multiple regions.
- [ ] More playable units.
- [ ] Equipment system.
- [ ] Status effects, buff, dan debuff.
- [ ] Area-of-effect attacks.
- [ ] Height/elevation.
- [ ] Destructible cover.
- [ ] Procedural map generation.
- [ ] Boss mechanics.
- [ ] Achievement.
- [ ] Save slot atau export/import save.
- [ ] Playtest analytics.

---

# 13. Urutan Pengerjaan yang Disarankan

## Phase 2.6 — Stabilization

1. Full-loop regression.
2. State dan flow hardening.
3. Bug fixing.
4. Release snapshot.
5. Presentasi dan feedback dosen.

## Phase 3.1 — Content Differentiation

1. Map berbeda per stage.
2. Encounter berbeda per stage.
3. Enemy variety.
4. Difficulty scaling aktif.
5. Stage 4 mini-boss.

## Phase 3.2 — Gameplay Depth

1. Reward effects.
2. Skill system.
3. Scripted tutorial.
4. HP carry dan recovery.
5. Objective variety.

## Phase 3.3 — Roguelite Expansion

1. Branch consequences.
2. Event nodes.
3. Active run persistence.
4. Continue Run.
5. Run History.

## Phase 3.4 — Balance dan Polish

1. Battle balancing.
2. Economy balancing.
3. UI stat explanation.
4. Visual feedback.
5. Accessibility.
6. Presentation polish.

---

# 14. Keputusan yang Masih Terbuka

- [ ] Apakah DEF tetap +1 per level?
- [ ] Apakah conversion tetap 100%?
- [ ] Apakah Shop dapat dibuka dari Main Menu?
- [ ] Apakah HP carry berlaku untuk seluruh run?
- [ ] Apakah unit yang kalah dapat kembali di stage berikutnya?
- [ ] Apakah reward dapat muncul berulang dan menumpuk?
- [ ] Apakah jalur hard selalu memberi lebih banyak Crystal?
- [ ] Apakah Stage 4 selalu fixed?
- [ ] Apakah tutorial dapat di-skip?
- [ ] Apakah active battle perlu disimpan saat refresh?
- [ ] Apakah Run History diperlukan untuk penilaian akademik?

---

# 15. Definition of Done

Sebuah checkpoint dianggap selesai bila:

- [ ] Perubahan diuji dari state aktual.
- [ ] Tidak merusak flow yang sudah ada.
- [ ] Keyboard dan mouse diuji.
- [ ] Double input diuji.
- [ ] Refresh/persistence diuji bila relevan.
- [ ] Reset Data diuji bila menyentuh profile.
- [ ] Backup dibuat.
- [ ] Perubahan dicatat di roadmap atau progress tracker.
- [ ] Hasil aktual sesuai skenario, bukan hanya lolos compile.

---

## Ringkasan

Prototype v2.5 sudah menunjukkan loop permainan utuh dan layak dipresentasikan. Fitur yang dulu ditunda tidak hilang; semuanya dicatat sebagai backlog di dokumen ini.

```text
Stabilkan loop
→ terima feedback dosen
→ bedakan content stage
→ aktifkan gameplay depth
→ perluas roguelite structure
→ lakukan balancing dan polish
```
