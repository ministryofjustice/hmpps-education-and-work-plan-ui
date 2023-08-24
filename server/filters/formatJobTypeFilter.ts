export default function formatJobTypeFilter(value: string): string {
  const jobTypeValue = JobTypeValues[value as keyof typeof JobTypeValues]
  return jobTypeValue
}

enum JobTypeValues {
  OUTDOOR = 'Animal care and farming',
  CLEANING_AND_MAINTENANCE = 'Cleaning and maintenance',
  CONSTRUCTION = 'Construction and trade',
  DRIVING = 'Driving and transport',
  BEAUTY = 'Hair, beauty and wellbeing',
  HOSPITALITY = 'Hospitality and catering',
  TECHNICAL = 'IT and digital',
  MANUFACTURING = 'Manufacturing and technical',
  OFFICE = 'Office or desk-based',
  RETAIL = 'Retail and sales',
  SPORTS = 'Sport and fitness',
  WAREHOUSING = 'Warehousing and storage',
  EDUCATION_TRAINING = 'Training and support',
  WASTE_MANAGEMENT = 'Waste management',
  OTHER = 'Other',
}
