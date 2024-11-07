import json
from typing import List
import uuid
from tinydb import TinyDB, Query
from pathlib import Path
from ...schemas.course import Course
from ...schemas.lesson import Lesson
from ...schemas.response import ErrorResponseModel
from fastapi.encoders import jsonable_encoder
from app.logger import deskLogger
from bs4 import BeautifulSoup
import asyncio
from pyppeteer import launch

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
        return course

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
        
    def update_lesson(self, course_id: str, lesson_id: str, is_complete: bool):
        courseQ = Query()
        course_info = self.userDB.get(courseQ.course_id == course_id)
        if course_info is None:
            deskLogger.error(f"Couldn't find the course with id {course_id}")
            raise NotFoundError(f"Couldn't find the course with id {course_id}")
        
        path = Path(course_info['path'])
        if not path.exists():
            deskLogger.error(f"Couldn't find the course at {path} for course id {course_id}")
            raise NotFoundError(f"Couldn't find the course at {path} for course id {course_id}")
        
        course_info_path = path / '.desk' / 'info.json'
        course_db = TinyDB(course_info_path)
        
        course_data_list = course_db.all()
        if not course_data_list:
            deskLogger.error(f"Couldn't find course data in DB for course id {course_id}")
            raise NotFoundError(f"Couldn't find course data in DB for course id {course_id}")
        
        deskLogger.info(f"Course data list: {course_data_list}")
        
        course_data = course_data_list[0]
        
        def find_and_update_lesson(node, lesson_id, is_complete):
            if 'id' in node and node['id'] == lesson_id:
                node['is_complete'] = is_complete
                return True
            elif 'children' in node:
                for child in node['children']:
                    found = find_and_update_lesson(child, lesson_id, is_complete)
                    if found:
                        return True
            return False
        
        found = find_and_update_lesson(course_data['lessons'], lesson_id, is_complete)
        
        if found:
            course_db.truncate()
            course_db.insert(course_data)
            deskLogger.info(f"Updated lesson {lesson_id} in course {course_id}")
        else:
            deskLogger.error(f"Couldn't find lesson with id {lesson_id} in course {course_id}")
            raise NotFoundError(f"Couldn't find lesson with id {lesson_id} in course {course_id}")

    

    async def load_course_from_youtube_playlist(self,url: str) -> List[Lesson]:
        browser = await launch()
        page = await browser.newPage()
        await page.goto(url)
        page = await page.content()
        dom = BeautifulSoup(page,'html.parser')
        links = dom.find_all(id='video-title')
        lessons = []
        for link in links:
            youtube_link = "https://www.youtube.com"+link['href']
            name = link['title']
            lesson = Lesson(
                id=str(uuid.uuid4()),
                path=youtube_link,
                name=name,
                type='VIDEO',
                video_duration = "",
                is_complete=False
            )
            lessons.append(lesson)
        await browser.close()
        return lessons

        
    


            
            
