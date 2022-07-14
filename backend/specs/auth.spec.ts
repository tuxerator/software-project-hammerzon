import { User } from '../src/Models/User';
import { appInstance } from '../src/serverTest';
import request from 'supertest';
import bcrypt from 'bcrypt';

describe('authentication', () => {

  beforeEach(async () => {
    // Tests sollten nie auf Produktionsdaten arbeiten!
    // Damit der Test immer gleich läuft werden die Daten vom Test selbst simuliert
    await User.deleteMany({});

    await new User({
      email: 'test@test.com',
      password: '$2b$10$IrEgO9bVGjaBxdS/GXA4ZuV0SJCnOnh0f69O38Nl89Cu6ncOG2RVa',
      firstName: 'first',
      lastName: 'last',
      address:{
          street: 'Straße',
          houseNum: '42', // String da es auch 10a gibt
          postCode: '420',
          city: 'Test City',
          country: 'Test Country',
      }
    }).save();
  });

  it('should add new user upon registration', async () => {
    const password = '123456789';

    const response = await request(appInstance)
        .post('/api/auth/register')
        .send({
            email: 'test2@test.com',
            password, // TypeScript-Kurzform, äquivalent zu 'password: password'
            firstName: 'first',
            lastName: 'last',
            address:{
              street: 'Straße',
              houseNum: '42', // String da es auch 10a gibt
              postCode: '420',
              city: 'Test City',
              country: 'Test Country',
            }
        })
        .expect(201);

    expect(response.body.code)
        .withContext('status response')
        .toBe(201);
    expect(response.body.message)
        .withContext('status message')
        .toMatch(/registered/);

    const users = await User.find({}).exec();

    expect(users)
        .withContext('created user in database')
          .toHaveSize(2);

    //console.log(await bcrypt.hashSync())
    expect(bcrypt.compareSync(password, '' + users[1].password ))
        .withContext('password properly hashed')
        .toBe(true);
  });

});

