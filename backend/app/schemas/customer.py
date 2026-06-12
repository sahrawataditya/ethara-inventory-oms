from pydantic import BaseModel, Field


class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., max_length=255)
    phone: str = Field(..., min_length=1, max_length=50)


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    model_config = {"from_attributes": True}
