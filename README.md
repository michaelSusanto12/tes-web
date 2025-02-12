# Sistem Komisi Marketing

Aplikasi web untuk menghitung komisi marketing dan manajemen pembayaran kredit.

## Fitur Utama

- Laporan komisi marketing berdasarkan tier omset
- Form pembayaran kredit dengan tracking status
- Laporan penjualan dengan pagination
- Export riwayat pembayaran ke PDF
- API endpoints untuk integrasi

## Prasyarat

- Node.js v18+
- MySQL/MariaDB
- XAMPP (opsional)
- Postman (untuk testing API)
- Git (untuk cloning repo)

## Cara Install

### 1. Clone Repository

```bash
git clone https://github.com/username/repo-name.git
cd repo-name
2. Install Dependencies
Backend:

bash
Copy
cd backend
npm install
Frontend:

bash
Copy
cd ../frontend
npm install
3. Setup Database
Jalankan XAMPP dan start Apache & MySQL

Buka phpMyAdmin di http://localhost/phpmyadmin

Import file marketing_db.sql yang ada di folder database

4. Konfigurasi
Backend:

Buka backend/config/db.js

Sesuaikan dengan kredensial database Anda:

javascript
Copy
{
  host: 'localhost',
  user: 'root',
  password: '', // Password MySQL Anda
  database: 'marketing_db'
}
Frontend:

Buka frontend/src/services/api.js

Pastikan baseURL mengarah ke backend:

javascript
Copy
baseURL: 'http://localhost:5000/api'
Cara Menjalankan
Start Backend:

bash
Copy
cd backend
npm start
Server akan berjalan di port 5000

Start Frontend:

bash
Copy
cd ../frontend
npm start
Aplikasi akan terbuka di browser http://localhost:3000

Testing API dengan Postman
Import file Marketing_API.postman_collection.json

Buat environment baru dengan variable:

base_url: http://localhost:5000/api

Jalankan test collection

Struktur Folder
Copy
📦root
├──📂backend
│   ├──📂config
│   ├──📂controllers
│   ├──📂models
│   └──📂routes
├──📂frontend
│   ├──📂public
│   └──📂src
└──📂postman_collection
```
