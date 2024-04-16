import Page, { PageElement } from '../page'
import WorkAndInterestsPage from '../overview/WorkAndInterestsPage'

export default class CheckYourAnswersPage extends Page {
  constructor() {
    super('induction-check-your-answers')
  }

  submitPage(): WorkAndInterestsPage {
    this.submitButton().click()
    return Page.verifyOnPage(WorkAndInterestsPage)
  }

  private submitButton = (): PageElement => cy.get('#submit-button')
}
