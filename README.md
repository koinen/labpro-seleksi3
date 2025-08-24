# Grocademy
## Seleksi Lab - Labpro
> Tugas Seleksi Tahap 3

## Cara Menjalankan Aplikasi
1. Buat file .env yang sesuai dengan contoh .env.example dan isi sesuai environment anda.
2. Jalankan script ini dengan Docker Engine menyala untuk menjalankan aplikasi di lokal.
```bash
docker compose up
```

## Design Patterns
1. Builder Pattern

Builder pattern digunakan untuk membentuk response, karena setiap response untuk REST API memerlukan bentuk yang terstruktur, dan terkadang juga terdapat field pagination yang digunakan untuk beberapa jenis response

2. Composite Pattern

Composite Pattern digunakan dalam setiap module, dengan adanya pemisahan controller, service, dan data layer (Prisma), dan dibuat dengan mengikuti SRP, untuk memisahkan dan mengecilkan tiap tanggung jawab dari suatu kelas.

3. Strategy Pattern

Strategy Pattern digunakan dalam pembuatan StorageStrategy, dan dibuat dengan mengikuti prinsip OCP dan DIP pada SOLID.

## Tech Stack
- Framework Website: NestJS (TypeScript)
- Database: MariaDB
- ORM: Prisma
- Template Engine: Express Handlebar

## Endpoint
> REST API - semua

> Frontend
1. Login
2. Register 

## Bonus
- B02 - Deployment
- B07 - Dokumentasi API
- B08 - SOLID

## B02 - Deployment
Dapat diakses di: https://labpro-seleksi3-production.up.railway.app

## B07 - Dokumentasi API
Menggunakan Swagger, dan dapat diakses di /docs

## B08 - SOLID
> **S** - Single Responsibilty Principle

Prinsip ini diterapkan dengan memisahkan tiap-tiap tanggung jawab modul, sebagai AuthModule bertugas untuk menangani segala macam yang berkaitan tentang Authentication, seperti login dan register. Selain itu, tiap-tiap modul juga terdapat pemisahan tanggung jawab dengan adanya controller dan service, dengan controller bertugas sebagai antarmuka untuk request dari client, dan service untuk memroses request tersebut dengan logik yang terpisah, sehingga level controller tidak perlu terlibat dalamnya, hanya menerima hasil jadi dan mengembalikan sebagai response/halaman ke pengguna.

> **O** - Open/Closed Principle

Untuk prinsip ini, penerapannya dapat ditemukan pada penggunaan kelas-kelas abstrak atau interface sehingga dapat dibuat kelas-kelas baru dan apabila salah satu kelas konkrit ingin diganti penggunaannya, tinggal dapat menukar tanpa ada error atau permasalahan. 

> **L** - Liskov Substitution Principle

Prinsip Liskov Substitution diterapkan dengan memastikan bahwa kelas turunan atau implementasi dari suatu interface atau kelas abstrak dapat menggantikan kelas parent tanpa menyebabkan error. Contohnya adalah implementasi StorageStrategy (LocalStorageStrategy, atau strategy Storage lainnya) dapat digunakan oleh StorageService (interchangable) tanpa merusak fungsionalitas

> **I** - Interface Segregation Principle

Interface Segregation Principle adalah prinsip pemisahan antarmuka dimana tiap-tiap kelas hanya memiliki antarmuka-antarmuka yang diperlukan saja. Penerapan prinsip ini dapat ditemukan pada pemisahan antarmuka DTO (Data Transfer Object), baik request maupun response, untuk setiap route API yang ada.

> **D** - Dependency Inversion Principle 

Pada aplikasi ini, inti dari prinsip ini adalah penggunaan dependency injection, namun dependency tersebut adalah sesuatu yang abstrak, sehingga modifikasi tidak terlalu menyebarkan error (code fragility). Penerapannya dapat ditemukan pada penggunaan StorageStrategy pada StorageService.

## Author
David Bakti Lodianto - 13523083