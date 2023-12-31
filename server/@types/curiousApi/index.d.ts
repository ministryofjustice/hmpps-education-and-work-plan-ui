/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/learnerProfile/{prn}': {
    /** Returns all learner data for the given PRN from and eventually from all establishments the learner has been resident in. */
    get: operations['getLearnerInfo']
  }
  '/learnerEducation/{prn}': {
    /** Returns all courses the learner has been enrolled. This is going to contain all course entries, with no filtering on the course enrolment status, in order to provide a holistic view of the learner educational journey. */
    get: operations['getLearnerEducation']
  }
  '/latestLearnerAssessments/{prn}': {
    /** Returns the most recent assessment of each type for a given learner. */
    get: operations['latestLearnerAssessments']
  }
  '/learnerGoals/{prn}': {
    /** Returns all learner Goals for the given PRN */
    get: operations['getLearnerGoals']
  }
  '/learnerEmployabilitySkills/{prn}': {
    /** Returns all employability skills associated with given learner. */
    get: operations['getEmployabilitySkills']
  }
  '/learnerNeurodivergence/{prn}': {
    /** Returns all learner Neurodivergence info */
    get: operations['getLearnerNeurodivergence']
  }
}

export type webhooks = Record<string, never>

export interface components {
  schemas: {
    LearnerProfileDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      /** @description NOMIS Establishment ID */
      establishmentId?: string
      /** @description NOMIS Establishment Name */
      establishmentName?: string
      uln?: string
      /** @description Learner Self Assessment LDD and Health Problem */
      lddHealthProblem?: string
      /** @description Overall attainment level of learners that have achieved various combinations of qualifications. */
      priorAttainment?: string
      /** @description The assessment taken by the learner while in prison */
      qualifications?: components['schemas']['AssessmentDTO'][]
      /** @description To be confirmed */
      languageStatus?: string
      /** @description To be confirmed */
      plannedHours?: string
      /**
       * Format: date
       * @description Rapid Assessment Date
       */
      rapidAssessmentDate?: string
      /**
       * Format: date
       * @description In-Depth Assessment Date
       */
      inDepthAssessmentDate?: string
      /** @description Primary LDD and Health Problem */
      primaryLDDAndHealthProblem?: string
      /**
       * @description Additional LDD and Health Problems
       * @example [
       *   "Visual impairment",
       *   "Hearing impairment",
       *   "Disability affecting mobility",
       *   "Dyslexia"
       * ]
       */
      additionalLDDAndHealthProblems?: string[]
    }
    LearnerEducationDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      /** @description NOMIS Establishment ID */
      establishmentId?: string
      /** @description NOMIS Establishment Name */
      establishmentName?: string
      /** @description Course Indicator from LRS */
      a2LevelIndicator?: boolean
      /** @description Course Indicator from LRS */
      accessHEIndicator?: boolean
      /** @description Actual guided learning hours allocated to course */
      actualGLH?: number
      /** @description The AIM sequence number of Course for a learner */
      aimSeqNumber?: number
      /** @description Course Indicator from LRS */
      aLevelIndicator?: boolean
      /** @description Course Indicator from LRS */
      asLevelIndicator?: boolean
      /** @description Actual attended Guided Learning Hours by learner on course */
      attendedGLH?: number
      /** @description Course completion Status(for e.g. continuing, completed, withdrawn, temporarily withdrawn) */
      completionStatus?: string
      /** @description Unique Course Code */
      courseCode?: string
      /** @description Course Name */
      courseName?: string
      /** @description Prison Post code of a location where this course is getting delivered */
      deliveryLocationPostCode?: string
      /** @description Course Delivery Method (e.g. Blended Learning, Classroom Only Learning, Pack Only Learning) */
      deliveryMethodType?: string
      /** @description Employment Outcome gained status associated with the course ( with training , without training) */
      employmentOutcome?: string
      /** @description Course Indicator from LRS */
      functionalSkillsIndicator?: boolean
      /** @description Funding adjustment hours from prior learning */
      fundingAdjustmentForPriorLearning?: number
      /** @description Funding Model for a Course (defaulted to Adult Skills) */
      fundingModel?: string
      /** @description Funding type for a course (e.g. DPS, PEF, The Clink etc.) */
      fundingType?: string
      /** @description Course Indicator from LRS */
      gceIndicator?: boolean
      /** @description Course Indicator from LRS */
      gcsIndicator?: boolean
      /** @description Indicates if the course is accredited */
      isAccredited?: boolean
      /** @description Course Indicator from LRS */
      keySkillsIndicator?: boolean
      /** @description Course Indicator from LRS */
      learnAimRef?: string
      /** @description Learners aim on Course (Programme aim, Component learning aim within programme etc.) */
      learnersAimType?: string
      /**
       * Format: date
       * @description Actual Course end date
       */
      learningActualEndDate?: string
      /**
       * Format: date
       * @description Planned Course end date
       */
      learningPlannedEndDate?: string
      /**
       * Format: date
       * @description Course start date
       */
      learningStartDate?: string
      /** @description Course Indicator from LRS */
      level?: string
      /** @description Number of Guided Learning hours from LRS */
      lrsGLH?: number
      /** @description Course Indicator from LRS */
      occupationalIndicator?: boolean
      /** @description Outcome of Course (e.g. Achieved, Partially Achieved etc.) */
      outcome?: string
      /** @description Outcome grade of Course (e.g. Passed, Merit, Failed, Distinction etc.) */
      outcomeGrade?: string
      /** @description Withdrawal reason if the learner withdraws from course (e.g. Moved to another establishment or release ,ill health etc.) */
      prisonWithdrawalReason?: string
      /** @description Course Indicator from LRS */
      qcfCertificateIndicator?: boolean
      /** @description Course Indicator from LRS */
      qcfDiplomaIndicator?: boolean
      /** @description Course Indicator from LRS */
      qcfIndicator?: boolean
      /** @description Indicates if the withdrawal is reviewed */
      reviewed?: boolean
      /** @description Course Indicator from LRS */
      sectorSubjectAreaTier2?: string
      /** @description Course Indicator from LRS */
      subcontractedPartnershipUKPRN?: number
      /** @description Course Indicator from LRS */
      unitType?: string
      /** @description Indicates if withdrawal is agreed or not */
      withdrawalReasonAgreed?: boolean
      /** @description Withdrawal reason (defaulted to Other) populated for the courses which are withdrawn */
      withdrawalReasons?: string
    }
    LearnerLatestAssessmentDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      qualifications?: components['schemas']['LearnerAssessmentDTO'][]
    }
    LearnerAssessmentDTO: {
      /** @description NOMIS Establishment ID */
      establishmentId?: string
      /** @description NOMIS Establishment Name */
      establishmentName?: string
      qualification?: components['schemas']['AssessmentDTO']
    }
    AssessmentDTO: {
      qualificationType?: components['schemas']['QualificationType']
      /** @description Assessment Grade */
      qualificationGrade?: string
      /**
       * Format: date
       * @description The date the assessment has been taken
       */
      assessmentDate?: string
    }
    LearnerGoalDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      /** @description Employment Goals */
      employmentGoals?: string[]
      /** @description Personal Goals */
      personalGoals?: string[]
      /** @description Long Term Goals */
      longTermGoals?: string[]
      /** @description Short Term Goals */
      shortTermGoals?: string[]
    }
    LearnerEmployabilitySkillsDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      /** @description NOMIS Establishment ID */
      establishmentId?: string
      /** @description NOMIS Establishment Name */
      establishmentName?: string
      /** @description Learner Employability Skill (Adaptability, Attitudes and Behaviour, Communication, Creativity, Initiative, Organisation, Planning, Problem Solving, Reliability, Timekeeping) */
      employabilitySkill?: string
      /**
       * Format: date
       * @description Activity Start Date
       */
      activityStartDate?: string
      /**
       * Format: date
       * @description Activity End Date
       */
      activityEndDate?: string
      /** @description Prison Post code of a location where this skill is under taken */
      deliveryLocationPostCode?: string
      /** @description Skill Delivery Method (e.g. Face to Face, Blended Learning, Classroom Only Learning, Pack Only Learning) */
      deliveryMethodType?: string
      /** @description Activity Location */
      activityLocation?: string
      reviews?: components['schemas']['EmployabilitySkillsReviewDTO'][]
    }
    EmployabilitySkillsReviewDTO: {
      /**
       * Format: date
       * @description Date when the employability skill was reviewed
       */
      reviewDate?: string
      /** @description Employability Skill progression status and score on a scale of 1 to 5 (1 - Not demonstrated, 5 - Outstanding demonstration) */
      currentProgression?: string
      /** @description Any comments on the review */
      comment?: string
    }
    LearnerNeurodivergenceDTO: {
      /** @description NOMIS Offender Number */
      prn?: string
      /** @description NOMIS Establishment ID */
      establishmentId?: string
      /** @description NOMIS Establishment Name */
      establishmentName?: string
      /** @description Learner Neurodivergence Self-Declared */
      neurodivergenceSelfDeclared?: string[]
      /**
       * Format: date
       * @description Self-Declared Date
       */
      selfDeclaredDate?: string
      /** @description Learner Neurodivergence Assessed */
      neurodivergenceAssessed?: string[]
      /**
       * Format: date
       * @description Assessment Date
       */
      assessmentDate?: string
      /** @description Learner Neurodivergence Support */
      neurodivergenceSupport?: string[]
      /**
       * Format: date
       * @description Support Date
       */
      supportDate?: string
    }
    /** @enum {string} */
    QualificationType: 'English' | 'Maths' | 'Digital Literacy'
    NonSuccessResponseObject: {
      errorCode?: string
      errorMessage?: string
      httpStatusCode?: number
    }
    /** Pageable */
    Pageable: {
      /** Format: int64 */
      offset?: number
      /** Format: int32 */
      pageNumber?: number
      /** Format: int32 */
      pageSize?: number
      paged?: boolean
      sort?: components['schemas']['Sort']
      unpaged?: boolean
    }
    /** Page */
    Page: {
      content?: components['schemas']['LearnerEducationDTO'][]
      empty?: boolean
      first?: boolean
      last?: boolean
      /** Format: int32 */
      number?: number
      /** Format: int32 */
      numberOfElements?: number
      pageable?: components['schemas']['Pageable']
      /** Format: int32 */
      size?: number
      sort?: components['schemas']['Sort']
      /** Format: int64 */
      totalElements?: number
      /** Format: int32 */
      totalPages?: number
    }
    /** Sort */
    Sort: {
      empty?: boolean
      sorted?: boolean
      unsorted?: boolean
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}

