import Page, { PageElement } from '../page'
import WorkAndInterestsPage from '../overview/WorkAndInterestsPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import InPrisonTrainingPage from './InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import InPrisonWorkPage from './InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import AdditionalTrainingPage from './AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import ReasonsNotToGetWorkPage from './ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import HopingToWorkOnReleasePage from './HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from './QualificationsListPage'

export default class CheckYourAnswersPage extends Page {
  constructor() {
    super('induction-check-your-answers')
  }

  hasInPrisonTrainingInterests(expected: Array<InPrisonTrainingValue>): CheckYourAnswersPage {
    this.inPrisonTrainingInterests().then(trainingInterests => {
      const trainingInterestsDataQaAttributes = trainingInterests.map((idx, el) => el.getAttribute('data-qa')).get()
      cy.wrap(trainingInterestsDataQaAttributes)
        .should('have.length', expected.length)
        .each(dataQaAttribute => {
          const expectedDataQaAttributes = expected.map(value => `inPrisonEducation-${value}`)
          expect(expectedDataQaAttributes).to.contain(dataQaAttribute)
        })
    })
    return this
  }

  clickInPrisonTrainingInterestsChangeLink(): InPrisonTrainingPage {
    this.inPrisonTrainingInterestsChangeLink().click()
    return Page.verifyOnPage(InPrisonTrainingPage)
  }

  hasInPrisonWorkInterests(expected: Array<InPrisonWorkValue>): CheckYourAnswersPage {
    this.inPrisonWorkInterests().then(workInterests => {
      const workInterestsDataQaAttributes = workInterests.map((idx, el) => el.getAttribute('data-qa')).get()
      cy.wrap(workInterestsDataQaAttributes)
        .should('have.length', expected.length)
        .each(dataQaAttribute => {
          const expectedDataQaAttributes = expected.map(value => `inPrisonWork-${value}`)
          expect(expectedDataQaAttributes).to.contain(dataQaAttribute)
        })
    })
    return this
  }

  clickInPrisonWorkInterestsChangeLink(): InPrisonWorkPage {
    this.inPrisonWorkInterestsChangeLink().click()
    return Page.verifyOnPage(InPrisonWorkPage)
  }

  hasAdditionalTraining(expected: Array<AdditionalTrainingValue>): CheckYourAnswersPage {
    this.additionalTrainingSelections().then(trainingSelections => {
      const trainingSelectionsDataQaAttributes = trainingSelections.map((idx, el) => el.getAttribute('data-qa')).get()
      cy.wrap(trainingSelectionsDataQaAttributes)
        .should('have.length', expected.length)
        .each(dataQaAttribute => {
          const expectedDataQaAttributes = expected.map(value => `additionalTraining-${value}`)
          expect(expectedDataQaAttributes).to.contain(dataQaAttribute)
        })
    })
    return this
  }

  clickAdditionalTrainingChangeLink(): AdditionalTrainingPage {
    this.additionalTrainingChangeLink().click()
    return Page.verifyOnPage(AdditionalTrainingPage)
  }

  hasReasonsForNotWantingToWork(expected: Array<ReasonNotToGetWorkValue>): CheckYourAnswersPage {
    this.reasonsForNotWantingToWorkOnReleaseSelections().then(reasonsForNotWantingToWorkSelections => {
      const reasonsForNotWantingToWorkSelectionsDataQaAttributes = reasonsForNotWantingToWorkSelections
        .map((idx, el) => el.getAttribute('data-qa'))
        .get()
      cy.wrap(reasonsForNotWantingToWorkSelectionsDataQaAttributes)
        .should('have.length', expected.length)
        .each(dataQaAttribute => {
          const expectedDataQaAttributes = expected.map(value => `reasonToNotGetWork-${value}`)
          expect(expectedDataQaAttributes).to.contain(dataQaAttribute)
        })
    })
    return this
  }

  hasEducationalQualifications(expected: Array<string>): CheckYourAnswersPage {
    this.educationalQualificationsTable()
      .find('[data-qa=educational-qualification-subject]')
      .then(subjectTableCells => {
        const subjects = subjectTableCells.map((idx, el) => el.textContent).get()
        cy.wrap(subjects)
          .should('have.length', expected.length)
          .each(value => {
            expect(expected).to.contain(value)
          })
      })
    return this
  }

