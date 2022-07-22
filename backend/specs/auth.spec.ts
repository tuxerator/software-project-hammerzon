import { IUser, User } from '../src/Models/User';
import { appInstance } from '../src/serverTest';
import request from 'supertest';
import bcrypt from 'bcrypt';

describe('authentication', () => {

  beforeEach(async () => {
    // Tests sollten nie auf Produktionsdaten arbeiten!
    // Damit der Test immer gleich läuft werden die Daten vom Test selbst simuliert
    await User.deleteMany({});

    await new User({
      _id : '6284efd5b72a93135fb79c90',
      email: 'test@test.com',
      password: '$2b$10$8mG78C7buR8e/TEVTmaFWe3QksXrSaNjX96E9GFeDZJsITly7EvXi', //password
      firstName: 'first',
      lastName: 'last',
      role: 'user',
      address: {
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
        address: {
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
    expect(bcrypt.compareSync(password, '' + users[1].password))
      .withContext('password properly hashed')
      .toBe(true);
  });

  it('should fail to register if email already exists', async () => {
    const password = '123456789';
    await request(appInstance)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password, // TypeScript-Kurzform, äquivalent zu 'password: password'
        firstName: 'first',
        lastName: 'last',
        address: {
          street: 'Straße',
          houseNum: '42', // String da es auch 10a gibt
          postCode: '420',
          city: 'Test City',
          country: 'Test Country',
        }
      })
      .expect(400);
    const users = await User.find({}).exec();

    expect(users)
      .withContext('there should be only one user')
      .toHaveSize(1);
  });

  // the login tests also test the getUser method at the same time
  it('should log the user in if correct credentials are provided', async () => {
    const loginRequest = {
      email: 'test@test.com',
      password: 'password'
    };
    const agent = request.agent(appInstance);
    await agent
      .post('/api/auth/login')
      .send(loginRequest)
      .expect(200);
    const email = loginRequest.email;
    const user = await User.findOne({ email }).exec();

    const isLoggedInResponse = await agent
      .get('/api/auth/logintest')
      .expect(200);
    // check if the user of the session is the same as the one in the database
    expect(isLoggedInResponse.body._id.toString()).toBe(user._id.toString());

  });


  it('should not log the user in if a wrong email is provided', async () => {
    const loginRequest = {
      email: 'does_not@exist.de',
      password: 'password'
    };
    const agent = request.agent(appInstance);
    const response = await agent
      .post('/api/auth/login')
      .send(loginRequest)
      .expect(401);
    expect(response.body.message).toBe('Mail address not found');

    // expect 403 from isAuthorized validator
    const isLoggedInResponse = await agent
      .get('/api/auth/logintest')
      .expect(403);
    expect(isLoggedInResponse.body.message).toBe('Not Authorized');
  });

  it('should not log the user in if a wrong password is provided', async () => {
    const loginRequest = {
      email: 'test@test.com',
      password: 'wrongpassword'
    };
    const agent = request.agent(appInstance);
    const response = await agent
      .post('/api/auth/login')
      .send(loginRequest)
      .expect(401);

    expect(response.body.message).toBe('Wrong password');
  });

  it('should get the user by his id', async () => {
    const user = await User.findOne({ email: 'test@test.com' });

    const response = await request(appInstance)
      .get(`/api/getUserById/${user._id}`)
      .expect(200);

    expect(response.body._id.toString()).toBe(user._id.toString());

  });

  it('should not find a user for a id that does not exist', async () => {
    const response = await request(appInstance)
      .get('/api/getUserById/42')
      .expect(500);

    expect(response.body.message).toBe('there is no user with such an id');
  });

  it('should log out the user on request', async () => {
    // login
    const agent = await TestUtils.login();

    // logout
    await agent
      .get('/api/auth/logout')
      .expect(200);
// did the logout work?
    const isLoggedInResponse = await agent
      .get('/api/auth/logintest')
      .expect(403);
    expect(isLoggedInResponse.body.message).toBe('Not Authorized');
  });

  it('should return from the validator if no user is logged in on logout', async () => {
    const agent = request.agent(appInstance);
    const logoutResponse = await agent
      .get('/api/auth/logout')
      .expect(403);

    expect(logoutResponse.body.message).toBe('Not Authorized');
  });

  it('should update userdata if the user is logged in and data in the request is correct', async () => {
    // login
    const agent = await TestUtils.login();
    // update
    const updatedUser = TestUtils.updatedUser;
    const updateRequest = {
      oldPassword : 'password',
      updatedUser
    };

    const updateResponse = await agent
      .post('/api/auth/update')
      .send(updateRequest)
      .expect(200);

    expect(updateResponse.body.message)
    .withContext('Success message from the update method')
    .toBe('Updated Successfull');


    // check if the updates where saved to the database
    const id = '6284efd5b72a93135fb79c90';
    const user = await User.findOne({ id }).exec();

    expect(TestUtils.compare(user, updatedUser))
      .withContext('saved user in the database has the data from the request')
      .toBe(true);

  });

  it('should return an error message, if the user is not in the database', async () => {
    const updatedUser = TestUtils.updatedUser;
    const updateRequest = {
      oldPassword : 'password',
      updatedUser
    };
    const agent = await TestUtils.login();

    await User.deleteMany({});

    const updateResponse = await agent
      .post('/api/auth/update')
      .send(updateRequest)
      .expect(500);

    expect(updateResponse.body.message).toBe('User doesnt exist');

  });

  it('should return an error message if a wrong old password is provided in the request', async () => {
    const updatedUser = TestUtils.updatedUser;
    const updateRequest = {
      oldPassword : 'wrongpassword',
      updatedUser
    };
    const agent = await TestUtils.login();

    const updateResponse = await agent
      .post('/api/auth/update')
      .send(updateRequest)
      .expect(401);
    expect(updateResponse.body.message).toBe('Wrong password');

    const id = '6284efd5b72a93135fb79c90';
    const user = await User.findOne({ id }).exec();

    expect(TestUtils.compare(user, updatedUser))
      .withContext('the user in the database should not have been changed')
      .toBe(false);
  });

  it('should return an error message if the new password is too short', async () => {
    const updatedUser = {
      password: '123',
      firstName: 'new',
      lastName: 'new',
      role: 'user',
      address: {
        street: 'new',
        houseNum: 'new', // String da es auch 10a gibt
        postCode: 'new',
        city: 'new',
        country: 'new',
      }
    };
    const updateRequest = {
      oldPassword : 'password',
      updatedUser
    };
    const agent = await TestUtils.login();

    const updateResponse = await agent
      .post('/api/auth/update')
      .send(updateRequest)
      .expect(401);

    expect(updateResponse.body.message).toBe('Password to short');

    const id = '6284efd5b72a93135fb79c90';
    const user = await User.findOne({ id }).exec();

    expect(TestUtils.compare(user, updatedUser))
      .withContext('the user in the database should not have been changed')
      .toBe(false);

  });


});

class TestUtils {
  public static updatedUser  = {
    password: 'newpassword',
    firstName: 'new',
    lastName: 'new',
    role: 'user',
    address: {
      street: 'new',
      houseNum: 'new', // String da es auch 10a gibt
      postCode: 'new',
      city: 'new',
      country: 'new',
    }
  };
  static async login() : Promise<request.SuperAgentTest> {
    const loginRequest = {
      email: 'test@test.com',
      password: 'password'
    };
    const agent = request.agent(appInstance);
    await agent
      .post('/api/auth/login')
      .send(loginRequest)
      .expect(200);
    return agent;
  }

  static compare(user1: any, user2: any): boolean {
    return ((user1.firstName) === (user2.firstName)
      && (user1.lastName) === (user2.lastName)
      && (user1.address.street) === (user2.address.street)
      && (user1.address.houseNum) === (user2.address.houseNum)
      && (user1.address.postCode) === (user2.address.postCode)
      && (user1.address.city) === (user2.address.city)
      && (user1.address.country) === (user2.address.country)
      && (bcrypt.compareSync(user2.password, '' + user1.password)));

  }
}

