from tinydb import TinyDB, Query
from pathlib import Path
from ...schemas.course import Course
from fastapi.encoders import jsonable_encoder

class CrudController:

    userDB: TinyDB

    def __init__(self):
        home_path = Path.home()
        user_db_path = self.__create_desk_path__(home_path)
        self.userDB = TinyDB(user_db_path)

    
    def __create_desk_path__(self, path: Path) -> Path:
        desk_dir = path / '.desk'
        desk_db_path = desk_dir / 'info.json'

        if not desk_db_path.exists():
            desk_dir.mkdir()
            desk_db_path.touch()
        return desk_db_path
        

    def add_course(self,course_path: str, course: Course):
        path = Path(course_path)
        course_db_path = self.__create_desk_path__(path)
        course_db = TinyDB(course_db_path)
        course_json = jsonable_encoder(course)
        course_db.insert(course_json)