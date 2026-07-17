# TMTB Handoff Maintenance Protocol

**Project:** TMTB / BeCan Prototype  
**Document Type:** Evergreen Handoff Maintenance Protocol  
**Purpose:** Menjaga konsistensi konteks project, kualitas asistensi, dan workflow pengembangan ketika berpindah chat, akun, perangkat, atau assistant.  
**Last Updated:** 17 July 2026

---

# 1. Tujuan Dokumen

Dokumen ini menjelaskan protokol resmi untuk membuat, memperbarui, memverifikasi, dan menggunakan paket handoff project TMTB.

Paket handoff dibuat agar pengembangan prototype dapat dilanjutkan dengan kualitas konteks yang konsisten ketika:

- berpindah ke chat baru;
- berpindah akun ChatGPT;
- berpindah perangkat;
- kembali ke project setelah jeda panjang;
- menggunakan assistant lain;
- melakukan handoff kepada collaborator;
- membuat checkpoint besar baru.

Masalah utama yang ingin dicegah adalah hilangnya konteks seperti:

- arah desain project;
- struktur repository;
- tanggung jawab setiap file;
- bentuk state dan data;
- fitur yang sudah selesai;
- fitur yang sengaja ditunda;
- keputusan gameplay;
- urutan roadmap;
- pola kerja antara user dan assistant;
- hasil testing yang sudah dikonfirmasi.

Assistant baru tidak boleh diasumsikan memiliki ingatan dari chat atau akun sebelumnya.

Karena itu, source code aktual dan paket dokumentasi handoff harus menjadi dasar untuk membangun kembali konteks.

---

# 2. Prinsip Dasar Handoff

Paket handoff harus:

1. Mewakili kondisi project aktual.
2. Dibuat berdasarkan audit source code dan repository nyata.
3. Tidak hanya mengandalkan ingatan percakapan.
4. Memisahkan informasi berdasarkan tanggung jawab dokumen.
5. Membedakan fitur selesai, tentative, deferred, dan open question.
6. Tidak mengklaim fitur berhasil bila belum pernah diuji.
7. Tidak memaksakan arsitektur lama bila source code aktual sudah berubah.
8. Menjelaskan cara assistant harus bekerja dengan user.
9. Dapat digunakan oleh assistant baru tanpa harus membaca seluruh histori chat lama.
10. Tetap menyimpan dokumen lama sebagai referensi historical bila diperlukan.

Paket handoff bukan pengganti source code.

Paket handoff adalah representasi terstruktur dari konteks yang dibutuhkan untuk memahami source code dan melanjutkan pengembangan dengan aman.

---

# 3. Struktur Dokumentasi Handoff

Dokumen evergreen ini disimpan pada:

```text
docs/
└─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Setiap checkpoint besar memiliki folder handoff sendiri.

Contoh:

```text
docs/
├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
│
├─ handoff-v2.5/
│  ├─ README.md
│  ├─ TMTB_CHAT_HANDOFF_v2.5.md
│  ├─ TMTB_CURRENT_STATE_v2.5.md
│  ├─ TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
│  ├─ TMTB_STATE_AND_DATA_MODEL_v2.5.md
│  ├─ TMTB_GAME_DESIGN_DECISIONS_v2.5.md
│  ├─ TMTB_PROGRESS_AND_BACKLOG_v2.5.md
│  └─ TMTB_PROJECT_CONTEXT_v2.5.md
│
└─ handoff-vNEXT/
   └─ ...
