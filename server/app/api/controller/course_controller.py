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

    def add_course(self,path: str) -> Course:
        course_name = path.split('/')[-1]
        lessons_path = self.file_controller.get_all_files(path)
        lessons: List[Lesson] = []
        for file in lessons_path:
            lesson_name = file.name
            lesson = Lesson(path=str(file), id=generate_short_id(), name=lesson_name)
            lessons.append(lesson)
        course = Course(id=generate_short_id(), path=path, lessons=lessons,last_lesson_played=lessons[0], name=course_name, author="admin")
        return self.crud_controller.add_course(path, course)

    def delete_course(self, id: str):
        return self.crud_controller.delete_course_by_id(id)
    
    def update_course(self, id:str, name: str | None, last_lesson_id: str | None):
        return self.crud_controller.update_course(id, name, last_lesson_id)