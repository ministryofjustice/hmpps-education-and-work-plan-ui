import Page, { PageElement } from '../page'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'

export default class PreviousWorkExperienceTypesPage extends Page {
  constructor() {
    super('induction-previous-work-experience-types')
  }

  selectPreviousWorkExperience(option: TypeOfWorkExperienceValue): PreviousWorkExperienceTypesPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectPreviousWorkExperience(option: TypeOfWorkExperienceValue): PreviousWorkExperienceTypesPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setOtherPreviousWorkExperienceType(value: string): PreviousWorkExperienceTypesPage {
    this.otherPreviousWorkExperienceField().clear().type(value, { delay: 0 })
    return this
  }

  hasOtherPreviousWorkExperienceType(expected: string): PreviousWorkExperienceTypesPage {
    this.otherPreviousWorkExperienceField().should('have.text', expected)
    return this
  }

  clearOtherPreviousWorkExperienceType(): PreviousWorkExperienceTypesPage {
    this.otherPreviousWorkExperienceField().clear()
    return this
  }

  hasPreviousWorkExperiences(expected: Array<TypeOfWorkExperienceValue>): PreviousWorkExperienceTypesPage {
    this.allSelectedCheckboxes().then(checkboxes => {
      const selectedCheckboxValues = checkboxes.map((idx, el) => el.getAttribute('value')).get()
      cy.wrap(selectedCheckboxValues)
        .should('have.length', expected.length)
        .each(value => {
          expect(expected).to.contain(value)
        })
    })
    return this
  }

  allSelectedCheckboxes = (): PageElement => cy.get(`.govuk-checkboxes__input:checked`)

  checkbox = (option: TypeOfWorkExperienceValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  otherPreviousWorkExperienceField = (): PageElement => cy.get('#typeOfWorkExperienceOther')
}
