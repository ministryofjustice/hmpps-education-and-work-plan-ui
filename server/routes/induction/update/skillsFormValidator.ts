import type { SkillsForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import formatErrors from '../../errorFormatter'
import SkillsValue from '../../../enums/skillsValue'

export default function validateSkillsForm(
  skillsForm: SkillsForm,
  prisonerSummary: PrisonerSummary,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('skills', validateSkills(skillsForm, prisonerSummary)))
  errors.push(...formatErrors('skillsOther', validateSkillsOther(skillsForm, prisonerSummary)))
  return errors
}

const validateSkills = (skillsForm: SkillsForm, prisonerSummary: PrisonerSummary): Array<string> => {
  const errors: Array<string> = []

  const { skills } = skillsForm
  if (
    !skills ||
    skills.length === 0 ||
    containsInvalidOptions(skills) ||
    (skills.length > 1 && skills.includes(SkillsValue.NONE))
  ) {
    errors.push(
      `Select the skills that ${prisonerSummary.firstName} ${prisonerSummary.lastName} feels they have or select 'None of these'`,
    )
  }

  return errors
}

/**
 * Return true if any value in the specified array is not in the full set of `SkillsValue` enum values.
 */
const containsInvalidOptions = (skills: Array<SkillsValue>): boolean => {
  const allValidValues = Object.values(SkillsValue)
  return skills.some(value => !allValidValues.includes(value))
}

const validateSkillsOther = (skillsForm: SkillsForm, prisonerSummary: PrisonerSummary): Array<string> => {
  const errors: Array<string> = []

  const { skills, skillsOther } = skillsForm

  if (skills && skills.includes(SkillsValue.OTHER) && !skillsOther) {
    errors.push(`Enter the skill that ${prisonerSummary.firstName} ${prisonerSummary.lastName} feels they have`)
  }

  return errors
}
