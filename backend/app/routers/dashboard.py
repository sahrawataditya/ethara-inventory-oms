from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
SessionDep = Annotated[Session, Depends(get_session)]


class DashboardResponse(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: list[dict]


@router.get("", response_model=DashboardResponse)
def get_dashboard(session: SessionDep):
    total_products = session.execute(select(func.count(Product.id))).scalar() or 0
    total_customers = session.execute(select(func.count(Customer.id))).scalar() or 0
    total_orders = session.execute(select(func.count(Order.id))).scalar() or 0
    low_stock = session.execute(
        select(Product).where(Product.quantity < 10).order_by(Product.quantity)
    ).scalars().all()

    return DashboardResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_products=[
            {"id": p.id, "name": p.name, "sku": p.sku, "quantity": p.quantity} for p in low_stock
        ],
    )
