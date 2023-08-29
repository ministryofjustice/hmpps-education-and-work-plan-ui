export default function formatPersonalInterestsFilter(value: string): string {
  const personalInterestsValue = PersonalInterestValues[value as keyof typeof PersonalInterestValues]
  return personalInterestsValue
}

enum PersonalInterestValues {
  COMMUNITY = 'Community',
  CRAFTS = 'Crafts',
  CREATIVE = 'Creative',
  DIGITAL = 'Digital',
  KNOWLEDGE_BASED = 'Knowledge-based',
  MUSICAL = 'Musical',
  OUTDOOR = 'Outdoor',
  NATURE_AND_ANIMALS = 'Nature and animals',
  SOCIAL = 'Social',
  SOLO_ACTIVITIES = 'Solo activities',
  SOLO_SPORTS = 'Solo sports',
  TEAM_SPORTS = 'Team sports',
  WELLNESS = 'Wellness',
  OTHER = 'Other',
  NONE = 'None of these',
}
