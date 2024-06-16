from fastapi import FastAPI
from app.api.controller.course_controller import CourseController
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.logger import DeskLogger 
from fastapi import HTTPException
from pydantic import BaseModel
from app.schemas.response import create_error_response, create_response

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
    return create_response("success", "pong")


@app.post("/course")
def add_course(path: str):
    try:
        course = course_controller.add_course(path)
        course_json = jsonable_encoder(course)
        return create_response("success", "Course added successfully", course_json)
    except Exception as e:
        logger.error(f"Error adding course: {e}")
        return create_error_response("error", "Error adding course", str(e))


@app.get('/course')
def get_all_courses():
    courses = course_controller.get_all_courses()
    return create_response("success", "Courses retrieved successfully", courses)

@app.get('/course/:id')
def get_course_by_id(id: str):
    try:
        course = course_controller.get_course_by_id(id)
        course_json = jsonable_encoder(course)
        return create_response("success", "Course retrieved successfully", course_json)
    except Exception as e:
        logger.error(f"Error retrieving course: {e}")
        return create_error_response("error", "Error retrieving course", str(e))

@app.delete('/course/:id')
def delete_course(id: str):
    try:
        course = course_controller.delete_course(id)
        return create_response("success", "Course deleted successfully", course)
    except Exception as e:
        logger.error(f"Error deleting course: {e}")
        return create_error_response("error", "Error deleting course", str(e))
    
@app.put('/course/:id')
def update_course(id: str, name: str = None, last_lesson_id: str = None):
    try:
        course = course_controller.update_course(id, name, last_lesson_id)
        return create_response("success", "Course updated successfully", course)
    except Exception as e:
        logger.error(f"Error updating course: {e}")
        return create_error_response("error", "Error updating course", str(e))

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail.dict() if isinstance(exc.detail, BaseModel) else {"detail": exc.detail},
    )
