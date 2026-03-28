# 🚀 دليل نشر Oriana Staff على Railway

## ما هو Railway؟

Railway هي منصة سحابية سهلة وآمنة لنشر التطبيقات. توفر:
- ✅ نشر مباشر من GitHub
- ✅ قاعدة بيانات MySQL مدمجة
- ✅ SSL/HTTPS مجاني
- ✅ نطاق فرعي مجاني
- ✅ لوحة تحكم سهلة

## الخطوات

### 1. إنشاء حساب على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. اضغط "Start Free"
3. سجّل دخول باستخدام GitHub (الأسهل)
4. اسمح للتطبيق بالوصول إلى حسابك

### 2. رفع المشروع إلى GitHub

إذا لم تكن قد رفعت المشروع بعد:

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Oriana Staff v2.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oriana_staff.git
git push -u origin main
```

### 3. إنشاء مشروع جديد على Railway

1. في لوحة التحكم، اضغط "New Project"
2. اختر "Deploy from GitHub"
3. اختر المستودع `oriana_staff`
4. اضغط "Deploy"

### 4. إضافة قاعدة البيانات

1. في المشروع، اضغط "Add Service"
2. اختر "Database"
3. اختر "MySQL"
4. اضغط "Create"

سيتم إنشاء قاعدة بيانات تلقائياً وإضافة `DATABASE_URL` إلى المتغيرات.

### 5. إضافة متغيرات البيئة

1. اضغط على خدمة التطبيق (app)
2. اذهب إلى "Variables"
3. أضف المتغيرات التالية:

```
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_secure_and_long_at_least_32_characters
VITE_APP_TITLE=Oriana Staff
OWNER_NAME=Admin
OWNER_OPEN_ID=admin_user_id
PORT=3000
```

### 6. تشغيل الهجرة

بعد النشر الأول:

1. اذهب إلى "Deployments"
2. اختر أحدث نشر
3. اضغط "View Logs"
4. تأكد من عدم وجود أخطاء

### 7. الوصول إلى التطبيق

1. في Railway، ستجد "Public URL"
2. انسخ الرابط وافتحه في المتصفح
3. يجب أن ترى صفحة Oriana Staff

## استكشاف الأخطاء

### خطأ: "Database connection failed"

```bash
# في Railway، تحقق من:
1. أن قاعدة البيانات تعمل
2. أن DATABASE_URL صحيح
3. أن الهجرة تمت بنجاح
```

### خطأ: "Build failed"

1. اذهب إلى Logs
2. ابحث عن رسالة الخطأ
3. تأكد من أن جميع المكتبات مثبتة

### التطبيق بطيء جداً

- قد يكون السبب الخادم المجاني
- يمكنك الترقية إلى خطة مدفوعة

## الخطوات التالية

### تعيين نطاق مخصص

1. في Railway، اذهب إلى "Settings"
2. اختر "Domains"
3. أضف نطاقك الخاص
4. اتبع التعليمات

### تفعيل HTTPS

يتم تفعيله تلقائياً! ✅

### النسخ الاحتياطية

Railway توفر نسخ احتياطية تلقائية لقاعدة البيانات.

## الخيارات الأخرى

### Render

1. اذهب إلى [render.com](https://render.com)
2. أنشئ حساب جديد
3. اختر "New Web Service"
4. اربط GitHub
5. أضف المتغيرات
6. اضغط Deploy

### Heroku

1. اذهب إلى [heroku.com](https://heroku.com)
2. أنشئ تطبيق جديد
3. اربط GitHub
4. أضف متغيرات البيئة
5. اضغط Deploy

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

**تم إنشاء هذا الدليل لـ Oriana Staff v2.0**
