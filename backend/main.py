from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date as date_type
import models
import schemas
from database import engine, get_db
from config import settings


def verify_admin(x_admin_key: Optional[str] = Header(default=None)):
    if settings.admin_api_key and x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")


def _build_confirmation_html(reservation: models.Reservation) -> str:
    time_str = str(reservation.time)[:5]
    date_str = reservation.date.strftime("%d/%m/%Y") if hasattr(reservation.date, "strftime") else str(reservation.date)
    notes_block = (
        f'<tr><td style="padding:8px 0;color:#666;width:140px;">Ghi chú</td>'
        f'<td style="padding:8px 0;color:#111;">{reservation.notes}</td></tr>'
        if reservation.notes else ""
    )
    seat_labels = {
        "window": "Cạnh cửa sổ",
        "private": "Phòng riêng",
        "terrace": "Sân thượng",
        "standard": "Khu vực chính",
    }
    seat_block = (
        f'<tr><td style="padding:8px 0;color:#666;width:140px;">Vị trí ngồi</td>'
        f'<td style="padding:8px 0;color:#111;">{seat_labels.get(reservation.seat_preference, reservation.seat_preference)}</td></tr>'
        if reservation.seat_preference else ""
    )
    return f"""<!DOCTYPE html>
<html lang="vi"><body style="font-family:Inter,Arial,sans-serif;background:#f5f5f5;padding:40px 20px;margin:0;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="560" style="background:#ffffff;border-top:4px solid #D4AF6A;">
    <tr><td style="padding:40px 40px 24px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;color:#D4AF6A;text-transform:uppercase;">La Passion</p>
      <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:28px;color:#0D1F3C;">Xác nhận đặt bàn</h1>
    </td></tr>
    <tr><td style="padding:0 40px 24px;">
      <p style="margin:0;color:#444;line-height:1.6;">Kính chào <strong>{reservation.name}</strong>,</p>
      <p style="margin:12px 0 0;color:#444;line-height:1.6;">Chúng tôi đã nhận được yêu cầu đặt bàn của Quý khách. Nhà hàng sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
    </td></tr>
    <tr><td style="padding:0 40px 24px;">
      <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top:1px solid #eee;border-bottom:1px solid #eee;">
        <tr><td style="padding:8px 0;color:#666;width:140px;">Ngày</td><td style="padding:8px 0;color:#111;">{date_str}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Giờ</td><td style="padding:8px 0;color:#111;">{time_str}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Số khách</td><td style="padding:8px 0;color:#111;">{reservation.guests} người</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Liên hệ</td><td style="padding:8px 0;color:#111;">{reservation.phone}</td></tr>
        {notes_block}
        {seat_block}
      </table>
    </td></tr>
    <tr><td style="padding:0 40px 32px;">
      <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">Trạng thái: <em>Chờ xác nhận</em>. Mọi thay đổi xin liên hệ qua số nhà hàng.</p>
    </td></tr>
    <tr><td style="padding:24px 40px;background:#0D1F3C;color:#cfd6e3;font-size:12px;text-align:center;">
      La Passion — Fine Dining, Hà Nội<br><a href="{settings.restaurant_url}" style="color:#D4AF6A;text-decoration:none;">{settings.restaurant_url}</a>
    </td></tr>
  </table>
</body></html>"""


def _send_confirmation_email(reservation: models.Reservation) -> bool:
    if not settings.resend_api_key:
        return False
    try:
        import resend
        resend.api_key = settings.resend_api_key
        resend.Emails.send({
            "from": settings.from_email,
            "to": reservation.email,
            "subject": "Xác nhận đặt bàn — La Passion",
            "html": _build_confirmation_html(reservation),
        })
        return True
    except Exception as e:
        print(f"Email send failed for reservation {reservation.id}: {e}")
        return False

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")

try:
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text(
            "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN NOT NULL DEFAULT FALSE"
        ))
except Exception as e:
    print(f"Migration warning (confirmation_sent column): {e}")

try:
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text(
            "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS seat_preference VARCHAR(20)"
        ))
except Exception as e:
    print(f"Migration warning (seat_preference column): {e}")

app = FastAPI(title="La Passion API", version="1.0.0")


@app.on_event("startup")
async def auto_seed():
    try:
        from seed import seed
        seed()
    except Exception as e:
        print(f"Seed warning: {e}")

origins = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials="*" not in origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "restaurant": "La Passion"}


@app.get("/menu", response_model=List[schemas.MenuItemOut])
def get_menu(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.MenuItem).filter(models.MenuItem.is_available == True)
    if category:
        query = query.filter(models.MenuItem.category == category)
    return query.all()


@app.get("/menu/{category}", response_model=List[schemas.MenuItemOut])
def get_menu_by_category(category: str, db: Session = Depends(get_db)):
    items = (
        db.query(models.MenuItem)
        .filter(
            models.MenuItem.category == category,
            models.MenuItem.is_available == True,
        )
        .all()
    )
    if not items:
        raise HTTPException(status_code=404, detail="Category not found")
    return items


@app.post("/reservations", response_model=schemas.ReservationOut, status_code=201)
def create_reservation(payload: schemas.ReservationCreate, db: Session = Depends(get_db)):
    reservation = models.Reservation(**payload.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    if _send_confirmation_email(reservation):
        try:
            reservation.confirmation_sent = True
            db.commit()
            db.refresh(reservation)
        except Exception as e:
            print(f"Could not update confirmation_sent for {reservation.id}: {e}")

    return reservation


@app.get("/availability")
def check_availability(date: str, time: str, db: Session = Depends(get_db)):
    MAX_TABLES = 12
    count = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.date == date,
            models.Reservation.time == time,
            models.Reservation.status != "cancelled",
        )
        .count()
    )
    remaining = max(0, MAX_TABLES - count)
    return {"available": remaining > 0, "remaining": remaining, "total": MAX_TABLES}


@app.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db), _=Depends(verify_admin)):
    today = date_type.today()
    return {
        "total_bookings":   db.query(models.Reservation).count(),
        "pending_count":    db.query(models.Reservation).filter(models.Reservation.status == "pending").count(),
        "confirmed_count":  db.query(models.Reservation).filter(models.Reservation.status == "confirmed").count(),
        "today_bookings":   db.query(models.Reservation).filter(models.Reservation.date == today).count(),
        "total_menu_items": db.query(models.MenuItem).count(),
    }


@app.get("/admin/reservations", response_model=List[schemas.ReservationOut])
def admin_list_reservations(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    query = db.query(models.Reservation)
    if status:
        query = query.filter(models.Reservation.status == status)
    return query.order_by(models.Reservation.created_at.desc()).all()


@app.patch("/admin/reservations/{reservation_id}", response_model=schemas.ReservationOut)
def admin_update_status(
    reservation_id: int,
    payload: schemas.ReservationStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    reservation.status = payload.status
    db.commit()
    db.refresh(reservation)
    return reservation


@app.post("/admin/menu", response_model=schemas.MenuItemOut, status_code=201)
def admin_create_menu_item(
    payload: schemas.MenuItemCreate,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    item = models.MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.put("/admin/menu/{item_id}", response_model=schemas.MenuItemOut)
def admin_update_menu_item(
    item_id: int,
    payload: schemas.MenuItemCreate,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@app.delete("/admin/menu/{item_id}", status_code=204)
def admin_delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(item)
    db.commit()


@app.patch("/admin/menu/{item_id}/toggle", response_model=schemas.MenuItemOut)
def admin_toggle_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    item.is_available = not item.is_available
    db.commit()
    db.refresh(item)
    return item
