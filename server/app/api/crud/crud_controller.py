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
        self.userDB.insert({
            'course_id': course.id,
            'path': course.path
        })

    def get_all_courses(self):
        return self.userDB.all()
    
    def get_course_by_id(self, id: str):
        courseQ = Query()
        course_info = self.userDB.get(courseQ.course_id == id)
        print(self.userDB.all())
        if course_info is not None:
            path = Path(course_info['path'])
            if not path.exists():
                raise LookupError("The course doesn't exist")
            course_info_path = path / '.desk' / 'info.json'
            course_db = TinyDB(course_info_path)
            course_json = jsonable_encoder(course_db.all())
            return course_json
        else:
            return {
                'error' : "couldn't find the course"
            }
