# TMTB Chat Handoff v2.5

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Document Type:** Chat / Collaboration Handoff  
**Purpose:** Menjaga konsistensi cara kerja antara user dan assistant ketika project dilanjutkan di chat, akun, perangkat, atau assistant lain.

---

# 1. Profil User

User berperan sebagai **Game Designer** untuk project TMTB.

User bukan programmer utama.

Karena itu, bantuan teknis harus:

- eksplisit;
- bertahap;
- berorientasi pada file aktual;
- mudah diikuti tanpa asumsi pengetahuan programming yang tinggi;
- selalu menyebutkan path file;
- menjelaskan jenis perubahan;
- menjelaskan expected result;
- menjelaskan urutan testing.

User nyaman bekerja dengan pola:

```text
Audit file aktual
→ tentukan perubahan kecil
→ jelaskan lokasi perubahan
→ tempel kode
→ run
→ test
→ konfirmasi hasil
→ lanjut
```

Assistant tidak boleh mempercepat proses dengan memberikan batch perubahan besar tanpa alasan yang jelas.

---

# 2. Prinsip Kerja Utama

Gunakan prinsip berikut untuk semua perubahan prototype.

## 2.1 Actual files first

Jangan menebak isi file.

Jangan mengandalkan struktur ideal.

Jangan mengandalkan dokumentasi lama bila source code aktual sudah berbeda.

Sebelum memberikan perubahan:

1. identifikasi file yang relevan;
2. minta user meng-upload file aktual bila belum tersedia;
3. audit isi file;
4. baru tentukan perubahan.

---

## 2.2 One small change at a time

Perubahan sebaiknya kecil dan dapat diuji.

Contoh:

```text
Audit movement
→ perbaiki satu rule
→ test
→ lanjut rule berikutnya
```

Bukan:

```text
Refactor movement
+ attack
+ enemy AI
+ scene routing
+ persistence
```

dalam satu langkah besar.

---

## 2.3 Jangan menganggap langkah sudah dilakukan

Assistant tidak boleh menganggap user sudah:

- membuat file;
- menyimpan file;
- menjalankan command;
- menjalankan prototype;
- mengetes;
- berhasil.

Setelah memberi langkah, tunggu konfirmasi user.

---

# 3. Workflow Default untuk Perubahan Kode

Gunakan urutan berikut.

```text
1. Pahami target
2. Audit kondisi aktual
3. Identifikasi file relevan
4. Minta/upload file aktual
5. Baca file
6. Tentukan perubahan kecil
7. Beri instruksi edit
8. Run
9. Test
10. Bandingkan expected vs actual
11. Tunggu konfirmasi
12. Lanjut
```

---

# 4. Cara Memberikan Instruksi Edit File

Untuk setiap perubahan file, assistant harus menjelaskan:

- path lengkap file;
- apakah file:
  - dibuat;
  - diedit;
  - dipindahkan;
  - dihapus;
- blok kode yang harus dicari;
- apakah perubahan dilakukan:
  - sebelum blok tertentu;
  - sesudah blok tertentu;
  - mengganti blok tertentu;
  - mengganti seluruh file;
- kode siap salin;
- expected result setelah perubahan.

Contoh format:

```text
File:
C:\Datas\prototype-tmtb\src\logic\battle\battleSetup.js

Cari fungsi:
createInitialBattleState(...)

Ganti blok ini:
...

Dengan:
...

Jangan ubah bagian lain.
```

Bila seluruh file perlu diganti, katakan secara eksplisit:

```text
Ganti seluruh isi file.
```

Jangan membuat user menebak lokasi penempatan kode.

---

# 5. Pembuatan File atau Folder Baru

Jangan menambah file atau folder tanpa instruksi eksplisit.

Gunakan wording seperti:

```text
Tolong buat folder ini:
C:\Datas\prototype-tmtb\docs\handoff-v2.5
```

atau:

```text
Tolong buat file ini:
C:\Datas\prototype-tmtb\docs\handoff-v2.5\README.md
```

Setelah user mengonfirmasi, baru lanjut ke isi atau langkah berikutnya.

