# StoreCraft SaaS — Deployment & Hosting Guide

This guide covers how to deploy the entire full-stack Multi-Tenant E-commerce SaaS application to **GitHub**, **Netlify**, **Vercel**, **Render**, **Railway**, and **VPS (Ubuntu / Docker)**.

---

## 1. 🐙 How to Push to GitHub

### Step 1: Create a new repository on GitHub
1. Go to [https://github.com/new](https://github.com/new)
2. Enter repository name: `storecraft-saas` (Public or Private)
3. Do **not** check "Initialize with README"
4. Click **Create repository**.

### Step 2: Push your local code from terminal
Open terminal in your project directory:

```bash
cd storecraft

# Rename branch to main
git branch -M main

# Add your GitHub remote URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/storecraft-saas.git

# Push the code
git push -u origin main
```

---

## 2. ⚡ Deploy on Render.com (Recommended for Full-Stack)

Render deploys both the Express API and the React frontend on a single free/paid instance with zero configuration.

### Steps:
1. Log into [Render.com](https://render.com) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository (`storecraft-saas`).
3. Set the following build settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**:
     - `PORT` = `3000` (or leave default $PORT)
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = `your_strong_secret_key_2026`
4. Click **Create Web Service**. Your live SaaS URL will be ready in ~2 minutes!

---

## 3. 🚆 Deploy on Railway.app

1. Go to [Railway.app](https://railway.app) ➔ **New Project** ➔ **Deploy from GitHub repo**.
2. Select `storecraft-saas`.
3. Railway automatically detects `Dockerfile` or `package.json`.
4. Add environment variables (`JWT_SECRET`, `PORT=3000`).
5. Click **Deploy**.

---

## 4. 🌐 Deploy on Vercel

1. Import your GitHub repository on [Vercel.com](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Vercel automatically reads `vercel.json` for API rewrites and single-page application routing.
6. Click **Deploy**.

---

## 5. 🌲 Deploy on Netlify

1. Import your GitHub repository on [Netlify.com](https://netlify.com).
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Netlify automatically reads `netlify.toml` for SPA redirects (`/*` -> `/index.html`).
5. Click **Deploy Site**.

---

## 6. 🐳 Deploy with Docker & Docker Compose (VPS / DigitalOcean)

```bash
# 1. Clone repository on your VPS
git clone https://github.com/YOUR_USERNAME/storecraft-saas.git
cd storecraft-saas

# 2. Run with Docker Compose
docker-compose up -d --build

# 3. Check running status
docker ps
```
The app will be live on `http://YOUR_SERVER_IP:3000` with automated persistent volume storage in `./data`.
