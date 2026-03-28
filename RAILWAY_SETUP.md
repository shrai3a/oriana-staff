# نشر Oriana Staff على Railway - شرح مفصل

## الخطوة 1️⃣: إنشاء حساب Railway

1. اذهب إلى: https://railway.app
2. اضغط "Sign Up" (التسجيل)
3. سجل بـ GitHub أو البريد الإلكتروني
4. تأكيد البريد الإلكتروني

---

## الخطوة 2️⃣: إنشاء قاعدة بيانات MySQL

1. في لوحة Railway، اضغط "Create New Project"
2. اختر "Provision New" → "MySQL"
3. سيتم إنشاء قاعدة بيانات مجانية تلقائياً
4. انسخ بيانات الاتصال:
   - Host
   - Port
   - Username
   - Password
   - Database

---

## الخطوة 3️⃣: تحضير المشروع للنشر

### تثبيت Railway CLI

```bash
npm install -g @railway/cli
```

### تسجيل الدخول

```bash
railway login
```

### ربط المشروع

```bash
cd /path/to/oriana_staff
railway init
```

---

## الخطوة 4️⃣: إعداد المتغيرات البيئية

في لوحة Railway، أضف المتغيرات:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

---

## الخطوة 5️⃣: النشر

```bash
railway up
```

أو عبر الواجهة:
1. اضغط "Deploy"
2. انتظر حتى ينتهي (2-5 دقائق)
3. ستحصل على رابط مباشر

---

## ✅ النتيجة

بعد النشر، ستحصل على:
- 🌐 رابط الموقع: `https://your-app.railway.app`
- 📊 لوحة تحكم الإدارة: `https://your-app.railway.app`
- 👥 تطبيق الموظفين: `https://your-app.railway.app/employee`

---

## 🔧 استكشاف الأخطاء

### خطأ: "Database connection failed"
- تحقق من بيانات الاتصال
- تأكد من أن MySQL يعمل

### خطأ: "Port already in use"
- غيّر PORT في المتغيرات البيئية

### خطأ: "Build failed"
- تحقق من package.json
- جرب `npm install` محلياً أولاً

---

## 📱 الوصول من الجوال

بعد النشر، يمكنك الوصول من أي جهاز:

1. **الإدارة:**
   - https://your-app.railway.app
   - سجل دخول كـ admin

2. **الموظفين:**
   - https://your-app.railway.app/employee
   - سجل دخول كـ موظف

3. **التطبيق الموبايل:**
   - عدّل `config.ts` بـ رابط Railway
   - بناء APK

---

## 💾 النسخ الاحتياطية

Railway توفر نسخ احتياطية تلقائية لقاعدة البيانات.

---

## 🚀 الخطوة التالية

بعد النشر، يمكنك:
- ✅ إضافة موظفين
- ✅ تسجيل الحضور
- ✅ عرض التقارير
- ✅ بناء تطبيق Android
