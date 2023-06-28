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
        prisonerNumber: 'A00001A',
        firstName: 'Paris',
        lastName: 'Jones',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
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
        prisonerNumber: 'H4115SD',
        firstName: 'Billy',
        lastName: 'Jean',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
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
        prisonerNumber: 'G5005GD',
        firstName: 'John',
        lastName: 'Smith',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
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
        prisonerNumber: 'G6115VJ',
        firstName: 'Daniel',
        lastName: 'Craig',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
}

export default prisoners
