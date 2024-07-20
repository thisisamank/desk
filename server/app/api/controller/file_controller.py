from pathlib import Path
from typing import List
from app.logger import deskLogger
import json
import uuid
from datetime import time
from pathlib import Path
from typing import List, Dict, Any

from ...schemas.lesson import Lesson


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

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, time):
            return obj.strftime("%H:%M:%S")
        return super().default(obj)

class FileController:
    
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
                for item in folder_path.iterdir():
                    if item.name.startswith('.'):
                        continue
                    if item.is_dir():
                        folder_dict["children"].append(folder_to_dict(item))
                    else:
                        file_type = determine_file_type(item.name)
                        lesson = Lesson(
                            id=str(uuid.uuid4()),
                            path=str(item),
                            name=item.name,
                            type=file_type
                        )
                        folder_dict["children"].append(lesson.dict())
            except PermissionError:
                pass

            return folder_dict

        folder_structure = folder_to_dict(path)
        return folder_structure
