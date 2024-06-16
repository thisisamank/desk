from pydantic import BaseModel
from datetime import time

class Lesson(BaseModel):    
    id: str
    path: str
    paused_at: time = time(0,0,0)
    name: str



