from pydantic import BaseModel
from typing import List
from app.model.lesson import Lesson
import uuid

class Course(BaseModel):
    id: str = uuid.uuid1().int
    path: str
    videos: List[Lesson]
    last_lesson_played: Lesson