```

Folder handoff lama tidak perlu dihapus ketika membuat versi baru.

Contoh:

```text
handoff-v2.5
handoff-v2.6
handoff-v3.0
```

Versi lama dianggap sebagai snapshot historical.

---

# 4. Dokumen Wajib dalam Setiap Paket Handoff

Setiap paket handoff memiliki delapan file utama.

---

## 4.1 README.md

### Fungsi

Menjadi pintu masuk paket handoff.

README harus menjelaskan:

- versi handoff;
- tanggal checkpoint;
- tujuan paket;
- daftar dokumen;
- fungsi singkat setiap dokumen;
- urutan membaca;
- link atau path ke Maintenance Protocol;
- instruksi singkat untuk assistant baru.

### README menjawab pertanyaan:

> "Saya baru membuka paket ini. Dokumen mana yang harus saya baca terlebih dahulu?"

---

## 4.2 TMTB_CHAT_HANDOFF_vX.X.md

### Fungsi

Menjelaskan cara assistant harus bekerja dengan user.

Dokumen ini menjaga konsistensi pola kolaborasi.

Minimal harus mencatat bahwa user:

- berperan sebagai Game Designer;
- bukan programmer utama;
- membutuhkan instruksi teknis yang eksplisit;
- ingin source code aktual diaudit sebelum perubahan;
- tidak ingin assistant menebak struktur file;
- ingin perubahan dilakukan secara bertahap;
- ingin expected result dan testing scenario diberikan;
- ingin hasil setiap checkpoint diverifikasi sebelum melanjutkan.

Dokumen ini juga harus menjelaskan workflow perubahan kode.

Contoh:

```text
Audit kondisi aktual
→ minta file relevan
→ baca file aktual
→ tentukan perubahan kecil
→ sebutkan path
→ sebutkan blok yang dicari
→ jelaskan apakah ditambah/diganti/dihapus
→ berikan kode siap tempel
→ jalankan prototype
→ berikan expected result
→ lakukan testing
→ tunggu konfirmasi user
→ lanjut
```

### CHAT_HANDOFF menjawab pertanyaan:

> "Bagaimana cara terbaik bekerja dengan user ini?"

---

## 4.3 TMTB_CURRENT_STATE_vX.X.md

### Fungsi

Menjelaskan keadaan build aktual pada checkpoint tersebut.

Isinya harus mencakup:

- teknologi;
- environment yang terkonfirmasi;
- milestone saat ini;
- full flow aktual;
- fitur yang sudah berfungsi;
- fitur yang masih placeholder;
- known limitations;
- persistence behavior;
- checkpoint terakhir;
- hasil testing penting;
- next recommended step.

Dokumen ini tidak boleh berisi roadmap panjang.

Roadmap berada di PROGRESS_AND_BACKLOG.

### CURRENT_STATE menjawab pertanyaan:

> "Prototype saat ini sebenarnya sudah bisa melakukan apa?"

---

## 4.4 TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md

### Fungsi

Menjelaskan struktur teknis repository aktual.

Harus dibuat berdasarkan audit repository dan source code nyata.

Minimal mencakup:

- struktur folder;
- daftar file penting;
- tanggung jawab setiap file;
- hubungan import utama;
- aliran data;
- data source;
- UI layer;
- logic layer;
- storage layer;
- scene/flow controller;
- file legacy atau unreferenced bila ditemukan.

Untuk setiap file penting, idealnya dijelaskan:

```text
Path
Tanggung jawab
Input
Output
Dipanggil oleh
Memanggil
Tidak bertanggung jawab atas
```

Contoh:

```text
src/logic/battle/battleSetup.js

Tanggung jawab:
- membuat battle state awal;
- membuat player battle units;
- membuat enemy battle units;
- menerapkan permanent upgrade pada run stage.

Tidak bertanggung jawab atas:
- damage resolution;
- enemy AI;
- scene routing;
- profile persistence.
```

### PROTOTYPE_ARCHITECTURE menjawab pertanyaan:

> "File apa melakukan apa, dan perubahan ini seharusnya dilakukan di mana?"

---

## 4.5 TMTB_STATE_AND_DATA_MODEL_vX.X.md

### Fungsi

Mendokumentasikan struktur state dan data runtime aktual.

Minimal mencakup:

- profileState;
- runState;
- battleState;
- battle unit;
- generated node;
- reward option;
- permanent upgrade;
- crystal conversion;
- JSON definitions penting.

Untuk setiap state, jelaskan:

- field;
- arti field;
- nilai valid;
- siapa yang mengubahnya;
- kapan berubah;
- persistence behavior.

Contoh:

```text
profileState
- tutorialCompleted
- metaCrystal
- permanentUpgrades

