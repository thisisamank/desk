from pydantic import BaseModel
from typing import List
from ..schemas.lesson import Lesson

class Course(BaseModel):
    id: str
    path: str
    lessons: List[Lesson]
    last_lesson_played: Lesson
