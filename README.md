# 🌱 GreenRoots

GreenRoots is a modern web platform connecting nature lovers, urban gardeners, and eco-enthusiasts to share plant growth stories, track tree diaries, and participate in sustainability challenges.

---

## 🛠️ Tech Stack

- **Frontend (`/client`)**: React 19, Vite, Tailwind CSS, Headless UI, Framer Motion, Axios, React Icons
- **Backend (`/server`)**: Django 5, Django REST Framework, SimpleJWT, Cloudinary, Whitenoise, Gunicorn

---

## 🚀 Quick Start (Local Development)

### 1. Backend (Django)
```bash
cd server
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs at: `http://localhost:8000`

### 2. Frontend (React + Vite)
```bash
cd client
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🌐 Production Deployment Guide

### A. Deploy Backend on Render (Free / Paid)
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `server`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh` (or `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`)
   - **Start Command**: `gunicorn config.wsgi:application`
5. Set Environment Variables on Render:
   - `DEBUG`: `False`
   - `SECRET_KEY`: `<Generate a random secure key>`
   - `ALLOWED_HOSTS`: `your-app-name.onrender.com,localhost`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
   - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend.vercel.app,https://your-app-name.onrender.com`
   - `CLOUDINARY_CLOUD_NAME`: `<your Cloudinary cloud name>`
   - `CLOUDINARY_API_KEY`: `<your Cloudinary API key>`
   - `CLOUDINARY_API_SECRET`: `<your Cloudinary API secret>`

---

### B. Deploy Frontend on Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) -> **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure Project:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-app-name.onrender.com/api`
5. Click **Deploy**.

---

## 📦 Push to GitHub

If you haven't created a GitHub repository yet:
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `greenroots`).
2. Run:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
