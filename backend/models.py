from sqlalchemy import Column, Integer, String, Text, Date, Time, Decimal, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name_vi = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    description_vi = Column(Text)
    description_en = Column(Text)
    price = Column(Decimal(10, 2), nullable=False)
    category = Column(String(50), nullable=False)  # starter / main / dessert / drink
    image_url = Column(Text)
    is_available = Column(Boolean, default=True)


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    guests = Column(Integer, nullable=False)
    notes = Column(Text)
    status = Column(String(20), default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())
