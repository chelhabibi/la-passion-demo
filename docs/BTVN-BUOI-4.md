# BTVN Buổi 4 — La Passion

Tổng hợp những việc đã làm trong buổi 4 của khoá AI code, theo từng yêu cầu của giảng viên.

---

## Yêu cầu 1 — Files & folder code trên GitHub

**Repo:** https://github.com/chelhabibi/la-passion-demo

### Cấu trúc `.claude/`

```
.claude/
├── agents/                  # 4 sub-agents chuyên biệt
│   ├── content-specialist.md
│   ├── operation-manager.md
│   ├── product-designer.md
│   └── web-developer.md
├── skills/                  # 17 skills tiếng Việt
│   ├── bao-mat/
│   ├── content-creative/
│   ├── cta/
│   ├── doi-soat/
│   ├── dung-khung-du-lieu-dong/
│   ├── kiem-dinh/
│   ├── marketing-hook/
│   ├── quan-ly-bien-moi-truong-va-bao-mat-api/
│   ├── quan-tri-co-so-du-lieu/
│   ├── quick-summary/
│   ├── theo-doi-hoat-dong-he-thong/
│   ├── thiet-ke-giao-dien/
│   ├── toi-uu-hieu-nang/
│   ├── toi-uu-seo/
│   ├── toi-uu-trai-nghiem-user/
│   ├── translate-vi/
│   └── xu-ly-logic-he-thong/
└── hooks/                   # PreCompact hook
    ├── README.md
    ├── setup-compact-hook.py
    └── save-before-compact.py
```

### Cấu trúc code chính

- `backend/` — FastAPI + SQLAlchemy + PostgreSQL
- `frontend/` — Next.js 14 + next-intl (vi/en) + Tailwind
- `scripts/jsonl_to_txt.py` — utility convert transcript JSONL → .txt

---

## Yêu cầu 2 — File lịch sử hội thoại

**File:** `btvn-buoi-4.txt` (~298KB, ~6000 dòng)

- Format: USER / ASSISTANT có timestamp
- Tool calls được nén thành 1 dòng tóm tắt để dễ đọc
- Bao trùm: từ lúc tạo `.claude/skills/agents/hooks` cho tới khi push lên GitHub xong

---

## Yêu cầu 3 — Tính năng đã xây bằng Agent + SKILLS

### Tính năng MỚI thêm vào project trong buổi 4

#### 1. Chọn vị trí ngồi khi đặt bàn
| Lớp | File | Mô tả |
|---|---|---|
| DB | `backend/models.py` | Cột `seat_preference` (window/private/terrace/standard) |
| Backend | `backend/schemas.py` | Pydantic `Literal` enum validation |
| Backend | `backend/main.py` | Migration `ALTER TABLE IF NOT EXISTS` chạy lúc startup |
| Frontend | `frontend/src/components/ReservationForm.tsx` | 4 nút single-select có icon + mô tả |
| i18n | `frontend/messages/{vi,en}.json` | Keys `reservation.seat_preference.*` cả 2 ngôn ngữ |

#### 2. Email xác nhận thật qua Resend
| File | Mô tả |
|---|---|
| `backend/requirements.txt` | Thêm `resend==2.0.0` |
| `backend/config.py` | Env vars `RESEND_API_KEY`, `FROM_EMAIL` |
| `backend/main.py` | `_send_confirmation_email()` gọi Resend API trong try/except (không block reservation nếu fail) |
| `backend/main.py` | HTML email template song ngữ design fine-dining (navy/gold) |
| `backend/models.py` | Cột `confirmation_sent: bool` track trạng thái |

**Env vars cần set trên Railway:**
- `RESEND_API_KEY = re_xxx`
- `FROM_EMAIL = onboarding@resend.dev` (cho test) hoặc domain riêng đã verify

#### 3. Admin dashboard nâng cấp
| Tab | Mô tả |
|---|---|
| Đặt bàn | Đã có từ trước — thêm cột "Vị trí" hiển thị seat_preference |
| **Sơ đồ bàn** (mới) | Heatmap 7 ngày × 14 khung giờ, 5 mức màu theo số bàn đã đặt/12 |
| **Khách hàng** (CRM, mới) | Tổng hợp từ `reservations` state — số lần ghé, tổng khách, lần cuối, tier (VIP ≥5 / Quen thuộc 2-4 / Mới 1) |
| Menu | Đã có từ trước — CRUD món |

#### 4. SEO + bảo mật cơ bản
| File | Mô tả |
|---|---|
| `frontend/src/app/layout.tsx` | Open Graph + Twitter Card metadata |
| `frontend/src/app/[locale]/layout.tsx` | `lang` attribute động + JSON-LD structured data (restaurant schema) |
| `frontend/src/app/[locale]/{menu,reservation}/page.tsx` | Per-page `metadata.title` |
| `backend/config.py` | CORS default sửa từ `*` về `http://localhost:3000` |
| `backend/main.py` | Header `X-Admin-Key` cho admin endpoints |
| `frontend/.../admin/page.tsx` | Bỏ hardcoded password `lapassion2024`, đăng nhập probe `/admin/stats` |

