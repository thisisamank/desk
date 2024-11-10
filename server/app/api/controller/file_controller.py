from pathlib import Path
from typing import List, Dict, Any
from app.logger import deskLogger
import json
import uuid
from datetime import time
from ...schemas.lesson import Lesson
from moviepy.editor import VideoFileClip


def determine_file_type(file_name):
    ext = file_name.split('.')[-1].lower()
    if ext in ['pdf']:
        return 'PDF'
    elif ext in ['html', 'htm']:
        return 'HTML'
    elif ext in ['mp4', 'avi', 'mkv']:
        return 'VIDEO'
    elif ext in ['mp3', 'wav']:
        return 'AUDIO'
    elif ext in ['jpg', 'jpeg', 'png', 'gif']:
        return 'IMAGE'
    elif ext in ['txt', 'doc', 'docx']:
        return 'TEXT'
    else:
        return 'UNKNOWN'

def get_video_duration(file_path) -> str:
    try:
        with VideoFileClip(file_path) as video:
            duration = video.duration 
            minutes = int(duration // 60)
            seconds = int(duration % 60)
            return f"{minutes}min {seconds}s"
    except:
        return ""


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, time):
            return obj.strftime("%H:%M:%S")
        return super().default(obj)

class FileController:


    def generate_youtube_folder_structure(self, root: str, lessons: List[Lesson], course_name: str) -> Dict[str, Any]:
        
        folder_dict = {
            "type": "folder",
            "name": course_name,
            "children": []
        }

        for lesson in lessons:
            folder_dict["children"].append(lesson.dict())
        
        return folder_dict

    
    def generate_folder_structure(self, root: str) -> Dict[str, Any]:
        path = Path(root)
        if not path.is_dir():
            raise ValueError("The provided path is not a directory")

        def folder_to_dict(folder_path: Path) -> Dict[str, Any]:
            folder_dict = {
                "type": "folder",
                "name": folder_path.name,
                "children": []
            }

            try:
                folders = []
                files = []

                for item in folder_path.iterdir():
                    if item.name.startswith('.'):
                        continue
                    if item.is_dir():
                        folders.append(item)
                    else:
                        files.append(item)

                folders = sorted(folders, key=lambda x: x.name.lower())
                files = sorted(files, key=lambda x: x.name.lower())

                for folder in folders:
                    folder_dict["children"].append(folder_to_dict(folder))

                for file in files:
                    file_type = determine_file_type(file.name)
                    lesson = Lesson(
                        id=str(uuid.uuid4()),
                        path=str(file),
                        name=file.name,
                        type=file_type,
                        video_duration = get_video_duration(str(file)),
                        is_complete=False,
                    )
                    folder_dict["children"].append(lesson.dict())

            except PermissionError:
                pass

            return folder_dict

        folder_structure = folder_to_dict(path)
        return folder_structure
