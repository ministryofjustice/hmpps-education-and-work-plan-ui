import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import WantToAddQualificationsPage from '../../pages/induction/WantToAddQualificationsPage'
import YesNoValue from '../../../server/enums/yesNoValue'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'

context('Create a short question set Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should create a short question set Induction', () => {
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
    overviewPage.clickMakeProgressPlan()
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()
    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.FULL_TIME_CARER)
      .submitPage()
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(WantToAddQualificationsPage).selectHopingWorkOnRelease(YesNoValue.NO).submitPage()
    // Confirm "No" qualification journey redirects correctly then return back
    Page.verifyOnPage(AdditionalTrainingPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .clickBackLinkTo(WantToAddQualificationsPage)
    // Continue through "Yes" journey
    Page.verifyOnPage(WantToAddQualificationsPage).selectHopingWorkOnRelease(YesNoValue.YES).submitPage()

    // Qualification Level page is next
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
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
    // Then*/
  })
})
