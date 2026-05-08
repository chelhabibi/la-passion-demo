# Conversation Export — La Passion · Session Build & Debug

> Claude Code session · Xây dựng và debug full-stack web app La Passion  
> Stack: Next.js 14 · FastAPI · PostgreSQL · Railway

---

## User

Menu không hiện trên web deploy Railway. Debug giúp tôi.

---

## Claude

Tôi sẽ kiểm tra từng lớp — frontend component, API call, và backend data.

Đầu tiên đọc `MenuSection.tsx` và `menu/page.tsx` để hiểu flow hiện tại.

*(Đọc file — phát hiện component dùng `useEffect` fetch từ `/api/menu` proxy)*

Thấy vấn đề đầu tiên: page file có `export const dynamic = "force-dynamic"` nhưng cũng có `import dynamic from "next/dynamic"` — hai cái này **trùng tên**, Next.js build sẽ conflict. Sửa bằng cách xóa `export const dynamic` khỏi page files vì layout.tsx đã có rồi.

---

## User

*(screenshot — menu page hiện category buttons nhưng không có item nào)*

Build xong rồi, f5 rồi vẫn thế. Debug cẩn thận lại.

---

## Claude

Vấn đề sâu hơn. Kiểm tra tiếp:

1. `api/menu/route.ts` — proxy nội bộ gọi backend
2. Backend log trên Railway

Phát hiện **bug logic**: 
```ts
if (initialItems) return;  // BUG: [] là truthy trong JavaScript!
```
Khi `initialItems = []` (mảng rỗng), điều kiện này vẫn `true` → skip client fetch → không bao giờ lấy được data.

Fix: đổi thành `if (initialItems && initialItems.length > 0) return`.

---

## User

*(screenshot — api/menu trả về `[]`)*

---

## Claude

Backend trả về rỗng. Kiểm tra Railway backend log.

---

## User

*(screenshot — log: "Already has 19 menu items, skipping seed")*

Backend có data, nhưng `/api/menu` vẫn trả `[]`. Vấn đề ở proxy nội bộ.

---

## Claude

Railway internal networking: server-to-server call từ frontend service sang backend service dùng internal URL khác với public URL. Proxy `/api/menu` đang gọi sai địa chỉ.

Fix: bỏ proxy, cho frontend fetch thẳng đến public backend URL `https://backend-production-dc32.up.railway.app/menu`.

---

## User

*(screenshot — backend URL trả về đủ 19 items trong browser)*

Backend hoạt động. Nhưng vẫn không hiện menu trên web.

---

## Claude

Confirm backend OK. Vấn đề phải nằm ở React rendering. Thêm debug log vào `useEffect`.

---

## User

*(screenshot — console: "OK: 19 items" + React hydration errors #418 và #423)*

---

## Claude

**Root cause xác định**: React hydration mismatch do Framer Motion.

`useInView` trong Framer Motion trả về `false` lúc SSR → element có `opacity: 0` trên server. Client render lại với giá trị khác → React báo lỗi #418/#423 → **toàn bộ component bị tắt client-side rendering**.

Fix: load `MenuSection` với `ssr: false` qua `next/dynamic`:
```tsx
const MenuSection = dynamic(() => import("@/components/MenuSection"), { ssr: false });
```
Component sẽ chỉ render ở client, tránh hoàn toàn hydration conflict.

---

## User

*(screenshot — build Railway lỗi 2 errors)*

---

## Claude

Build fail. Đọc error log — TypeScript type error trong component. Fix types và push lại.

---

## User

Vẫn không hiện menu. Có giải pháp nào khác không?

---

## Claude

Đã thử nhiều hướng, vẫn không ổn. Phân tích lại toàn bộ:

- Backend: OK ✓  
- Fetch từ browser: OK ✓  
- SSR đã tắt: OK ✓  
- Vẫn không hiện → vấn đề có thể là combination của nhiều bug cùng lúc

**Giải pháp dứt điểm**: bỏ hoàn toàn fetch/useEffect, dùng **static JSON import**.

Tạo file `frontend/src/data/menu.json` với đủ 19 món, import thẳng vào component:
```tsx
import STATIC_MENU from "@/data/menu.json";
const items = STATIC_MENU as MenuItem[];
// Không cần useEffect, không cần fetch, không cần loading state
```

Data nằm trong bundle, không phụ thuộc network, không thể fail.

---

## User

Sao deploy gì gần 15 phút rồi?

---

## Claude

*(screenshot — Railway build log stuck tại "load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067")*

Railway đang tải Docker image từ GitHub Container Registry — đây là infrastructure của Railway bị chậm, không phải lỗi code. Thỉnh thoảng họ bị slow pull. Đợi thêm hoặc cancel rồi Redeploy.

---

## User

Tôi còn phát hiện thêm lỗi không hiện popup sau khi đặt bàn.

---

## Claude

Đọc `ReservationForm.tsx` — phát hiện 2 bugs:

**Bug 1 — hooks rules violation:**
```tsx
// SAI: useTranslations gọi trong JSX expression
return <div>{(() => { const t = useTranslations("reservation"); ... })()}</div>
```
React hooks phải gọi ở top-level của function, không được gọi trong JSX hay nested function. Component crash silently → popup không bao giờ render.

Fix: chuyển `useTranslations` lên đầu `SuccessToast` function:
```tsx
function SuccessToast({ message, onClose }) {
  const t = useTranslations("reservation"); // ← đây
  return <motion.div>...</motion.div>;
}
```

**Bug 2 — fallback URL sai:**
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // SAI
```
Trên production, `NEXT_PUBLIC_API_URL` không được set → fallback về `localhost` → fetch fail → popup không hiện.

Fix: đổi fallback thành Railway backend URL.

---

## User

*(Xác nhận menu hiện sau khi deploy commit static JSON)*

Ôi hiện menu rồi!

---

## Claude

Static JSON approach hoạt động. Menu luôn hiện ngay lập tức, không phụ thuộc API hay network condition.

Session này cover các kỹ thuật debug:
- JavaScript truthiness (`[]` là truthy)
- Next.js naming conflict (`dynamic` export vs import)  
- React hooks rules
- Framer Motion SSR hydration
- Railway internal vs public networking
- Static JSON as reliable fallback pattern

---

*End of session · Tất cả fixes đã được commit và push lên `chelhabibi/la-passion-demo`*
