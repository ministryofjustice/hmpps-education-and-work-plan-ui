import { Request } from 'express'

/**
 * Returns the aria text/hint for a corresponding URI.
 * This is to allow controllers to easily resolve the aria text for a given back link (which may not be known until
 * runtime, depending on the page flow).
 * Returns an empty string '' if the URI cannot be resolved.
 */
const getDynamicBackLinkAriaText = (req: Request, backLinkUrl: string): string => {
  if (!backLinkUrl) {
    return ''
  }
  const { prisonNumber } = req.params
  const { prisonerSummary } = req.session
  const prisonerName = `${prisonerSummary.firstName} ${prisonerSummary.lastName}`

  const ariaTextByUri: Record<string, string> = {
    '/plan/{PRISON_NUMBER}/view/education-and-training': `Back to ${prisonerName}'s learning and work progress`,
    '/plan/{PRISON_NUMBER}/view/work-and-interests': `Back to ${prisonerName}'s learning and work progress`,
    '/prisoners/{PRISON_NUMBER}/induction/hoping-to-work-on-release': `Back to Is ${prisonerName} hoping to get work when they're released?`,
    '/prisoners/{PRISON_NUMBER}/induction/highest-level-of-education': `Back to What's the highest level of education ${prisonerName} completed before entering prison?`,
    '/prisoners/{PRISON_NUMBER}/induction/qualifications': `Back to ${prisonerName}'s qualifications`,
    '/prisoners/{PRISON_NUMBER}/induction/want-to-add-qualifications': `Back to Does ${prisonerName} have any other educational qualifications they want to be recorded?`,
    '/prisoners/{PRISON_NUMBER}/induction/qualification-level': `Back to What level of qualification does ${prisonerName} want to add`,
    '/prisoners/{PRISON_NUMBER}/induction/qualification-details': 'Back to Add a qualification',
  }
  const uriKey = backLinkUrl.replace(prisonNumber, '{PRISON_NUMBER}')
  return ariaTextByUri[uriKey] || ''
}

export default getDynamicBackLinkAriaText