#### 5. Content polish (2 pass)
| Pass | Phạm vi |
|---|---|
| 1 | hero.subtitle, reservation.title/subtitle/success.message, about.philosophy, menu.subtitle, footer year 2024→2025 |
| 2 | hero.cta_reserve, hero.scroll, about.title/body1/body2/ingredient, menu.title VI (fix bug "Seasonal Menu" lọt tiếng Anh), reservation.errors.*, contact.title |

---

## Agent + SKILL đã sử dụng

### Agents (Task delegation)

| Agent | Việc đã làm |
|---|---|
| **web-developer** | Viết code backend + frontend cho seat preference, email, CRM, timeline, SEO |
| **content-specialist** | 2 pass review nội dung VI/EN — tone fine-dining, fix lỗi "Sò điệp Đà Lạt" (sai địa lý) |
| **operation-manager** | E2E validation 21 checklist items, phát hiện 2 typo CSS `tracking-widests` |
| **product-designer** | Standby reviewer cho UX flow admin login mới |

### Skills (Slash commands)

| Skill | Dùng ở đâu |
|---|---|
| `/bao-mat` | Fix CORS, xoá hardcoded password, X-Admin-Key auth |
| `/quan-ly-bien-moi-truong-va-bao-mat-api` | Setup RESEND_API_KEY, ADMIN_API_KEY trên Railway |
| `/quan-tri-co-so-du-lieu` | Schema migration cho `seat_preference`, `confirmation_sent` |
| `/xu-ly-logic-he-thong` | CRM aggregation logic (useMemo), Timeline heatmap |
| `/content-creative` | Soạn nội dung email confirmation, brand story |
| `/cta` | "Giữ Bàn Tối Nay" thay "Đặt Bàn Ngay" |
| `/translate-vi` | Sync vi.json ↔ en.json mỗi lần thêm key |
| `/toi-uu-seo` | Open Graph, Twitter Card, JSON-LD restaurant schema |
| `/kiem-dinh` | E2E test checklist, validation 21 items |
| `/doi-soat` | Reconciliation giá menu DB vs hiển thị web |
| `/theo-doi-hoat-dong-he-thong` | Operation-manager track phối hợp agent |
| `/quick-summary` | Tổng hợp các pass review |

---

## Deploy

**Live URLs:**
- Frontend: https://frontend-production-01ff.up.railway.app
- Backend: https://backend-production-dc32.up.railway.app

**Env vars trên Railway:**

Backend:
- `DATABASE_URL` — Railway tự inject từ Postgres plugin
- `ALLOWED_ORIGINS = *` (production nên đổi thành URL frontend cụ thể)
- `ADMIN_API_KEY = lapassion_admin_2026_123456`
- `RESEND_API_KEY = re_xxx`
- `FROM_EMAIL = onboarding@resend.dev`

Frontend:
- `NEXT_PUBLIC_API_URL = https://backend-production-dc32.up.railway.app`

---

## Lỗi đã gặp + cách fix (ghi lại để rút kinh nghiệm)

| Lỗi | Nguyên nhân | Cách fix |
|---|---|---|
| Admin login báo "Mật khẩu không đúng" dù gõ đúng | `NEXT_PUBLIC_API_URL` có khoảng trắng cuối → URL thành `backend...app%20%20/admin/stats` → `ERR_NAME_NOT_RESOLVED` | Xoá khoảng trắng trong Railway env var |
| Đặt bàn thành công nhưng admin không thấy | Admin chỉ fetch reservations 1 lần khi đăng nhập | Refresh trang (F5) — nâng cấp sau: auto-refresh |
| GitHub push protection chặn commit | File `Daily-Weather-Brief/du-bao-thoi-tiet.txt` chứa OpenWeather API key | Xoá folder Daily-Weather-Brief khỏi commit |
| Email vào Spam | Dùng `onboarding@resend.dev` (chưa verify domain) | Setup domain riêng + DNS records để production |

---

## Còn thiếu / có thể cải thiện sau

1. **Auto-refresh admin** — hiện phải F5 mới thấy booking mới
2. **Login error rõ ràng hơn** — phân biệt 401 vs network error
3. **Domain email riêng** — chuyển từ `onboarding@resend.dev` sang `noreply@lapassion.vn`
4. **Alembic migrations** — thay vì `ALTER TABLE IF NOT EXISTS` raw SQL
5. **Test tự động** — Pytest backend + Playwright frontend
6. **Admin bilingual** — hiện chỉ tiếng Việt
