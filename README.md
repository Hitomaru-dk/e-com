# Feane E-Commerce Platform 🍔🛒

A full-stack e-commerce web application for a restaurant, built with Node.js (Express) and SQLite. The project utilizes a strict layered architecture to ensure maintainability, scalability, and clean code principles.

## 🏗️ Architecture & Design Patterns

This project follows a **Multi-Tier Architecture** (Separation of Concerns) pattern:

1. **Routes Layer (`/routes`):** Defines RESTful API endpoints and routes incoming traffic to the appropriate controllers.
2. **Controller Layer (`/controllers`):** Handles the HTTP request/response lifecycle. It extracts data from the client, passes it to the service layer, and formats the JSON response.
3. **Service Layer (`/services`):** The heart of the application containing all the business logic (e.g., cart total calculations, data validation before saving).
4. **Repository Layer (`/repositories`):** The Data Access Layer. It isolates the database queries (SQLite) and file system reads (JSON) from the rest of the app.
5. **Database Layer (`database.js` & `store.db`):** Manages the SQLite database connection and schema initialization.

## 💻 Tech Stack

### **Frontend**
* **HTML5 & CSS3:** Responsive design utilizing Bootstrap 4.
* **JavaScript (Vanilla JS):** DOM manipulation, Fetch API for backend communication.
* **State Management:** Client-side shopping cart managed via `LocalStorage`.

### **Backend**
* **Runtime & Framework:** Node.js with Express.js.
* **Database:** SQLite3 for lightweight, serverless relational data storage.
* **Security:** Password hashing (MD5 via `crypto`) and environment variable management (`.env`).

## 📂 Project Structure

```text
.
├── feane-backend/           # Server-side application
│   ├── controllers/         # HTTP request handlers
│   ├── data/                # JSON seed data
│   ├── repositories/        # Database interaction logic
│   ├── routes/              # API routing definitions
│   ├── services/            # Core business logic
│   ├── database.js          # SQLite configuration
│   ├── server.js            # Express app entry point
│   └── store.db             # SQLite database file
├── css/                     # Stylesheets (Bootstrap, custom)
├── js/                      # Frontend JavaScript
├── fonts/                   # FontAwesome assets
├── images/                  # Static images
└── *.html                   # Frontend views (index, menu, login, etc.)

---

### 🇹🇭 Thai Version (ฉบับแปลไทย)

```markdown
# แพลตฟอร์ม Feane E-Commerce 🍔🛒

เว็บแอปพลิเคชัน E-Commerce แบบ Full-stack สำหรับร้านอาหาร พัฒนาด้วย Node.js (Express) และฐานข้อมูล SQLite โปรเจกต์นี้ใช้การออกแบบสถาปัตยกรรมซอฟต์แวร์แบบแยกชั้น (Layered Architecture) อย่างเคร่งครัด เพื่อให้โค้ดสะอาด ดูแลรักษาง่าย และพร้อมสำหรับการขยายสเกลในอนาคต

## 🏗️ สถาปัตยกรรมและรูปแบบการออกแบบ (Architecture & Design Patterns)

โปรเจกต์นี้ใช้โครงสร้างแบบ **Multi-Tier Architecture** (การแยกส่วนความรับผิดชอบอย่างชัดเจน):

1. **Routes Layer (`/routes`):** กำหนดเส้นทาง API (Endpoints) และส่งต่อ Request ไปยัง Controller ที่ถูกต้อง
2. **Controller Layer (`/controllers`):** จัดการการรับส่งข้อมูลผ่าน HTTP รับข้อมูลจากฝั่ง Client ส่งต่อให้ Service และจัดรูปแบบการตอบกลับ (Response) แบบ JSON
3. **Service Layer (`/services`):** หัวใจหลักของระบบที่บรรจุ Business Logic ทั้งหมด (เช่น การคำนวณราคารวมของตะกร้าสินค้า, การตรวจสอบข้อมูลก่อนบันทึก)
4. **Repository Layer (`/repositories`):** ชั้นจัดการฐานข้อมูล (Data Access Layer) ทำหน้าที่แยกคำสั่งคิวรี SQLite และการอ่านไฟล์ JSON ออกจากส่วนอื่นๆ ของระบบ
5. **Database Layer (`database.js` & `store.db`):** จัดการการเชื่อมต่อฐานข้อมูล SQLite และการสร้างโครงสร้างตาราง (Schema)

## 💻 เทคโนโลยีที่ใช้ (Tech Stack)

### **ฝั่งหน้าบ้าน (Frontend)**
* **HTML5 & CSS3:** ออกแบบให้รองรับทุกหน้าจอ (Responsive) ด้วย Bootstrap 4
* **JavaScript (Vanilla JS):** จัดการ DOM และใช้ Fetch API สำหรับดึงข้อมูลจากหลังบ้าน
* **การจัดการสถานะ (State Management):** ระบบตะกร้าสินค้าทำงานฝั่ง Client โดยใช้ `LocalStorage`

### **ฝั่งหลังบ้าน (Backend)**
* **Runtime & Framework:** Node.js ทำงานร่วมกับ Express.js
* **Database:** SQLite3 ฐานข้อมูลเชิงสัมพันธ์ที่มีน้ำหนักเบาและไม่ต้องตั้งค่าเซิร์ฟเวอร์แยก
* **Security:** การเข้ารหัสรหัสผ่าน (MD5 ผ่านโมดูล `crypto`) และการจัดการตัวแปรสภาพแวดล้อมเพื่อซ่อนข้อมูลความลับ (`.env`)

## 📂 โครงสร้างโปรเจกต์

```text
.
├── feane-backend/           # โค้ดฝั่งเซิร์ฟเวอร์ (Backend)
│   ├── controllers/         # ตัวรับส่ง HTTP Request
│   ├── data/                # ข้อมูลตั้งต้นรูปแบบ JSON
│   ├── repositories/        # ลอจิกการเข้าถึงฐานข้อมูล
│   ├── routes/              # ตัวกำหนดเส้นทาง API
│   ├── services/            # ลอจิกทางธุรกิจหลัก
│   ├── database.js          # การตั้งค่าการเชื่อมต่อ SQLite
│   ├── server.js            # ไฟล์หลักสำหรับรันเซิร์ฟเวอร์
│   └── store.db             # ไฟล์ฐานข้อมูล SQLite
├── css/                     # ไฟล์จัดการความสวยงาม (Bootstrap, สไตล์ที่กำหนดเอง)
├── js/                      # โค้ด JavaScript ฝั่งหน้าบ้าน
├── fonts/                   # ไอคอน FontAwesome
├── images/                  # รูปภาพที่ใช้ในเว็บไซต์
└── *.html                   # หน้าเว็บต่างๆ (index, menu, login เป็นต้น)