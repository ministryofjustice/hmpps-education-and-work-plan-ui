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
    '/plan/{PRISON_NUMBER}/view/overview': `Back to ${prisonerName}'s learning and work progress`,
    '/plan/{PRISON_NUMBER}/view/education-and-training': `Back to ${prisonerName}'s learning and work progress`,
    '/plan/{PRISON_NUMBER}/view/work-and-interests': `Back to ${prisonerName}'s learning and work progress`,
    '/prisoners/{PRISON_NUMBER}/create-induction/hoping-to-work-on-release': `Back to Is ${prisonerName} hoping to get work when they're released?`,
    '/prisoners/{PRISON_NUMBER}/induction/hoping-to-work-on-release': `Back to Is ${prisonerName} hoping to get work when they're released?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience': `Back to What type of work has ${prisonerName} done before?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/outdoor': `Back to What did ${prisonerName} do in their animal care and farming job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/cleaning_and_maintenance': `Back to What did ${prisonerName} do in their cleaning and maintenance job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/construction': `Back to What did ${prisonerName} do in their construction and trade job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/driving': `Back to What did ${prisonerName} do in their driving and transport job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/beauty': `Back to What did ${prisonerName} do in their hair, beauty and wellbeing job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/hospitality': `Back to What did ${prisonerName} do in their hospitality and catering job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/technical': `Back to What did ${prisonerName} do in their IT and digital job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/manufacturing': `Back to What did ${prisonerName} do in their manufacturing and technical job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/office': `Back to What did ${prisonerName} do in their office or desk-based job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/retail': `Back to What did ${prisonerName} do in their retail and sales job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/sports': `Back to What did ${prisonerName} do in their sport and fitness job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/warehousing': `Back to What did ${prisonerName} do in their warehousing and storage job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/education_training': `Back to What did ${prisonerName} do in their training and support job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/waste_management': `Back to What did ${prisonerName} do in their waste management job?`,
    '/prisoners/{PRISON_NUMBER}/induction/previous-work-experience/other': `Back to What did ${prisonerName} do in their other job?`,
    '/prisoners/{PRISON_NUMBER}/induction/reasons-not-to-get-work': `Back to What could stop ${prisonerName} working when they are released?`,
    '/prisoners/{PRISON_NUMBER}/induction/highest-level-of-education': `Back to What's the highest level of education ${prisonerName} completed before entering prison?`,
    '/prisoners/{PRISON_NUMBER}/induction/qualifications': `Back to ${prisonerName}'s qualifications`,
    '/prisoners/{PRISON_NUMBER}/induction/additional-training': `Back to Does ${prisonerName} have any other training or vocational qualifications?`,
    '/prisoners/{PRISON_NUMBER}/induction/in-prison-work': `Back to What type of work would ${prisonerName} like to do in prison?`,
    '/prisoners/{PRISON_NUMBER}/induction/in-prison-training': `Back to What type of training and education activities would ${prisonerName} like to do in prison?`,
    '/prisoners/{PRISON_NUMBER}/induction/want-to-add-qualifications': `Back to Does ${prisonerName} have any other educational qualifications they want to be recorded?`,
    '/prisoners/{PRISON_NUMBER}/induction/qualification-level': `Back to What level of qualification does ${prisonerName} want to add`,
    '/prisoners/{PRISON_NUMBER}/induction/qualification-details': 'Back to Add a qualification',
    '/prisoners/{PRISON_NUMBER}/induction/work-interest-types': `Back to What type of work is ${prisonerName} interested in?`,
    '/prisoners/{PRISON_NUMBER}/induction/work-interest-roles': `Back to Is ${prisonerName} interested in any particular jobs?`,
    '/prisoners/{PRISON_NUMBER}/induction/skills': `Back to What skills does ${prisonerName} feel they have?`,
    '/prisoners/{PRISON_NUMBER}/induction/personal-interests': `Back to What are ${prisonerName}'s interests?`,
    '/prisoners/{PRISON_NUMBER}/induction/check-your-answers': `Back to Check and save your answers before adding ${prisonerName}'s goals`,
  }
  const uriKey = backLinkUrl.replace(prisonNumber, '{PRISON_NUMBER}')
  return ariaTextByUri[uriKey] || ''
}

export default getDynamicBackLinkAriaText
