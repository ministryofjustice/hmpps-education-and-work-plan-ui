import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the "Create Goals" page
 */
export default class CreateGoalsPage extends Page {
  constructor() {
    super('create-goals')
  }

  setGoalTitle(title: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalTitleField(goalNumber).clear().type(title)
    return this
  }

  clearGoalTitle(goalNumber: number = 1): CreateGoalsPage {
    this.goalTitleField(goalNumber).clear()
    return this
  }

  setTargetCompletionDate0to3Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(0).check() // 0-3 months option is the first radio button (zero indexed)
    return this
  }

  setTargetCompletionDate3to6Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(1).check() // 3-6 months option is the 2nd radio button (zero indexed)
    return this
  }

  setTargetCompletionDate6to12Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(2).check() // 6-12 months option is the 3rd radio button (zero indexed)
    return this
  }

  setTargetCompletionDate(day: string, month: string, year: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).last().check() // Setting a custom date is the last radio button option
    this.goalTargetDateDayField(goalNumber).clear().type(day)
    this.goalTargetDateMonthField(goalNumber).clear().type(month)
    this.goalTargetDateYearField(goalNumber).clear().type(year)
    return this
  }

  setGoalNote(note: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalNoteField(goalNumber).clear().type(note)
    return this
  }

  clearNoteTitle(goalNumber: number = 1): CreateGoalsPage {
    this.goalNoteField(goalNumber).clear()
    return this
  }

  addNewEmptyStepToGoal(goalNumber: number = 1): CreateGoalsPage {
    this.addAnotherStepButtonForGoal(goalNumber).click()
    return this
  }

  setStepTitle(title: string, goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.stepTitleField(goalNumber, stepNumber).clear().type(title)
    return this
  }

  clearStepTitle(goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.stepTitleField(goalNumber, stepNumber).clear()
    return this
  }

  stepTitleFieldIsFocussed(goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.stepTitleField(goalNumber, stepNumber).should('have.focus')
    return this
  }

  goalHasNumberOfStepsFields(goalNumber: number, expectedNumberOfStepsFields: number): CreateGoalsPage {
    this.goalStepTitleFields(goalNumber).should('have.length', expectedNumberOfStepsFields)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  private goalTitleField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${zeroIndexed(goalNumber)}][title]"]`)

  private goalTargetDateRadioButtons = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${zeroIndexed(goalNumber)}][targetCompletionDate]"][type="radio"]`)

  private goalTargetDateDayField = (goalNumber: number): PageElement =>
    cy.get(`[name="${zeroIndexed(goalNumber)}][targetCompletionDate-day]"]`)

  private goalTargetDateMonthField = (goalNumber: number): PageElement =>
    cy.get(`[name="${zeroIndexed(goalNumber)}][targetCompletionDate-month]"]`)

  private goalTargetDateYearField = (goalNumber: number): PageElement =>
    cy.get(`[name="${zeroIndexed(goalNumber)}][targetCompletionDate-year]"]`)

  private goalStepTitleFields = (goalNumber: number): PageElement =>
    // Return elements whose name attribute is goals[zeroIndexedGoalNumber][steps][.*][title]
    // CSS attribute selectors don't have a true regex pattern matching syntax, so we do it with a "starts with" and "ends with" approach
    cy
      .get(`[name^="goals[${zeroIndexed(goalNumber)}][steps]["]`) // elements whose name attribute starts with `goals[zeroIndexedGoalNumber][steps][`
      .filter('[name$="][title]"]') // filter those elements to those whose name attribute ends with `][title]`

  private goalNoteField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${zeroIndexed(goalNumber)}][note]"]`)

  private submitButton = (): PageElement => cy.get('#submit-button')

  private addAnotherStepButtonForGoal = (goalNumber: number): PageElement =>
    cy.get(`#add-another-step-to-goal-${zeroIndexed(goalNumber)}-button`)

  private stepTitleField = (goalNumber: number, stepNumber: number): PageElement =>
    cy.get(`[name="goals[${zeroIndexed(goalNumber)}][steps][${zeroIndexed(stepNumber)}][title]"]`)
}

const zeroIndexed = (indexNumber: number): number => Math.max(0, indexNumber - 1)