---

# 6. Audit Sebelum Coding

Sebelum implementasi fitur baru:

1. audit source code yang terkait;
2. audit data JSON bila relevan;
3. audit state yang terpengaruh;
4. audit flow yang terpengaruh;
5. audit persistence bila relevan;
6. identifikasi risiko regression.

Assistant harus mengatakan dengan jelas file apa saja yang perlu di-upload.

Jangan meminta seluruh repository bila hanya beberapa file yang dibutuhkan.

Contoh:

```text
Untuk audit Shop:
- src/logic/profile/profileStorage.js
- src/ui/flow/basicFlowScreens.js
- src/main.js
```

---

# 7. Expected Result dan Testing

Setiap perubahan harus memiliki expected result.

Contoh:

```text
Expected result:
- Tutorial tetap memakai base stat.
- Run stage memakai permanent upgrade.
- Enemy stat tidak berubah.
```

Testing harus berurutan dan mudah diikuti.

Contoh:

```text
Test 1
Reset Data.

Expected:
Guard HP = 25.

Test 2
Beli Guard Max HP level 1.

Expected:
Meta Crystal berkurang 30.

Test 3
Mulai Journey baru.

Expected:
Guard Max HP = 27.
```

Jangan hanya mengatakan:

```text
Coba test apakah berhasil.
```

---

# 8. Regression Testing

Bila perubahan menyentuh sistem yang sudah ada, test juga behavior lama.

Contoh:

Perubahan permanent upgrade harus memastikan:

- tutorial tetap base stat;
- run stage memakai upgrade;
- enemy tidak ikut upgrade;
- stage berikutnya masih memakai upgrade;
- refresh mempertahankan profile;
- Reset Data menghapus upgrade.

---

# 9. Konfirmasi Sebelum Melanjutkan

Setelah memberikan testing scenario, berhenti.

Tunggu user melaporkan:

- berhasil;
- gagal;
- hasil berbeda;
- ada error;
- ada behavior tidak terduga.

Jangan langsung memberikan checkpoint berikutnya sebelum hasil dikonfirmasi.

---

# 10. Penanganan Error

Bila user melaporkan error:

1. jangan langsung menebak;
2. minta pesan error aktual;
3. minta file aktual yang relevan;
4. audit perubahan terakhir;
5. cari penyebab paling sempit;
6. perbaiki satu masalah;
7. test ulang.

Jangan melakukan refactor besar hanya untuk memperbaiki bug kecil.

---

# 11. Prioritas Sumber Kebenaran

Gunakan urutan berikut.

```text
1. Keputusan terbaru user di chat aktif
2. Source code dan data aktual
3. TMTB_CURRENT_STATE_v2.5.md
4. TMTB_PROGRESS_AND_BACKLOG_v2.5.md
5. TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
6. TMTB_STATE_AND_DATA_MODEL_v2.5.md
7. TMTB_GAME_DESIGN_DECISIONS_v2.5.md
8. TMTB_PROJECT_CONTEXT_v2.5.md
9. Dokumen historical
```

Bila source code dan dokumentasi berbeda:

- tandai konflik;
- jangan menyatukannya diam-diam;
- gunakan source code untuk implementation truth;
- gunakan keputusan user terbaru untuk design intent.

---

# 12. Git Workflow

Workflow normal:

```text
Save
→ Test
→ Commit
→ Push
```

Sebelum bekerja dari perangkat lain:

```text
Fetch
→ Pull
→ Work
```

Assistant tidak perlu meminta ZIP backup pada setiap perubahan.

ZIP hanya opsional untuk:

- submission;
- presentation package;
- offline archive;
- release package tertentu.

Untuk milestone besar, Git tag dapat digunakan.

---

# 13. Cara Menangani Checkpoint

Sebuah checkpoint dianggap selesai bila:

- perubahan sudah disimpan;
- prototype berhasil dijalankan;
- test utama dilakukan;
- regression test relevan dilakukan;
- user mengonfirmasi hasil;
- commit dibuat;
- push dilakukan bila sesi kerja selesai atau checkpoint penting.

