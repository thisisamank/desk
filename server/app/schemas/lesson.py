from pydantic import BaseModel
from datetime import time

class Lesson(BaseModel):    
    id: str
    path: str
    paused_at: time = time(0,0,0)
    name: str
    # PDF, HTML, VIDEO, AUDIO, IMAGE, TEXT
    type: str
    video_duration: str
    is_complete: bool
