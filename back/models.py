from pydantic import BaseModel, AnyUrl, field_validator, field_serializer, EmailStr, FilePath
from typing import Optional


class ProductSchema(BaseModel):
    name: str
    price: int
    info: str
    image_path: FilePath

    @field_validator("name")
    def name_validate(cls, v):
        if v is None:
            raise ValueError("name cannot be null")
        elif not isinstance(v, str):
            raise TypeError("name must be a string")
        elif len(v) < 3 or len(v) > 50:
            raise ValueError("name must be between 3 and 20 characters")
        return v

    @field_validator("price")
    def price_validate(cls, v):
        if v is None:
            raise ValueError("price cannot be null")
        elif not isinstance(v, int):
            raise TypeError("price must be an integer")
        elif v < 0:
            raise ValueError("price cannot be negative")
        return v

    @field_validator("image_path")
    def image_path_to_str(cls, v):
        v = str(v)
        return v

    @field_validator("info")
    def info_validate(cls, v):
        if not isinstance(v, str):
            raise TypeError("info must be a string")
        elif len(v) < 3 or len(v) > 1000:
            raise ValueError("info must be between 3 and 100 characters")
        return v

    
    class Config:
        from_attributes = True

class ProductSchemaOut(ProductSchema):
    id: int


class SupportSchema(BaseModel):
    name: Optional[str]
    email: EmailStr
    message: str

    @field_validator("name")
    def name_validate(cls, v):
        if not isinstance(v, str):
            raise TypeError("name must be a string")
        elif len(v) < 3 or len(v) > 50:
            raise ValueError("name must be between 3 and 50 characters")
        return v

    @field_validator("email")
    def email_validate(cls, v):
        if v is None:
            raise ValueError("email cannot be null")
        elif not isinstance(v, str):
            raise TypeError("email must be a string")
        elif len(v) < 3 or len(v) > 50:
            raise ValueError("email must be between 3 and 20 characters")
        return v

    @field_validator("message")
    def message_validate(cls, v):
        if v is None:
            raise ValueError("message cannot be null")
        elif not isinstance(v, str):
            raise TypeError("message must be a string")
        elif len(v) < 3 or len(v) > 1000:
            raise ValueError("message must be between 3 and 1000 characters")
        return v

class SupportSchemaOut(SupportSchema):
    id: int