# CLAUDE.md — La Passion Project

Tài liệu này giúp Claude Code hiểu cấu trúc và quy ước của dự án.

## Project Overview

Full-stack web app cho nhà hàng fine dining **La Passion** tại Hà Nội.
- Frontend: `frontend/` — Next.js 14 App Router
- Backend: `backend/` — Python FastAPI
- Database: PostgreSQL

## Architecture

```
frontend/src/
  app/
    layout.tsx          # Root layout (no HTML lang — let locale layout handle)
    globals.css         # Design tokens + Tailwind utilities
    [locale]/           # next-intl locale routing (vi | en)
      layout.tsx        # NextIntlClientProvider wrapper
      page.tsx          # Home: Hero + About + MenuSection(preview) + CTA + Contact
      menu/page.tsx     # Full menu page
      reservation/page.tsx  # Reservation form page
  components/
    Logo.tsx            # SVG LP monogram — gold square frame
    Navbar.tsx          # Fixed nav, scroll opacity, language toggle, mobile menu
    Hero.tsx            # Parallax, fade-in, CTA buttons
    About.tsx           # Brand story, philosophy, stats
    MenuSection.tsx     # Fetches /menu API, category filter, hover cards
    ReservationForm.tsx # react-hook-form + zod, POST /reservations, success toast
    Contact.tsx         # Address/hours/social + footer

messages/
  vi.json               # All Vietnamese strings
  en.json               # All English strings
```

## Design System

| Token | Value |
|---|---|
| Navy primary | `#0D1F3C` |
| Navy deep | `#091629` |
| Black | `#0A0A0A` |
| Burgundy | `#8B1A2F` |
| Gold | `#D4AF6A` |
| Gold rich | `#C9A84C` |
| Font serif | Cormorant Garamond — use for headings and "La Passion" name only |
| Font sans | Inter — use for all body/UI text |

## Key Conventions

- All user-visible text must be in `messages/vi.json` and `messages/en.json` — never hardcode strings
- API URL comes from `process.env.NEXT_PUBLIC_API_URL` (fallback: `http://localhost:8000`)
- Menu items are seeded via `backend/seed.py` — run once on fresh DB
- Success toast for reservation: appears bottom-right, auto-dismiss 5s, Framer Motion slide-in
- Animations: fade-in scroll (useInView), parallax on Hero only, no heavy motion

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`)
```
DATABASE_URL=postgresql://user:pass@host:5432/lapassion
ALLOWED_ORIGINS=http://localhost:3000
```

## Commands

```bash
# Backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload

# Frontend
npm install
npm run dev
npm run build
```
