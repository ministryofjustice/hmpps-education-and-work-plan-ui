export default function formatInPrisonWorkInterestFilter(value: string): string {
  const inPrisonWorkInterestValue = InPrisonWorkInterestValues[value as keyof typeof InPrisonWorkInterestValues]
  return inPrisonWorkInterestValue
}

enum InPrisonWorkInterestValues {
  CLEANING_AND_HYGIENE = 'Cleaning and hygiene',
  COMPUTERS_OR_DESK_BASED = 'Computers or desk-based',
  GARDENING_AND_OUTDOORS = 'Gardening and outdoors',
  KITCHENS_AND_COOKING = 'Kitchens and cooking',
  MAINTENANCE = 'Maintenance',
  PRISON_LAUNDRY = 'Prison laundry',
  PRISON_LIBRARY = 'Prison library',
  TEXTILES_AND_SEWING = 'Textiles and sewing',
  WELDING_AND_METALWORK = 'Welding and metalwork',
  WOODWORK_AND_JOINERY = 'Woodwork and joinery',
  OTHER = 'Other',
}
