# TUGAS

Buat file baru:

docs/22_SECURITY_GUIDE.md

JANGAN mengubah source code aplikasi.

Dokumen ini adalah standar keamanan resmi proyek POS Offline PWA.

Gunakan format Markdown profesional.

======================================================
ISI DOKUMEN
======================================================

# SECURITY GUIDE
POS Offline PWA

## Tujuan

Menjelaskan seluruh standar keamanan aplikasi.

---

# 1 Authentication

Jelaskan:

- Login
- Logout
- Lock Screen
- Session Restore
- Remember Me
- Session Timeout
- Password Change
- First Login

Business Rules.

---

# 2 Authorization

RBAC (Role Based Access Control)

Role:

Owner

Admin

Kasir

Gudang

Supervisor

Manager

jelaskan hak akses masing-masing.

---

# 3 Route Protection

Semua halaman yang wajib login.

Halaman publik.

Halaman internal.

Flow redirect.

---

# 4 Session Management

Jelaskan:

Session Storage

Local Storage

IndexedDB

Cookie (tidak digunakan)

Expiration

Idle Timeout

Auto Logout

Lock Screen

Multiple Tabs

Refresh Browser

Offline Session

---

# 5 Password Security

Minimal Password

Hashing

Salt

PBKDF2

bcrypt (future)

Password Reset

Password Expiration

---

# 6 OWASP Top 10

Bahas seluruh:

Injection

Broken Authentication

Sensitive Data Exposure

Broken Access Control

Security Misconfiguration

XSS

CSRF

SSRF

Dependency

Logging

dan bagaimana aplikasi menghindarinya.

---

# 7 Data Protection

Encryption

IndexedDB

Export Excel

Backup

Restore

Local File

Import Validation

---

# 8 Audit Log

Event yang dicatat:

Login

Logout

Tambah Produk

Edit Produk

Delete

Restore

Import

Export

Backup

Restore

User Management

Settings

dll.

Format audit.

---

# 9 Permission Matrix

Tabel lengkap.

Role

vs

Feature.

---

# 10 Security Checklist

Checklist sebelum release.

Minimal 50 poin.

---

# 11 Future Security Roadmap

2FA

OTP

Biometric

PIN

Cloud Sync

Encryption Key Rotation

Digital Signature

dll.

======================================================

HASIL

Satu file:

docs/22_SECURITY_GUIDE.md

Minimal ±500 baris dokumentasi profesional.