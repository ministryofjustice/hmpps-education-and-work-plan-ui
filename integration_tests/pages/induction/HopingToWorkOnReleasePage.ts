import Page, { PageElement } from '../page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'

/**
 * Cypress page class representing the Induction "Hoping to get work on release" page
 */
export default class HopingToWorkOnReleasePage extends Page {
  constructor() {
    super('induction-hoping-to-work-on-release')
  }

  selectHopingWorkOnRelease(value: HopingToGetWorkValue): HopingToWorkOnReleasePage {
    this.radio(value).click()
    return this
  }

  radio = (value: HopingToGetWorkValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
