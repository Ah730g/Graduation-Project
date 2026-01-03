# دليل رفع التطبيق على Railway

## متطلبات الاستضافة على Railway

### 1. إنشاء حساب على Railway
- اذهب إلى [railway.app](https://railway.app)
- سجل دخول بحساب GitHub
- أنشئ مشروع جديد (New Project)

### 2. إعداد قاعدة البيانات MySQL

1. في Dashboard، اضغط **"New"** → **"Database"** → **"Add MySQL"**
2. Railway سينشئ قاعدة بيانات تلقائياً
3. احفظ معلومات الاتصال (سيتم إضافتها تلقائياً كمتغيرات بيئة)

### 3. إعداد Backend Service

1. اضغط **"New"** → **"GitHub Repo"**
2. اختر المستودع: `Ah730g/Graduation-Project`
3. Railway سيكتشف تلقائياً أنه Laravel من `composer.json`
4. في **Settings** → **Root Directory**: اكتب `backend`
5. في **Settings** → **Deploy**:
   - **Build Command**: `composer install --no-dev --optimize-autoloader && php artisan key:generate --force && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache`
   - **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

### 4. إعداد متغيرات البيئة للـ Backend

في **Variables** tab، أضف:

```
APP_NAME="Graduation Project"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-service.railway.app

LOG_CHANNEL=stderr
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

FRONTEND_URL=https://your-frontend-service.railway.app
SANCTUM_STATEFUL_DOMAINS=your-frontend-service.railway.app
SESSION_DOMAIN=.railway.app

# ImageKit (إذا كنت تستخدمه)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

**ملاحظة**: Railway يضيف متغيرات قاعدة البيانات تلقائياً عند ربط MySQL service.

### 5. إعداد Frontend Service

1. اضغط **"New"** → **"GitHub Repo"** (في نفس المشروع)
2. اختر نفس المستودع: `Ah730g/Graduation-Project`
3. في **Settings** → **Root Directory**: اكتب `frontend`
4. في **Settings** → **Build Command**: `npm install && npm run build`
5. في **Settings** → **Start Command**: اتركه فارغاً (Static Site)
6. في **Settings** → **Output Directory**: `dist`

### 6. إعداد متغيرات البيئة للـ Frontend

في **Variables** tab، أضف:

```
VITE_BASE_API_URL=https://your-backend-service.railway.app
```

**ملاحظة**: استبدل `your-backend-service` بـ URL الـ Backend Service الفعلي من Railway.

### 7. ربط Services

1. في **Backend Service** → **Settings** → **Networking**:
   - أضف **Public Domain** (سيحصل على URL مثل: `your-backend.railway.app`)
2. في **Frontend Service** → **Settings** → **Networking**:
   - أضف **Public Domain** (سيحصل على URL مثل: `your-frontend.railway.app`)

### 8. تحديث متغيرات البيئة بعد الحصول على URLs

بعد الحصول على URLs الفعلية:

1. في **Backend Service Variables**:
   - حدث `APP_URL` إلى URL الـ Backend الفعلي
   - حدث `FRONTEND_URL` إلى URL الـ Frontend الفعلي
   - حدث `SANCTUM_STATEFUL_DOMAINS` إلى domain الـ Frontend

2. في **Frontend Service Variables**:
   - حدث `VITE_BASE_API_URL` إلى URL الـ Backend الفعلي

3. أعد تشغيل Services بعد التحديث

### 9. تشغيل Migrations

Railway سيشغل migrations تلقائياً من Build Command، لكن يمكنك تشغيلها يدوياً:

1. في **Backend Service** → **Deployments** → **View Logs**
2. أو استخدم Railway CLI:
   ```bash
   railway run php artisan migrate --force
   ```

### 10. التحقق من النشر

1. **Backend Health Check**: 
   - افتح: `https://your-backend.railway.app/api/health`
   - يجب أن ترى: `{"status":"ok","timestamp":"..."}`

2. **Frontend**:
   - افتح: `https://your-frontend.railway.app`
   - يجب أن ترى صفحة التطبيق

## نصائح مهمة

### الأمان
- لا ترفع ملفات `.env` إلى GitHub
- استخدم Railway Variables للمعلومات الحساسة
- تأكد من `APP_DEBUG=false` في الإنتاج

### الأداء
- Railway يخزن cache تلقائياً
- استخدم `php artisan config:cache` في Build Command
- استخدم `php artisan route:cache` و `php artisan view:cache`

### الملفات والصور
- استخدم ImageKit أو Cloudinary للصور (موصى به)
- أو استخدم Railway Volume Storage للملفات المحلية

### Logs
- يمكنك رؤية logs من Railway Dashboard
- أو استخدم Railway CLI: `railway logs`

## استكشاف الأخطاء

### Backend لا يعمل
1. تحقق من Logs في Railway Dashboard
2. تأكد من أن `APP_KEY` موجود
3. تأكد من اتصال قاعدة البيانات
4. تحقق من CORS settings

### Frontend لا يتصل بالـ Backend
1. تأكد من `VITE_BASE_API_URL` في Frontend Variables
2. تأكد من CORS في Backend
3. تحقق من أن Backend يعمل من Health Check

### قاعدة البيانات
1. تأكد من ربط MySQL Service مع Backend Service
2. تحقق من متغيرات البيئة للـ Database
3. تأكد من تشغيل Migrations

## Railway CLI (اختياري)

يمكنك استخدام Railway CLI لإدارة المشروع:

```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# رفع متغيرات البيئة
railway variables set KEY=value

# تشغيل أوامر
railway run php artisan migrate
```

## الدعم

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

