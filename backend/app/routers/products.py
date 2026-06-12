from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, session: SessionDep):
    existing = session.execute(select(Product).where(Product.sku == product_in.sku)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")
    db_product = Product(**product_in.model_dump())
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.get("", response_model=list[ProductResponse])
def list_products(session: SessionDep):
    products = session.execute(select(Product).order_by(Product.id)).scalars().all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductUpdate, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if product_in.sku is not None and product_in.sku != product.sku:
        existing = session.execute(select(Product).where(Product.sku == product_in.sku)).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")
    for field, value in product_in.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    session.commit()
    session.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    session.delete(product)
    session.commit()
