# TMTB — Enemy Design Discussion Handoff

**Tanggal pembaruan:** 9 Agustus 2026
**Cakupan:** rangkuman pembahasan desain enemy mulai dari Checkpoint 1 sampai Special Enemy Template, Orange/Purple/Blue Charger, serta definisi Player Stun
**Fungsi:** handoff percakapan agar pembahasan enemy dapat dilanjutkan tanpa mengulang konteks dari awal, dan agar programmer dapat memahami arah desain sebelum menerjemahkannya ke Unity.
**Status dokumen:** **WORKING HANDOFF / NON-CANONICAL SUMMARY**.

> Dokumen ini bukan pengganti dokumen game design canon. Latest explicit Game Designer decision tetap menjadi source of truth tertinggi. Bagian berstatus `OPEN` atau `TENTATIVE` belum boleh dianggap final.

---

# 0. Cara menggunakan dokumen ini

## Source of truth game design

1. Latest explicit Game Designer decision.
2. Handoff enemy terbaru ini.
3. `TMTB_GAME_DESIGN_AND_IMPLEMENTATION_HANDOFF_2026-07-30.md`.
4. `TMTB_GAME_DESIGN_CONTEXT.md`.
5. Latest `TMTB_GAME_DESIGN_DECISIONS`.
6. Dokumen historical/legacy.

## Source of truth implementasi

1. Actual source code/data.
2. Confirmed runtime testing.
3. Latest `TMTB_CURRENT_STATE`.
4. Dokumen arsitektur/handoff.

Jika design dan source code berbeda, jangan memilih diam-diam. Catat konflik dan audit actual implementation terlebih dahulu.

Status yang digunakan:

- **LOCKED**
- **PLANNED**
- **TENTATIVE**
- **OPEN**
- **SUPERSEDED**
- **PROTOTYPE ONLY**
- **DEVELOPMENT EXCEPTION**
- **HISTORICAL DESIGN SEED**

---

# 1. Konteks desain enemy

Arah enemy TMTB bergeser dari sekadar stat block:

```text
HP
ATK
DEF
Movement
ATR
```

menjadi:

> **Sumber pressure yang memaksa keputusan taktis melalui target rule, movement rule, action, intent, status, state, pattern, dan hubungan dengan encounter.**

Enemy tidak harus kompleks satu per satu. Depth juga dapat muncul dari komposisi beberapa enemy sederhana.

---

# 2. Checkpoint 1 — Tujuan desain enemy

## 2.1 Decision-Oriented Enemy

Enemy atau komposisi enemy harus menghasilkan keputusan taktis, bukan hanya memberikan damage.

Contoh pertanyaan yang ingin muncul:

- siapa yang harus diprioritaskan;
- apakah perlu mendekat;
- apakah perlu menjaga jarak;
- apakah perlu menggunakan unit lain;
- apakah perlu membuka status tertentu terlebih dahulu;
- apakah threat tertentu harus diinterrupt atau diabaikan sementara.

Status: **STRONG DIRECTION**.

## 2.2 Multi-Unit Relevance / Anti-AP Funnel

Sistem AP terbaru memungkinkan seluruh AP tim difokuskan ke satu unit.

Contoh:

```text
2 Player Units
→ 4 AP

Archer berada di posisi aman
→ seluruh 4 AP dapat dipakai Archer
→ Guard berpotensi tidak relevan
```

Tujuan anti-AP-funnel **bukan** memaksa semua unit dipakai setiap turn.

Tujuannya:

> Encounter harus menciptakan kondisi di mana unit yang berbeda kadang menjadi penggunaan AP yang lebih tepat daripada selalu memusatkan seluruh AP pada satu unit.

Sumber variasinya dapat berasal dari:

- enemy;
- status;
- obstacle;
- map layout;
- objective;
- range;
- unit role;
- skill;
- composition.

Contoh:

- enemy tertentu lebih mudah dibuka oleh melee;
- obstacle membuat ranged unit kehilangan angle;
- unit tertentu dibutuhkan untuk membuka kesempatan bagi unit lain.

Status: **STRONG DIRECTION**.

## 2.3 Systemic Counterplay

Hard character lock sebaiknya bukan metode utama.

Kurang disukai:

```text
Enemy X hanya bisa dikalahkan Guard.
```

Lebih disukai:

```text
Enemy X memiliki kondisi/status tertentu.

Status tersebut dapat diatasi melalui:
- proximity;
- melee interaction;
- detection skill;
- support ability;
- environment;
- status interaction lain.
```

Artinya suatu unit bisa menjadi counter yang paling natural tanpa menjadi satu-satunya jawaban.

Status: **STRONG DIRECTION**.

## 2.4 Basic Enemy tetap sederhana

Basic enemy Region 1 yang sudah ada:

- **Enemy Sword** = baseline melee;
- **Enemy Spear** = baseline ranged.

Keduanya belum membutuhkan:

- pattern khusus;
- state kompleks;
- banyak action;
- conditional AI rumit.

Pattern dan kompleksitas tambahan hanya diberikan ketika memang menghasilkan keputusan baru.

Status: **STRONG DIRECTION**.

## 2.5 Readable Behaviour

Enemy harus dapat dipahami pemain, tetapi game tidak memberikan solusi positioning secara lengkap.

Diperlihatkan:

- intent;
- current target;
- state/status penting;
- informasi yang memang dibutuhkan untuk respons.

Tidak diperlihatkan:

- exact path;
- exact destination;
- exact ending grid;
- solusi positioning optimal.

Prinsip:

> **Informasikan ancamannya, bukan jawabannya.**

Status: **STRONG DIRECTION**.

## 2.6 Role-Consistent AI

Enemy tidak harus selalu memilih langkah global paling optimal untuk memenangkan seluruh battle.

Arah yang dipilih:

> Enemy memilih langkah efektif **menurut role dan behaviour-nya sendiri**.

Contoh:

- Sword mengejar dan menutup jarak.
- Spear menjaga preferred ranged distance.
- Healer nanti dapat memprioritaskan heal.
- Guardian nanti dapat memprioritaskan proteksi.

AI tetap dapat menggunakan perhitungan matematis, tetapi parameter yang dianggap “baik” berbeda sesuai role.

Status: **TENTATIVE / STRONG CANDIDATE**.

---

# 3. Status System — konsep umum

Tim setuju bahwa unit enemy dapat memiliki status yang mengubah cara pemain berinteraksi dengannya.

Contoh pertama:

```text
CONCEALED
```

Tujuan contoh ini:

- mengurangi kondisi di mana ranged unit selalu menjadi solusi terbaik;
- mendorong interaksi antarunit;
- membuka ruang skill dan counterplay.

Tim belum menyepakati metode reveal final.

Candidate reveal:

- proximity player;
- melee interaction;
- skill Support;
- detection skill;
- environmental interaction;
- status interaction lain.

Keputusan penting:

> Cara status didapat, dihilangkan, atau dinonaktifkan dapat berbeda-beda antarstatus.

Jadi `Concealed` adalah contoh dari **status system**, bukan otomatis archetype baru.

Status: **STATUS SYSTEM = STRONG DIRECTION**
Status `Concealed` dan detail Reveal = **TENTATIVE / OPEN**

---

# 4. Enemy Pattern — batas penggunaan

Tim sepakat:

> **Tidak semua enemy mempunyai pattern khusus.**

Pattern digunakan pada:

- Mini-Boss;
- Boss;
- enemy spesifik tertentu;
- archetype yang memang membutuhkan ritme antar-turn.

Basic Sword dan Spear tidak membutuhkan pattern.

Contoh pattern hanya ilustrasi:

```text
Charge
→ Heavy Attack
→ Recover
```

Bukan rule universal.

Status: **STRONG DIRECTION**.

Detail jenis-jenis pattern belum dibahas pada dokumen ini.

---

# 5. Checkpoint 2 — Enemy Grammar Universal

Grammar dasar dibagi agar konsep tidak tercampur.

```text
Target Rule
→ Movement Rule
→ Action Rule
→ Intent
```

Optional layer nanti:

```text
State
Status
Conditional Override
Pattern
Fallback khusus
```

---

# 6. Target Rule

Target Rule menjawab:

> **Siapa atau apa yang ingin dipengaruhi enemy?**

Target Rule tidak menentukan destination.

Baseline saat ini:

### Sword

```text
Target Rule:
Nearest Player Unit
```

### Spear

```text
Target Rule:
Nearest Player Unit
```

Jadi perbedaan Sword dan Spear bukan target awalnya, tetapi movement behaviour.

Status: **LATEST DESIGN DIRECTION**.

---

# 7. Dynamic Enemy Intent

Intent adalah:

> **Rencana enemy berdasarkan battle state terbaru.**

Intent bukan target/path lock.

Intent dapat berubah selama Player Turn jika kondisi berubah.

Contoh posisi:

```text
Sword
Intent: ATTACK → Archer

Guard bergerak lebih dekat

→ Current Target berubah
→ Intent: ATTACK → Guard
```

Contoh kondisi:

```text
Enemy
Intent: ATTACK

Enemy terkena damage
HP menjadi critical

→ Conditional behaviour terpenuhi
→ Intent dapat berubah menjadi FLEE
```

Atau:

```text
Ally menjadi critical
→ enemy Support dapat berubah menjadi HEAL
```

Update bersifat:

```text
Dynamic in gameplay
Event-driven in system
```

Bukan recalculation setiap frame.

Candidate event:

- unit selesai berpindah;
- action selesai;
- HP berubah;
- status berubah;
- unit mati;
- objective berubah;
- wave/phase berubah.

Status: **LATEST DESIGN DIRECTION**.

---

# 8. Intent Rule vs Current Target

Contoh:

```text
Intent Rule:
Attack Nearest Player Unit

Current Target:
Archer
```

Jika Guard menjadi lebih dekat:

```text
Intent Rule tetap:
Attack Nearest Player Unit

Current Target:
Guard
```

Intent dapat ditampilkan:

```text
ATTACK + GUARD
```

Exact movement tile tetap hidden.

---

# 9. Movement Rule

Movement Rule menjawab:

> **Dari posisi seperti apa enemy ingin menjalankan perannya terhadap Current Target?**

Grammar kerja:

```text
Movement Rule
├─ Primary Positional Goal
├─ Secondary Preference (optional)
├─ Avoidance (optional)
└─ Tie-Break
```

---

# 10. Enemy Sword — baseline

## Target Rule

```text
Nearest Player Unit
```

## Movement Goal

```text
Cari valid melee engagement position
terhadap Current Target.
```

Sword berusaha menutup jarak.

Jika tidak dapat mencapai engagement tile turn ini:

```text
→ bergerak menuju posisi yang paling mendekati
  valid melee engagement area.
```

## Action

```text
Basic Melee Attack
```

## Pattern

```text
None
```

## Behaviour summary

> **Sword meminimalkan jarak sampai dapat melakukan melee engagement terhadap Current Target.**

Status: **LATEST DESIGN DIRECTION**.

---

# 11. Enemy Spear — baseline

## Target Rule

```text
Nearest Player Unit
```

## Movement Goal

Spear menjaga jarak.

Arah dasar:

> **Spear berusaha berada sejauh mungkin dari Current Target selama target tetap dapat diserang.**

Lebih tepat secara grammar:

```text
Preferred Engagement Distance
=
Maximum effective ATR
```

Jika terlalu dekat:

```text
→ Spear menjauh.
```

Jika terlalu jauh:

```text
→ Spear mendekat.
```

Jika sudah dapat menyerang tetapi belum berada di preferred distance:

```text
→ Spear tetap reposition.
```

Jadi kemampuan menyerang dari posisi awal **tidak otomatis menghentikan movement**.

## Action

```text
Basic Ranged Attack
```

## Pattern

```text
None
```

Status: **LATEST DESIGN DIRECTION**.

---

# 12. Movement Candidate Tiles

Secara konseptual:

```text
Reachable Tiles
- invalid destination
= Candidate Tiles
```

Invalid destination mencakup misalnya:

- obstacle yang memang tidak dapat ditempati;
- tile yang sudah occupied;
- reserved spawn telegraph;
- area ilegal lain.

Reserved Spawn Telegraph tetap boleh dilewati tetapi tidak boleh menjadi ending tile.

---

# 13. Movement Tie-Break

Jika beberapa tile sama-sama sesuai Movement Rule:

Candidate baseline:

```text
1. Capai engagement goal.
2. Gunakan movement sesedikit mungkin.
3. Jika masih seri, gunakan deterministic stable ordering.
```

Tujuan:

- behaviour konsisten;
- debugging mudah;
- test reproducible;
- Intent tidak terasa random.

Cover **belum** menjadi preference default Spear.

Status: **TENTATIVE / STRONG CANDIDATE**.

---

# 14. Cover bukan default movement preference Spear

Baseline Spear tidak otomatis:

- mencari cover;
- menghindari Guard berdasarkan predicted next-turn threat;
- menghitung global safety;
- membentuk formasi.

Itu dapat menjadi:

- variant;
- veteran enemy;
- archetype baru;
- secondary movement preference nanti.

Contoh future variant:

```text
Veteran Spear

Primary:
Valid ranged engagement position

Secondary:
Prefer Cover
```

Status: **PLANNED DESIGN SPACE**, bukan baseline.

---

# 15. Sequential Enemy Resolution

Tim/Game Designer memilih:

> Enemy dieksekusi satu per satu.

Enemy berikutnya membaca board state hasil enemy sebelumnya.

Contoh:

```text
Sword A bergerak ke timur Guard
→ tile timur sekarang occupied

Sword B activation
→ hitung ulang candidate tile
→ tile timur tidak available
→ pilih tile valid lain
```

Tidak ada squad-level reservation planning untuk baseline.

Status: **LATEST DESIGN DIRECTION**.

---

# 16. Enemy Execution Order

Untuk saat ini:

```text
Enemy Execution Order
=
Spawn Order
```

Contoh:

```text
1. Sword A
2. Sword B
3. Spear A
4. Sword C
```

Enemy yang spawn lebih dulu mendapat activation lebih dulu selama masih hidup.

Spawn order sekarang menjadi game rule, bukan sekadar detail array/program.

Status: **LATEST DESIGN DIRECTION**.

---

# 17. Execution-Time Positioning

Intent dan Current Target dapat diketahui pemain sebelum Enemy Turn.

Namun exact destination tidak di-reserve dari Player Turn.

Saat activation enemy tiba:

```text
1. Revalidate Intent
2. Revalidate Current Target
3. Generate reachable tiles berdasarkan board terbaru
4. Remove invalid destination
5. Evaluate tile berdasarkan Movement Rule
6. Pilih best available tile
7. Move
8. Revalidate action
9. Execute action bila valid
10. Resolve battle state
11. Next enemy
```

Status: **LATEST DESIGN DIRECTION**.

---

# 18. 1 Enemy Activation = 1 Movement + 1 Action

Game Designer memilih baseline sederhana:

```text
1 Enemy Activation
=
maximum 1 Movement Resolution
+
maximum 1 Action Resolution
```

Catatan:

- Movement boleh 0.
- Action boleh 0.
- Tidak ada Move → Attack → Move lagi.
- Tidak ada multiple Action pada basic activation.
- Exception pada special enemy/boss nanti harus eksplisit.

Status: **LATEST DESIGN DIRECTION**.

---

# 19. Retarget vs Fallback

Tiga kasus dibedakan.

## A. Target Invalid

```text
→ RETARGET
```

Enemy menjalankan Target Rule lagi.

## B. Target Valid, posisi ideal tidak tersedia

```text
→ MOVEMENT FALLBACK
```

Enemy tetap mempertahankan Current Target.

## C. Target valid, action tetap tidak dapat dilakukan

```text
→ END ACTIVATION tanpa Action
```

Status: **LATEST DESIGN DIRECTION**.

---

# 20. Basic Sword Fallback

Primary:

```text
Capai valid melee engagement tile.
```

Jika tidak bisa:

```text
→ bergerak menuju posisi yang paling mendekati
  valid engagement area.
```

Jika tidak dapat bergerak:

```text
→ Stay.
```

Setelah movement:

```text
Target dalam melee ATR?
→ Attack

Tidak?
→ End Activation
```

Sword tidak otomatis mengganti target hanya karena semua melee tile sedang penuh.

---

# 21. Basic Spear Fallback

Primary:

```text
Capai valid ranged engagement position
mendekati preferred maximum ATR.
```

Jika ideal tile tidak tersedia:

```text
→ pilih legal position yang paling mendekati
  preferred engagement condition.
```

Jika tidak dapat bergerak tetapi masih dapat menyerang:

```text
→ Attack dari current position.
```

Jika movement dan attack tidak valid:

```text
→ End Activation.
```

---

# 22. Temporary Blocking vs Structural Blocking

## Temporary blocking

Contoh:

- unit lain;
- player;
- enemy;
- reserved telegraph;
- occupancy sementara.

Ini **tidak** otomatis membuat Current Target invalid.

## Structural blocking

Target dianggap tidak engageable jika secara ruleset enemy tersebut memang tidak mempunyai kemungkinan engagement terhadap target tersebut akibat struktur/map/rules.

Important distinction:

```text
Tidak bisa mencapai target TURN INI
≠
target structurally unreachable.
```

Status: **LATEST DESIGN DIRECTION**.

---

# 23. Target Validity

Baseline target selection:

```text
All Player Units
↓
Validity Filter
↓
Nearest Evaluation
↓
Tie-Break
↓
Current Target
```

Candidate validity:

- alive;
- masih berada di encounter;
- targetable untuk enemy/rule tersebut;
- secara struktural dapat di-engage oleh capability enemy tersebut.

Temporary occupancy tidak membatalkan target validity.

---

# 24. Definisi `Nearest`

Untuk Sword dan Spear baseline:

> Gunakan **combat-distance metric** yang konsisten dengan sistem ATR/range.

Bukan otomatis:

- path distance;
- easiest engagement;
- global utility score.

Alasan:

- `Nearest Player Unit` tetap berarti nearest;
- Sword dan Spear memakai target rule yang sama;
- perbedaan behaviour muncul dari Movement Rule.

Status exact metric Unity belum dikunci, tetapi prinsip konsistensi dengan combat distance disepakati.

---

# 25. Nearest Target Tie-Break

Candidate baseline:

```text
1. Cari valid target dengan distance minimum.

2. Jika tie dan Current Target masih berada dalam hasil tie:
   → pertahankan Current Target.

3. Jika belum ada Current Target / masih tie:
   → gunakan deterministic stable ordering.
```

Tujuannya mencegah Intent flicker.

Contoh:

```text
Current Target = Archer

Guard distance = 3
Archer distance = 3

→ tetap Archer
```

Jika:

```text
Guard = 2
Archer = 3

→ berubah ke Guard
```

Status: **LATEST DESIGN DIRECTION / STRONG DIRECTION**.

---

# 26. Action Validity

Target Validity dan Action Validity adalah dua hal berbeda.

```text
Target Validity:
Apakah unit ini masih sah menjadi Current Target?

Action Validity:
Apakah Action tertentu dapat dilakukan terhadap Current Target sekarang?
```

Contoh:

```text
Guard valid target = Yes
Sword masih terlalu jauh = Basic Attack Invalid
```

---

# 27. Universal Action Validity — grammar kerja

Candidate:

```text
1. Actor masih dapat bertindak?
2. Current Target masih valid?
3. Action mengizinkan Target Type tersebut?
4. Target berada dalam Action Range?
5. Spatial requirement terpenuhi?
6. Status actor/target mengizinkan?
7. Resource/cooldown requirement terpenuhi? [future special enemy]

Jika semua terpenuhi:
→ Action valid
```

---

# 28. Ranged Attack dan Line of Sight

Game Designer menetapkan:

> **Semua ranged attack di TMTB membutuhkan Line of Sight.**

Line of Sight dan Cover adalah dua konsep berbeda.

```text
LOS
=
apakah attack line secara ruleset tersedia

Cover
=
modifier terhadap hasil serangan
```

Status: **LATEST DESIGN DECISION**.

---

# 29. Cover tidak membatalkan targeting

Target di balik cover masih dapat ditarget selama:

- dalam attack range;
- line of sight memenuhi rule;
- tidak ada status/condition lain yang melarang.

Cover memodifikasi hasil.

Contoh:

```text
Partial Cover
→ target valid
→ attack valid
→ damage berkurang
```

Status: **LATEST DESIGN DECISION**.

---

# 30. Full Cover

Pada desain saat ini, bahkan Full Cover **tidak otomatis membuat target untargetable**.

Alasan:

- future skill mungkin menembus obstacle;
- future skill mungkin mengabaikan cover;
- skill lain mungkin tidak bergantung pada damage/cover.

Contoh:

```text
Target behind Full Cover
LOS menurut ruleset masih valid
→ targetable = Yes
→ Basic Ranged Attack legal
→ damage dapat menjadi 0
```

Status: **LATEST DESIGN DECISION**.

---

# 31. Action Effectiveness

Karena target/action dapat legal tetapi hasilnya tidak berguna, grammar ditambah:

```text
Target Validity
→ Movement
→ Action Validity
→ Action Effectiveness
→ Execute
```

Action Effectiveness menjawab:

> Apakah Action tersebut menghasilkan effect yang relevan?

Contoh Spear:

```text
Basic Ranged Attack
Target behind Full Cover
Final damage = 0
No other effect

→ Action Effectiveness = 0
```

AI Basic Spear sebaiknya **tidak mengeksekusi** serangan tersebut.

Status: **LATEST DESIGN DIRECTION**.

---

# 32. Spear dan Full Cover

Jika Current Target berada di Full Cover:

```text
Current Target tetap valid.
```

Spear mencoba mencari posisi yang memungkinkan Basic Ranged Attack menghasilkan effect/damage.

Movement priority menjadi lebih akurat:

```text
1. Cari valid/effective firing position terhadap Current Target.
2. Dari posisi tersebut, pilih yang paling dekat ke preferred maximum ATR.
3. Jika tie, pilih minimum movement.
4. Jika masih tie, deterministic ordering.
```

Contoh:

```text
Current tile:
distance 4
Full Cover
damage 0

Tile A:
distance 4
Partial Cover
damage > 0

→ Spear memilih Tile A.
```

Jika tidak ada effective firing position yang reachable:

```text
→ gunakan Movement Fallback
→ jangan menembak jika Basic Attack menghasilkan 0 effect
→ End Activation.
```

---

# 33. Basic Ranged Attack vs Future Skill

Pemisahan `Targetable` dan `Effectiveness` memungkinkan future skill tanpa merombak targeting.

Contoh:

```text
Basic Attack
→ targetable
→ Full Cover
→ 0 damage
```

```text
Piercing Shot
→ targetable
→ Ignore Cover
→ damage normal
```

```text
Mark
→ targetable
→ no damage
→ apply status
```

Jadi jangan membuat universal rule:

```text
Full Cover = untargetable
```

---

# 34. Movement Rule setelah Action Effectiveness diperkenalkan

General movement goal sekarang lebih tepat:

> **Cari posisi yang memungkinkan intended interaction terhadap Current Target, lalu terapkan positional preference role enemy.**

Sword:

```text
Valid melee engagement
→ minimum engagement distance
```

Spear:

```text
Effective ranged engagement
→ maximum preferred ATR
```

Ini lebih akurat daripada sekadar menghitung distance.

---

# 35. Current Baseline Enemy Summary

## Enemy Sword

```text
Archetype:
Basic Melee

Target Rule:
Nearest valid Player Unit

Intent:
Dynamic

Movement:
Cari valid melee engagement position.
Jika tidak bisa, mendekati engagement area.

Action:
Maximum 1 Basic Melee Attack.

Pattern:
None.

Retarget:
Jika Current Target invalid.

Fallback:
Approach engagement area / Stay.

Execution:
Sequential berdasarkan Spawn Order.
```

## Enemy Spear

```text
Archetype:
Basic Ranged

Target Rule:
Nearest valid Player Unit

Intent:
Dynamic

Movement:
Cari effective ranged engagement position.
Preferred Distance = maximum effective ATR.
Tetap reposition walau sudah bisa Attack jika posisi belum ideal.

Action:
Maximum 1 Basic Ranged Attack.

Ranged Requirement:
Line of Sight.

Cover:
Target tetap valid.
Cover memodifikasi hasil.

Full Cover:
Basic Attack dapat legal tetapi 0 effect.
AI tidak mengeksekusi action tanpa relevant effect.

Pattern:
None.

Retarget:
Jika Current Target invalid.

Fallback:
Approach future/effective firing position / Stay / Attack dari current position bila masih meaningful.

Execution:
Sequential berdasarkan Spawn Order.
```

---

# 36. Decisions yang sudah cukup kuat

## Latest Design Direction / Strong Direction

- Enemy harus menghasilkan decision, bukan sekadar stat pressure.
- Encounter harus mengurangi kecenderungan satu unit selalu menjadi AP sink terbaik.
- Counterplay diutamakan sistemik, bukan hard character lock.
- Basic Sword dan Spear tetap sederhana.
- Pattern hanya untuk special enemy tertentu.
- Enemy Intent dynamic mengikuti battle state terbaru.
- Intent tidak menunjukkan exact path/destination.
- Sword dan Spear memakai `Nearest Player Unit`.
- Sword menutup jarak.
- Spear menjaga maximum effective ATR.
- Spear tetap reposition walaupun sudah dapat Attack.
- Enemy resolve sequential.
- Execution Order sementara = Spawn Order.
- 1 Enemy Activation = max 1 Movement + max 1 Action.
- Target invalid = Retarget.
- Posisi ideal gagal = Movement Fallback.
- Action gagal = End Activation.
- Temporary occupancy tidak membatalkan target validity.
- Nearest memakai combat-distance metric yang konsisten dengan ATR.
- Tie mempertahankan Current Target bila masih seri.
- Semua ranged attack membutuhkan LOS.
- Cover memodifikasi hasil, bukan otomatis membatalkan targeting.
- Full Cover tetap targetable.
- Action Effectiveness dipisahkan dari Action Validity.
- Basic AI tidak perlu mengeksekusi action yang menghasilkan 0 relevant effect.

---

# 37. Checkpoint — State vs Status vs Conditional Override

Checkpoint ini dibuat agar behaviour mode, effect yang menempel pada unit, dan rule pengambil keputusan tidak tercampur ketika enemy menjadi lebih kompleks.

## 37.1 State

**State** adalah mode perilaku utama enemy yang dapat mengubah Target Rule, Movement Rule, Action Rule, atau Intent.

Contoh:

```text
Normal
Charging
Recovering
Fleeing
Guarding
Enraged
```

Candidate universal rule:

> **Satu enemy memiliki maksimal satu Primary Behaviour State aktif pada satu waktu.**

Contoh:

```text
State:
Fleeing

bukan:
Charging + Fleeing + Guarding
```

Perubahan State dapat mengganti behaviour package enemy.

Contoh:

```text
Normal
→ HP critical
→ Fleeing
```

Kemudian Movement/Intent dapat berubah dari mengejar Player menjadi menuju escape position.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 37.2 Status

**Status** adalah effect/modifier yang menempel pada unit dan mengubah rule, capability, stat, targetability, atau interaction tertentu tanpa harus mengganti keseluruhan behaviour enemy.

Contoh:

```text
Concealed
Rooted
Marked
Weakened
Exposed
Guarded
```

Berbeda dari State, satu unit dapat memiliki beberapa Status sekaligus.

Contoh:

```text
State:
Fleeing

Statuses:
Concealed
Weakened
Marked
```

`Rooted` dapat melarang movement sementara enemy masih mempunyai Intent yang sama.

`Concealed` dapat memodifikasi cara Player berinteraksi dengan enemy tanpa mengubah behaviour AI enemy tersebut.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 37.3 Conditional Override

**Conditional Override** adalah rule yang mengevaluasi battle condition dan, jika terpenuhi, mengambil alih keputusan normal atau memicu perubahan behaviour.

Contoh:

```text
IF HP <= 20%
→ Enter Fleeing State
```

atau:

```text
IF ally critical
→ Heal ally
```

Conditional Override dapat menghasilkan:

- change Intent;
- change Current Target / Target Rule;
- choose Action tertentu;
- enter State;
- apply/remove Status.

Tidak semua Conditional Override harus membuat State baru.

Contoh Support:

```text
State tetap Normal

IF ally critical
→ Heal

setelah Heal
→ kembali menggunakan normal behaviour
```

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 37.4 Distinction ringkas

```text
State
= "mode perilaku saya sekarang"

Status
= "effect apa yang sedang menempel pada saya"

Conditional Override
= "kondisi apa yang membuat saya mengambil keputusan berbeda"
```

Action dan State juga harus dipisahkan.

Contoh:

```text
Action:
Begin Charge

Result:
State = Charging
```

`Charge` sebagai Action tidak sama dengan `Charging` sebagai State.

---

# 38. Checkpoint — Enemy Pattern

## 38.1 Definisi

**Enemy Pattern** adalah urutan Behaviour Step yang menentukan rencana utama enemy dari satu activation ke activation berikutnya.

Contoh:

```text
Attack
→ Charge
→ Heavy Attack
→ Recover
→ loop
```

Pattern tidak menentukan:

- exact destination;
- exact path;
- target permanen.

Target dan posisi tetap dievaluasi menggunakan battle state terbaru.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 38.2 Pattern hanya untuk enemy yang membutuhkan ritme antar-activation

Basic Sword dan Spear tetap:

```text
Pattern:
None
```

Pattern lebih cocok untuk:

- special enemy;
- Mini-Boss;
- Boss;
- enemy yang membutuhkan setup/payoff atau ritme yang dapat dipelajari.

Status: **CURRENT DESIGN DIRECTION**.

---

## 38.3 Pattern vs State vs Intent vs Action

```text
Pattern
= urutan behaviour antar-activation

Pattern Step
= bagian pattern yang sedang aktif

State
= mode perilaku enemy sekarang

Intent
= rencana aktual berdasarkan battle state terbaru

Action
= tindakan yang benar-benar dieksekusi
```

Contoh:

```text
Pattern Step:
Charge

Action:
Begin Charge

Result:
State = Charging
```

---

## 38.4 Dynamic Intent tetap berlaku

Pattern menentukan **jenis rencana**, bukan target yang terkunci.

Contoh:

```text
Pattern Step:
Heavy Attack

Target Rule:
Nearest Player Unit
```

Awal:

```text
HEAVY ATTACK → Archer
```

Guard kemudian menjadi lebih dekat:

```text
HEAVY ATTACK → Guard
```

Pattern Step tetap `Heavy Attack`; yang berubah adalah Current Target.

Status: **CURRENT DESIGN DIRECTION**.

---

## 38.5 Pattern deterministic sebagai default

Arah desain saat ini:

> **Pattern special enemy bersifat deterministic sebagai default, bukan random action selection.**

Contoh preferred:

```text
Attack
→ Attack
→ Heavy Attack
→ Recover
```

Bukan default:

```text
70% Attack
20% Heavy Attack
10% Buff
```

Tujuan:

- lebih readable;
- dapat dipelajari;
- Intent lebih bermakna;
- balancing lebih terkontrol;
- debugging lebih mudah.

Random branch tetap dapat menjadi mechanic enemy tertentu jika nanti memang disengaja.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 38.6 Bentuk Pattern yang dianggap relevan

Candidate pattern families:

### Fixed Loop

```text
Attack
→ Attack
→ Strong Attack
→ Recover
→ loop
```

### Setup–Payoff

```text
Charge
→ Heavy Attack
→ Recover
```

### Multi-Step Threat

```text
Mark
→ Hunt
→ Execute
```

### Phase Pattern

```text
Pattern A
→ phase/state condition
→ Pattern B
```

`IF ally critical → Heal` tidak otomatis dianggap Pattern; itu lebih cocok sebagai Conditional Override.

Status: **DESIGN FRAMEWORK / TENTATIVE**.

---

## 38.7 Conditional Override memiliki priority di atas Base Pattern

Candidate hierarchy:

```text
Base Pattern Step
↓
Evaluate Conditional Override
↓
Override triggered?
├─ Yes → execute override behaviour
└─ No  → continue Pattern Step
```

Contoh:

```text
Pattern Step:
Heavy Attack

IF HP <= 15%
→ Enter Fleeing State
```

Arah saat ini:

```text
Conditional Override
> Base Pattern
```

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**.

---

## 38.8 Pattern Advance Rule

Satu Pattern Step tidak harus maju dengan cara yang sama.

Candidate Advance Rules:

### On Activation End

```text
Activation selesai
→ Step dianggap selesai
```

Cocok untuk simple timing step.

### On Action Resolved

```text
Action yang dimaksud benar-benar berhasil dilakukan
→ Step selesai
```

Cocok untuk threat penting seperti Heavy Attack.

Jika enemy gagal mendapat posisi menyerang:

```text
→ Movement Fallback
→ Heavy Attack belum resolved
→ Pattern tetap pada Heavy Attack
```

### On Condition Complete

```text
Condition/state tertentu selesai
→ advance
```

Contoh:

```text
Charging 2 turn selesai
→ Heavy Attack
```

Status: **TENTATIVE / STRONG CANDIDATE**, belum menjadi satu rule universal yang sama untuk semua Pattern Step.

---

## 38.9 Conditional Override vs Pattern progression masih mempunyai detail OPEN

Jika override memotong Pattern Step, ada beberapa kemungkinan:

```text
Pause
→ setelah override, kembali ke step yang sama
```

```text
Consume
→ step dianggap terlewati
```

```text
Reset
→ kembali ke awal pattern
```

Belum dipilih sebagai universal rule.

Kemungkinan besar behaviour ini perlu ditentukan sesuai special enemy/pattern.

Status: **OPEN**.

---

## 38.10 Pattern start dan sinkronisasi

Candidate default:

> Enemy dengan tipe/pattern yang sama mulai dari Step awal yang sama ketika spawn.

Jika dua enemy spawn pada waktu berbeda, pattern mereka akan menjadi tidak sinkron secara natural karena spawn timing berbeda.

Random starting offset tidak menjadi default.

Jika enemy sengaja spawn pada Pattern Step berbeda, kondisi tersebut harus readable melalui Intent/State/visual.

Status: **TENTATIVE / STRONG CANDIDATE**.

---

# 39. Current Enemy Grammar setelah Checkpoint Pattern

Grammar kerja terbaru:

```text
Enemy Definition
│
├─ Target Rule
├─ Movement Rule
├─ Action Set / Action Rule
├─ Fallback Rule
├─ State Set [optional]
├─ Status interaction
├─ Conditional Override [optional]
└─ Pattern [optional]
```

Runtime concept:

```text
Battle State berubah
↓
Evaluate target/condition
↓
Conditional Override?
├─ Yes → override behaviour
└─ No  → current Pattern Step / base behaviour
↓
Dynamic Intent
↓
Enemy Activation
↓
Movement Resolution
↓
Action Validity + Effectiveness
↓
Maximum 1 Action
↓
Resolve
↓
Pattern/State progression jika applicable
↓
Update Battle State
```

Ini adalah **design grammar**, bukan instruksi struktur kode Unity.

---

# 40. Decisions yang sudah cukup kuat sampai dokumen v2

## Current / Strong Design Direction

- Enemy harus menghasilkan tactical decision, bukan hanya stat pressure.
- Anti-AP-funnel tidak berarti semua unit wajib digunakan setiap turn.
- Counterplay diutamakan sistemik, bukan hard character lock.
- Basic Sword dan Spear tetap sederhana.
- Sword dan Spear memakai `Nearest Player Unit`.
- Dynamic Intent mengikuti battle state terbaru.
- Exact path/destination tidak diperlihatkan.
- Sword mengejar valid melee engagement.
- Spear menjaga maximum effective ATR dan tetap reposition bila perlu.
- Enemy resolve sequential.
- Execution Order sementara = Spawn Order.
- 1 Enemy Activation = max 1 Movement + max 1 Action.
- Target invalid = Retarget.
- Posisi ideal gagal = Movement Fallback.
- Action tidak valid/meaningful = End Activation tanpa Action.
- Temporary occupancy tidak membatalkan target validity.
- Nearest konsisten dengan combat-distance metric.
- Tie mempertahankan Current Target bila masih termasuk hasil seri.
- Semua ranged attack membutuhkan LOS.
- Cover memodifikasi hasil, bukan otomatis membatalkan targetability.
- Full Cover tetap targetable.
- Action Validity dan Action Effectiveness adalah layer berbeda.
- Satu Primary Behaviour State aktif pada satu waktu adalah arah saat ini.
- Multiple Status dapat aktif bersamaan.
- Conditional Override adalah decision rule, bukan State/Status.
- Pattern hanya dipakai ketika enemy memang membutuhkan ritme antar-activation.
- Pattern deterministic adalah default direction.
- Pattern tidak mengunci Current Target; Dynamic Intent tetap berlaku.
- Conditional Override diprioritaskan di atas Base Pattern sebagai current direction.

---

---

# 41. Checkpoint — Pattern Communication / Telegraphing

## 41.1 Tujuan komunikasi Pattern

Pattern internal enemy tidak perlu diperlihatkan sebagai full sequence kepada Player.

Prinsip komunikasi:

> **Berikan informasi yang dibutuhkan Player untuk merespons threat saat ini, tanpa membocorkan seluruh script enemy.**

Pattern tetap dapat dipelajari melalui pengalaman bermain karena baseline Pattern bersifat deterministic.

Status: **CURRENT DESIGN DIRECTION**.

---

## 41.2 Current Intent adalah informasi utama

Intent tetap menjadi informasi universal utama mengenai apa yang enemy akan lakukan pada Enemy Turn berikutnya.

Grammar UI konseptual:

```text
Intent
├─ Action / Behaviour Icon
└─ Target Icon, jika Action membutuhkan target
```

Contoh:

```text
[HEAVY ATTACK] [Guard]
```

berarti enemy berniat melakukan Heavy Attack kepada Guard.

Contoh self-target:

```text
[BUFF ATTACK] [Self]
```

Contoh ally-target:

```text
[HEAL] [Spear A]
```

Intent tertentu tidak harus mempunyai target.

Contoh:

```text
[RECOVER]
```

Status: **LATEST DESIGN DECISION**.

---

## 41.3 Target Action mengikuti grammar Intent yang sama

Target untuk Heavy Attack, Heal, Buff, atau Action lain tidak membutuhkan sistem UI terpisah.

Jika Action membutuhkan target:

```text
[Action Icon] + [Target Icon]
```

Current Target tetap mengikuti Target Rule dan Dynamic Intent, kecuali mechanic secara eksplisit melakukan Target Lock.

Contoh:

```text
Player Turn dimulai:
[HEAVY ATTACK] [Archer]

Guard bergerak dan menjadi nearest valid target:
[HEAVY ATTACK] [Guard]
```

Status: **LATEST DESIGN DECISION**.

---

## 41.4 Full Pattern tidak ditampilkan secara default

Combat UI tidak perlu memperlihatkan:

```text
Attack
→ Attack
→ Charge
→ Heavy Attack
→ Recover
```

secara penuh.

Alasannya:

- Pattern sebaiknya dapat dipelajari melalui encounter;
- full sequence dapat membuat enemy terasa seperti flowchart yang sudah dibocorkan;
- Conditional Override dan Phase Switch dapat membuat future branch berubah;
- UI harus berfokus pada current threat.