runState
- runStatus
- runResult
- generatedNodes
- runCrystal
- chosenRewardIds
- pendingRewardOptions
- crystalConversionCompleted
```

Dokumen juga harus menjelaskan aturan transisi penting.

Contoh:

```text
Run Crystal
→ diperoleh dari victory stage
→ disimpan selama run
→ dikonversi ketika completed/defeated
→ setelah conversion runCrystal menjadi 0
→ conversion harus idempotent
```

### STATE_AND_DATA_MODEL menjawab pertanyaan:

> "Data apa yang ada, bentuknya bagaimana, dan kapan berubah?"

---

## 4.6 TMTB_GAME_DESIGN_DECISIONS_vX.X.md

### Fungsi

Mendokumentasikan keputusan gameplay dan balancing.

Keputusan harus dikategorikan.

Gunakan status:

```text
LOCKED
TENTATIVE
DEFERRED
OPEN QUESTION
```

### LOCKED

Keputusan aktif yang saat ini menjadi rule prototype.

### TENTATIVE

Sudah digunakan, tetapi angka atau rule masih dapat direvisi.

### DEFERRED

Sengaja ditunda demi prioritas lain.

### OPEN QUESTION

Belum diputuskan.

Dokumen ini dapat mencakup:

- activation;
- turn structure;
- movement;
- ATR;
- cover;
- damage;
- unit stat;
- objective;
- progression;
- Crystal;
- rewards;
- branching;
- Shop;
- permanent upgrades;
- HP carry;
- tutorial;
- difficulty.

### GAME_DESIGN_DECISIONS menjawab pertanyaan:

> "Apa rule desain yang sekarang berlaku, apa yang masih sementara, dan apa yang belum diputuskan?"

---

## 4.7 TMTB_PROGRESS_AND_BACKLOG_vX.X.md

### Fungsi

Mencatat perkembangan dan pekerjaan masa depan.

Minimal mencakup:

- checkpoint selesai;
- milestone saat ini;
- phase berikutnya;
- fitur deferred;
- technical debt;
- stabilization tasks;
- testing backlog;
- dependency antar-task;
- prioritas.

Dokumen ini harus membedakan:

```text
DONE
NEXT
DEFERRED
OPTIONAL
```

Dokumen ini tidak boleh mengklaim bahwa sebuah fitur selesai hanya karena kode pernah ditulis.

Fitur hanya dianggap selesai setelah hasil aktual diuji dan dikonfirmasi.

### PROGRESS_AND_BACKLOG menjawab pertanyaan:

> "Apa yang sudah selesai, apa yang harus dikerjakan berikutnya, dan apa yang sengaja ditunda?"

---

## 4.8 TMTB_PROJECT_CONTEXT_vX.X.md

### Fungsi

Memberikan konteks besar project.

Minimal mencakup:

- identitas project;
- tujuan prototype;
- konteks akademik;
- role user;
- pembagian role team;
- scope prototype;
- non-goals;
- prinsip desain;
- prinsip arsitektur;
- teknologi;
- terminologi utama;
- arah jangka panjang.

Dokumen ini relatif lebih stabil dibanding CURRENT_STATE.

### PROJECT_CONTEXT menjawab pertanyaan:

> "Mengapa project ini ada, untuk siapa, dan apa tujuan besarnya?"

---

# 5. Mengapa Dokumen Dipisahkan

Jangan menggabungkan seluruh konteks menjadi satu file raksasa.

Pemisahan dilakukan karena:

- setiap dokumen memiliki tanggung jawab berbeda;
- lebih mudah mengetahui dokumen mana yang perlu diperbarui;
- lebih mudah menemukan informasi;
- mengurangi risiko informasi lama tersembunyi di dokumen besar;
- memudahkan audit konflik;
- memudahkan assistant baru membaca konteks secara bertahap;
- memisahkan intent desain dari implementation detail.

Contoh:

```text
Perubahan folder
→ Architecture

Perubahan field runState
→ State & Data Model

Perubahan rule damage
→ Game Design Decisions

Checkpoint selesai
→ Current State + Progress

