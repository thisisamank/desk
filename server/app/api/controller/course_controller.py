from pathlib import Path

from app.logger import deskLogger
from .file_controller import FileController
from ...schemas.course import Course
from ...schemas.lesson import Lesson
from ..crud.crud_controller import CrudController
from typing import List
from ...utils.desk_util import generate_short_id

class CourseController:

    file_controller: FileController = FileController()
    crud_controller: CrudController = CrudController()

    def get_all_courses(self):
        return self.crud_controller.get_all_courses()

    def get_course_by_id(self, id: str):
        return self.crud_controller.get_course_by_id(id)

    def add_course(self,path: str):
        course_name = path.split('/')[-1]
        lessons = self.file_controller.generate_folder_structure(path)
        course = Course(id=generate_short_id(), path=path, lessons=lessons,last_lesson_played= {}, name=course_name, author="admin")
        return self.crud_controller.add_course(path, course)

    def delete_course(self, id: str):
        return self.crud_controller.delete_course_by_id(id)
    
    def update_course(self, id:str, name: str | None, last_lesson_id: str | None):
        return self.crud_controller.update_course(id, name, last_lesson_id)
    
    def update_lesson(self, course_id: str, lesson_id: str, is_complete:bool):
        return self.crud_controller.update_lesson(course_id, lesson_id,is_complete)
    
    async def add_youtube_course(self, course_name: str, playlist_url: str):
        lessons = await self.crud_controller.load_course_from_youtube_playlist(playlist_url)
        lessons_dict =  self.file_controller.generate_youtube_folder_structure("",lessons, course_name)
        path = Path.home()/ 'youtube-course' / course_name
        path_str = str(path)
        path.mkdir(parents=True, exist_ok=True)
        deskLogger.info(f"Path created for youtube course:")
        course = Course(
            id=generate_short_id(),
            path=path_str,
            lessons=lessons_dict,
            last_lesson_played= {},
            name=course_name,
            author="admin"
        )
        deskLogger.info(f"Course created for youtube course: {course}")

        return self.crud_controller.add_course(course.path, course)
    