export type external = Record<string, never>

export interface operations {
  /** Returns all learner data for the given PRN from and eventually from all establishments the learner has been resident in. */
  getLearnerInfo: {
    parameters: {
      query?: {
        /** @description NOMIS Establishment ID */
        establishmentId?: string
      }
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': components['schemas']['LearnerProfileDTO'][]
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
  /** Returns all courses the learner has been enrolled. This is going to contain all course entries, with no filtering on the course enrolment status, in order to provide a holistic view of the learner educational journey. */
  getLearnerEducation: {
    parameters: {
      query?: {
        /** @description NOMIS Establishment ID */
        establishmentId?: string
        /** @description Course Name */
        courseName?: string
        /** @description Course Code */
        courseCode?: string
        /** @description Accredited or not */
        isAccredited?: boolean
        /** @description Course Start Date */
        learningStartDate?: string
        /** @description Planned Course End Date */
        learningPlannedEndDate?: string
        /** @description Whether the education is current or not */
        isCurrent?: boolean
        /**
         * @description The page to be returned
         * @example 0
         */
        page?: number
        /**
         * @description Number of items to be returned
         * @example 10
         */
        size?: number
        /**
         * @description Parameter on which the records are to be sorted
         * @example courseName, courseCode, learningStartDate, learningPlannedEndDate, isAccredited, actualGLH(learningStartDate,desc)
         */
        sort?: string
      }
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': components['schemas']['Page'][]
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
  /** Returns the most recent assessment of each type for a given learner. */
  latestLearnerAssessments: {
    parameters: {
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': components['schemas']['LearnerLatestAssessmentDTO'][]
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
  /** Returns all learner Goals for the given PRN */
  getLearnerGoals: {
    parameters: {
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': components['schemas']['LearnerGoalDTO']
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied. */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
  /** Returns all employability skills associated with given learner. */
  getEmployabilitySkills: {
    parameters: {
      query?: {
        /** @description NOMIS Establishment ID */
        establishmentId?: string
        /** @description Employability Skill */
        employabilitySkill?: string
        /**
         * @description The page to be returned
         * @example 0
         */
        page?: number
        /**
         * @description Number of items to be returned
         * @example 10
         */
        size?: number
        /**
         * @description Parameter on which the records are to be sorted
         * @example employabilitySkill, activityStartDate, activityEndDate, (activityStartDate,desc)
         */
        sort?: string
      }
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': {
            content?: components['schemas']['LearnerEmployabilitySkillsDTO'][]
            empty?: boolean
            first?: boolean
            last?: boolean
            /** Format: int32 */
            number?: number
            /** Format: int32 */
            numberOfElements?: number
            pageable?: components['schemas']['Pageable']
            /** Format: int32 */
            size?: number
            sort?: components['schemas']['Sort']
            /** Format: int64 */
            totalElements?: number
            /** Format: int32 */
            totalPages?: number
          }
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
  /** Returns all learner Neurodivergence info */
  getLearnerNeurodivergence: {
    parameters: {
      query?: {
        /** @description NOMIS Establishment ID */
        establishmentId?: string
      }
      path: {
        /** @description NOMIS Assigned Offender Number (Prisoner Identifier) */
        prn: string
      }
    }
    responses: {
      /** @description Success */
      200: {
        content: {
          'application/json': components['schemas']['LearnerNeurodivergenceDTO'][]
        }
      }
      /** @description Authentication required. */
      401: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Access denied. */
      403: {
        content: {
          'application/json': unknown
        }
      }
      /** @description Learner record has not been found */
      404: {
        content: {
          'application/json': unknown
        }
      }
    }
  }
}
