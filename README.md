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
- Thực đơn theo mùa (Seasonal Menu) với 19 món, 5 danh mục + Set Menu
- Đặt bàn online — lưu vào PostgreSQL, success popup bottom-right
- **Kiểm tra giờ trống real-time** — hiển thị số bàn còn trống khi chọn ngày/giờ
- **Admin dashboard** (`/admin`) — xem và quản lý toàn bộ đặt bàn, đổi trạng thái
- Chuyển đổi ngôn ngữ Tiếng Việt / English
- Ticker marquee — giải thưởng + tên món đặc sắc chạy ngang
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
| GET | `/availability?date=&time=` | Kiểm tra số bàn còn trống |
| GET | `/admin/reservations` | Lấy toàn bộ đặt bàn (admin) |
| PATCH | `/admin/reservations/{id}` | Cập nhật trạng thái đặt bàn |

---

## Admin Dashboard

Truy cập tại `/admin` (ví dụ: `https://frontend.up.railway.app/vi/admin`)

Mật khẩu mặc định: `lapassion2024`

Tính năng:
- Xem toàn bộ danh sách đặt bàn từ database
- Thống kê: tổng / chờ xác nhận / đã xác nhận / đã huỷ
- Đổi trạng thái từng đặt bàn: **Xác nhận / Huỷ / Reset**