Perubahan workflow user
→ Chat Handoff
```

---

# 6. Source-of-Truth Priority

Jika terdapat konflik informasi, gunakan urutan berikut.

```text
1. Keputusan terbaru user di chat aktif
2. Source code dan data aktual dari repository
3. TMTB_CURRENT_STATE versi handoff terbaru
4. TMTB_PROGRESS_AND_BACKLOG versi terbaru
5. TMTB_PROTOTYPE_ARCHITECTURE versi terbaru
6. TMTB_STATE_AND_DATA_MODEL versi terbaru
7. TMTB_GAME_DESIGN_DECISIONS versi terbaru
8. TMTB_PROJECT_CONTEXT versi terbaru
9. Dokumen historical / versi lama
```

Ada perbedaan penting antara implementation truth dan design intent.

### Implementation Truth

Untuk menjawab:

> "Apa yang benar-benar dilakukan prototype sekarang?"

Gunakan source code aktual dan hasil testing.

### Design Intent

Untuk menjawab:

> "Apa rule yang sebenarnya diinginkan?"

Gunakan keputusan terbaru user dan GAME_DESIGN_DECISIONS.

Jika implementation dan design intent berbeda:

- jangan menyatukan konflik secara diam-diam;
- tandai perbedaannya;
- konfirmasi keputusan terbaru;
- tentukan apakah implementasi perlu diperbaiki atau dokumentasi perlu diperbarui.

---

# 7. Protokol Audit Sebelum Membuat Handoff

Jangan langsung menyalin handoff versi lama lalu mengganti nomor versi.

Gunakan urutan berikut.

## Step 1 — Pastikan Git dalam kondisi jelas

Periksa:

```bash
git status
```

Ideal:

```text
nothing to commit, working tree clean
```

Periksa commit terakhir:

```bash
git log -1 --oneline
```

Periksa tag:

```bash
git tag --list
```

---

## Step 2 — Audit repository aktual

Gunakan:

```bash
git ls-files
```

atau export:

```bash
git ls-files > PATH_TO_FILE.txt
```

Tujuan:

- melihat seluruh tracked files;
- menghindari asumsi struktur lama;
- mengidentifikasi file baru;
- mengidentifikasi file legacy.

---

## Step 3 — Audit dokumen lama

Klasifikasikan sebagai:

```text
STILL VALID
NEEDS UPDATE
HISTORICAL ONLY
CONFLICTS WITH CURRENT BUILD
```

Dokumen lama tidak boleh digunakan sebagai current truth tanpa verifikasi.

---

## Step 4 — Audit source code relevan

Untuk Architecture, State Model, dan Current State:

- baca file aktual;
- periksa import/export;
- periksa state fields;
- periksa data JSON;
- periksa scene routing;
- periksa storage;
- periksa fungsi yang benar-benar dipanggil.

---

## Step 5 — Audit hasil testing

Pisahkan:

```text
Implemented
```

dari:

```text
Tested and Confirmed
```

Jangan mengklaim fitur selesai hanya karena fungsi ada di source code.

---

## Step 6 — Identifikasi konflik

Contoh:

```text
Dokumen lama mengatakan fitur belum ada
Source aktual menunjukkan fitur sudah ada
Testing user mengonfirmasi fitur berjalan
```

Maka dokumen lama menjadi historical.

---

## Step 7 — Baru tulis paket handoff baru

Urutan yang direkomendasikan:

```text
1. Maintenance Protocol
2. README
3. Chat Handoff
4. Current State
5. Prototype Architecture
6. State & Data Model
7. Game Design Decisions
8. Progress & Backlog
9. Project Context
```

Maintenance Protocol tidak perlu dibuat ulang untuk setiap versi.

Ia hanya diperbarui bila protokol handoff berubah.

---

# 8. Trigger Pembaruan Dokumen

## Update CHAT_HANDOFF ketika:

- pola kerja user berubah;
- workflow audit berubah;
- cara memberikan instruksi kode berubah;
- prioritas interaksi berubah.

## Update CURRENT_STATE ketika:

- checkpoint besar selesai;
- scene baru ditambahkan;
- flow berubah;
- fitur utama mulai aktif;
- limitation penting berubah.

## Update PROTOTYPE_ARCHITECTURE ketika:

- file dibuat/dihapus/dipindah;
- folder berubah;
- tanggung jawab module berubah;
- controller dipisah;
- dependency berubah.

## Update STATE_AND_DATA_MODEL ketika:

- field state berubah;
- structure JSON berubah;
- persistence berubah;
- transition state berubah.

## Update GAME_DESIGN_DECISIONS ketika:

- rule gameplay berubah;
- angka balancing berubah;
- status tentative menjadi locked;
- deferred feature diaktifkan.

## Update PROGRESS_AND_BACKLOG ketika:

- checkpoint selesai;
- task baru muncul;
- backlog berubah;
- feedback dosen masuk;
- prioritas berubah.

## Update PROJECT_CONTEXT ketika:

- tujuan project berubah;
- scope akademik berubah;
- pembagian role berubah;
- teknologi utama berubah.

---

# 9. Protokol Membuat Versi Handoff Baru

Contoh ketika berpindah:

```text
handoff-v2.5
→ handoff-v2.6
```

Gunakan proses berikut.

1. Jangan hapus `handoff-v2.5`.
2. Gunakan handoff lama hanya sebagai referensi.
3. Audit repository aktual.
4. Audit source code aktual.
5. Audit keputusan chat terbaru.
6. Audit backlog.
7. Buat folder `handoff-v2.6`.
8. Buat dokumen versi baru.
9. Jangan hanya mengganti nomor versi.
10. Lakukan cross-document audit.
11. Commit.
12. Push.
13. Tambahkan Git tag bila merupakan milestone besar.

Versi lama menjadi historical snapshot.

---

# 10. Cross-Document Consistency Audit

Sebelum paket dianggap selesai, periksa hubungan antar-dokumen.

Contoh:

Jika CURRENT_STATE mengatakan:

```text
Permanent Upgrade sudah aktif di battle.
```

Maka:

- ARCHITECTURE harus menjelaskan file yang menerapkannya;
- STATE_AND_DATA_MODEL harus menjelaskan field level upgrade;
- GAME_DESIGN_DECISIONS harus menjelaskan efek per level;
- PROGRESS_AND_BACKLOG harus menandainya DONE.

Jika salah satu masih mengatakan deferred, paket belum konsisten.

---

# 11. Protokol Kerja Assistant dalam Perubahan Kode

Assistant yang menggunakan handoff harus mengikuti prinsip berikut.

## Sebelum perubahan

1. Pahami tujuan perubahan.
2. Minta file aktual yang relevan.
3. Audit file aktual.
4. Jangan mengandalkan versi file lama.
5. Jangan mengasumsikan struktur ideal.

## Saat memberikan instruksi

Selalu jelaskan:

- path file;
- file mana yang diedit;
- apakah file dibuat, diganti, atau dihapus;
- blok kode yang harus dicari;
- apakah kode ditambah sebelum/sesudah;
- apakah blok diganti;
- apakah seluruh file diganti.

Gunakan kode siap salin bila memungkinkan.

## Setelah perubahan

Berikan:

- expected result;
- urutan testing;
- regression scenario;
- edge case penting.

Jangan menganggap user sudah:

- menyimpan;
- menjalankan;
- mengetes;
- berhasil.

Tunggu konfirmasi hasil.

---

# 12. Workflow Perubahan Prototype

Pola default:

```text
Inspect actual state
→ discuss target
→ audit relevant files
→ make one small change
→ run
→ verify
→ continue
```

Untuk user non-programmer:

- gunakan bahasa eksplisit;
- hindari asumsi teknis tersembunyi;
- jelaskan lokasi perubahan;
- jangan memberikan batch perubahan besar tanpa alasan;
- prioritaskan perubahan kecil yang dapat diverifikasi.

---

# 13. Git Workflow untuk Checkpoint

Workflow default sekarang adalah:

```text
Save
→ Test
→ Commit
→ Push
```

Sebelum bekerja di perangkat lain:

```text
Fetch
→ Pull
→ Work
```

Setelah selesai:

```text
Test
→ Commit
→ Push
```

Commit lokal saja bukan backup penuh.

Perubahan harus di-push agar tersedia di repository remote.

---

# 14. Milestone dan Git Tag

Untuk checkpoint besar, gunakan Git tag.

Contoh:

```text
v2.5-full-loop-core
v2.6-stabilization
v3.0-content-expansion
```

Contoh command:

```bash
git tag -a v2.5-full-loop-core -m "Prototype v2.5 full loop core"
git push origin v2.5-full-loop-core
```

Tag digunakan untuk menandai milestone penting.

---

# 15. Posisi ZIP Backup

ZIP bukan lagi metode checkpoint default.

Gunakan Git commit + push untuk version history rutin.

ZIP bersifat opsional untuk:

- submission kepada dosen;
- presentation package;
- offline archive;
- release package tertentu.

Jangan membuat ZIP untuk setiap perubahan kecil.

---

# 16. Menggunakan Handoff di Chat atau Akun Baru

Pada chat baru:

1. Upload `README.md`.
2. Upload `TMTB_CHAT_HANDOFF`.
3. Upload `TMTB_CURRENT_STATE`.
4. Upload `TMTB_PROTOTYPE_ARCHITECTURE`.
5. Upload `TMTB_STATE_AND_DATA_MODEL`.
6. Upload `TMTB_GAME_DESIGN_DECISIONS`.
7. Upload `TMTB_PROGRESS_AND_BACKLOG`.
8. Upload `TMTB_PROJECT_CONTEXT`.

Bila diperlukan, upload juga Maintenance Protocol.

Setelah itu gunakan pesan pembuka seperti:

```text
Ini adalah paket handoff terbaru project TMTB.

