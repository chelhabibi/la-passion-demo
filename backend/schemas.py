from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional


class MenuItemOut(BaseModel):
    id: int
    name_vi: str
    name_en: str
    description_vi: Optional[str]
    description_en: Optional[str]
    price: Decimal
    category: str
    image_url: Optional[str]
    is_available: bool

    class Config:
        from_attributes = True


class ReservationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: date
    time: time
    guests: int
    notes: Optional[str] = None


class ReservationStatusUpdate(BaseModel):
    status: str


class ReservationOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    date: date
    time: time
    guests: int
    notes: Optional[str]
    status: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
