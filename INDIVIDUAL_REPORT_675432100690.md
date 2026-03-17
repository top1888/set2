# INDIVIDUAL REPORT
## ชัยมนัส วัฒนปรีดา (67543210069-0)

### หน้าที่ที่รับผิดชอบ
- พัฒนา Task Service (CRUD Tasks)
- ตรวจสอบ JWT จาก Auth Service
- พัฒนา User Service
- Deploy Service บน Railway
- พัฒนา Frontend (Register / Login / Profile)

### ขั้นตอนการทำงาน
ใช้ user_id จาก JWT เป็น owner ของ task  
สร้าง User Service สำหรับดึง profile

### ปัญหาที่พบ
- <html> is not valid JSON
→ เรียก API endpoint ผิด

- Railway หา frontend ไม่เจอ
→ แยก repo หรือสร้าง branch deploy

### ผลลัพธ์
- CRUD Task ทำงานได้
- Frontend login ได้
- แสดง profile ได้

### สิ่งที่ได้เรียนรู้
- Microservices Architecture
- API Gateway (Nginx)
- Debug Deployment