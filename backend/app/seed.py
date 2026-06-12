from sqlalchemy import select

from app.database import SessionLocal, Base, engine
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product


def seed():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()

    if session.execute(select(Product)).first():
        print("Database already seeded, skipping.")
        session.close()
        return

    products = [
        Product(name="Wireless Mouse", sku="WM-001", price=29.99, quantity=50),
        Product(name="Mechanical Keyboard", sku="MK-002", price=89.99, quantity=30),
        Product(name="USB-C Hub", sku="UC-003", price=45.50, quantity=5),
        Product(name="27-inch Monitor", sku="MN-004", price=349.99, quantity=12),
        Product(name="Webcam 1080p", sku="WC-005", price=79.99, quantity=3),
        Product(name="Noise Cancelling Headphones", sku="HP-006", price=199.99, quantity=8),
        Product(name="External SSD 1TB", sku="SSD-007", price=129.99, quantity=15),
        Product(name="Laptop Stand", sku="LS-008", price=39.99, quantity=2),
        Product(name="Desk Lamp LED", sku="DL-009", price=34.99, quantity=25),
        Product(name="Ergonomic Chair", sku="EC-010", price=499.99, quantity=4),
    ]
    session.add_all(products)
    session.flush()

    customers = [
        Customer(full_name="Alice Johnson", email="alice@example.com", phone="+1-555-0101"),
        Customer(full_name="Bob Smith", email="bob@example.com", phone="+1-555-0102"),
        Customer(full_name="Charlie Brown", email="charlie@example.com", phone="+1-555-0103"),
    ]
    session.add_all(customers)
    session.flush()

    order1 = Order(customer_id=customers[0].id)
    session.add(order1)
    session.flush()
    session.add_all([
        OrderItem(order_id=order1.id, product_id=products[0].id, quantity=2, unit_price=products[0].price),
        OrderItem(order_id=order1.id, product_id=products[1].id, quantity=1, unit_price=products[1].price),
    ])
    order1.total_amount = sum(
        item.unit_price * item.quantity
        for item in [OrderItem(order_id=order1.id, product_id=products[0].id, quantity=2, unit_price=products[0].price),
                     OrderItem(order_id=order1.id, product_id=products[1].id, quantity=1, unit_price=products[1].price)]
    )

    order2 = Order(customer_id=customers[1].id)
    session.add(order2)
    session.flush()
    session.add_all([
        OrderItem(order_id=order2.id, product_id=products[2].id, quantity=1, unit_price=products[2].price),
        OrderItem(order_id=order2.id, product_id=products[6].id, quantity=2, unit_price=products[6].price),
    ])
    order2.total_amount = sum(
        item.unit_price * item.quantity
        for item in [OrderItem(order_id=order2.id, product_id=products[2].id, quantity=1, unit_price=products[2].price),
                     OrderItem(order_id=order2.id, product_id=products[6].id, quantity=2, unit_price=products[6].price)]
    )

    session.commit()
    session.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed()
