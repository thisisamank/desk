from tinydb import TinyDB, Query
from pathlib import Path
from ...schemas.course import Course
from ...schemas.lesson import Lesson
from ...schemas.response import ErrorResponseModel
from fastapi.encoders import jsonable_encoder
from app.logger import deskLogger

class DatabaseError(Exception):
    pass

class NotFoundError(DatabaseError):
    pass

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
            deskLogger.info(f"Desk path created at {desk_db_path}")
        else:
            deskLogger.info(f"Desk path found at {desk_db_path}")
        return desk_db_path
        

    def add_course(self,course_path: str, course: Course):
        course.lessons.sort(key = lambda lesson: lesson.name)
        if(self.exists(course_path)):
            deskLogger.error(f"Course with id {course.id} already exist!")
            raise DatabaseError(f"Course with id {course.id} already exist!")
        path = Path(course_path)
        course_db_path = self.__create_desk_path__(path)
        course_db = TinyDB(course_db_path)
        course_json = jsonable_encoder(course)
        course_db.insert(course_json)
        self.userDB.insert({
            'course_id': course.id,
            'path': course.path,
            'name': course.name,
            'author': course.author,
        })
        deskLogger.info(f"Course added with id {course.id}")

    def get_all_courses(self):
        deskLogger.info("Getting all courses")
        return self.userDB.all()
    
    def get_course_by_id(self, id: str):
        courseQ = Query()
        course_info = self.userDB.get(courseQ.course_id == id)
        if course_info is not None:
            path = Path(course_info['path'])
            if not path.exists():
                deskLogger.error(f"Couldn't find the course at {path} for course id {id}")
                raise NotFoundError(f"Couldn't find the course at {path} for course id {id}")
            course_info_path = path / '.desk' / 'info.json'
            course_db = TinyDB(course_info_path)
            course_json = jsonable_encoder(course_db.all())
            deskLogger.info(f"Course found with id {id}")
            return course_json
        else:
            deskLogger.error(f"Couldn't find the course with id {id}")
            raise NotFoundError(f"Couldn't find the course with id {id}")
        
    def exists(self,course_path: str) -> bool :
        courseQ = Query()
        return len(self.userDB.search(courseQ.path == course_path)) > 0


    def delete_course_by_id(self, id: str):
        courseQ = Query()
        course_info = self.userDB.get(courseQ.course_id == id)
        if course_info is not None:
            deskLogger.info(f"Deleting course with id {id}")
            path = Path(course_info['path'])
            if not path.exists():
                deskLogger.error(f"Couldn't find the course at {path} for course id {id}")
                raise NotFoundError(f"Couldn't find the course at {path} for course id {id}")
            course_info_path = path / '.desk' / 'info.json'
            course_db = TinyDB(course_info_path)
            course_db.truncate()
            self.userDB.remove(courseQ.course_id == id)
            deskLogger.info(f"Course deleted with id {id}")
        else:
            deskLogger.error(f"Couldn't find the course with id {id}")
            raise NotFoundError(f"Couldn't find the course with id {id}")
    
    def update_course(self, id:str, name: str | None, last_lesson_id: str | None):
        courseQ = Query()
        course_info = self.userDB.get(courseQ.course_id == id)
        if course_info is None:
            deskLogger.error(f"Couldn't find the course with id {id}")
            raise NotFoundError(f"Couldn't find the course with id {id}")
        if name is not None:
            course_info.name = name
        if last_lesson_id is not None:
            path = Path(course_info['path'])
            course_info_path = path / '.desk' / 'info.json'
            course_db = TinyDB(course_info_path)
            last_lesson = course_db.get(Query().id == last_lesson_id)
            if last_lesson is None:
                deskLogger.error(f"Couldn't find the lesson with id {last_lesson_id}")
                raise NotFoundError(f"Couldn't find the lesson with id {last_lesson_id}")
            course_info.last_lesson_played = last_lesson
        self.userDB.update(course_info, courseQ.course_id == id)
        deskLogger.info(f"Course updated with id {id}")
        return course_info

