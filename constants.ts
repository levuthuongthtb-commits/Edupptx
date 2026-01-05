
import { Grade, LessonType, Level, Style } from './types';

export const GRADES = [Grade.GRADE_6, Grade.GRADE_7, Grade.GRADE_8, Grade.GRADE_9];

export const UNITS = Array.from({ length: 12 }, (_, i) => `Unit ${i + 1}`);

export const LESSON_TYPES = [
  LessonType.GETTING_STARTED,
  LessonType.A_CLOSER_LOOK_1,
  LessonType.A_CLOSER_LOOK_2,
  LessonType.COMMUNICATION,
  LessonType.SKILLS_1,
  LessonType.SKILLS_2,
  LessonType.LOOKING_BACK_PROJECT
];

export const LEVELS = [Level.BASIC, Level.STANDARD, Level.ADVANCED];

export const STYLES = [Style.TRADITIONAL, Style.DYNAMIC, Style.COMPETENCY];

export const APP_THEME = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  bg: '#f8fafc',
  card: '#ffffff'
};
