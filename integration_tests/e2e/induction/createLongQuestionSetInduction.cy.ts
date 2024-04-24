import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'

context('Create a long question set Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should create a long question set Induction', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const hopingToWorkOnReleasePage = overviewPage //
      .clickMakeProgressPlan()
      .hasBackLinkTo('/plan/A00001A/view/overview')
    // submit the page without answering the question to trigger a validation error
    hopingToWorkOnReleasePage.submitPage()
    hopingToWorkOnReleasePage //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES) // Answer the question and submit the page
      .submitPage()

    // Qualifications List page is next
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasNoEducationalQualificationsDisplayed()
      .submitPage() // Submit page - there are no other CTAs at this point as there are Qualifications currently recorded.
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .hasErrorCount(1)
      .hasFieldInError('educationLevel')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Qualification Level page is next
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .hasErrorCount(1)
      .hasFieldInError('qualificationLevel')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()

    // Qualification Detail page is next
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .hasErrorCount(2)
      .hasFieldInError('qualificationSubject')
      .hasFieldInError('qualificationGrade')
      .setQualificationSubject('Computer science')
      .setQualificationGrade('A*')
      .submitPage()

    // Qualifications List page is displayed again. Add another qualification
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasEducationalQualifications(['Computer science'])
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .setQualificationSubject('Physics')
      .setQualificationGrade('B')
      .submitPage()

    // Qualifications List page is displayed again. Remove a qualification
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasEducationalQualifications(['Computer science', 'Physics'])
      .removeQualification(1) // remove Computer science
      .hasEducationalQualifications(['Physics'])
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .hasErrorCount(1)
      .hasFieldInError('additionalTraining')
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .chooseAdditionalTraining(AdditionalTrainingValue.OTHER)
      .setAdditionalTrainingOther('Basic accountancy course')
      .submitPage()

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')

    // Then
  })
})
