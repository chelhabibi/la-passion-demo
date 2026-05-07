# PLAN.md — La Passion Web App

Kế hoạch xây dựng được tạo bởi Claude Code.

## Context

Bài tập BTVN từ SEONGON: xây full-stack web app cho nhà hàng fine dining **La Passion** tại phố cổ Hà Nội bằng Claude Code. Dự án phải đáp ứng tiêu chí: code public trên GitHub, deploy có URL public, có đủ README.md / CLAUDE.md / PLAN.md / file xuất cuộc trò chuyện với Claude.

---

## Tech Stack

| Layer | Technology | Deploy |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Railway |
| Backend | Python FastAPI | Railway |
| Database | PostgreSQL | Railway (managed) |
| i18n | next-intl | — |

---

## Features

1. **Giới thiệu nhà hàng** — Hero, About Us, câu chuyện thương hiệu, ảnh không gian
2. **Menu / Thực đơn** — Danh mục (Khai vị / Chính / Tráng miệng / Đồ uống), tên món, mô tả, giá
3. **Đặt bàn online** — Form: tên, email, SĐT, ngày, giờ, số khách, ghi chú → lưu PostgreSQL
4. **Chuyển đổi ngôn ngữ** — Tiếng Việt / English, toggle trên navbar

---

## Design System

- **Colors:** Deep navy `#0D1F3C`, black `#0A0A0A`, burgundy `#8B1A2F`, gold `#D4AF6A`
- **Typography:** Cormorant Garamond (tên nhà hàng), Inter (UI/body)
- **Logo:** LP monogram SVG, gold square frame
- **Motion:** Fade-in scroll, parallax hero, hover CTA glow, success popup bottom-right

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/menu` | Toàn bộ menu |
| GET | `/menu/{category}` | Menu theo danh mục |
| POST | `/reservations` | Tạo đặt bàn |

---

## Implementation Steps

1. ✅ Khởi tạo project structure + Git repo
2. ✅ Backend: FastAPI + PostgreSQL models + API + seed data
3. ✅ Frontend: Next.js + next-intl + components (Navbar, Hero, About, Menu, Reservation, Contact)
4. ✅ Documentation: README.md, CLAUDE.md, PLAN.md
5. ⏳ Deploy lên Railway + push GitHub public

---

## Content

- **About Us:** Câu chuyện Chef Minh Tú, hành trình từ Paris về Hà Nội, triết lý ẩm thực Pháp-Việt
- **Menu:** 16 món seasonal (4 starters + 5 mains + 4 desserts + 3 drinks)
- **Address (demo):** 24 Hàng Bè, Hoàn Kiếm, Hà Nội