Status: **CURRENT DESIGN DIRECTION**.

---

## 41.5 Charge countdown adalah Current Intent, bukan future preview

Game Designer menetapkan contoh lifecycle:

```text
Turn 1
Player Turn:
CHARGE 1/3

Enemy Turn:
Enemy Charging
```

```text
Turn 2
Player Turn:
CHARGE 2/3

Enemy Turn:
Enemy Charging
```

```text
Turn 3
Player Turn:
CHARGE 3/3

Enemy Turn:
Enemy Charging / Charge Complete
```

```text
Turn 4
Player Turn:
HEAVY ATTACK + Current Target

Enemy Turn:
Execute Heavy Attack
```

Keputusan penting:

> `CHARGE 3/3` masih berarti enemy akan melakukan Charge pada Enemy Turn tersebut.

Jangan tampilkan:

```text
CHARGE 3/3
NEXT: HEAVY ATTACK
```

Heavy Attack baru diperlihatkan setelah Charge selesai dan Heavy Attack benar-benar menjadi **Current Intent** pada Player Turn berikutnya.

Status: **LATEST DESIGN DECISION**.

---

## 41.6 Countdown menunjukkan progress current multi-activation behaviour

Countdown seperti:

```text
CHARGE 1/3
CHARGE 2/3
CHARGE 3/3
```

digunakan untuk menjelaskan progress behaviour yang sedang berjalan beberapa activation.

Countdown bukan full Pattern preview.

Candidate use case lain:

```text
CHANNEL 1/2
DETONATE 1/2
SUMMON 2/3
```

hanya jika mechanic tersebut memang membutuhkan multi-activation progress.

Status: **CURRENT DESIGN DIRECTION**.

---

## 41.7 Future Action tidak ditampilkan sebelum menjadi Intent

Jika Charger sedang `CHARGE 2/3`, Player belum perlu melihat target Heavy Attack yang belum menjadi Current Intent.

Setelah Charge selesai:

```text
Pattern Step:
Heavy Attack
```

baru UI menampilkan:

```text
[HEAVY ATTACK] [Current Target]
```

Exception hanya jika suatu mechanic secara eksplisit memiliki Target Lock atau committed target lebih awal.

Status: **LATEST DESIGN DECISION**.

---

## 41.8 Target Lock adalah exception eksplisit

Default:

```text
Pattern Step menentukan jenis behaviour
Current Target tetap dynamic
```

Future special mechanic dapat melakukan:

```text
MARK → target lock
```

Setelah lock:

```text
[EXECUTE] [Marked Target]
```

Target tidak berubah hanya karena unit lain menjadi nearest.

Jika Target Lock digunakan, informasi lock harus jelas di UI.

Status: **PLANNED DESIGN SPACE / OPEN DETAIL**.

---

## 41.9 Threat Area dan telegraph spasial

Action yang mempunyai area spesifik dapat membutuhkan telegraph tambahan:

- line;
- cone;
- ground area;
- bombardment area;
- charge lane.

Namun telegraph area tidak berarti exact movement solution enemy harus dibocorkan.

Prinsip tetap:

> **Tampilkan ancamannya, bukan solusi positioning enemy.**

Status: **CURRENT DESIGN DIRECTION**.

---

# 42. Checkpoint — Pattern + Conditional Override

## 42.1 Conditional Override mempunyai priority di atas Base Pattern

Resolution konseptual:

```text
Current Pattern Step
↓
Evaluate Conditional Overrides
↓
Override valid?
├─ Tidak → gunakan Pattern Step
└─ Ya    → gunakan Override
```

Status: **CURRENT DESIGN DIRECTION**.

---

## 42.2 Temporary Override default = Pause Pattern

Untuk override sementara, default yang disepakati:

> **Pattern Step dipause dan tetap pending sampai dapat dijalankan kembali.**

Contoh Support:

```text
Pattern:
Attack
→ Buff
→ Attack

Current Step:
Buff
```

Kondisi:

```text
Ally Critical
→ Conditional Override: Heal
```

Activation:

```text
[HEAL] [Ally]
```

Setelah Heal selesai, `Buff` masih menjadi Pattern Step pending.

Status: **LATEST DESIGN DIRECTION**.

---

## 42.3 Consume bukan default

`Consume` berarti Pattern Step dianggap terlewati walaupun tidak dijalankan karena Override.

Contoh:

```text
Buff Step
→ overridden by Heal
→ Buff dianggap selesai
→ cursor maju
```

Rule ini tidak digunakan secara universal.

Gunakan hanya jika mechanic enemy secara eksplisit mengatakan bahwa opportunity step tersebut hangus.

Status: **SPECIAL CASE / OPEN PER ENEMY**.

---

## 42.4 Reset adalah explicit Pattern interaction

`Reset` berarti Pattern kembali ke step/progress tertentu.

Contoh:

```text
CHARGE 2/3
→ terkena explicit Charge Break
→ progress reset
```

Reset bukan konsekuensi otomatis dari Status biasa.

Status: **SPECIAL CASE / OPEN PER ENEMY**.

---

## 42.5 Switch untuk perubahan mode/phase besar

Major State atau Phase transition dapat mengganti Active Pattern.

Contoh:

```text
Phase 1 Pattern
↓
HP <= 50%
↓
Enter Enraged
↓
Switch to Phase 2 Pattern
```

Pattern lama tidak harus dilanjutkan kembali.

Status: **CURRENT DESIGN DIRECTION**.

---

## 42.6 Hierarchy default

Grammar kerja:

```text
Temporary Decision Override
→ PAUSE Pattern by default

Explicit Pattern Interaction
→ PAUSE / CONSUME / RESET sesuai mechanic

Major State / Phase Transition
→ SWITCH Pattern
```

Status: **CURRENT DESIGN DIRECTION**.

---

## 42.7 Conditional Override dapat mempunyai priority per enemy

Special enemy dapat mempunyai beberapa kondisi sekaligus.

Contoh:

```text
Priority 1:
IF self critical
→ Flee

Priority 2:
IF ally critical
→ Heal

Else:
→ Base Pattern
```

Tidak ada universal priority seperti `Survival > Support > Objective` untuk semua enemy.

Priority ditentukan sesuai role/archetype enemy.

Status: **CURRENT DESIGN DIRECTION**.

---

## 42.8 Pattern Step hanya maju jika Advance Rule terpenuhi

Jika Step menggunakan:

```text
Advance:
On Action Resolved
```

dan Action gagal dilakukan:

```text
→ Pattern tidak maju
```

Ini berbeda dari Pattern Pause akibat Conditional Override.

Distinction:

```text
Action belum berhasil
→ Advance Rule belum terpenuhi

Conditional Override mengambil alih
→ Pattern Step dipause
```

Status: **CURRENT DESIGN DIRECTION**.

---

## 42.9 Re-evaluation tidak berarti unlimited replanning

Arah resolution:

```text
Activation Start
→ Revalidate State / Override / Intent / Target
→ Movement
→ Revalidate Action Validity
→ Commit Action
→ Resolve
```

Setelah Action sudah commit/resolving, enemy tidak terus mengganti Action akibat setiap micro-event.

Status: **CURRENT DESIGN DIRECTION**.

---

# 43. Checkpoint — Pattern + Status Interaction

## 43.1 Prinsip dasar

> **Status tidak otomatis mengubah Pattern. Status lebih dulu mengubah capability enemy. Pattern hanya maju jika Advance Rule benar-benar terpenuhi.**

Status: **LATEST DESIGN DIRECTION**.

---

## 43.2 Movement restriction

Contoh grammar status:

```text
ROOTED
→ Movement disabled
```

Jika enemy mempunyai:

```text
Intent:
[HEAVY ATTACK] [Guard]
```

dan Guard sudah dalam attack range:

```text
→ Heavy Attack tetap dapat dilakukan
```

Jika Movement diperlukan:

```text
→ enemy tidak dapat Move
→ Heavy Attack mungkin invalid
→ Pattern Step tidak maju jika Advance Rule belum terpenuhi
```

`Rooted` tidak otomatis:

- mereset Pattern;
- menghapus Heavy Attack;
- mengganti target.

Catatan: nama/status final belum dikunci; `Rooted` adalah contoh grammar.

---

## 43.3 Activation restriction / Stun

Jika suatu Status membuat enemy kehilangan seluruh activation normal:

```text
STUNNED
→ no normal activation
```

maka:

```text
Pattern tidak maju
```

dan multi-turn progress seperti Charge tidak bertambah.

Contoh:

```text
Underlying Pattern:
CHARGE 2/3

Player applies Stun
↓
Enemy Turn:
No activation
↓
Charge progress tetap
```

Player Turn berikutnya setelah Stun berakhir:

```text
CHARGE 2/3
```

bukan `CHARGE 3/3`.

Status: **LATEST DESIGN DIRECTION**.

---

## 43.4 Charge countdown menghitung successful Charge activations

Keputusan penting:

> **`CHARGE X/Y` adalah progress Action/State Charge yang berhasil dijalankan, bukan jumlah global turn yang sudah lewat.**

Jadi:

```text
Charge activation berhasil
→ progress bertambah
```

```text
Enemy tidak dapat melakukan Charge
→ progress tetap
```

Status: **LATEST DESIGN DIRECTION**.

---

## 43.5 Rooted tidak otomatis membatalkan Charge

Jika Charge adalah behaviour yang dilakukan sambil diam:

```text
ROOTED
+
CHARGE
→ Charge masih dapat berjalan
```

Jika future Charge tertentu membutuhkan movement, status movement restriction dapat membuat Action tersebut invalid.

Jadi tidak ada universal rule:

```text
Rooted = cancel Charge
```

Setiap Action mendefinisikan capability requirement-nya.

Status: **CURRENT DESIGN DIRECTION**.

---

## 43.6 Action restriction

Future Status dapat membatasi kategori Action.

Contoh konseptual:

```text
SILENCED
→ Cannot use Ability-tagged Actions
```

Jika current Pattern Step membutuhkan Ability:

```text
Action invalid
→ Action tidak resolved
→ Pattern Step tidak maju
```

Setelah restriction hilang, Step masih pending kecuali mechanic lain mengatakan berbeda.

Catatan: `Silenced` hanya contoh grammar, bukan Status final.

---

## 43.7 Explicit Pattern Interrupt berbeda dari Status restriction biasa

Special mechanic dapat secara eksplisit mengatakan:

```text
BREAK CHARGE
→ Cancel / Reset Charge
→ mungkin Enter Recovering
```

Ini adalah **Pattern Interaction Effect**, bukan konsekuensi universal dari Stun/Root/Status biasa.

Status: **CURRENT DESIGN DIRECTION**.

---

## 43.8 Intent ketika activation sepenuhnya diblokir

Jika enemy dipastikan tidak dapat melakukan activation karena Status seperti Stun:

```text
Intent UI:
[STUNNED]
```

Underlying Pattern tetap tersimpan.

Setelah Stun berakhir:

```text
Intent kembali ke Pattern Step yang masih pending
```

Contoh:

```text
CHARGE 2/3
→ STUNNED
→ CHARGE 2/3
```

Status: **CURRENT DESIGN DIRECTION**.

---

## 43.9 Intent ketika hanya capability tertentu dibatasi

Jika enemy masih mempunyai behavioural goal yang sama, Intent tidak harus diganti.

Contoh:

```text
Status:
ROOTED

Intent:
[HEAVY ATTACK] [Guard]
```

Intent tetap menunjukkan goal tersebut walaupun execution mungkin gagal akibat posisi.

Status: **CURRENT DESIGN DIRECTION**.

---

# 44. Updated Enemy Behaviour Resolution Grammar

Current conceptual flow:

```text
BATTLE STATE CHANGES
↓
Dynamic Intent Re-evaluation
↓
Enemy Activation by Spawn Order
↓
Evaluate Primary Behaviour State
↓
Evaluate Conditional Overrides by enemy-specific priority
↓
Resolve Active Pattern Step / Temporary Override / Pattern Switch
↓
Resolve Target Rule
↓
Set Current Target
↓
Apply capability restrictions from Status
↓
Resolve Movement Rule
↓
Movement Resolution (max 1)
↓
Revalidate Action
↓
Evaluate Action Validity
↓
Evaluate Action Effectiveness
↓
Commit Action if meaningful and valid
↓
Action Resolution (max 1)
↓
Evaluate Pattern Advance Rule
↓
Update State / Status / Pattern Progress
↓
Update Battle State
↓
Next Enemy
```

Catatan:

> Ini adalah **grammar desain**, bukan instruksi struktur kode Unity.

---

# 45. Current Pattern Communication Summary

```text
PATTERN
= internal sequence

CURRENT INTENT
= behaviour/action yang akan dilakukan pada Enemy Turn berikutnya

TARGET ICON
= target dari Current Intent jika Action membutuhkan target

COUNTDOWN
= progress Current Intent multi-activation

FULL PATTERN
= tidak ditampilkan secara default
```

Contoh Charger:

```text
Turn 1 Player:
[CHARGE 1/3]

Turn 1 Enemy:
Charge
```

```text
Turn 2 Player:
[CHARGE 2/3]

Turn 2 Enemy:
Charge
```

```text
Turn 3 Player:
[CHARGE 3/3]

Turn 3 Enemy:
Charge Complete
```

```text
Turn 4 Player:
[HEAVY ATTACK] [Current Target]

Turn 4 Enemy:
Heavy Attack
```

---

# 46. Current decisions yang sudah cukup kuat sampai dokumen v3

- Enemy harus menghasilkan tactical decision, bukan hanya stat pressure.
- Anti-AP-funnel tidak berarti semua unit wajib digunakan setiap turn.
- Counterplay diutamakan sistemik, bukan hard character lock.
- Basic Sword dan Spear tetap sederhana.
- Sword dan Spear memakai `Nearest Player Unit`.
- Dynamic Intent mengikuti battle state terbaru.
- Exact path/destination tidak diperlihatkan.
- Sword mengejar valid melee engagement.
- Spear menjaga maximum effective ATR dan tetap reposition bila perlu.
- Enemy resolve sequential.
- Execution Order sementara = Spawn Order.
- 1 Enemy Activation = max 1 Movement + max 1 Action.
- Target invalid = Retarget.
- Posisi ideal gagal = Movement Fallback.
- Action tidak valid/meaningful = End Activation tanpa Action.
- Temporary occupancy tidak membatalkan target validity.
- Nearest konsisten dengan combat-distance metric.
- Tie mempertahankan Current Target bila masih termasuk hasil seri.
- Semua ranged attack membutuhkan LOS.
- Cover memodifikasi hasil, bukan otomatis membatalkan targetability.
- Full Cover tetap targetable.
- Action Validity dan Action Effectiveness adalah layer berbeda.
- Satu Primary Behaviour State aktif pada satu waktu adalah arah saat ini.
- Multiple Status dapat aktif bersamaan.
- Conditional Override adalah decision rule, bukan State/Status.
- Pattern hanya dipakai ketika enemy memang membutuhkan ritme antar-activation.
- Pattern deterministic adalah default direction.
- Pattern tidak mengunci Current Target secara default.
- Intent menggunakan `Action/Behaviour Icon + Target Icon` jika target relevan.
- Full Pattern tidak ditampilkan secara default.
- Charge countdown hanya menunjukkan current Charge progress.
- Heavy Attack tidak dipreview ketika masih `CHARGE 3/3`; Heavy Attack baru muncul ketika menjadi Current Intent pada turn berikutnya.
- Temporary Conditional Override mem-pause Pattern sebagai default.
- Pattern hanya maju jika Advance Rule terpenuhi.
- Consume/Reset adalah explicit special-case behaviour.
- Major State/Phase transition dapat Switch Pattern.
- Conditional Override priority dapat ditentukan per enemy.
- Status restriction biasa tidak otomatis mereset Pattern.
- Activation denial seperti Stun menunda Pattern progress.
- `CHARGE X/Y` menghitung successful Charge activations.
- Explicit Pattern Interrupt seperti Break dapat mereset/mengubah Pattern jika memang didesain demikian.

---

---

# 47. Checkpoint — Special Enemy Template

Tujuan template adalah membuat format desain reusable sebelum menentukan roster special enemy.

```text
SPECIAL ENEMY TEMPLATE

Enemy Name:
Enemy Identity:
Encounter Purpose:
Archetype / Role:
Target Rule:
Movement Rule:
Action Set:
Primary Behaviour State:
Status Interaction:
Conditional Override:
Pattern:
Pattern Advance Rule:
Intent / Telegraph:
Fallback:
Special Interaction:
Counterplay:
Failure Case:
```

Catatan:
- template ini adalah grammar desain, bukan struktur class/code;
- special enemy tidak wajib mempunyai Pattern;
- special enemy tidak wajib mempunyai Conditional Override;
- setiap Action/State/Status hanya ditambahkan jika memang menghasilkan keputusan baru;
- Encounter Purpose dan Counterplay harus dapat dijelaskan dengan jelas.

Prinsip:

> **Mulai dari pressure/decision yang ingin dipaksa, baru turunkan ke behaviour, action, status, pattern, lalu angka.**

Status: **CURRENT DESIGN DIRECTION**.

---

# 48. Special Enemy Candidate — ORANGE Charger Buffer

## 48.1 Identity

```text
Code Unit:
ORANGE

Role:
Support / Temporal Threat

Primary Purpose:
Menguji commitment Player terhadap target priority.
```

Pertanyaan utama:

> **“Apakah saya benar-benar dapat menghabisi Orange pada Player Turn ini, atau lebih baik jangan mencicil HP-nya?”**

Orange menghukum chip damage yang tidak disertai kill commitment dengan reposition defensif sambil tetap melanjutkan Charge.

Status: **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**.

## 48.2 Base Pattern

```text
CHARGE 1/3
→ CHARGE 2/3
→ CHARGE 3/3
→ BUFF ALLY
→ RESET
→ CHARGE 1/3
```

Saat normal Charging:

```text
Movement:
Stay

Action:
Charge
```

Orange tidak memiliki Basic Attack terhadap Player.

`3 Charge` adalah baseline awal yang masih dapat diubah.

## 48.3 Terrified Trigger

Terrified hanya dapat dipicu selama fase **Charging**.

```text
First successful damaging hit during Player Turn
→ Fear Source = Player Unit pertama yang berhasil memberi damage
→ TERRIFIED
```

Fear Source dikunci untuk Player Turn tersebut.

Serangan Player Unit lain setelahnya tidak mengganti Fear Source.

Serangan yang menghasilkan 0 damage / invalid / sepenuhnya dibatalkan tidak memicu Terrified.

Status: **LATEST DESIGN DECISION**.

## 48.4 Terrified Movement dan Charge

Pada activation Orange berikutnya:

```text
TERRIFIED
→ Move menjauh dari Fear Source
→ tetap melakukan Charge
→ Charge progress bertambah
→ Terrified selesai
→ Fear Source dibersihkan
→ kembali stationary Charging
```

Candidate movement rule:

```text
Generate reachable legal tiles
→ pilih tile dengan distance maksimum dari Fear Source
→ tie: minimum movement
→ tie: deterministic tile order
```

Jika tidak ada tile yang benar-benar lebih jauh:
- pilih legal tile dengan distance terbesar yang tersedia.

Jika tidak bisa bergerak:
- Stay;
- tetap Charge.

Status: **CURRENT DESIGN DIRECTION**.

## 48.5 Terrified hanya satu activation

Lifecycle:

```text
STATIONARY CHARGING
↓
Damaged
↓
TERRIFIED
↓
Flee + Charge
↓
Terrified expires
↓
STATIONARY CHARGING
```

Jika diserang lagi pada Player Turn berikutnya, Terrified dapat dipicu lagi dengan Fear Source baru.