  hasNoEducationalQualificationsDisplayed(): CheckYourAnswersPage {
    this.educationalQualificationsTable().should('not.exist')
    return this
  }

  clickQualificationsChangeLink(): QualificationsListPage {
    this.qualificationsChangeLink().click()
    return Page.verifyOnPage(QualificationsListPage)
  }

  clickReasonsForNotWantingToWorkChangeLink(): ReasonsNotToGetWorkPage {
    this.reasonsForNotWantingToWorkOnReleaseChangeLink().click()
    return Page.verifyOnPage(ReasonsNotToGetWorkPage)
  }

  hasHopingToWorkOnRelease(expected: HopingToGetWorkValue): CheckYourAnswersPage {
    this.hopingToWorkOnReleaseValue(expected).should('be.visible')
    return this
  }

  clickHopingToWorkOnReleaseChangeLink(): HopingToWorkOnReleasePage {
    this.hopingToWorkOnReleaseChangeLink().click()
    return Page.verifyOnPage(HopingToWorkOnReleasePage)
  }

  submitPage(): WorkAndInterestsPage {
    this.submitButton().click()
    return Page.verifyOnPage(WorkAndInterestsPage)
  }

  private submitButton = (): PageElement => cy.get('#submit-button')

  private factorsAffectingAbilityToWorkChangeLink = (): PageElement => cy.get('[data-qa=affectAbilityToWorkLink]')

  private wantsToAddQualificationsChangeLink = (): PageElement => cy.get('[data-qa=wantsToAddQualificationsLink]')

  educationalQualificationsTable = (): PageElement => cy.get('[data-qa=educational-qualifications-table]')

  private qualificationsChangeLink = (): PageElement => cy.get('[data-qa=qualificationsLink]')

  private highestLevelOfEducationChangeLink = (): PageElement => cy.get('[data-qa=educationLevelLink]')

  private additionalTrainingSelections = (): PageElement => cy.get('[data-qa^=additionalTraining-]')

  private additionalTrainingChangeLink = (): PageElement => cy.get('[data-qa=additionalTrainingLink]')

  private inPrisonWorkInterests = (): PageElement => cy.get('[data-qa^=inPrisonWork-]')

  private inPrisonWorkInterestsChangeLink = (): PageElement => cy.get('[data-qa=inPrisonWorkLink]')

  private inPrisonTrainingInterests = (): PageElement => cy.get('[data-qa^=inPrisonEducation-]')

  private inPrisonTrainingInterestsChangeLink = (): PageElement => cy.get('[data-qa=inPrisonEducationLink]')

  private workInterestsChangeLink = (): PageElement => cy.get('[data-qa=workInterestsLink]')

  private particularJobInterestsChangeLink = (): PageElement => cy.get('[data-qa=particularJobInterestsLink]')

  private personalSkillsChangeLink = (): PageElement => cy.get('[data-qa=skillsLink]')

  private personalInterestsChangeLink = (): PageElement => cy.get('[data-qa=personalInterestsLink]')

  private hasWorkedBeforeChangeLink = (): PageElement => cy.get('[data-qa=hasWorkedBeforeLink]')

  private workExperienceTypesChangeLink = (): PageElement => cy.get('[data-qa=typeOfWorkExperienceLink]')

  private workExperienceDetailChangeLink = (workExperienceType: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=workExperienceDetailLink-${workExperienceType}]`)

  private hopingToWorkOnReleaseValue = (expected: HopingToGetWorkValue): PageElement =>
    cy.get(`[data-qa=hopingToGetWork-${expected}`)

  private hopingToWorkOnReleaseChangeLink = (): PageElement => cy.get('[data-qa=hopingToGetWorkLink]')

  private reasonsForNotWantingToWorkOnReleaseSelections = (): PageElement => cy.get('[data-qa^=reasonToNotGetWork-]')

  private reasonsForNotWantingToWorkOnReleaseChangeLink = (): PageElement => cy.get('[data-qa=reasonToNotGetWorkLink]')
}
