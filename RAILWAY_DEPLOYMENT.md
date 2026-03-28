# 🚀 نشر Oriana Staff على Railway (الخطة المجانية)

## المميزات المجانية على Railway

✅ **500 ساعة تشغيل شهرية** - كافية لتطبيق صغير  
✅ **5 دولار رصيد شهري مجاني** - لقاعدة البيانات والتخزين  
✅ **نطاق فرعي مجاني** - example.railway.app  
✅ **SSL/HTTPS مجاني** - شهادة SSL تلقائية  
✅ **قاعدة بيانات MySQL مجانية** - 5GB تخزين  

---

## الخطوات الكاملة

### 1. إنشاء حساب Railway

1. اذهب إلى [railway.app](https://railway.app)
2. اضغط **"Sign Up"**
3. سجّل دخول باستخدام **GitHub** (الأسهل)
4. اسمح للتطبيق بالوصول إلى حسابك

### 2. رفع المشروع إلى GitHub

إذا لم تكن قد رفعت المشروع بعد:

```bash
# في مجلد oriana_staff
git init
git add .
git commit -m "Initial commit: Oriana Staff v2.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oriana_staff.git
git push -u origin main
```

**استبدل:**
- `YOUR_USERNAME` باسم مستخدم GitHub الخاص بك

### 3. إنشاء مشروع جديد على Railway

1. في لوحة التحكم، اضغط **"New Project"**
2. اختر **"Deploy from GitHub"**
3. اختر المستودع `oriana_staff`
4. اختر الفرع `main`
5. اضغط **"Deploy"**

### 4. إضافة قاعدة البيانات MySQL

1. في المشروع، اضغط **"Add Service"**
2. اختر **"Database"**
3. اختر **"MySQL"**
4. اضغط **"Create"**

سيتم إنشاء قاعدة بيانات تلقائياً وإضافة `DATABASE_URL` إلى المتغيرات.

### 5. إضافة متغيرات البيئة

1. اضغط على خدمة التطبيق (app)
2. اذهب إلى **"Variables"**
3. أضف المتغيرات التالية:

```
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_secure_and_long_at_least_32_characters
VITE_APP_TITLE=Oriana Staff
OWNER_NAME=Admin
OWNER_OPEN_ID=admin_user_id
PORT=3000
```

**ملاحظة:** استخدم قيمة عشوائية قوية لـ `JWT_SECRET`

### 6. تشغيل الهجرة

بعد النشر الأول:

1. اذهب إلى **"Deployments"**
2. اختر أحدث نشر
3. اضغط **"View Logs"**
4. تأكد من عدم وجود أخطاء

### 7. الوصول إلى التطبيق

1. في Railway، ستجد **"Public URL"**
2. انسخ الرابط وافتحه في المتصفح
3. يجب أن ترى صفحة Oriana Staff

---

## استكشاف الأخطاء

### خطأ: "Database connection failed"

```bash
# تحقق من:
1. أن قاعدة البيانات تعمل
2. أن DATABASE_URL صحيح
3. أن الهجرة تمت بنجاح
```

**الحل:**
- اذهب إلى **"Variables"** وتحقق من `DATABASE_URL`
- إعادة نشر التطبيق

### خطأ: "Build failed"

1. اذهب إلى **"Deployments"**
2. اختر النشر الفاشل
3. اضغط **"View Logs"**
4. ابحث عن رسالة الخطأ

**الحل الشامل:**
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules
pnpm install
git add .
git commit -m "Fix: reinstall dependencies"
git push origin main
```

### التطبيق بطيء جداً

- قد يكون السبب الخادم المجاني
- يمكنك الترقية إلى خطة مدفوعة مقابل $5/شهر

---

## تحسينات الأداء

### 1. تقليل حجم الصور

```bash
# استخدم أداة مثل ImageOptim أو TinyPNG
# لتقليل حجم الصور قبل الرفع
```

### 2. تفعيل الضغط

تم تفعيله تلقائياً في Express

### 3. استخدام CDN

استخدم Railway CDN للملفات الثابتة:

```
https://cdn.railway.app/your-file.png
```

---

## الخطوات التالية

### تعيين نطاق مخصص

1. في Railway، اذهب إلى **"Settings"**
2. اختر **"Domains"**
3. أضف نطاقك الخاص
4. اتبع التعليمات

### تفعيل HTTPS

يتم تفعيله تلقائياً! ✅

### النسخ الاحتياطية

Railway توفر نسخ احتياطية تلقائية لقاعدة البيانات.

---

## الترقية من الخطة المجانية

إذا أردت المزيد من الموارد:

- **$5/شهر:** 1000 ساعة تشغيل + موارد إضافية
- **$10/شهر:** موارد أكثر + أولوية أعلى
- **$20/شهر:** خادم مخصص

---

## التحديثات

لتحديث التطبيق:

```bash
# قم بالتعديلات المطلوبة
git add .
git commit -m "Update: your changes"
git push origin main
```

Railway سيكتشف التغييرات تلقائياً وسيعيد نشر التطبيق! 🚀

---

## الدعم

- **Railway Docs:** https://docs.railway.app
- **Railway Community:** https://railway.app/support
- **GitHub Issues:** اطلب المساعدة في مستودع المشروع

---

**تم إنشاء هذا الدليل لـ Oriana Staff v2.0**  
**آخر تحديث:** مارس 2026
