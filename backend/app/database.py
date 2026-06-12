from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_session():
    with Session(engine) as session:
        yield session
