Lakukan Project Stabilization.

Jangan menambah fitur baru.

Fokus memperbaiki semua warning, error, dan dependency.

Checklist:

1.
Periksa seluruh CDN.

Pastikan semua URL valid.

Ganti URL yang sudah tidak tersedia.

2.
Pastikan library berikut menggunakan versi stabil:

Bootstrap
Bootstrap Icons
Dexie
Chart.js
SheetJS (xlsx)
jsPDF

3.
Perbaiki package.json.

Tambahkan:

name
version
description
type
scripts

scripts minimal:

dev
serve
start

Tambahkan dependency bila diperlukan.

4.
Periksa semua import ES Module.

Pastikan tidak ada import yang mengarah ke file yang tidak ada.

5.
Periksa seluruh manifest.json.

Pastikan semua icon benar-benar ada.

Jika icon belum tersedia:

buat otomatis

icon-72
icon-96
icon-128
icon-144
icon-152
icon-192
icon-384
icon-512

6.
Periksa service worker.

Cache hanya file yang benar-benar ada.

Hilangkan cache file yang hilang.

7.
Periksa seluruh Console.

Target:

0 Error

0 Warning

(kecuali warning Chrome DevTools)

8.
Periksa seluruh Network.

Semua resource harus status 200.

Tidak boleh ada:

404

ERR_ABORTED

ERR_CONNECTION_REFUSED

9.
Tambahkan fallback bila Chart.js belum selesai loading.

Dashboard tetap tampil normal.

10.
Tambahkan fallback bila XLSX gagal dimuat.

Export Excel dinonaktifkan sementara tanpa membuat aplikasi crash.

11.
Rapikan struktur package.json.

Gunakan dependency modern.

12.
Setelah selesai tampilkan laporan:

✔ File yang diubah

✔ Error yang diperbaiki

✔ Warning yang diperbaiki

✔ Resource yang diganti

✔ Dependency yang ditambahkan

Jangan mengubah UI.

Jangan mengubah database.

Jangan mengubah struktur folder.

Fokus hanya stabilisasi project.