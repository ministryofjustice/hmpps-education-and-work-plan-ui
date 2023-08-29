export default function formatAdditionalTrainingFilter(value: string): string {
  const additionalTrainingValue = AdditionalTrainingValues[value as keyof typeof AdditionalTrainingValues]
  return additionalTrainingValue
}

enum AdditionalTrainingValues {
  CSCS_CARD = 'CSCS card',
  FULL_UK_DRIVING_LICENCE = 'Full UK driving licence',
  FIRST_AID_CERTIFICATE = 'First aid certificate',
  FOOD_HYGIENE_CERTIFICATE = 'Food hygiene certificate',
  HEALTH_AND_SAFETY = 'Health and safety',
  HGV_LICENCE = 'HGV licence',
  MACHINERY_TICKETS = 'Machinery tickets',
  MANUAL_HANDLING = 'Manual handling',
  TRADE_COURSE = 'Trade course',
  OTHER = 'Other',
  NONE = 'None of these',
}
