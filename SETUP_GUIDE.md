# 🚀 دليل تثبيت وتشغيل Oriana Staff على Windows

## المتطلبات الأساسية

### 1. تثبيت Node.js و npm

1. اذهب إلى [nodejs.org](https://nodejs.org)
2. حمّل **LTS Version** (الإصدار المستقر)
3. شغّل المثبت واتبع التعليمات
4. تحقق من التثبيت بفتح Command Prompt وكتابة:
   ```bash
   node --version
   npm --version
   ```

### 2. تثبيت pnpm (اختياري لكن موصى به)

```bash
npm install -g pnpm
```

## خطوات التثبيت المحلي

### 1. استخراج الملفات

1. استخرج مجلد `oriana_staff` في مكان آمن على جهازك
2. افتح Command Prompt في المجلد

### 2. تثبيت المكتبات

```bash
pnpm install
```

أو إذا كنت تستخدم npm:

```bash
npm install
```

### 3. إعداد قاعدة البيانات السحابية

#### الخيار 1: استخدام PlanetScale (موصى به)

1. اذهب إلى [planetscale.com](https://planetscale.com)
2. أنشئ حساب مجاني
3. أنشئ قاعدة بيانات جديدة باسم `oriana_staff`
4. احصل على رابط الاتصال (Connection String)
5. انسخ الرابط (سيكون بهذا الشكل):
   ```
   mysql://username:password@host/oriana_staff
   ```

#### الخيار 2: استخدام Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب مجاني
3. أنشئ مشروع جديد
4. احصل على رابط الاتصال من إعدادات المشروع

### 4. إنشاء ملف .env

1. في مجلد المشروع، أنشئ ملف جديد باسم `.env`
2. انسخ المحتوى التالي:

```env
# قاعدة البيانات (من الخطوة السابقة)
DATABASE_URL="mysql://username:password@host/oriana_staff"

# JWT Secret (استخدم قيمة عشوائية قوية)
JWT_SECRET="your_super_secret_jwt_key_change_this_to_something_secure_and_long_at_least_32_characters"

# معلومات التطبيق
VITE_APP_TITLE="Oriana Staff"
NODE_ENV="development"
PORT=3000

# معلومات المالك
OWNER_NAME="Admin"
OWNER_OPEN_ID="admin_user_id"
```

### 5. إنشاء قاعدة البيانات

شغّل أوامر الهجرة:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## التشغيل المحلي

### تشغيل خادم التطوير

```bash
pnpm dev
```

سيظهر رابط محلي مثل:
```
http://localhost:3000
```

افتح هذا الرابط في متصفحك!

## النشر على سيرفر خارجي

### الخيار 1: Railway (الأسهل والأفضل)

1. اذهب إلى [railway.app](https://railway.app)
2. سجّل دخول باستخدام GitHub
3. أنشئ مشروع جديد
4. اختر "Deploy from GitHub"
5. اختر مستودع المشروع
6. أضف متغيرات البيئة:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
7. اضغط Deploy

### الخيار 2: Render

1. اذهب إلى [render.com](https://render.com)
2. أنشئ حساب جديد
3. اختر "New Web Service"
4. اربط مستودع GitHub الخاص بك
5. أضف متغيرات البيئة
6. اضغط Deploy

### الخيار 3: Heroku

1. اذهب إلى [heroku.com](https://heroku.com)
2. أنشئ تطبيق جديد
3. اربط مستودع GitHub
4. أضف متغيرات البيئة
5. اضغط Deploy

## استخدام التطبيق

### دخول الإدارة

1. افتح التطبيق
2. اختر "دخول الإدارة"
3. استخدم بيانات حسابك

### دخول الموظفين

1. افتح التطبيق
2. اختر "دخول الموظفين"
3. استخدم بيانات الموظف

## استكشاف الأخطاء

### خطأ: "Cannot find module"

```bash
pnpm install
```

### خطأ: "Database connection failed"

- تحقق من رابط قاعدة البيانات في `.env`
- تأكد من أن قاعدة البيانات تعمل
- تأكد من أن كلمة المرور صحيحة

### خطأ: "Port 3000 already in use"

غيّر المنفذ في `.env`:

```env
PORT=3001
```

## الملفات المهمة

```
oriana_staff/
├── client/              # واجهة المستخدم (React)
├── server/              # خادم التطبيق (Express)
├── drizzle/             # قاعدة البيانات
├── package.json         # المكتبات والأوامر
├── .env                 # متغيرات البيئة
└── README.md            # توثيق المشروع
```

## الأوامر المهمة

```bash
# تثبيت المكتبات
pnpm install

# تشغيل خادم التطوير
pnpm dev

# بناء التطبيق للإنتاج
pnpm build

# تشغيل التطبيق المبني
pnpm start

# فحص الأخطاء
pnpm check

# تنسيق الكود
pnpm format

# اختبار التطبيق
pnpm test
```

## الدعم والمساعدة

إذا واجهت أي مشاكل:

1. تحقق من الأخطاء في Command Prompt
2. تأكد من أن جميع المتطلبات مثبتة
3. حاول حذف مجلد `node_modules` وإعادة التثبيت

```bash
rmdir /s /q node_modules
pnpm install
```

---

**تم إنشاء هذا الدليل لـ Oriana Staff v2.0** 🎉
