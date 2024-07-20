from pydantic import BaseModel
from typing import List
from ..schemas.lesson import Lesson

class Course(BaseModel):
    id: str
    path: str
    lessons: dict
    last_lesson_played: dict
    name: str
    author: str
