import os from 'os';

export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    pausedAt: number;
    name: string;
    path: string;
}
  
export enum LessonType {
    VIDEO = 'VIDEO',
    PDF = 'PDF',
    TEXT = 'TEXT',
    HTML = 'HTML',
    URL = 'URL',
    UNKNOWN = 'UNKNOWN'
}
  
export interface Course {
    title: string;
    lessons: Lesson[];
    path: string;
    id: string;
    name: string;
    lastLessonViewed: Lesson;
}
  
class CourseMap {
  private folderMap = new Map<string, { files: Lesson[], subdirectories: Map<string, string> }>();

  private coursePath: string;
  private os = os.type();

  constructor(coursePath: string) {
      this.coursePath = coursePath;
  }

  private separator = this.os === 'Windows_NT' ? '\\' : '/';

  add(lesson: Lesson) {
      const folders = lesson.path.split(this.separator);
      let currentPath = '';

      for (let i = 0; i < folders.length; i++) {
          const part = folders[i];
          if (i > 0) {
              currentPath += this.separator + part;
          } else {
              currentPath = part;
          }

          if (!this.folderMap.has(currentPath)) {
              this.folderMap.set(currentPath, { files: [], subdirectories: new Map() });
          }

          const entry = this.folderMap.get(currentPath);
          if (entry && i < folders.length - 1) {
              const nextPart = folders[i + 1];
              const nextPath = currentPath + this.separator + nextPart;
              entry.subdirectories.set(nextPart, nextPath); // Store both the name and full path
          }

          if (i === folders.length - 1 && entry) { // If it's the last part and it's a file
              entry.files.push(lesson);
          }
      }
  }

  get(folder: string): { files: Lesson[], subdirectories: { name: string, fullPath: string }[] } {
      const entry = this.folderMap.get(folder);
      if (entry) {
          return {
              files: entry.files,
              subdirectories: Array.from(entry.subdirectories).map(([name, fullPath]) => ({ name, fullPath }))
          };
      } else {
          return { files: [], subdirectories: [] };
      }
  }

  root(): { files: Lesson[], subdirectories: { name: string, fullPath: string }[] } {
      return this.get(this.coursePath);
  }
}

const parseAndAddLessons = (courseData: any) => {
    const courseMap = new CourseMap(courseData.path);
  
    courseData.lessons.forEach((lessonData: any) => {
      const lesson: Lesson = {
        id: lessonData.id,
        title: lessonData.name,
        type: determineLessonType(lessonData.path),
        pausedAt: parsePausedAt(lessonData.paused_at),
        name: lessonData.name,
        path: lessonData.path
      };
      courseMap.add(lesson);
    });
  
    return courseMap;
  };
  
  const determineLessonType = (path: string): LessonType => {
    if (path.endsWith('.mp4')) return LessonType.VIDEO;
    if (path.endsWith('.pdf')) return LessonType.PDF;
    if (path.endsWith('.txt')) return LessonType.TEXT;
    if (path.endsWith('.html')) return LessonType.HTML;
    if (path.endsWith('url')) return LessonType.URL;
    return LessonType.UNKNOWN;
  };
  
  const parsePausedAt = (pausedAt: string): number => {
    const [hours, minutes, seconds] = pausedAt.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  
export { CourseMap, parseAndAddLessons };
