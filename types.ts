
export enum Grade {
  GRADE_6 = '6',
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9'
}

export enum LessonType {
  GETTING_STARTED = 'Getting Started',
  A_CLOSER_LOOK_1 = 'A Closer Look 1',
  A_CLOSER_LOOK_2 = 'A Closer Look 2',
  COMMUNICATION = 'Communication',
  SKILLS_1 = 'Skills 1',
  SKILLS_2 = 'Skills 2',
  LOOKING_BACK_PROJECT = 'Looking Back & Project'
}

export enum Level {
  BASIC = 'Cơ bản',
  STANDARD = 'Chuẩn',
  ADVANCED = 'Nâng cao'
}

export enum Style {
  TRADITIONAL = 'Truyền thống',
  DYNAMIC = 'Sinh động – Trò chơi',
  COMPETENCY = 'Phát triển năng lực'
}

export interface LessonConfig {
  grade: Grade;
  unit: string;
  lesson: LessonType;
  level: Level;
  style: Style;
  includeGroupWork: boolean;
  includeMiniGames: boolean;
}

export interface SlideContent {
  title: string;
  points: string[];
  teacherNotes?: string;
  activityType: string;
}

export interface GeneratedLesson {
  outline: string;
  slides: SlideContent[];
  fileName: string;
}
