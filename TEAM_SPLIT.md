⚠️ ปัญหาที่พบและวิธีแก้
❌ ปัญหา 1: Railway clone repository ผิดโครงสร้าง ทำให้หาไฟล์ไม่เจอ

สาเหตุ:
Repository ที่ใช้ deploy มีโครงสร้างเป็นหลายโฟลเดอร์ (เช่น frontend/, auth-service/)
แต่ Railway จะ build จาก root ของ repository ทำให้ไม่พบไฟล์สำคัญ เช่น:

Could not find root directory: frontend
COPY frontend/ /usr/share/nginx/html → not found

ส่งผลให้ build ล้มเหลว และ container ไม่สามารถ start ได้

วิธีแก้:

แยก repository ตาม service (เช่น frontend แยก repo)

หรือปรับโครงสร้างให้ไฟล์ที่ใช้ build อยู่ที่ root

สร้าง branch ใหม่สำหรับ deploy:

git checkout -b deploy-frontend

commit และ push ขึ้น GitHub แล้วเชื่อม Railway ใหม่

ผลลัพธ์:

Railway สามารถ build และ deploy ได้สำเร็จ

container ทำงานได้ปกติ และเข้าผ่าน URL ได้

❌ ปัญหา 2: เกิด error <html> is not valid JSON

สาเหตุ:
frontend เรียก API ผิด endpoint ทำให้ request ไปที่ nginx แล้วถูก redirect ไปหน้า HTML แทนที่จะเป็น JSON

วิธีแก้:

แก้ URL ให้ถูกต้อง:

fetch('/api/auth/login')

ตรวจสอบ routing ใน API Gateway (Nginx) ให้ตรงกับ service

ผลลัพธ์:

API ตอบกลับเป็น JSON ถูกต้อง

frontend สามารถ login ได้สำเร็จ

❌ ปัญหา 3: JWT error (jwt is not defined / JWT_SECRET not defined)

สาเหตุ:

ลืม import library jsonwebtoken

ไม่ได้กำหนดค่า JWT_SECRET

วิธีแก้:

เพิ่ม:

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

ตั้งค่า Environment Variable ใน Railway:

JWT_SECRET=your_secret_key

ผลลัพธ์:

สามารถ generate token ได้

ระบบ login ทำงานได้ปกติ

❌ ปัญหา 4: Database ยังไม่ถูกสร้างแต่มีการ insert ข้อมูล

สาเหตุ:
เรียก createDefaultAdmin() ก่อน initDB() ทำให้ table ยังไม่ถูกสร้าง

วิธีแก้:
จัดลำดับการทำงานใหม่:

await initDB();
await createDefaultAdmin();

ผลลัพธ์:

Database ถูกสร้างก่อนใช้งาน

สามารถ insert admin ได้สำเร็จ

🎯 สรุปภาพรวม

ปัญหาที่พบส่วนใหญ่เกี่ยวข้องกับ:

การ deploy (Railway / Docker)

การเชื่อมต่อระหว่าง services

การตั้งค่า environment และ routing