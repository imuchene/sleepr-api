describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'sleeprnestapp@gmail.com',
      password: 'StrongPassword123!@',
    };

    await fetch('http://auth:3002/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await fetch('http://auth:3002/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    jwt = await response.text();
  });

  test('Create & Get a Reservation', async () => {
    const createdReservation = await createReservation();
    const responseGet = await fetch(
      `http://reservations:3001/reservations/${createdReservation._id}`,
      {
        headers: {
          Authentication: jwt,
        },
      },
    );

    const reservation = await responseGet.json();

    expect(createdReservation).toEqual(reservation);
  });

  const createReservation = async () => {
    const responseCreate = await fetch(
      'http://reservations:3001/reservations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
        body: JSON.stringify({
          startDate: '10/16/2023',
          endDate: '10/20/2023',
          placeId: '12345',
          invoiceId: '493',
          charge: {
            amount: 17,
            card: {
              cvc: '413',
              exp_month: 12,
              exp_year: 2027,
              number: '4242 4242 4242 4242',
            },
          },
        }),
      },
    );

    expect(responseCreate.ok).toBeTruthy();
    return await responseCreate.json();
  };
});
