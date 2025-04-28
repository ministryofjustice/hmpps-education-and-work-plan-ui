import Page from '../../pages/page'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update previous work experience types in the Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should not update Previous Work Experience Types given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    // Induction has previous work experiences of Office and Other
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    let previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

    // When
    previousWorkExperienceTypesPage //
      .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OTHER)
      .submitPage()

    // Then
    previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)
    previousWorkExperienceTypesPage.hasFieldInError('typeOfWorkExperience')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should not update Previous Work Experience Types given page submitted with no changes made', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    // Induction has previous work experiences of Office and Other
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

    // When
    previousWorkExperienceTypesPage //
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update Previous Work Experience Types given page submitted with only removed worked experiences', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    // Induction has previous work experiences of Office and Other
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

    // When
    previousWorkExperienceTypesPage //
      .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.previousWorkExperiences.experiences.size() == 1 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'OTHER' && @.previousWorkExperiences.experiences[0].experienceTypeOther == 'Finance' &&" +
              "@.previousWorkExperiences.experiences[0].role == 'Trader' && @.previousWorkExperiences.experiences[0].details == 'Some trading tasks')]",
          ),
        ),
    )
  })

  describe('Journey based scenarios involving a page flow from Previous Work Experience Types to Previous Work Experience Details', () => {
    it('should update Previous Work Experience Types and Details given page submitted with only additional worked experiences', () => {
      // Given
      const prisonNumber = 'G6115VJ'

      // Induction has previous work experiences of Office and Other
      cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

      previousWorkExperienceTypesPage //
        .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OUTDOOR)
        .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
        .submitPage()

      // Populate the Detail page for "OUTDOOR"
      let previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Farmer')
        .setJobDetails('Milking cows')
        .submitPage()

      // Populate the Detail page for "CONSTRUCTION"
      previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Builder')
        .setJobDetails('Building walls')

      // When
      previousWorkExperienceDetailPage.submitPage()

      // Then
      Page.verifyOnPage(WorkAndInterestsPage)
      cy.wiremockVerify(
        putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
          .withRequestBody(
            matchingJsonPath(
              '$[?(@.previousWorkExperiences.experiences.size() == 4 && ' +
                "@.previousWorkExperiences.experiences[0].experienceType == 'OUTDOOR' && @.previousWorkExperiences.experiences[0].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[0].role == 'Farmer' && @.previousWorkExperiences.experiences[0].details == 'Milking cows' && " +
                "@.previousWorkExperiences.experiences[1].experienceType == 'CONSTRUCTION' && @.previousWorkExperiences.experiences[1].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[1].role == 'Builder' && @.previousWorkExperiences.experiences[1].details == 'Building walls' && " +
                "@.previousWorkExperiences.experiences[2].experienceType == 'OFFICE' && @.previousWorkExperiences.experiences[2].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[2].role == 'Accountant' && @.previousWorkExperiences.experiences[2].details == 'Some daily tasks' && " +
                "@.previousWorkExperiences.experiences[3].experienceType == 'OTHER' && @.previousWorkExperiences.experiences[3].experienceTypeOther == 'Finance' &&" +
                "@.previousWorkExperiences.experiences[3].role == 'Trader' && @.previousWorkExperiences.experiences[3].details == 'Some trading tasks')]",
            ),
          ),
      )
    })

    it('should update Previous Work Experience Types and Details given page submitted with only value for OTHER changed', () => {
      // Given
      const prisonNumber = 'G6115VJ'

      // Induction has previous work experiences of Office and Other
      cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

      previousWorkExperienceTypesPage //
        .setOtherPreviousWorkExperienceType('Health and fitness')
        .submitPage()

      // Populate the Detail page for "OTHER"
      const previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Gym instructor')
        .setJobDetails('Coaching and motivating customers fitness goals')

      // When
      previousWorkExperienceDetailPage.submitPage()

      // Then
      Page.verifyOnPage(WorkAndInterestsPage)
      cy.wiremockVerify(
        putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
          .withRequestBody(
            matchingJsonPath(
              '$[?(@.previousWorkExperiences.experiences.size() == 2 && ' +
                "@.previousWorkExperiences.experiences[0].experienceType == 'OFFICE' && @.previousWorkExperiences.experiences[0].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[0].role == 'Accountant' && @.previousWorkExperiences.experiences[0].details == 'Some daily tasks' && " +
                "@.previousWorkExperiences.experiences[1].experienceType == 'OTHER' && @.previousWorkExperiences.experiences[1].experienceTypeOther == 'Health and fitness' &&" +
                "@.previousWorkExperiences.experiences[1].role == 'Gym instructor' && @.previousWorkExperiences.experiences[1].details == 'Coaching and motivating customers fitness goals')]",
            ),
          ),
      )
    })

    it('should update Previous Work Experience Types and Details given page submitted with removals, additions, and change to value of OTHER', () => {
      // Given
      const prisonNumber = 'G6115VJ'

      // Induction has previous work experiences of Office and Other
      cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

      previousWorkExperienceTypesPage //
        .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
        .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OUTDOOR)
        .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
        .setOtherPreviousWorkExperienceType('Health and fitness')
        .submitPage()

      // Populate the Detail page for "OUTDOOR"
      let previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Farmer')
        .setJobDetails('Milking cows')
        .submitPage()

      // Populate the Detail page for "CONSTRUCTION"
      previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Builder')
        .setJobDetails('Building walls')
        .submitPage()

      // Populate the Detail page for "OTHER"
      previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      previousWorkExperienceDetailPage //
        .setJobRole('Gym instructor')
        .setJobDetails('Coaching and motivating customers fitness goals')

      // When
      previousWorkExperienceDetailPage.submitPage()

      // Then
      Page.verifyOnPage(WorkAndInterestsPage)
      cy.wiremockVerify(
        putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
          .withRequestBody(
            matchingJsonPath(
              '$[?(@.previousWorkExperiences.experiences.size() == 3 && ' +
                "@.previousWorkExperiences.experiences[0].experienceType == 'OUTDOOR' && @.previousWorkExperiences.experiences[0].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[0].role == 'Farmer' && @.previousWorkExperiences.experiences[0].details == 'Milking cows' && " +
                "@.previousWorkExperiences.experiences[1].experienceType == 'CONSTRUCTION' && @.previousWorkExperiences.experiences[1].experienceTypeOther == null && " +
                "@.previousWorkExperiences.experiences[1].role == 'Builder' && @.previousWorkExperiences.experiences[1].details == 'Building walls' && " +
                "@.previousWorkExperiences.experiences[2].experienceType == 'OTHER' && @.previousWorkExperiences.experiences[2].experienceTypeOther == 'Health and fitness' &&" +
                "@.previousWorkExperiences.experiences[2].role == 'Gym instructor' && @.previousWorkExperiences.experiences[2].details == 'Coaching and motivating customers fitness goals')]",
            ),
          ),
      )
    })
  })
})
