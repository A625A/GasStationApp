import os

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User
from schemas import AuthResponse, LoginRequest, UserCreate, UserOut

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shell Auth API")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:8081")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://localhost:19006", "http://localhost:8081", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/register", response_model=AuthResponse)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    user = User(email=payload.email.lower(), username=payload.username, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(user=UserOut.model_validate(user), token=None)


@app.post("/api/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return AuthResponse(user=UserOut.model_validate(user), token=None)
