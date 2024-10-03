const actionPlans = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/action-plans/A00001A',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'A00001A',
        goals: [],
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPattern: '/action-plans/H4115SD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'H4115SD',
        goals: [
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn French',
            status: 'ACTIVE',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book French course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete French course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedAt: '2023-07-20T09:29:15.386Z',
            targetCompletionDate: '2124-01-29',
            notes: 'Billy will struggle to concentrate for long periods.',
          },
        ],
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPattern: '/action-plans/G5005GD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G5005GD',
        goals: [
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn first aid',
            status: 'ACTIVE',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book first aid course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete first aid course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedAt: '2023-07-20T09:29:15.386Z',
            targetCompletionDate: '2124-01-29',
            notes: "Pay close attention to John's behaviour.",
          },
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn French',
            status: 'ACTIVE',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book French course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete French course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedAt: '2023-07-20T09:29:15.386Z',
            targetCompletionDate: '2124-01-29',
            notes: 'John will struggle to concentrate for long periods.',
          },
        ],
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/action-plans/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G6115VJ',
        goals: [
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn wood work',
            status: 'ACTIVE',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book wood work course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete wood work course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedByDisplayName: 'George Costanza',
            updatedAt: '2023-07-20T09:29:15.386Z',
            updatedAtPrison: 'MDI',
            targetCompletionDate: '2124-01-29',
            notes: 'Daniel needs to be heavily supervised when using tools.',
          },
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn first aid',
            status: 'COMPLETED',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book first aid course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete first aid course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedByDisplayName: 'George Costanza',
            updatedAt: '2023-07-21T09:29:15.386Z',
            updatedAtPrison: 'MDI',
            targetCompletionDate: '2124-01-29',
            notes: "Pay close attention to Daniel's behaviour.",
          },
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn French',
            status: 'ARCHIVED',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book French course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete French course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedByDisplayName: 'George Costanza',
            updatedAt: '2023-08-22T09:29:15.386Z',
            updatedAtPrison: 'MDI',
            archiveReason: 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL',
            targetCompletionDate: '2124-01-29',
            notes: 'Daniel will struggle to concentrate for long periods.',
          },
          {
            goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
            title: 'Learn wood work',
            status: 'ARCHIVED',
            steps: [
              {
                stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
                title: 'Book wood work course',
                status: 'NOT_STARTED',
                sequenceNumber: 1,
              },
              {
                stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
                title: 'Complete wood work course',
                status: 'NOT_STARTED',
                sequenceNumber: 2,
              },
            ],
            createdBy: 'auser_gen',
            createdAt: '2023-07-20T09:29:15.386Z',
            updatedBy: 'auser_gen',
            updatedByDisplayName: 'George Costanza',
            updatedAt: '2023-07-22T09:29:15.386Z',
            updatedAtPrison: 'MDI',
            archiveReason: 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON',
            targetCompletionDate: '2124-01-29',
            notes: 'Daniel needs to be heavily supervised when using tools.',
          },
        ],
      },
    },
  },
}

export default actionPlans
