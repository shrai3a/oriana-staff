# 🚀 دليل نشر Oriana Staff على Railway

## المرحلة الأولى: إنشاء حساب Railway

### الخطوة 1: اذهب إلى Railway

```
https://railway.app
```

### الخطوة 2: اضغط "Sign Up"

- اختر GitHub أو البريد الإلكتروني

- أكمل التسجيل

### الخطوة 3: تأكيد البريد الإلكتروني

- افتح بريدك الإلكتروني

- اضغط رابط التأكيد

---

## المرحلة الثانية: إنشاء قاعدة البيانات

### الخطوة 1: في لوحة Railway

1. اضغط **"Create New Project"**

1. اختر **"ProvisionProvisionProvisionProvision NewNewNewNew"**

1. اختر **"MySQL"**

### الخطوة 2: انسخ بيانات الاتصال

ستظهر لك:

```
MYSQL_HOST=xxx.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=xxxxx
MYSQL_DB=railway
```

**احفظ هذه البيانات!** ⭐

---

## المرحلة الثالثة: تحضير المشروع

### الخطوة 1: تحميل الملفات

1. حمّل ملف `oriana_staff_complete.zip`

1. استخرج الملفات على جهازك

1. افتح Terminal/Command Prompt

### الخطوة 2: الذهاب إلى مجلد المشروع

```bash
cd path/to/oriana_staff
```

### الخطوة 3: تثبيت المكتبات

```bash
npm install
```

---

## المرحلة الرابعة: إعداد المتغيرات البيئية

### الخطوة 1: إنشاء ملف .env

في مجلد المشروع، أنشئ ملف باسم `.env` وأضف:

```
DATABASE_URL=mysql://root:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your-super-secret-key-change-this-12345
NODE_ENV=production
PORT=3000
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_APP_TITLE=Oriana Staff
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id
```

**استبدل:**

- `PASSWORD` ببيانات MySQL

- `HOST` ببيانات MySQL

- `PORT` ببيانات MySQL

- `DATABASE` ببيانات MySQL

---

## المرحلة الخامسة: النشر على Railway

### الطريقة الأولى: عبر GitHub (الأسهل )

#### الخطوة 1: رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/oriana-staff.git
git push -u origin main
```

#### الخطوة 2: في لوحة Railway

1. اضغط **"Create New Project"**

1. اختر **"Deploy from GitHub"**

1. اختر مستودعك

1. اضغط **"Deploy"**

#### الخطوة 3: إضافة المتغيرات البيئية

1. في Railway، اذهب إلى **"Variables"**

1. أضف جميع المتغيرات من ملف `.env`

---

### الطريقة الثانية: عبر Railway CLI

#### الخطوة 1: تثبيت Railway CLI

```bash
npm install -g @railway/cli
```

#### الخطوة 2: تسجيل الدخول

```bash
railway login
```

#### الخطوة 3: ربط المشروع

```bash
cd path/to/oriana_staff
railway init
```

#### الخطوة 4: النشر

```bash
railway up
```

---

## المرحلة السادسة: التحقق من النشر

### الخطوة 1: الحصول على الرابط

في لوحة Railway، ستجد رابط مثل:

```
https://your-app.railway.app
```

### الخطوة 2: اختبر الموقع

1. افتح الرابط في المتصفح

1. يجب أن ترى صفحة Oriana Staff

### الخطوة 3: اختبر الدخول

- اضغط "دخول الإدارة"

- سجل دخول بـ admin

- تحقق من أن كل شيء يعمل

---

## 🔧 استكشاف الأخطاء

### خطأ: "Database connection failed"

**الحل:**

- تحقق من بيانات MySQL

- تأكد من أن DATABASE_URL صحيح

- جرب الاتصال محلياً أولاً

### خطأ: "Build failed"

**الحل:**

- تحقق من package.json

- جرب `npm install` محلياً

- تأكد من أن Node.js مثبت

### خطأ: "Port already in use"

**الحل:**

- غيّر PORT في المتغيرات البيئية

- استخدم 3000 أو 5000

---

## 📱 الوصول من الجوال

بعد النشر، يمكنك:

### الإدارة:

```
https://your-app.railway.app
```

### الموظفين:

```
https://your-app.railway.app/employee
```

### تطبيق Android:

عدّل `config.ts` في المشروع:

```typescript
export const API_BASE_URL = 'https://your-app.railway.app';
```

---

## 💾 النسخ الاحتياطية

Railway توفر نسخ احتياطية تلقائية:

- في لوحة MySQL

- اضغط **"Backups"**

- ستجد النسخ الاحتياطية

---

## 🎉 النتيجة النهائية

بعد النشر بنجاح:

- ✅ الموقع يعمل على الإنترنت

- ✅ قاعدة البيانات تعمل

- ✅ الإدارة يمكنها إدارة الموظفين

- ✅ الموظفين يمكنهم تسجيل الحضور

- ✅ تطبيق Android يعمل

---

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من الأخطاء أعلاه

1. اقرأ logs في Railway

1. تواصل مع دعم Railway: [https://railway.app/support](https://railway.app/support)

---

## 🚀 الخطوة التالية

بعد النشر بنجاح:

1. أضف موظفين

1. اختبر تسجيل الحضور

1. بناء تطبيق Android

1. أضف تنبيهات SMS (اختياري )

