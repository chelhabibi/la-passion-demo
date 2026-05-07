# La Passion — Fine Dining Restaurant Web App

Nhà hàng fine dining tại 24 Hàng Bè, Phố Cổ Hà Nội. Web app full-stack được xây dựng bằng Claude Code.

## Live Demo

> **Frontend:** https://frontend-production-01ff.up.railway.app
> **API:** https://backend-production-dc32.up.railway.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| i18n | next-intl (Tiếng Việt / English) |
| Deploy | Railway |

---

## Features

- Giới thiệu nhà hàng với triết lý ẩm thực Pháp-Việt
- Thực đơn theo mùa (Seasonal Menu) với 16 món, 4 danh mục
- Đặt bàn online — lưu vào PostgreSQL, success popup bottom-right
- Chuyển đổi ngôn ngữ Tiếng Việt / English
- Parallax hero, fade-in animations, hover interactions
- Responsive design — mobile first

---

## Project Structure

```
la-passion/
├── frontend/        # Next.js app
│   ├── src/
│   │   ├── app/[locale]/   # i18n routing
│   │   ├── components/     # Navbar, Hero, About, Menu, Reservation, Contact
│   │   └── i18n.ts
│   └── messages/    # vi.json, en.json
├── backend/         # FastAPI
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── seed.py
├── README.md
├── CLAUDE.md
└── PLAN.md
```

---

## Run Locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL running locally

### Backend

```bash
cd backend
cp .env.example .env
# Sửa DATABASE_URL trong .env
pip install -r requirements.txt
python seed.py          # Seed menu data
uvicorn main:app --reload
# API chạy tại http://localhost:8000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
# Web chạy tại http://localhost:3000
```

---

## Deploy (Railway)

1. Tạo 3 services trên Railway: **PostgreSQL**, **backend**, **frontend**
2. Backend: set `DATABASE_URL` và `ALLOWED_ORIGINS` = URL frontend
3. Frontend: set `NEXT_PUBLIC_API_URL` = URL backend
4. Backend: chạy `python seed.py` một lần để seed menu data

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/menu` | Lấy toàn bộ menu |
| GET | `/menu/{category}` | Lấy menu theo danh mục |
| POST | `/reservations` | Tạo đặt bàn mới |
