import Page, { PageElement } from '../page'
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
import HighestLevelOfEducationPage from './HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import WantToAddQualificationsPage from './WantToAddQualificationsPage'
import WorkedBeforePage from './WorkedBeforePage'
import YesNoValue from '../../../server/enums/yesNoValue'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import PreviousWorkExperienceTypesPage from './PreviousWorkExperienceTypesPage'
import PreviousWorkExperienceDetailPage from './PreviousWorkExperienceDetailPage'
import FutureWorkInterestTypesPage from './FutureWorkInterestTypesPage'
import FutureWorkInterestRolesPage from './FutureWorkInterestRolesPage'
import SkillsPage from './SkillsPage'
import PersonalInterestsPage from './PersonalInterestsPage'
import AffectAbilityToWorkPage from './AffectAbilityToWorkPage'
import SkillsValue from '../../../server/enums/skillsValue'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'

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

  hasEducationalQualificationsDisplayed(): CheckYourAnswersPage {
    this.educationalQualificationsTable().should('be.visible')
    return this
  }

  clickQualificationsChangeLink(): QualificationsListPage {
    this.qualificationsChangeLink().click()
    return Page.verifyOnPage(QualificationsListPage)
  }

  hasHighestLevelOfEducation(expected: EducationLevelValue): CheckYourAnswersPage {
    this.highestLevelOfEducation(expected).should('be.visible')
    return this
  }

  clickHighestLevelOfEducationLink(): HighestLevelOfEducationPage {
    this.highestLevelOfEducationChangeLink().click()
    return Page.verifyOnPage(HighestLevelOfEducationPage)
  }

  clickWantsToAddQualificationsChangeLink(): WantToAddQualificationsPage {
    this.wantsToAddQualificationsChangeLink().click()
    return Page.verifyOnPage(WantToAddQualificationsPage)
  }

  hasWantsToAddQualificationsAs(expected: YesNoValue): CheckYourAnswersPage {
    this.wantsToAddQualifications().should('contain.text', expected === YesNoValue.YES ? 'Yes' : 'No')
    return this
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

  hasWorkedBefore(expected: YesNoValue): CheckYourAnswersPage {
    this.hasWorkedBeforeValue(expected).should('be.visible')
    return this
  }

  clickHasWorkedBeforeChangeLink(): WorkedBeforePage {
    this.hasWorkedBeforeChangeLink().click()
    return Page.verifyOnPage(WorkedBeforePage)
  }

  hasParticularJobInterest(expected: WorkInterestTypeValue): CheckYourAnswersPage {
    this.particularJobInterests(expected).should('be.visible')
    return this
  }

  hasTypeOfWorkExperienceType(expected: TypeOfWorkExperienceValue): CheckYourAnswersPage {
    this.typeOfWorkExperienceType(expected).should('be.visible')
    return this
  }

  hasWorkExperience(
    expectedType: TypeOfWorkExperienceValue,
    expectedRole: string,
    expectedDetails: string,
  ): CheckYourAnswersPage {
    this.hasWorkExperienceRole(expectedType).should('contain.text', expectedRole)
    this.hasWorkExperienceDetails(expectedType).should('contain.text', expectedDetails)
    return this
  }

  clickWorkExperienceTypesChangeLink(): PreviousWorkExperienceTypesPage {
    this.workExperienceTypesChangeLink().click()
    return Page.verifyOnPage(PreviousWorkExperienceTypesPage)
  }

  clickWorkExperienceDetailChangeLink(expected: TypeOfWorkExperienceValue): PreviousWorkExperienceDetailPage {
    this.workExperienceDetailChangeLink(expected).click()
    return Page.verifyOnPage(PreviousWorkExperienceDetailPage)
  }

  hasWorkInterest(expectedType: WorkInterestTypeValue): CheckYourAnswersPage {
    this.workInterest(expectedType).should('be.visible')
    return this
  }

  clickWorkInterestsChangeLink(): FutureWorkInterestTypesPage {
    this.workInterestsChangeLink().click()
    return Page.verifyOnPage(FutureWorkInterestTypesPage)
  }

  clickParticularJobInterestsChangeLink(): FutureWorkInterestRolesPage {
    this.particularJobInterestsChangeLink().click()
    return Page.verifyOnPage(FutureWorkInterestRolesPage)
  }

  hasPersonalSkill(expected: SkillsValue): CheckYourAnswersPage {
    this.personalSkill(expected).should('be.visible')
    return this
  }

  clickPersonalSkillsChangeLink(): SkillsPage {
    this.personalSkillsChangeLink().click()
    return Page.verifyOnPage(SkillsPage)
  }

  hasPersonalInterest(expected: PersonalInterestsValue): CheckYourAnswersPage {
    this.personalInterest(expected).should('be.visible')
    return this
  }

  clickPersonalInterestsChangeLink(): PersonalInterestsPage {
    this.personalInterestsChangeLink().click()
    return Page.verifyOnPage(PersonalInterestsPage)
  }

  hasFactorsAffectingAbilityToWork(expected: AbilityToWorkValue): CheckYourAnswersPage {
    this.factorsAffectingAbilityToWork(expected).should('be.visible')
    return this
  }

  clickFactorsAffectingAbilityToWorkChangeLink(): AffectAbilityToWorkPage {
    this.factorsAffectingAbilityToWorkChangeLink().click()
    return Page.verifyOnPage(AffectAbilityToWorkPage)
  }

  submitPage() {
    this.submitButton().click()
  }

  private submitButton = (): PageElement => cy.get('#submit-button')

  private factorsAffectingAbilityToWork = (expected: AbilityToWorkValue): PageElement =>
    cy.get(`[data-qa=affectingAbilityToWork-${expected}]`)

  private factorsAffectingAbilityToWorkChangeLink = (): PageElement => cy.get('[data-qa=affectAbilityToWorkLink]')

  private wantsToAddQualifications = (): PageElement => cy.get('[data-qa=wantsToAddQualifications]')

  private wantsToAddQualificationsChangeLink = (): PageElement => cy.get('[data-qa=wantsToAddQualificationsLink]')

  private educationalQualificationsTable = (): PageElement => cy.get('[data-qa=educational-qualifications-table]')

  private qualificationsChangeLink = (): PageElement => cy.get('[data-qa=qualificationsLink]')

  private highestLevelOfEducation = (educationLevel: EducationLevelValue): PageElement =>
    cy.get(`[data-qa=highestLevelOfEducation-${educationLevel}`)

  private highestLevelOfEducationChangeLink = (): PageElement => cy.get('[data-qa=educationLevelLink]')

  private additionalTrainingSelections = (): PageElement => cy.get('[data-qa^=additionalTraining-]')

  private additionalTrainingChangeLink = (): PageElement => cy.get('[data-qa=additionalTrainingLink]')

  private inPrisonWorkInterests = (): PageElement => cy.get('[data-qa^=inPrisonWork-]')

  private inPrisonWorkInterestsChangeLink = (): PageElement => cy.get('[data-qa=inPrisonWorkLink]')

  private inPrisonTrainingInterests = (): PageElement => cy.get('[data-qa^=inPrisonEducation-]')

  private inPrisonTrainingInterestsChangeLink = (): PageElement => cy.get('[data-qa=inPrisonEducationLink]')

  private workInterest = (expected: WorkInterestTypeValue): PageElement => cy.get(`[data-qa=workInterests-${expected}]`)

  private workInterestsChangeLink = (): PageElement => cy.get('[data-qa=workInterestsLink]')

  private particularJobInterests = (expected: WorkInterestTypeValue) =>
    cy.get(`[data-qa^=particularJobInterests-${expected}]`)

  private particularJobInterestsChangeLink = (): PageElement => cy.get('[data-qa=particularJobInterestsLink]')

  private personalSkill = (expected: SkillsValue): PageElement => cy.get(`[data-qa=skills-${expected}]`)

  private personalSkillsChangeLink = (): PageElement => cy.get('[data-qa=skillsLink]')

  private personalInterest = (expected: PersonalInterestsValue): PageElement =>
    cy.get(`[data-qa=personalInterests-${expected}]`)

  private personalInterestsChangeLink = (): PageElement => cy.get('[data-qa=personalInterestsLink]')

  private hasWorkedBeforeValue(expected: YesNoValue): PageElement {
    const booleanValue = expected === YesNoValue.YES ? 'true' : 'false'
    return cy.get(`[data-qa=hasWorkedBefore-${booleanValue}]`)
  }

  private hasWorkedBeforeChangeLink = (): PageElement => cy.get('[data-qa=hasWorkedBeforeLink]')

  private typeOfWorkExperienceType = (expected: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=typeOfWorkExperience-${expected}]`)

  private workExperienceTypesChangeLink = (): PageElement => cy.get('[data-qa=typeOfWorkExperienceLink]')

  private hasWorkExperienceRole = (expected: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=workExperience-role-${expected}]`)

  private hasWorkExperienceDetails = (expected: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=workExperience-details-${expected}]`)

  private workExperienceDetailChangeLink = (workExperienceType: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=workExperienceDetailLink-${workExperienceType}]`)

  private hopingToWorkOnReleaseValue = (expected: HopingToGetWorkValue): PageElement =>
    cy.get(`[data-qa=hopingToGetWork-${expected}`)

  private hopingToWorkOnReleaseChangeLink = (): PageElement => cy.get('[data-qa=hopingToGetWorkLink]')

  private reasonsForNotWantingToWorkOnReleaseSelections = (): PageElement => cy.get('[data-qa^=reasonToNotGetWork-]')

  private reasonsForNotWantingToWorkOnReleaseChangeLink = (): PageElement => cy.get('[data-qa=reasonToNotGetWorkLink]')
}