Terrified **tidak** berlaku ketika Orange sudah masuk `BUFF ALLY`.

Status: **LATEST DESIGN DECISION**.

## 48.6 Buff Action

```text
Action:
Damage Buff

Target Type:
Enemy Ally

Target Rule:
Nearest Valid Ally

Range:
Orange Buff ATR

LOS:
Not required

Cover:
Ignored
```

Buff adalah range-limited non-attack ability.

Obstacle/Full Cover tidak menggagalkan Buff jika ally masih berada dalam Buff ATR.

Status: **LATEST DESIGN DECISION**.

## 48.7 Behaviour saat ally di luar Buff ATR

```text
Nearest valid Ally in Buff ATR?
├─ Yes → Stay → Buff
└─ No  → Approach nearest valid Ally
```

Setelah Movement:

```text
Within Buff ATR?
├─ Yes → Buff
└─ No  → End Activation
         BUFF step remains pending
```

Pattern Advance:

```text
BUFF
Advance Rule:
On Buff Resolved
```

Orange tidak kembali Charge sebelum Buff berhasil.

## 48.8 Buff Target Revalidation

Action Intent tetap:

```text
BUFF
```

Pada execution, actual target dapat direvalidasi sebagai `Nearest Valid Ally`.

Target icon sebelum execution adalah current candidate, bukan Target Lock.

Status: **CURRENT DESIGN DIRECTION**.

## 48.9 Setelah Buff berhasil

Keputusan lama bahwa Orange menjadi mobile setelah Buff pertama adalah:

**SUPERSEDED**.

Behaviour terbaru:

```text
Buff resolved
→ reset Charge
→ kembali stationary Charging
```

Orange hanya bergerak karena:
- Terrified;
- harus mendekati ally ketika Buff siap tetapi di luar ATR.

## 48.10 Buff Duration dan stacking

Baseline awal:

```text
Damage Buff Duration:
3 turns
```

Status: **TENTATIVE BALANCING PARAMETER**.

Untuk prototype awal:

```text
Buff stacking:
Allowed

Already buffed ally:
Still valid target
```

Detail yang masih **OPEN**:
- damage increase per stack;
- additive/multiplicative;
- refresh timer;
- independent stack timer atau shared timer.

## 48.11 Orange Failure Cases / Balancing Hypotheses

Perlu diuji:
- HP terlalu rendah → Terrified tidak relevan;
- HP terlalu tinggi → Orange selalu diabaikan;
- flee distance terlalu besar → terlalu sulit dikejar;
- flee distance terlalu kecil → Terrified tidak bermakna;
- Charge terlalu cepat/lambat;
- Buff terlalu kecil/besar;
- stacking terlalu kuat;
- Buff duration terlalu pendek/panjang;
- repeated buff pada ally sama menjadi stat wall;
- Orange terlalu mudah “digiring” melalui Fear Source.

Validation question utama:

> **Apakah Player benar-benar mempertimbangkan “bisa saya bunuh sekarang atau lebih baik jangan saya sentuh?”**

---

# 49. Special Enemy Candidate — PURPLE Charger Debuffer

## 49.1 Identity

```text
Code Unit:
PURPLE

Role:
Debuff / AP Commitment Pressure

Primary Purpose:
Mendorong temporary AP funnel pada satu Player Unit.
```

Pertanyaan utama:

> **“Unit mana yang sebaiknya membuka serangan ke Purple, dan apakah saya siap mengalokasikan AP cukup banyak ke unit tersebut pada turn ini?”**

Status: **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**.

## 49.2 Konsep immunity melee/ranged lama

Konsep:

```text
First melee hit → melee immunity
First ranged hit → ranged immunity
```

Status:

**SUPERSEDED**.

## 49.3 Attuned / Focused Mechanic

Working rule:

```text
First successful damaging hit during Player Turn
→ Purple locks to attacking Player Unit
```

Untuk sisa Player Turn:

> **Hanya Player Unit pertama tersebut yang dapat memberikan damage kepada Purple.**

Contoh:

```text
Guard damages Purple
→ ATTUNED: Guard

Guard attacks again
→ normal damage

Archer attacks Purple
→ 0 damage
```

Working name:
- `Attuned` = candidate;
- `Focused` = alternative;
- final naming = **OPEN**.

Status: **LATEST DESIGN DECISION**.

## 49.4 Attunement Timing dan Lock

Hit pertama tetap menghasilkan damage normal.

Setelah hit pertama resolve:
- Attunement aktif.
- source dikunci sampai akhir Player Turn.

Serangan unit lain:
- Purple tetap targetable;
- damaging effect terhadap Purple = 0;
- source tidak berubah.

End Player Turn:
- Attunement cleared.

Prinsip:

> **Attuned membatasi source of damage, bukan seluruh targetability/interaksi.**

Status: **CURRENT DESIGN DIRECTION**.

## 49.5 Purple Charging

Saat Charging:

```text
Movement:
Stay

Action:
Charge
```

Attunement tidak menghentikan Charge.

Purple tidak memiliki reactive movement seperti Orange.

## 49.6 Payoff — Vulnerable Curse

Setelah Charge complete:

```text
Intent:
[VULNERABLE] [Nearest Player Unit]
```

Target Rule:

```text
Nearest Valid Player Unit
```

Debuff ATR baseline:

```text
2 ATR
```

Status:
- Target Rule = **LATEST DESIGN DECISION**
- `2 ATR` = **TENTATIVE BALANCING PARAMETER**

## 49.7 Vulnerable adalah Curse

```text
LOS:
Not required

Cover:
Ignored

Obstacle:
Does not block curse effect
```

Jika target berada di balik obstacle tetapi masih dalam Debuff ATR:
- Vulnerable tetap valid.

Status: **LATEST DESIGN DECISION**.

## 49.8 Movement ketika Vulnerable siap

```text
Current Target in Debuff ATR?
├─ Yes → Stay → Apply Vulnerable
└─ No  → Approach Current Target
```

Movement Goal:

> Mencapai posisi terdekat yang membuat Current Target berada dalam Debuff ATR.

Jika belum bisa masuk ATR dalam satu activation:
- move toward best future debuff position;
- End Activation;
- `VULNERABLE` step tetap pending.

Jika tidak bisa bergerak:
- Stay;
- step tetap pending.

## 49.9 Dynamic Debuff Target

Target tetap mengikuti:

```text
Nearest Valid Player Unit
```

Selama payoff belum resolved, Current Target dapat berubah mengikuti battle state terbaru.

Ini memungkinkan Player memengaruhi penerima Curse melalui positioning.

Status: **CURRENT DESIGN DIRECTION**.

## 49.10 Setelah Vulnerable berhasil

```text
Apply Vulnerable
→ Debuff step resolved
→ reset Charge
→ Purple stationary di current position
→ mulai Charge lagi
```

Purple tidak kembali ke spawn/original position.

## 49.11 Vulnerable Duration

Baseline awal:

```text
Vulnerable Duration:
2 turns
```

Status: **TENTATIVE BALANCING PARAMETER**.

## 49.12 Vulnerable Stacking

Untuk prototype:

```text
Stacking:
Allowed
```

Jika menerima Vulnerable lagi:

```text
+1 stack
→ effect menjadi lebih besar
```

Arah awal:
- linear/additive stacking.

Exact `+X% incoming damage` per stack masih **OPEN**.

## 49.13 Vulnerable Duration Refresh

Semua stack menggunakan shared duration sederhana.

```text
Reapplication:
+1 stack
Duration refresh → 2 turns
```

Jika duration habis:
- seluruh stack Vulnerable hilang.

Status: **TENTATIVE / PROTOTYPE BALANCING RULE**.

## 49.14 Already Vulnerable tetap valid

Player Unit yang sudah Vulnerable:
- tetap valid target Purple.

Multiple Purple boleh menumpuk Vulnerable pada target yang sama.

Status: **TENTATIVE / PROTOTYPE BALANCING RULE**.

## 49.15 Purple Failure Cases / Balancing Hypotheses

Perlu diuji:
- Purple terlalu mudah di-burst oleh satu high-damage unit;
- Attuned justru memperkuat dominant AP funnel;
- pilihan unit pembuka selalu obvious;
- Player selalu lebih memilih menunggu turn berikutnya;
- Vulnerable terlalu kecil/besar;
- duration terlalu lama;
- stacking atau refresh terlalu kuat;
- Debuff ATR terlalu besar/kecil;
- dynamic retarget terlalu mudah dieksploitasi;
- party composition tertentu tidak punya unit yang layak commit sendirian.

Validation question utama:

> **Apakah Player mempertimbangkan unit mana yang membuka Purple dan apakah AP funnel tersebut layak dilakukan pada turn itu?**

---

# 50. Special Enemy Candidate — BLUE Shockwave Charger

## 50.1 Identity

```text
Code Unit:
BLUE

Role:
Timed Spatial Hazard

Primary Purpose:
Memaksa Player mempertimbangkan reposition sebelum area Blue aktif.
```

Interpretasi:

> **Blue adalah “ranjau hidup” yang timing ledakannya dapat dibaca Player.**

Status: **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**.

## 50.2 Baseline Behaviour

```text
Movement:
None

Basic Attack:
None

Reaction when damaged:
None
```

Blue tetap stationary selama encounter.

Damage hanya mengurangi HP normal dan tidak mengubah State/Pattern.

Status: **LATEST DESIGN DECISION**.

## 50.3 Pattern

Candidate baseline:

```text
CHARGE 1/2
→ CHARGE 2/2
→ SHOCKWAVE
→ RESET
→ CHARGE 1/2
```

`2 Charge` masih **TENTATIVE BALANCING PARAMETER**.

## 50.4 Intent Timing

```text
Player Turn 1:
[CHARGE 1/2]

Enemy Turn:
Charge
```

```text
Player Turn 2:
[CHARGE 2/2]

Enemy Turn:
Charge Complete
```

