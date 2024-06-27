import type { ArchiveGoalForm } from 'forms'
import ReasonToArchiveGoalValue from '../enums/ReasonToArchiveGoalValue'

export default function aValidArchiveGoalForm(
  reference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
  title = 'Learn to cut hair',
): ArchiveGoalForm {
  return {
    reference,
    title,
    reason: ReasonToArchiveGoalValue.OTHER,
    reasonOther: 'Has got the Monday blues',
  }
}
