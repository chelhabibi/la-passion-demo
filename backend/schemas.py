from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional, Literal


SeatPreference = Literal["window", "private", "terrace", "standard"]
ReservationStatus = Literal["pending", "confirmed", "cancelled", "completed"]
MenuCategory = Literal["starter", "main", "dessert", "drink", "combo"]


class MenuItemOut(BaseModel):
    id: int
    name_vi: str
    name_en: str
    description_vi: Optional[str]
    description_en: Optional[str]
    price: Decimal
    category: MenuCategory
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
    category: MenuCategory
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
    seat_preference: Optional[SeatPreference] = None


class ReservationStatusUpdate(BaseModel):
    status: ReservationStatus


class ReservationOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    date: date
    time: time
    guests: int
    notes: Optional[str]
    seat_preference: Optional[SeatPreference] = None
    status: ReservationStatus
    confirmation_sent: bool = False
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
