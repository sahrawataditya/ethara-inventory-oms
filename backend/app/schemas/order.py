from datetime import datetime

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product_name: str | None = None

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    customer_name: str | None = None
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}
