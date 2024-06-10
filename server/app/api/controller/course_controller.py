from .file_controller import FileController
from ...schemas.course import Course
from ...schemas.lesson import Lesson
from typing import List
from ...utils.desk_util import generate_short_id

class CourseController:

    file_controller: FileController = FileController()
    
    def add_course(self,path: str) -> Course:
        lessons_path = self.file_controller.get_all_files(path)
        lessons: List[Lesson] = []
        for file in lessons_path:
            lesson = Lesson(path=str(file), id=generate_short_id())
            lessons.append(lesson)
        course = Course(id=generate_short_id(), path=path, lessons=lessons,last_lesson_played=lessons[0])
        return course