Dokumentasi diperbarui bila checkpoint mengubah:

- current state;
- architecture;
- state/data model;
- design decision;
- backlog.

---

# 14. Prinsip Komunikasi

Gunakan bahasa yang jelas dan langsung.

Untuk instruksi teknis:

- gunakan nomor langkah;
- gunakan path lengkap;
- gunakan code block;
- hindari jargon tanpa penjelasan;
- jangan memberi terlalu banyak cabang pilihan dalam satu langkah.

Untuk perubahan sederhana, respons sebaiknya ringkas.

Untuk audit atau perubahan kompleks, jelaskan secukupnya agar user memahami konsekuensi.

---

# 15. Jangan Melakukan Ini

Assistant tidak boleh:

- menebak isi file yang belum diaudit;
- menambah file tanpa memberi tahu user;
- memindahkan file tanpa instruksi eksplisit;
- menghapus file tanpa konfirmasi;
- menganggap dokumentasi lama lebih benar dari source aktual;
- mengklaim fitur selesai hanya karena kode ada;
- memberikan banyak perubahan besar sekaligus;
- menganggap user sudah menjalankan test;
- melanjutkan checkpoint berikutnya sebelum hasil sebelumnya jelas.

---

# 16. Pola Respons yang Disukai User

Untuk perubahan kode, format ideal:

```text
Tujuan
↓
File yang perlu diedit
↓
Bagian yang perlu dicari
↓
Jenis perubahan
↓
Kode siap salin
↓
Expected result
↓
Testing steps
↓
Tunggu konfirmasi
```

Untuk audit:

```text
File yang perlu dikirim
↓
Audit isi aktual
↓
Temuan
↓
Risiko
↓
Rekomendasi perubahan kecil pertama
```

---

# 17. Konteks Project yang Harus Diingat

Prototype TMTB adalah prototype 2D/simulatif untuk game turn-based tactics yang secara produksi ditujukan sebagai game 3D.

Prototype digunakan untuk:

- memvalidasi mechanic;
- memvalidasi gameplay flow;
- memvalidasi progression;
- melakukan balancing awal;
- menjadi acuan fungsional;
- mendukung evaluasi akademik.

Prototype bukan:

- final Unity implementation;
- final UI/UX;
- final art production.

Karena user adalah Game Designer, prototype harus tetap fokus pada validasi fungsi dan desain, bukan over-engineering.

---

# 18. Current Working Philosophy

Gunakan prinsip berikut:

> Inspect actual state before changing anything.

> One small verified change is better than one large unverified change.

> Source code shows what exists.

> Design decisions show what should exist.

> Testing confirms what actually works.

> Documentation preserves the context.

---

# 19. Template Pembuka untuk Assistant Baru

User dapat menggunakan pesan berikut:

```text
Ini adalah paket handoff terbaru project TMTB Prototype v2.5.

Tolong baca seluruh dokumen yang saya upload.

Saya adalah Game Designer dan bukan programmer utama.

Gunakan source code aktual sebagai implementation truth.

Sebelum mengubah kode:
- minta file aktual yang relevan;
- audit file tersebut;
- jangan menebak isi file;
- sebutkan path lengkap;
- jelaskan bagian yang dicari;
- jelaskan apakah kode ditambah, diganti, dihapus, atau seluruh file diganti;
- berikan kode siap salin;
- berikan expected result;
- berikan urutan testing;
- tunggu konfirmasi saya sebelum lanjut ke checkpoint berikutnya.

Gunakan perubahan kecil dan terverifikasi.
```

---

# 20. Definition of Good Collaboration

Kolaborasi dianggap berjalan baik bila:

```text
User tahu apa yang diubah
→ user tahu di file mana
→ user tahu mengapa
→ user tahu expected result
→ user tahu cara test
→ assistant menunggu hasil
→ checkpoint diverifikasi
→ baru lanjut
```

Tujuan dokumen ini adalah menjaga pola kerja tersebut tetap konsisten meskipun project berpindah chat, akun, perangkat, atau assistant.
