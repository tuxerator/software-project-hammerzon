import { User } from '../src/Models/User';
import { app } from '../src/app';
import request from 'supertest';
import bcrypt from 'bcrypt';
/*
describe('authentication', () => {

  const appInstance = app(true);

  beforeEach(async () => {
    // Tests sollten nie auf Produktionsdaten arbeiten!
    // Damit der Test immer gleich läuft werden die Daten vom Test selbst simuliert
    await User.deleteMany({});
  });

  it('should add new user upon registration', async () => {
    const password = '12345678';
    const response = await request(appInstance)
        .post('/api/auth/register')
        .send({
            mail: 'test@test.com',
            password, // TypeScript-Kurzform, äquivalent zu 'password: password'
            firstName: 'first',
            lastName: 'last',
            address:{
              street: 'Straße ',
              houseNum: '42', // String da es auch 10a gibt
              postCode: '420',
              city: 'Test City',
              country: 'Test Country',
            }
        })
        .expect(200);

    expect(response.body.code)
        .withContext('status response')
        .toBe(200);
    expect(response.body.message)
        .withContext('status message')
        .toMatch(/registered/);

    const users = await User.find({}).exec();
    expect(users)
        .withContext('created user in database')
        .toHaveSize(1);
    expect(bcrypt.compareSync(password, users[0].password.toString()))
        .withContext('password properly hashed')
        .toBe(true);
  });
});
*/
