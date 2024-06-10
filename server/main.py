from fastapi import FastAPI
from app.api.controller.course_controller import CourseController
from typing import List
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


app = FastAPI()

course_controller = CourseController()

@app.get("/")
def ping():
    return {"Hello" : "World"}


@app.post("/course")
def add_course(path: str):
    course = course_controller.add_course(path)
    course_json = jsonable_encoder(course)
    return JSONResponse(content=course_json)


@app.get('/course')
def get_all_courses():
    return course_controller.get_all_courses()