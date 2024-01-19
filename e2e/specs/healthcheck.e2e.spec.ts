import { ping } from 'tcp-ping';

describe('Health', () => {
  test('Reservations', async () => {
    const response = await fetch('http://reservations:3001');
    expect(response.ok).toBeTruthy();
  }, 10000);

  test('Auth', async () => {
    const response = await fetch('http://auth:3002');
    expect(response.ok).toBeTruthy();
  }, 10000);

  test('Payments', (done) => {
    ping({ address: 'payments', port: 3003 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  }, 10000);

  test('Notifications', (done) => {
    ping({ address: 'notifications', port: 3004 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  }, 10000);
});
