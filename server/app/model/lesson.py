from pydantic import BaseModel
from datetime import time
import uuid

class Lesson(BaseModel):
    id: str = uuid.uuid1().int
    path: str
    paused_at: time = time(0,0,0)