from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_session
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, session: SessionDep):
    customer = session.get(Customer, order_in.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    total_amount = 0.0
    items_data = []

    for item in order_in.items:
        product = session.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product '{product.name}' (available: {product.quantity}, requested: {item.quantity})",
            )
        product.quantity -= item.quantity
        unit_price = product.price
        total_amount += unit_price * item.quantity
        items_data.append({"product_id": product.id, "quantity": item.quantity, "unit_price": unit_price})

    db_order = Order(customer_id=customer.id, total_amount=total_amount)
    session.add(db_order)
    session.flush()

    for data in items_data:
        session.add(OrderItem(order_id=db_order.id, **data))

    session.commit()
    session.refresh(db_order)
    return _load_order(session, db_order.id)


@router.get("", response_model=list[OrderResponse])
def list_orders(session: SessionDep):
    orders = session.execute(select(Order).order_by(Order.id.desc())).scalars().all()
    result = []
    for order in orders:
        result.append(_load_order(session, order.id))
    return result


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, session: SessionDep):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _load_order(session, order_id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, session: SessionDep):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    session.delete(order)
    session.commit()


def _load_order(session: Session, order_id: int) -> OrderResponse:
    stmt = (
        select(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product), joinedload(Order.customer))
        .where(Order.id == order_id)
    )
    order = session.execute(stmt).unique().scalar_one()
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        total_amount=order.total_amount,
        created_at=order.created_at,
        customer_name=order.customer.full_name,
        items=[
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "product_name": item.product.name,
            }
            for item in order.items
        ],
    )
