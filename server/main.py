from fastapi import FastAPI
from app.api.controller.course_controller import CourseController
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.logger import DeskLogger 

app = FastAPI()
logger = DeskLogger()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

course_controller = CourseController()

@app.get("/")
def ping():
    return {"Hello" : "World"}


@app.post("/course")
def add_course(path: str):
    course = course_controller.add_course(path)
    course_json = jsonable_encoder(course)
    logger.info(f"Course added: {course_json}")
    return JSONResponse(content=course_json)


@app.get('/course')
def get_all_courses():
    return course_controller.get_all_courses()

@app.get('/course/:id')
def get_course_by_id(id: str):
    return course_controller.get_course_by_id(id)

@app.delete('/course/:id')
def delete_course(id: str):
    return course_controller.delete_course(id)
