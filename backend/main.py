from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import engine, get_db
from config import settings

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")

app = FastAPI(title="La Passion API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
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
    return reservation