Tolong baca seluruh dokumen yang diberikan.

Gunakan prioritas sumber kebenaran yang dijelaskan dalam handoff.

Sebelum memberikan perubahan kode:
- minta dan audit file aktual yang relevan;
- jangan menebak isi file;
- sebutkan path file;
- jelaskan bagian yang dicari;
- jelaskan apakah kode ditambah, diganti, atau seluruh file diganti;
- berikan expected result;
- berikan urutan testing;
- jangan menganggap perubahan berhasil sebelum saya mengonfirmasi.
```

Setelah konteks terbentuk, upload source file aktual yang relevan dengan task berikutnya.

---

# 17. Jangan Upload Seluruh Repository Tanpa Alasan

Assistant tidak selalu membutuhkan seluruh project.

Gunakan prinsip:

```text
Task
→ identifikasi file relevan
→ upload file tersebut
→ audit
```

Contoh:

Shop bug:

```text
profileStorage.js
basicFlowScreens.js
main.js
```

Battle setup:

```text
battleSetup.js
player_units.json
main.js
```

Architecture audit:

```text
repository tracked-files list
+ source files utama
```

Hal ini menjaga konteks tetap fokus.

---

# 18. Historical Documents

Dokumen lama boleh tetap berada di repository.

Tetapi harus diperlakukan sebagai:

```text
HISTORICAL REFERENCE
```

Dokumen historical tidak boleh mengalahkan:

- keputusan terbaru user;
- source code aktual;
- handoff versi terbaru.

Tidak perlu menghapus histori hanya karena sudah usang.

Histori dapat membantu memahami mengapa sebuah keputusan dibuat.

---

# 19. Quality Checklist untuk Paket Handoff

Sebelum paket dianggap selesai:

## Repository

- [ ] Git status jelas.
- [ ] Source terbaru sudah di-commit.
- [ ] Source terbaru sudah di-push.
- [ ] Struktur repository sudah diaudit.

## README

- [ ] Semua dokumen terdaftar.
- [ ] Urutan membaca jelas.
- [ ] Maintenance Protocol dirujuk.

## Chat Handoff

- [ ] Workflow user dijelaskan.
- [ ] Protocol audit file dijelaskan.
- [ ] Expected testing behavior dijelaskan.

## Current State

- [ ] Flow aktual benar.
- [ ] Fitur selesai benar-benar sudah diuji.
- [ ] Limitation aktual tercatat.

## Architecture

- [ ] Struktur folder sesuai repository.
- [ ] File utama tercatat.
- [ ] Tanggung jawab file benar.
- [ ] Legacy files ditandai bila ada.

## State & Data Model

- [ ] Field sesuai source aktual.
- [ ] Transition state dijelaskan.
- [ ] Persistence behavior benar.

## Game Design Decisions

- [ ] LOCKED jelas.
- [ ] TENTATIVE jelas.
- [ ] DEFERRED jelas.
- [ ] OPEN QUESTION jelas.

## Progress & Backlog

- [ ] DONE sesuai hasil testing.
- [ ] NEXT jelas.
- [ ] Deferred feature tidak hilang.
- [ ] Feedback baru tercatat.

## Project Context

- [ ] Tujuan project masih benar.
- [ ] Scope prototype benar.
- [ ] Role dan tanggung jawab benar.

## Cross-document

- [ ] Tidak ada kontradiksi besar.
- [ ] Versi konsisten.
- [ ] Tanggal konsisten.
- [ ] Nama file konsisten.

---

# 20. Definition of Done untuk Paket Handoff

Paket handoff dianggap selesai ketika:

```text
Repository audited
→ source code relevant audited
→ historical docs audited
→ documents created
→ cross-document consistency checked
→ user reviews result
→ commit
→ push
```

Untuk milestone besar dapat dilanjutkan dengan:

```text
Git tag
```

---

# 21. Prinsip Terakhir

Handoff dibuat untuk mempertahankan konteks.

Handoff tidak boleh menjadi sumber informasi usang baru.

Karena itu:

> Audit first. Document second.

Dan untuk perubahan kode:

> Actual files first. Assumptions second.

Paket handoff yang baik harus memungkinkan assistant baru memahami:

```text
Apa project ini
→ sudah sampai mana
→ bagaimana sistemnya bekerja
→ bagaimana source diorganisasi
→ data apa yang ada
→ rule apa yang berlaku
→ apa yang belum dikerjakan
→ bagaimana bekerja dengan user
→ apa langkah berikutnya
```

Tanpa bergantung pada histori chat sebelumnya.