```text
Player Turn 3:
[SHOCKWAVE] [SELF]

Enemy Turn:
Execute Shockwave
```

Tidak ada preview `NEXT: SHOCKWAVE` saat masih `CHARGE 2/2`.

Status: **LATEST DESIGN DECISION**.

## 50.5 Shockwave selalu dieksekusi

```text
No Player Unit in area?
→ Shockwave still executes
→ payoff resolved
→ reset Charge
```

Player yang keluar dari area berhasil membuat Shockwave whiff.

Status: **LATEST DESIGN DECISION**.

## 50.6 Shockwave Area

```text
Area:
Blue ATR

Target:
Self

Affected:
Player Units inside Blue ATR when Shockwave resolves
```

Blue tidak memiliki Player Current Target untuk payoff ini.

Status: **LATEST DESIGN DECISION**.

## 50.7 Shockwave Spatial Rule

Shockwave bukan ranged attack.

```text
LOS:
Not required

Cover:
Ignored

Obstacle:
Does not block Shockwave
```

Player Unit dalam ATR tetap terkena walaupun terpisah obstacle.

Status: **LATEST DESIGN DECISION**.

## 50.8 Knockback Concept

Konsep awal:

```text
Shockwave → Knockback
```

Status:

**SUPERSEDED**.

Alasan:
- membuka collision/push direction/obstacle/unit interaction yang terlalu banyak untuk validation awal.

## 50.9 Shockwave Effect

Current direction:

```text
SHOCKWAVE
→ Apply STUN
```

Fallback candidate:

```text
IMMOBILIZE
```

jika Stun terlalu sulit/keras saat playtest.

Status:
- Stun = **CURRENT DIRECTION**
- Immobilize = **TENTATIVE FALLBACK**

## 50.10 Blue Stun Duration

Exact duration:

**OPEN / TENTATIVE BALANCING PARAMETER**.

---

# 51. Player Status Definition — STUN

Game Designer mendefinisikan:

```text
STUNNED PLAYER UNIT

Movement:
Disabled

Normal Attack:
Disabled

Skill:
Disabled

Hold:
Disabled

Switch / Select Unit:
Allowed

Shared AP Contribution:
Still contributes normal AP

Spend AP through stunned unit:
No
```

Praktis unit tidak dapat melakukan gameplay action selama Stun.

Status: **LATEST DESIGN DECISION**.

## 51.1 Shared AP ketika Stunned

Contoh:

```text
Guard = STUNNED
Archer = Normal

Shared AP = 4
```

Guard tetap menyumbang AP.

AP tersebut tetap dapat digunakan oleh Archer.

Jadi Stun adalah:

> **unit-action denial**

bukan:

> **party-resource denial**.

Status: **LATEST DESIGN DECISION**.

## 51.2 Semua Player Unit Stunned

Jika semua Player Unit Stunned:
- Shared AP tetap tersedia secara sistem;
- semua unit tidak dapat Move / Attack / Skill / Hold;
- Player masih dapat select/switch unit.

Practical remaining progression action:

```text
END TURN
```

Status: **LATEST DESIGN DECISION**.

---

# 52. Charger Trio — Pressure Comparison

| Code | Core Mechanic | Primary Pressure |
|---|---|---|
| **ORANGE** | Terrified when damaged; flee + continue Charge; Buff Ally | Kill commitment / chip-damage punishment |
| **PURPLE** | Attunes to first damaging Player Unit; payoff Vulnerable | Temporary AP funnel / attacker commitment |
| **BLUE** | No reactive mechanic; periodic Shockwave Stun field | Position commitment / timed spatial hazard |

Ketiganya sengaja menguji keputusan yang berbeda.

---

# 53. Charger Trio — Shared Grammar

Semua Charger mengikuti universal rules:

```text
Current Intent visible
→ Charge progress visible as Current Intent
→ payoff tidak dipreview sebelum menjadi Current Intent
→ Pattern hanya maju jika Advance Rule terpenuhi
→ activation denial seperti Stun menunda Charge progress
```

Perbedaan payoff:

```text
ORANGE:
Buff harus berhasil sebelum reset.

PURPLE:
Vulnerable harus berhasil sebelum reset.

BLUE:
Shockwave selalu resolve sesuai jadwal,
meskipun tidak mengenai Player.
```

---

# 54. Current Design Status Summary

## Latest Design Decisions

- Orange first damaging Player Unit menjadi Fear Source.
- Fear Source tidak berubah selama Player Turn yang sama.
- Terrified lasts one Orange activation.
- Orange flee lalu tetap Charge.
- Terrified hanya aktif saat Charging.
- Orange kembali stationary setelah Terrified dan setelah Buff.
- Orange Buff menggunakan ATR dan ignore LOS/Cover.
- Purple melee/ranged immunity concept **SUPERSEDED**.
- Purple menerima damage hanya dari first damaging Player Unit untuk sisa Player Turn.
- Purple tetap targetable oleh unit lain, tetapi damage mereka = 0.
- Purple Attunement clear di akhir Player Turn.
- Purple Vulnerable target = nearest valid Player Unit.
- Purple Curse ignore LOS/Cover.
- Blue stationary sepanjang encounter.
- Blue Shockwave selalu resolve walaupun area kosong.
- Blue Shockwave area = Blue ATR.
- Blue Shockwave ignore LOS/Cover/obstacle.
- Knockback Blue **SUPERSEDED**.
- Blue payoff current direction = Stun.
- Player Stun disable Move/Attack/Skill/Hold.
- Stunned unit tetap menyumbang Shared AP.
- Stunned unit masih dapat dipilih/switch control.
- Jika seluruh Player Unit Stunned, praktis hanya End Turn yang dapat memajukan battle.

## Tentative / Prototype Balancing Parameters

- Orange Charge count = 3.
- Orange Buff duration = 3 turns.
- Orange Buff stacking = allowed.
- Purple Debuff ATR = 2.
- Purple Vulnerable duration = 2 turns.
- Purple Vulnerable stacking = allowed.
- Vulnerable reapplication refresh duration ke 2.
- Blue Charge count = 2.
- Blue Stun duration = OPEN.
- Blue Immobilize = fallback jika Stun terlalu oppressive.

---

# 55. Open / Belum Dibahas Final

Universal:
- exact combat-distance metric;
- deterministic final tile ordering;
- final target tie-break ordering;
- exact LOS implementation;
- Cover percentage/rules;
- status tick timing convention;
- definisi exact arti `turn` pada duration status;
- final Intent/State/Status VFX/UI.

Orange:
- HP / Movement / Buff ATR;
- Buff strength;
- Buff stack formula;
- Buff timer semantics.

Purple:
- final mechanic name `Attuned` / `Focused` / lain;
- exact Charge count;
- HP / Movement;
- Vulnerable % per stack;
- exact duration tick timing;
- non-damage interaction dari non-Attuned unit;
- potential max stack jika diperlukan setelah test.

Blue:
- exact ATR;
- exact Charge count;
- exact Stun duration;
- apakah akhirnya Stun atau Immobilize;
- apakah Shockwave memengaruhi entity non-Player di masa depan.

Roster / Encounter:
- Charger mana yang masuk Region 1;
- introduction order;
- composition dengan Sword/Spear;
- apakah ketiganya diperlukan untuk scope prototype/PA;
- isolated vs combined scenario testing.

---

# 56. Validation Hypotheses

## ORANGE

Success signal:

> Player berhenti menganggap chip damage selalu bagus dan mengevaluasi kill commitment sebelum memicu Terrified.

## PURPLE

Success signal:

> Player mengevaluasi unit mana yang harus melakukan first damaging hit dan apakah AP funnel ke unit itu layak dilakukan.

## BLUE

Success signal:

> Player mengevaluasi apakah harus mengeluarkan movement/AP untuk keluar dari Blue ATR atau menerima kehilangan action akibat Stun.

Across all three:

> **Enemy harus menghasilkan tactical tradeoff, bukan hanya stat pressure atau mandatory punishment.**

---

# 57. Suggested Next Checkpoint

Arah paling logis berikutnya:

> **Enemy Composition & Scenario Testing Design**

Tujuan:
1. test each Charger sendiri untuk memastikan mechanic terbaca;
2. test Charger + Sword;
3. test Charger + Spear;
4. test kombinasi yang sengaja menekan Shared AP, positioning, dan target priority;
5. tentukan expected Player decision dan failure signal sebelum coding/balancing.

Alternatif sebelum composition:
- review apakah benar-benar dibutuhkan special enemy tambahan;
- jangan menambah roster hanya demi variasi.

---

# 58. Workflow Dokumentasi

Setelah beberapa checkpoint penting selesai:

```text
Diskusi
→ update status keputusan
→ publish full handoff version baru
```

Working handoff tetap menyimpan:
- `TENTATIVE`;
- `OPEN`;
- `SUPERSEDED`;
- prototype balancing assumptions.

Ketika enemy system dan bagian design lain cukup matang:

```text
Latest explicit Game Designer decisions
+
latest working handoffs
+
canonical design docs
↓
conflict / superseded audit
↓
TMTB Game Design Document terbaru
```

---

# 59. Prompt Lanjutan Siap Pakai

> Gunakan `TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md` sebagai handoff enemy terbaru. Prioritaskan latest explicit Game Designer decision. Current special-enemy candidates adalah Orange Charger Buffer, Purple Charger Debuffer, dan Blue Shockwave Charger. Orange menghukum chip damage melalui Terrified/flee sambil tetap Charge. Purple mengunci damage reception ke first damaging Player Unit pada Player Turn dan kemudian memberi stackable Vulnerable Curse. Blue stationary dan meledakkan Shockwave area sebesar ATR yang memberi Stun serta menembus obstacle. Player Stun menonaktifkan Move/Attack/Skill/Hold tetapi unit tetap menyumbang Shared AP. Jangan menganggap balancing parameter tentative sebagai canon. Lanjutkan dari checkpoint Enemy Composition & Scenario Testing Design atau review roster bila Game Designer memilih arah lain.
