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
    private folderMap = new Map<string, Lesson[]>();
  
    add(lesson: Lesson) {
      let folders = lesson.path.split('/');
      let folder = '';
      for (let i = 0; i < folders.length; i++) {
        if (i === 0) {
          folder = folders[i];
          if (!this.folderMap.has(folder)) {
            this.folderMap.set(folder, []);
          }
        } else {
          let subFolders = this.folderMap.get(folder);
          if (subFolders != null) {
            if (!subFolders.includes(lesson)) {
              subFolders.push(lesson);
            }
          }
            folder = folders[i];
            if(!this.folderMap.has(folder)){
             this.folderMap.set(folder, []);
             }
        }
      }
}
  
    get(folder: string): Lesson[] {
      return this.folderMap.get(folder) || [];
    }
  }
  
const parseAndAddLessons = (courseData: any) => {
    const courseMap = new CourseMap();
  
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
    if (path.startsWith('http')) return LessonType.URL;
    return LessonType.UNKNOWN;
  };
  
  const parsePausedAt = (pausedAt: string): number => {
    const [hours, minutes, seconds] = pausedAt.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  
export { CourseMap, parseAndAddLessons };