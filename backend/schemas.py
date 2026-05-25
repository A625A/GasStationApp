from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    user: UserOut
    token: str | None = None
