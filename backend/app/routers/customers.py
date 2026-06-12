from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["customers"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer_in: CustomerCreate, session: SessionDep):
    existing = session.execute(select(Customer).where(Customer.email == customer_in.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    db_customer = Customer(**customer_in.model_dump())
    session.add(db_customer)
    session.commit()
    session.refresh(db_customer)
    return db_customer


@router.get("", response_model=list[CustomerResponse])
def list_customers(session: SessionDep):
    customers = session.execute(select(Customer).order_by(Customer.id)).scalars().all()
    return customers


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, session: SessionDep):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, session: SessionDep):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    session.delete(customer)
    session.commit()
