import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'

const employabilitySkillsScreenValues: Record<EmployabilitySkillsValue, string> = {
  ADAPTABILITY: 'Adaptability',
  COMMUNICATION: 'Communication',
  CREATIVITY: 'Creativity',
  INITIATIVE: 'Initiative',
  ORGANISATION: 'Organisation',
  PLANNING: 'Planning',
  PROBLEM_SOLVING: 'Problem solving',
  RELIABILITY: 'Reliability',
  TEAMWORK: 'Teamwork',
  TIMEKEEPING: 'Timekeeping',
}

const employabilitySkillsQuestionTextValues: Record<EmployabilitySkillsValue, string> = {
  ADAPTABILITY: 'How do they feel about their ability to understand, accept and adjust to change?',
  COMMUNICATION: 'How do they feel about their ability to listen well and be clear when speaking or writing?',
  CREATIVITY: 'How do they feel about their ability to use imagination or own ideas to create or do something?',
  INITIATIVE:
    'How do they feel about their ability to do something or find things out by themselves without being asked?',
  ORGANISATION:
    'How do they feel about their ability to plan tasks and keep work tidy to get things done well and on time?',
  PLANNING: 'How do they feel about their ability to think ahead to decide what needs to be done and how?',
  PROBLEM_SOLVING: 'How do they feel about their ability to work things out and see how things work?',
  RELIABILITY:
    'How do they feel about their ability to do what they say they will do, and to do it properly and on time?',
  TEAMWORK: 'How do they feel about their ability to work with others and help out?',
  TIMEKEEPING:
    'How do they feel about their ability to arrive on time and manage time well to attend work, appointments and meet deadlines?',
}

const formatEmployabilitySkillsFilter = (value: EmployabilitySkillsValue): string =>
  employabilitySkillsScreenValues[value]

const formatEmployabilitySkillQuestionTextFilter = (value: EmployabilitySkillsValue): string =>
  employabilitySkillsQuestionTextValues[value]

export { formatEmployabilitySkillsFilter, formatEmployabilitySkillQuestionTextFilter }
