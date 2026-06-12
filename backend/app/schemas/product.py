from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    sku: str | None = Field(None, min_length=1, max_length=100)
    price: float | None = Field(None, gt=0)
    quantity: int | None = Field(None, ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int

    model_config = {"from_attributes": True}
