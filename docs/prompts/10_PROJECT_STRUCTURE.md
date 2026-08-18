# TASK: Buat Dokumen `10_PROJECT_STRUCTURE.md`

## Peran

Bertindaklah sebagai **Senior Software Architect**, **Solution Architect**, **Frontend Architect**, dan **Technical Lead** yang bertanggung jawab merancang struktur proyek aplikasi POS Offline Progressive Web App yang modular, mudah dipelihara, dan mudah dikembangkan.

Sebelum menyusun dokumen, baca dan pahami seluruh dokumen berikut:

* `01_PROJECT_BLUEPRINT.md`
* `02_DATABASE_SCHEMA.md`
* `03_BUSINESS_RULES.md`
* `04_UI_DESIGN_SYSTEM.md`
* `05_COMPONENT_LIBRARY.md`
* `06_FEATURE_LIST.md`
* `07_ROADMAP.md`
* `08_AI_PROMPT_GUIDE.md`
* `09_CODING_STANDARD.md`

Gunakan seluruh dokumen tersebut sebagai dasar penyusunan struktur proyek.

---

# Tujuan

Buat file:

`docs/10_PROJECT_STRUCTURE.md`

Dokumen ini menjadi standar resmi struktur folder, organisasi file, pembagian modul, dan arsitektur implementasi aplikasi.

Dokumen ini **tidak boleh berisi implementasi kode**.

---

# Filosofi Struktur Proyek

Jelaskan prinsip:

* Modular
* Feature Based
* Separation of Concerns
* Reusable
* Scalable
* Maintainable
* Offline First
* Documentation Driven Development

---

# Arsitektur Aplikasi

Jelaskan arsitektur yang digunakan.

Contoh:

Presentation Layer

?

Application Layer

?

Business Layer

?

Repository Layer

?

Database Layer

?

IndexedDB (Dexie)

Jelaskan tanggung jawab masing-masing layer.

---

# Struktur Folder

Rancang struktur folder lengkap.

Contoh:

```text
project-root/
¦
+-- docs/
+-- public/
+-- src/
¦   +-- app/
¦   +-- assets/
¦   +-- components/
¦   +-- layouts/
¦   +-- pages/
¦   +-- modules/
¦   +-- services/
¦   +-- repositories/
¦   +-- database/
¦   +-- models/
¦   +-- utils/
¦   +-- helpers/
¦   +-- hooks/ (jika diperlukan)
¦   +-- config/
¦   +-- constants/
¦   +-- router/
¦   +-- styles/
¦   +-- workers/
¦   +-- pwa/
¦
+-- tests/
+-- scripts/
+-- backups/
+-- package (jika diperlukan)
```

Jelaskan tujuan setiap folder.

---

# Struktur Modul

Setiap modul harus memiliki struktur standar.

Contoh:

```text
modules/

product/

index.js

product-page.js

product-service.js

product-repository.js

product-validator.js

product-events.js

product-utils.js

README.md
```

Jelaskan fungsi setiap file.

---

# Struktur Komponen

Rancang struktur:

components/

button/

card/

table/

modal/

form/

dashboard/

product/

payment/

layout/

Setiap komponen harus memiliki dokumentasi singkat.

---

# Struktur Halaman

Definisikan pola halaman.

Misalnya:

pages/

dashboard/

product/

sales/

purchase/

inventory/

report/

setting/

login/

Jelaskan standar isi setiap folder halaman.

---

# Struktur Database

Rancang folder:

database/

db.js

schema.js

migration.js

seed.js

backup.js

restore.js

Jelaskan tanggung jawab masing-masing.

---

# Struktur Service

Jelaskan:

services/

auth-service.js

sales-service.js

product-service.js

inventory-service.js

payment-service.js

report-service.js

Gunakan pola yang konsisten.

---

# Struktur Repository

Definisikan:

repositories/

product-repository.js

sales-repository.js

customer-repository.js

Jelaskan bahwa seluruh akses data harus melalui Repository.

---

# Struktur Utility

Contoh:

utils/

currency.js

date.js

formatter.js

validator.js

barcode.js

printer.js

storage.js

theme.js

Jelaskan fungsi setiap kategori utilitas.

---

# Struktur Config

Contoh:

config/

app.config.js

theme.config.js

database.config.js

report.config.js

feature.config.js

---

# Struktur Constants

Definisikan:

constants/

role.js

permission.js

status.js

color.js

tax.js

payment.js

---

# Struktur Styles

Contoh:

styles/

base.css

theme.css

layout.css

components.css

utilities.css

pages/

modules/

Jelaskan pembagian tanggung jawab stylesheet.

---

# Struktur Assets

Kelompokkan:

logo/

icon/

image/

sound/

font/

barcode/

receipt/

---

# Struktur PWA

Jelaskan folder:

manifest/

service-worker/

cache/

offline-page/

icons/

---

# Struktur Testing

Contoh:

tests/

unit/

integration/

manual/

performance/

fixtures/

mock/

Jelaskan tujuan masing-masing.

---

# Struktur Backup

Contoh:

backups/

manual/

auto/

export/

import/

---

# Naming Convention

Tentukan aturan penamaan:

Folder

File

Module

Service

Repository

Utility

Page

Component

Asset

Gunakan pola yang konsisten.

---

# Dependency Rule

Jelaskan aturan:

Page

?

Service

?

Repository

?

Database

UI tidak boleh mengakses database secara langsung.

---

# Import Rule

Jelaskan standar import.

Misalnya:

* Hindari circular dependency.
* Gunakan path yang konsisten.
* Kelompokkan import berdasarkan jenisnya.

---

# Modul Baru

Definisikan langkah standar saat membuat modul baru.

Misalnya:

1. Folder Modul
2. Service
3. Repository
4. Validator
5. Event
6. UI
7. Dokumentasi
8. Testing

---

# Dokumentasi Modul

Setiap modul harus memiliki:

README.md

yang menjelaskan:

* tujuan
* fitur
* dependensi
* business rules terkait

---

# Anti Pattern

Jelaskan hal yang harus dihindari.

Contoh:

* Folder terlalu dalam.
* Utility menjadi tempat semua fungsi.
* Komponen saling bergantung secara langsung.
* Service mengakses UI.
* UI mengakses database.
* Hardcoded path.

---

# Skalabilitas

Pastikan struktur tetap mampu mendukung:

* Multi Outlet
* Multi Warehouse
* Marketplace
* Cloud Sync
* REST API
* Plugin
* Modul Tambahan

Tanpa perubahan besar pada struktur.

---

# Kriteria Kualitas

Dokumen harus:

* Konsisten dengan seluruh dokumen sebelumnya.
* Menggunakan Markdown yang rapi.
* Memiliki daftar isi.
* Menggunakan diagram struktur bila diperlukan.
* Tidak berisi implementasi kode.
* Menjadi acuan resmi struktur proyek.

---

# Aturan Kerja AI

Selama membuat file baru:

* Selalu mengikuti struktur proyek ini.
* Jangan membuat folder di luar standar tanpa alasan yang jelas.
* Jangan memindahkan file tanpa memperbarui dokumentasi.
* Selalu tempatkan file sesuai tanggung jawabnya.

---

# Output

Hasil akhir berupa file:

`docs/10_PROJECT_STRUCTURE.md`

Dokumen ini harus menjadi referensi utama bagi AI dan developer mengenai struktur proyek, lokasi file, pembagian modul, serta hubungan antar-layer sehingga pengembangan aplikasi tetap konsisten dan mudah dipelihara sepanjang siklus hidup proyek.
