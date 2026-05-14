from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional, Literal


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


class MenuItemCreate(BaseModel):
    name_vi: str
    name_en: str
    description_vi: Optional[str] = None
    description_en: Optional[str] = None
    price: Decimal
    category: str
    image_url: Optional[str] = None
    is_available: bool = True


class ReservationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: date
    time: time
    guests: int
    notes: Optional[str] = None
    seat_preference: Optional[str] = None


class ReservationStatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "cancelled", "completed"]


class ReservationOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    date: date
    time: time
    guests: int
    notes: Optional[str]
    seat_preference: Optional[str] = None
    status: str
    confirmation_sent: bool = False
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
