const prisoners = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/A00001A',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'MDI',
        prisonerNumber: 'A00001A',
        firstName: 'Paris',
        lastName: 'Jones',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2001-17-01',
        dateOfBirth: '1967-12-13',
        cellLocation: 'A-1-1023',
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/H4115SD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'MDI',
        prisonerNumber: 'H4115SD',
        firstName: 'Billy',
        lastName: 'Jean',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2003-17-02',
        dateOfBirth: '1982-04-12',
        cellLocation: 'B-2-977',
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G5005GD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'MDI',
        prisonerNumber: 'G5005GD',
        firstName: 'John',
        lastName: 'Smith',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2003-17-03',
        dateOfBirth: '1980-06-22',
        cellLocation: 'F-19-572',
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'MDI',
        prisonerNumber: 'G6115VJ',
        firstName: 'Daniel',
        lastName: 'Craig',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-17-04',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
      },
    },
  },
}

export default prisoners
