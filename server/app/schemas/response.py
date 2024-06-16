from pydantic import BaseModel
from typing import Any, Optional
from fastapi import HTTPException


class ResponseModel(BaseModel):
    status: str
    message: Optional[str] = None
    data: Optional[Any] = None

class ErrorResponseModel(ResponseModel):
    error: str


def create_response(status: str, message: Optional[str] = None, data: Optional[Any] = None) -> ResponseModel:
    return ResponseModel(status=status, message=message, data=data)

def create_error_response(status: str, error: str, message: Optional[str] = None) -> ErrorResponseModel:
    return ErrorResponseModel(status=status, message=message, error=error)
