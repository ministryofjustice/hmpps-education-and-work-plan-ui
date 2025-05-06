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

  goalTitleFieldIsFocussed(goalNumber: number): CreateGoalsPage {
    this.goalTitleField(goalNumber).should('have.focus')
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

  setTargetCompletionDate(targetCompletionDate: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).last().check() // Setting a custom date is the last radio button option
    this.goalManuallyEnteredTargetCompletionDateField(goalNumber).clear().type(targetCompletionDate)
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

  stepTitleIs(expectedStepTitle: string, goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.stepTitleField(goalNumber, stepNumber).should('have.value', expectedStepTitle)
    return this
  }

  stepTitleFieldIsFocussed(goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.stepTitleField(goalNumber, stepNumber).should('have.focus')
    return this
  }

  goalHasNumberOfStepsFields(goalNumber: number, expectedNumberOfStepsFields: number): CreateGoalsPage {
    this.goalStepTitleFields(goalNumber) //
      .should('be.visible')
      .should('have.length', expectedNumberOfStepsFields)
    return this
  }

  hasNoRemoveStepButtons(): CreateGoalsPage {
    this.removeStepButtons().should('not.exist')
    return this
  }

  hasNumberOfRemoveStepButtonsForGoal(goalNumber: number, expectedNumberOfButtons: number): CreateGoalsPage {
    this.removeStepButtonsForGoal(goalNumber) //
      .should('be.visible')
      .should('have.length', expectedNumberOfButtons)
    return this
  }

  removeStep(goalNumber: number, stepNumber: number): CreateGoalsPage {
    this.removeStepButton(goalNumber, stepNumber).click()
    return this
  }

  addNewEmptyGoal(): CreateGoalsPage {
    this.addAnotherGoalButton().click()
    return this
  }

  hasNoRemoveGoalButtons(): CreateGoalsPage {
    this.removeGoalButtons().should('not.exist')
    return this
  }

  hasNumberOfRemoveGoalButtons(expectedNumberOfButtons: number): CreateGoalsPage {
    this.removeGoalButtons() //
      .should('be.visible')
      .should('have.length', expectedNumberOfButtons)
    return this
  }

  removeGoal(goalNumber: number): CreateGoalsPage {
    this.removeGoalButton(goalNumber).click()
    return this
  }

  goalTitleIs(expectedGoalTitle: string, goalNumber: number): CreateGoalsPage {
    this.goalTitleField(goalNumber).should('have.value', expectedGoalTitle)
    return this
  }

  private goalTitleField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexed(goalNumber)}][title]"]`)

  private goalTargetDateRadioButtons = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexed(goalNumber)}][targetCompletionDate]"][type="radio"]`)

  private goalManuallyEnteredTargetCompletionDateField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexed(goalNumber)}].manuallyEnteredTargetCompletionDate"]`)

  private goalStepTitleFields = (goalNumber: number): PageElement =>
    // Return elements whose name attribute is goals[zeroIndexedGoalNumber][steps][.*][title]
    // CSS attribute selectors don't have a true regex pattern matching syntax, so we do it with a "starts with" and "ends with" approach
    cy
      .get(`[name^="goals[${this.zeroIndexed(goalNumber)}][steps]["]`) // elements whose name attribute starts with `goals[zeroIndexedGoalNumber][steps][`
      .filter('[name$="][title]"]') // filter those elements to those whose name attribute ends with `][title]`

  private goalNoteField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexed(goalNumber)}][note]"]`)

  private addAnotherStepButtonForGoal = (goalNumber: number): PageElement =>
    cy.get(`#add-another-step-to-goal-${this.zeroIndexed(goalNumber)}-button`)

  private stepTitleField = (goalNumber: number, stepNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexed(goalNumber)}][steps][${this.zeroIndexed(stepNumber)}][title]"]`)

  private removeStepButtons = (): PageElement => cy.get('[data-qa=remove-step-button]')

  private removeStepButtonsForGoal = (goalNumber: number): PageElement =>
    this.removeStepButtons().filter(`[formaction^="create/REMOVE_STEP?goalNumber=${this.zeroIndexed(goalNumber)}"]`)

  private removeStepButton = (goalNumber: number, stepNumber: number): PageElement =>
    this.removeStepButtonsForGoal(goalNumber).filter(
      `[formaction^="create/REMOVE_STEP?goalNumber=${this.zeroIndexed(goalNumber)}&stepNumber=${this.zeroIndexed(stepNumber)}"]`,
    )

  private addAnotherGoalButton = (): PageElement => cy.get(`#add-another-goal-button`)

  private removeGoalButtons = (): PageElement => cy.get('[data-qa=remove-goal-button]')

  private removeGoalButton = (goalNumber: number): PageElement =>
    this.removeGoalButtons().filter(`[formaction="create/REMOVE_GOAL?goalNumber=${this.zeroIndexed(goalNumber)}"]`)
}
