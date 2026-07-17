# TMTB Prototype v2.5 — Handoff Package

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Milestone:** Full Game Loop Core  
**Purpose:** Menjadi pintu masuk utama untuk memahami kondisi project, struktur teknis, state, keputusan desain, backlog, dan cara bekerja dengan user pada checkpoint v2.5.

---

# 1. Tujuan Paket Handoff

Paket ini dibuat agar project TMTB dapat dilanjutkan secara konsisten ketika:

- berpindah ke chat baru;
- berpindah akun ChatGPT;
- berpindah perangkat;
- kembali ke project setelah jeda;
- menggunakan assistant lain;
- melakukan handoff kepada collaborator.

Assistant baru tidak boleh diasumsikan memiliki konteks dari chat lama.

Karena itu, baca paket ini terlebih dahulu sebelum memberikan arahan teknis atau perubahan kode.

---

# 2. Maintenance Protocol

Protokol resmi untuk membuat, memperbarui, dan menggunakan paket handoff berada di:

```text
docs/TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Dokumen tersebut bersifat evergreen dan berlaku untuk semua versi handoff berikutnya.

Baca dokumen tersebut bila:

- membuat handoff versi baru;
- memperbarui struktur paket;
- terjadi konflik antar-dokumen;
- perlu memahami source-of-truth priority;
- perlu memahami workflow kerja user dan assistant.

---

# 3. Dokumen dalam Paket v2.5

Folder ini berisi delapan dokumen utama.

## 3.1 `README.md`

Dokumen yang sedang dibaca.

Fungsi:

- menjadi indeks paket;
- menjelaskan urutan membaca;
- mengarahkan ke Maintenance Protocol;
- memberi instruksi awal untuk assistant baru.

---

## 3.2 `TMTB_CHAT_HANDOFF_v2.5.md`

Fungsi:

- menjelaskan cara bekerja dengan user;
- menjelaskan workflow audit source code;
- menjelaskan cara memberikan instruksi perubahan file;
- menjelaskan expected result dan testing workflow;
- mencegah assistant menebak isi file aktual.

Pertanyaan yang dijawab:

> Bagaimana cara terbaik bekerja dengan user ini?

---

## 3.3 `TMTB_CURRENT_STATE_v2.5.md`

Fungsi:

- menjelaskan kondisi build aktual;
- mencatat fitur yang sudah berjalan;
- mencatat fitur placeholder;
- mencatat limitation;
- mencatat hasil testing penting;
- mencatat next recommended step.

Pertanyaan yang dijawab:

> Prototype v2.5 saat ini sebenarnya sudah bisa melakukan apa?

---

## 3.4 `TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md`

Fungsi:

- menjelaskan struktur repository aktual;
- menjelaskan tanggung jawab file dan module;
- menjelaskan hubungan data, logic, UI, flow, dan storage;
- mencatat file legacy atau unreferenced bila ada.

Pertanyaan yang dijawab:

> File apa melakukan apa, dan perubahan teknis seharusnya dilakukan di mana?

---

## 3.5 `TMTB_STATE_AND_DATA_MODEL_v2.5.md`

Fungsi:

- mendokumentasikan `profileState`;
- mendokumentasikan `runState`;
- mendokumentasikan `battleState`;
- mendokumentasikan battle unit, generated node, reward, Crystal, dan permanent upgrade;
- menjelaskan aturan perubahan state dan persistence.

Pertanyaan yang dijawab:

> Data apa yang ada, bentuknya bagaimana, dan kapan berubah?

---

## 3.6 `TMTB_GAME_DESIGN_DECISIONS_v2.5.md`

Fungsi:

- mencatat rule gameplay;
- mencatat balancing aktif;
- membedakan keputusan `LOCKED`, `TENTATIVE`, `DEFERRED`, dan `OPEN QUESTION`;
- mencegah keputusan sementara dianggap final.

Pertanyaan yang dijawab:

> Rule desain apa yang berlaku sekarang, mana yang masih sementara, dan mana yang belum diputuskan?

---

## 3.7 `TMTB_PROGRESS_AND_BACKLOG_v2.5.md`

Fungsi:

- mencatat checkpoint yang sudah selesai;
- mencatat task berikutnya;
- mencatat fitur deferred;
- mencatat technical debt;
- mencatat roadmap;
- mencatat prioritas.

Pertanyaan yang dijawab:

> Apa yang sudah selesai, apa yang harus dikerjakan berikutnya, dan apa yang sengaja ditunda?

---

## 3.8 `TMTB_PROJECT_CONTEXT_v2.5.md`

Fungsi:

- menjelaskan identitas project;
- menjelaskan tujuan prototype;
- menjelaskan konteks akademik;
- menjelaskan role user;
- menjelaskan scope dan non-goals;
- menjelaskan prinsip besar desain dan arsitektur.

Pertanyaan yang dijawab:

> Mengapa project ini ada, untuk siapa, dan apa tujuan besarnya?

---

# 4. Urutan Membaca untuk Assistant Baru

Gunakan urutan berikut:

```text
1. README.md
2. ../TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
3. TMTB_CHAT_HANDOFF_v2.5.md
4. TMTB_CURRENT_STATE_v2.5.md
5. TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
6. TMTB_STATE_AND_DATA_MODEL_v2.5.md
7. TMTB_GAME_DESIGN_DECISIONS_v2.5.md
8. TMTB_PROGRESS_AND_BACKLOG_v2.5.md
9. TMTB_PROJECT_CONTEXT_v2.5.md
```

Setelah seluruh dokumen dibaca, gunakan source code aktual yang di-upload user untuk task berikutnya.

---

# 5. Source-of-Truth Priority

Bila terjadi konflik, gunakan urutan berikut:

```text
1. Keputusan terbaru user di chat aktif
2. Source code dan data aktual dari repository
3. TMTB_CURRENT_STATE_v2.5.md
4. TMTB_PROGRESS_AND_BACKLOG_v2.5.md
5. TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
6. TMTB_STATE_AND_DATA_MODEL_v2.5.md
7. TMTB_GAME_DESIGN_DECISIONS_v2.5.md
8. TMTB_PROJECT_CONTEXT_v2.5.md
9. Dokumen historical / versi lama
```

Untuk implementation truth, prioritaskan source code aktual dan hasil testing.

Untuk design intent, prioritaskan keputusan terbaru user dan dokumen Game Design Decisions.

Jangan menyelesaikan konflik secara diam-diam.

---

# 6. Instruksi Awal untuk Assistant Baru

Setelah membaca paket ini:

1. Jangan langsung memberi perubahan kode besar.
2. Tanyakan atau identifikasi task yang ingin dikerjakan.
3. Minta file aktual yang relevan.
4. Audit file aktual terlebih dahulu.
5. Sebutkan path file dengan jelas.
6. Jelaskan apakah bagian harus:
   - ditambah;
   - diganti;
   - dihapus;
   - atau seluruh file diganti.
7. Berikan kode siap salin bila memungkinkan.
8. Jelaskan expected result.
9. Berikan urutan testing.
10. Jangan menganggap perubahan sudah berhasil sebelum user mengonfirmasi.

Workflow default:

```text
Inspect actual state
→ audit relevant files
→ discuss target
→ make one small change
→ run
→ verify
→ continue
```

---

# 7. Dokumen Historical

Repository masih dapat berisi dokumen lama seperti:

```text
TMTB_CURRENT_STATE.md
TMTB_PROJECT_CONTEXT_v1.0.md
TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
```

Dokumen tersebut dapat berguna sebagai referensi historical.

Namun dokumen historical tidak boleh mengalahkan:

- keputusan terbaru user;
- source code aktual;
- paket handoff v2.5 terbaru.

---

# 8. Status Paket

Paket handoff v2.5 dianggap lengkap setelah semua file berikut tersedia dan telah diaudit silang:

```text
README.md
TMTB_CHAT_HANDOFF_v2.5.md
TMTB_CURRENT_STATE_v2.5.md
TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
TMTB_STATE_AND_DATA_MODEL_v2.5.md
TMTB_GAME_DESIGN_DECISIONS_v2.5.md
TMTB_PROGRESS_AND_BACKLOG_v2.5.md
TMTB_PROJECT_CONTEXT_v2.5.md
```

Setelah paket selesai:

```text
Cross-document audit
→ User review
→ Commit
→ Push
```

Git tag dapat digunakan bila checkpoint ini ditetapkan sebagai milestone resmi.

---

# 9. Template Pesan Pembuka untuk Chat Baru

Gunakan template berikut:

```text
Ini adalah paket handoff terbaru project TMTB Prototype v2.5.

Tolong baca seluruh dokumen yang saya upload dan gunakan source-of-truth priority yang dijelaskan di dalamnya.

Saya adalah Game Designer, bukan programmer utama.

Sebelum memberikan perubahan kode:
- minta dan audit file aktual yang relevan;
- jangan menebak isi file;
- sebutkan path file;
- jelaskan bagian yang harus dicari;
- jelaskan apakah kode ditambah, diganti, dihapus, atau seluruh file diganti;
- berikan expected result;
- berikan urutan testing;
- jangan menganggap perubahan berhasil sebelum saya mengonfirmasi.

Setelah memahami konteks, bantu saya melanjutkan dari current state dan backlog terbaru.
```

---

# 10. Prinsip Ringkas

```text
Latest user decision
→ actual source code
→ latest handoff
→ historical documents
```

Untuk dokumentasi:

> Audit first. Document second.

Untuk perubahan kode:

> Actual files first. Assumptions second.
